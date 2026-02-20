"use client";

import Link from "next/link";
import { ArrowRight, Package, Search, CheckCircle2, XCircle, Clock, Loader2, Home } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

type TrackOrderResult = {
  transaction_id: string;
  bundleName: string;
  network: string;
  price: number;
  status: string;
  createdAt: string;
  phoneNumber: string;
};

export default function TrackOrderPage() {
  const [trackId, setTrackId] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<TrackOrderResult | null>(null);
  const [trackNotFound, setTrackNotFound] = useState(false);
  const [trackError, setTrackError] = useState("");

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = trackId.trim();
    if (!id) return;
    setTrackLoading(true);
    setTrackResult(null);
    setTrackNotFound(false);
    setTrackError("");
    try {
      const res = await fetch(`/api/track-order?transaction_id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.found && data.order) {
        setTrackResult(data.order);
        setTrackNotFound(false);
      } else {
        setTrackResult(null);
        setTrackNotFound(true);
      }
      if (data.error) setTrackError(data.error);
    } catch {
      setTrackResult(null);
      setTrackError("Could not look up order. Please try again.");
    } finally {
      setTrackLoading(false);
    }
  };

  const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; className: string }> = {
    delivered: { label: "Delivered", icon: CheckCircle2, className: "text-green-600 bg-green-50" },
    failed: { label: "Failed", icon: XCircle, className: "text-red-600 bg-red-50" },
    reversed: { label: "Reversed", icon: XCircle, className: "text-amber-600 bg-amber-50" },
    pending: { label: "Pending", icon: Clock, className: "text-amber-600 bg-amber-50" },
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white pt-24 md:pt-28 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <Home size={16} /> Back to home
        </Link>

        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-lg shadow-slate-200/50 overflow-hidden">
          <div className="bg-[#0e0947] px-5 py-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 mb-3">
              <Package className="text-white" size={24} />
            </div>
            <h1 className="font-semibold text-white text-xl">Track your order</h1>
            <p className="text-white/80 text-sm mt-1">Enter your transaction ID — no sign-in needed</p>
          </div>
          <div className="p-5 md:p-6">
            <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  placeholder="e.g. OKGS-123456"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e0947]/25 focus:border-[#0e0947] transition-shadow"
                  disabled={trackLoading}
                />
              </div>
              <button
                type="submit"
                disabled={trackLoading || !trackId.trim()}
                className="px-5 py-3 rounded-xl bg-[#0e0947] text-white font-medium hover:bg-[#0e0947]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 transition-colors"
              >
                {trackLoading ? <Loader2 size={18} className="animate-spin" /> : "Check status"}
              </button>
            </form>
            {trackError && (
              <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{trackError}</p>
            )}
            {trackNotFound && !trackLoading && (
              <div className="mt-4 p-5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <XCircle className="text-slate-400 mx-auto mb-2" size={32} />
                <p className="text-slate-700 text-sm font-medium">No order found</p>
                <p className="text-slate-500 text-xs mt-1">Check the transaction ID or contact support.</p>
              </div>
            )}
            {trackResult && !trackLoading && (
              <div className="mt-4 rounded-xl border border-slate-100 overflow-hidden bg-linear-to-b from-slate-50 to-white">
                <div className="flex items-center justify-between flex-wrap gap-2 p-4 border-b border-slate-100">
                  <span className="text-xs font-mono text-slate-500">#{trackResult.transaction_id}</span>
                  {(() => {
                    const cfg = statusConfig[trackResult.status] || statusConfig.pending;
                    const Icon = cfg.icon;
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${cfg.className}`}>
                        <Icon size={14} /> {cfg.label}
                      </span>
                    );
                  })()}
                </div>
                <div className="p-4 space-y-2">
                  <p className="font-semibold text-slate-900">{trackResult.network} · {trackResult.bundleName}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                    <span>{formatCurrency(trackResult.price)}</span>
                    <span>To {trackResult.phoneNumber}</span>
                    <span>{new Date(trackResult.createdAt).toLocaleString()}</span>
                  </div>
                  <Link href="/buy" className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-[#0e0947] hover:underline">
                    Buy more data <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          <Link href="/buy" className="text-[#0e0947] font-medium hover:underline">
            Place a new order
          </Link>
          {" · "}
          <Link href="/" className="text-[#0e0947] font-medium hover:underline">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
