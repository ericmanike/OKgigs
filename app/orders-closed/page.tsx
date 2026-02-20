import Link from "next/link";
import { Lock, ArrowRight, Home, PackageSearch } from "lucide-react";

export default function OrdersClosedPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white pt-24 md:pt-28 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-lg shadow-slate-200/50 overflow-hidden">
          <div className="bg-[#0e0947] px-5 py-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 mb-3">
              <Lock className="text-white" size={24} />
            </div>
            <h1 className="font-semibold text-white text-xl">Orders are temporarily closed</h1>
            <p className="text-white/80 text-sm mt-1">
              Please check back shortly. You can still track existing orders.
            </p>
          </div>
          <div className="p-5 md:p-6 space-y-3">
            <Link
              href="/track-order"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0e0947] text-white font-medium hover:bg-[#0e0947]/90 transition-colors"
            >
              <PackageSearch size={18} /> Track an order <ArrowRight size={16} />
            </Link>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              <Home size={18} /> Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

