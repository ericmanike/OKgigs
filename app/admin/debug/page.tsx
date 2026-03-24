"use client";

import { useState, useEffect } from "react";
import {
    Loader2,
    RefreshCw,
    Terminal,
    AlertTriangle,
    Info,
    AlertCircle,
    Bug,
    Filter,
    ChevronDown,
    ChevronRight,
    Trash2,
} from "lucide-react";
import clsx from "clsx";

type LogEntry = {
    _id: string;
    level: "info" | "warn" | "error" | "debug";
    category: string;
    message: string;
    meta?: Record<string, any>;
    user?: string | null;
    ip?: string;
    createdAt: string;
};

const LEVEL_CONFIG: Record<string, { icon: typeof Info; color: string; bg: string; border: string }> = {
    info: { icon: Info, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    warn: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
    error: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
    debug: { icon: Bug, color: "text-zinc-500", bg: "bg-zinc-50", border: "border-zinc-200" },
};

const CATEGORIES = ["all", "order", "payment", "auth", "wallet", "agent", "webhook", "system", "store"];
const LEVELS = ["all", "info", "warn", "error", "debug"];

export default function DebugConsolePage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLevel, setSelectedLevel] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [autoRefresh, setAutoRefresh] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedLevel !== "all") params.set("level", selectedLevel);
            if (selectedCategory !== "all") params.set("category", selectedCategory);
            params.set("limit", "200");

            const res = await fetch(`/api/admin/logs?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [selectedLevel, selectedCategory]);

    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, [autoRefresh, selectedLevel, selectedCategory]);

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const formatTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
            " " + d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    };

    const levelCounts = logs.reduce<Record<string, number>>((acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
                        <Terminal size={20} className="text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-zinc-900">Debug Console</h2>
                        <p className="text-sm text-zinc-500">{logs.length} log entries</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={clsx(
                            "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                            autoRefresh
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200"
                        )}
                    >
                        <span className={clsx("w-1.5 h-1.5 rounded-full", autoRefresh ? "bg-green-500 animate-pulse" : "bg-zinc-400")} />
                        {autoRefresh ? "Live" : "Paused"}
                    </button>
                    <button
                        onClick={fetchLogs}
                        disabled={loading}
                        className="px-3 py-2 rounded-lg bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                    >
                        <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>
            </div>

            {/* Level stat pills */}
            <div className="flex flex-wrap gap-2">
                {(["info", "warn", "error", "debug"] as const).map((lvl) => {
                    const cfg = LEVEL_CONFIG[lvl];
                    const Icon = cfg.icon;
                    return (
                        <div key={lvl} className={clsx("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border", cfg.bg, cfg.color, cfg.border)}>
                            <Icon size={13} />
                            {lvl.toUpperCase()} <span className="font-black">{levelCounts[lvl] || 0}</span>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                    <Filter size={13} /> Filters
                </div>
                <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-zinc-200 text-xs font-semibold bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                    {LEVELS.map((l) => (
                        <option key={l} value={l}>{l === "all" ? "All Levels" : l.toUpperCase()}</option>
                    ))}
                </select>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-zinc-200 text-xs font-semibold bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                </select>
            </div>

            {/* Log entries */}
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
                {/* Console header */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="w-3 h-3 rounded-full bg-amber-400" />
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 ml-2">system-logs — {logs.length} entries</span>
                </div>

                {/* Log list */}
                <div className="max-h-[600px] overflow-y-auto divide-y divide-zinc-800/50">
                    {loading && logs.length === 0 ? (
                        <div className="flex items-center justify-center py-16 gap-3">
                            <Loader2 className="animate-spin text-zinc-500" size={20} />
                            <span className="text-zinc-500 text-sm font-mono">Loading logs...</span>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-2">
                            <Terminal size={28} className="text-zinc-600" />
                            <p className="text-zinc-500 text-sm font-mono">No logs found</p>
                        </div>
                    ) : (
                        logs.map((log) => {
                            const cfg = LEVEL_CONFIG[log.level] || LEVEL_CONFIG.info;
                            const Icon = cfg.icon;
                            const isExpanded = expandedIds.has(log._id);
                            const hasMeta = log.meta && Object.keys(log.meta).length > 0;

                            return (
                                <div key={log._id} className="group hover:bg-zinc-900/60 transition-colors">
                                    <button
                                        onClick={() => hasMeta && toggleExpand(log._id)}
                                        className="w-full text-left px-4 py-3 flex items-start gap-3"
                                    >
                                        {/* Expand icon */}
                                        <span className="mt-0.5 shrink-0 text-zinc-600">
                                            {hasMeta ? (
                                                isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                                            ) : (
                                                <span className="w-3.5 inline-block" />
                                            )}
                                        </span>

                                        {/* Level icon */}
                                        <span className={clsx("mt-0.5 shrink-0", cfg.color)}>
                                            <Icon size={14} />
                                        </span>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={clsx(
                                                    "px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                                    cfg.bg, cfg.color
                                                )}>
                                                    {log.level}
                                                </span>
                                                <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                                                    {log.category}
                                                </span>
                                                <span className="text-zinc-600 text-[11px] font-mono ml-auto shrink-0">
                                                    {formatTime(log.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-zinc-300 text-sm font-mono mt-1 break-words leading-relaxed">
                                                {log.message}
                                            </p>
                                        </div>
                                    </button>

                                    {/* Expanded meta */}
                                    {isExpanded && hasMeta && (
                                        <div className="px-4 pb-3 pl-16">
                                            <pre className="bg-zinc-900 rounded-lg p-3 text-xs font-mono text-green-400 overflow-x-auto whitespace-pre-wrap border border-zinc-800">
                                                {JSON.stringify(log.meta, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
