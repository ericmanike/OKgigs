"use client";

import { useState, useEffect } from "react";
import { X, Phone, CheckCircle, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const STORAGE_KEY = "okgigs_welcome_dismissed";

export default function DashboardWelcomeModal() {
    const [open, setOpen] = useState(false);
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const { data: session } = useSession();
    const router = useRouter();

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
                    if (data.phone  && session?.user.role == "agent") {
                    
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
                if(session?.user.role !== "agent") {
                    router.push("/dashboard");
                } else {
                    router.push("/dashboard/store");
                }
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
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-7 pt-7 pb-6 relative">
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors z-10"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                                Welcome to Mega Gigs
                            </p>
                            {session?.user.role !== "agent" && (
                                <a href="/dashboard/upgrade" className="inline-flex items-center gap-1.5 text-[18px] font-black bg-white/10 text-white border border-white/20 hover:bg-white/20 px-2.5 py-1 rounded-md transition-colors w-full shadow-sm">
                                    <span className="text-[11px]"></span> BECOME AN AGENT NOW FOR FREE
                                </a>
                            )}
                        </div>
                        
                        <div className="space-y-0.5">
                            <h2 className="text-lg font-black text-white leading-snug">
                                One quick thing
                            </h2>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Save your  number  so we can  offer you the best  of our services 
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Phone Collection ── */}
                <div className="p-7 space-y-6">

                    {/* Phone input */}
                    <div className="space-y-1.5 pt-2">
                        
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 focus-within:border-[#E42320] transition-colors bg-zinc-50 shadow-inner">
                            <Phone size={14} className="text-zinc-400 shrink-0" />
                            <input
                                type="tel"
                                placeholder="e.g. 0244123456"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setError("");
                                }}
                                className="flex-1 bg-transparent text-[13px] font-medium text-zinc-900 placeholder-zinc-400 outline-none"
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
                            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-60 shadow-md"
                        >
                            {saving ? "Saving…" : saved ? "Saved ✓" : "Save and Continue"}
                         
                        </button>

                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="w-full py-2.5 px-6 rounded-xl text-zinc-500 text-sm font-medium hover:bg-zinc-50 transition-colors"
                        >
                            Skip for now
                        </button>
                    </div>



                 
                </div>

            </div>
        </div>
    );
}
