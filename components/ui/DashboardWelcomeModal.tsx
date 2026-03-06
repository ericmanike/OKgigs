"use client";

import { useState, useEffect } from "react";
import { X, Phone, CheckCircle, ChevronRight } from "lucide-react";

const STORAGE_KEY = "okgigs_welcome_dismissed";

export default function DashboardWelcomeModal() {
    const [open, setOpen] = useState(false);
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState<"phone">("phone");

    // Check phone then decide whether to show modal
    useEffect(() => {
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (dismissed) return;

        const init = async () => {
            try {
                const res = await fetch("/api/profile/phone");
                if (res.ok) {
                    const data = await res.json();
                    // If phone already saved, don't show the modal
                    if (data.phone) {
                        return;
                    }
                }
            } catch {
                // silently fall through
            }
            // Small delay so the dashboard renders first
            setTimeout(() => setOpen(true), 600);
        };

        init();
    }, []);

    const handleDismiss = () => {
        setOpen(false);
    };

    const handleDontShowAgain = () => {
        localStorage.setItem(STORAGE_KEY, "true");
        setOpen(false);
    };

    const handleSavePhone = async () => {
        if (!phone || phone.trim().length < 9) {
            setError("Please enter a valid phone number (at least 9 digits).");
            return;
        }
        setError("");
        setSaving(true);
        try {
            const res = await fetch("/api/profile/phone", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phone.trim() }),
            });
            if (res.ok) {
                setSaved(true);
                // Dismiss modal after a short pause
                setTimeout(() => handleDontShowAgain(), 1500);
            } else {
                const data = await res.json();
                setError(data.message || "Failed to save phone number.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleDismiss}
            />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Top gradient bar */}
                <div className="h-1.5 w-full bg-linear-to-r from-[#E42320] via-amber-400 to-amber-500" />

                {/* Close button */}
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors z-10"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* ── Phone Collection ── */}
                <div className="p-7 space-y-6">
                    {/* Header */}
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#E42320]">
                            Welcome to MEGA GIGS 👋
                        </p>
                        <h2 className="text-2xl font-black text-zinc-900 leading-snug">
                            One quick thing<br />before you start
                        </h2>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Add your MoMo number so we can deliver your data instantly after every purchase.
                        </p>
                    </div>

                    {/* Phone input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">
                            Mobile Money Number
                        </label>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-zinc-200 focus-within:border-[#E42320] transition-colors bg-zinc-50">
                            <Phone size={18} className="text-zinc-400 shrink-0" />
                            <input
                                type="tel"
                                placeholder="e.g. 0244123456"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setError("");
                                }}
                                className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none"
                                onKeyDown={(e) => e.key === "Enter" && handleSavePhone()}
                            />
                        </div>
                        {error && (
                            <p className="text-xs text-red-500 font-medium">{error}</p>
                        )}
                        {saved && (
                            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                <CheckCircle size={12} /> Saved! Closing…
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2.5">
                        <button
                            type="button"
                            onClick={handleSavePhone}
                            disabled={saving || saved}
                            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#E42320] text-white font-bold text-sm hover:bg-[#c71e1b] active:scale-[0.98] transition-all disabled:opacity-60"
                        >
                            {saving ? "Saving…" : saved ? "Saved ✓" : "Save My Number"}
                            {!saving && !saved && <ChevronRight size={16} />}
                        </button>

                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="w-full py-2.5 px-6 rounded-xl text-zinc-500 text-sm font-medium hover:bg-zinc-50 transition-colors"
                        >
                            Skip for now
                        </button>
                    </div>

                    {/* Don't show again */}
                    <button
                        type="button"
                        onClick={handleDontShowAgain}
                        className="w-full text-center text-sm font-medium text-zinc-400 hover:text-zinc-600 transition-colors pt-1"
                    >
                        Don&apos;t show this again
                    </button>
                </div>

            </div>
        </div>
    );
}
