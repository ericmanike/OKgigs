"use client";

import { useState, useEffect } from "react";
import { X, Phone, Crown, CheckCircle, Zap, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const STORAGE_KEY = "okgigs_welcome_dismissed";

export default function DashboardWelcomeModal() {
    const [open, setOpen] = useState(false);
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState<"phone" | "premium">("phone");

    // Check phone then decide which step to start on
    useEffect(() => {
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (dismissed) return;

        const init = async () => {
            try {
                const res = await fetch("/api/profile/phone");
                if (res.ok) {
                    const data = await res.json();
                    // If phone already saved, skip phone step
                    if (data.phone) {
                        setStep("premium");
                    }
                }
            } catch {
                // silently fall through to default "phone" step
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
                // Move to premium step after a short pause
                setTimeout(() => setStep("premium"), 1000);
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleDismiss}
            />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Top gradient bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#E42320] via-amber-400 to-amber-500" />

                {/* Close button */}
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors z-10"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* ── STEP 1: Phone ── */}
                {step === "phone" && (
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
                                    <CheckCircle size={12} /> Saved! Moving on…
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
                                onClick={() => setStep("premium")}
                                className="w-full py-2.5 px-6 rounded-xl text-zinc-500 text-sm font-medium hover:bg-zinc-50 transition-colors"
                            >
                                Skip for now
                            </button>
                        </div>

                        {/* Don't show again */}
                        <button
                            type="button"
                            onClick={handleDontShowAgain}
                            className="w-full text-center text-xs text-zinc-400 hover:text-zinc-600 transition-colors pt-1"
                        >
                            Don&apos;t show this again
                        </button>
                    </div>
                )}

                {/* ── STEP 2: Premium Upsell ── */}
                {step === "premium" && (
                    <div className="bg-zinc-900 p-7 space-y-6 text-white">
                        {/* Glow */}
                        <div className="absolute top-0 right-0 w-56 h-56 bg-amber-400/10 blur-[90px] rounded-full -mr-10 -mt-10 pointer-events-none" />

                        {/* Header */}
                        <div className="relative space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Crown className="text-amber-400" size={24} />
                                <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                                    Premium Agent
                                </span>
                            </div>
                            <h2 className="text-2xl font-black leading-snug">
                                Get lower prices<br />on every bundle
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Upgrade once and enjoy agent-tier rates forever. No recurring fees.
                            </p>
                        </div>

                        {/* Benefits */}
                        <ul className="relative space-y-2.5">
                            {[
                                "Exclusive agent pricing on all bundles",
                                "Priority delivery — no delays",
                                "24/7 dedicated support",
                                "No monthly subscription — pay once",
                            ].map((b) => (
                                <li key={b} className="flex items-center gap-2.5 text-sm text-zinc-300">
                                    <CheckCircle size={15} className="text-amber-400 shrink-0" />
                                    {b}
                                </li>
                            ))}
                        </ul>

                        {/* Price & CTA */}
                        <div className="relative space-y-3">
                            <div className="text-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-0.5">
                                    One-time payment
                                </p>
                                <p className="text-4xl font-black text-white">{formatCurrency(30)}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    handleDontShowAgain();
                                    // Route to upgrade section
                                    window.dispatchEvent(new CustomEvent("okgigs:open-upgrade"));
                                }}
                                className="w-full group relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-600 text-amber-950 border-t border-white/40 active:scale-[0.98] transition-all overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <Zap size={15} className="fill-current text-amber-800 animate-pulse" />
                                Upgrade to Premium
                            </button>
                        </div>

                        {/* Footer buttons */}
                        <div className="relative flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={handleDismiss}
                                className="w-full py-2.5 px-6 rounded-xl text-zinc-500 text-sm font-medium hover:bg-white/5 transition-colors"
                            >
                                Maybe later
                            </button>
                            <button
                                type="button"
                                onClick={handleDontShowAgain}
                                className="w-full text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                            >
                                Don&apos;t show this again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
