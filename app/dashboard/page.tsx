import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Wallet,
  ShoppingBag,
  ArrowRight,
  Crown,
  CheckCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import BecomeAgent from "@/components/ui/becomeAgent";
import TopUpwallet from "@/components/ui/topUpwallet";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  await dbConnect();

  const [recentOrdersRaw, balanceDoc] = await Promise.all([
    Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .lean(),
    User.findById(session.user.id).select("walletBalance").lean(),
  ]);

  const balance: number = (balanceDoc as any)?.walletBalance ?? 0;

  const totalOrders = recentOrdersRaw.length;
  const delivered  = recentOrdersRaw.filter((o: any) => o.status === "delivered").length;
  const pending    = recentOrdersRaw.filter((o: any) => o.status === "pending").length;
  const processing = recentOrdersRaw.filter((o: any) => o.status === "processing").length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        <Card className="overflow-hidden border-zinc-200/80 h-full">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Wallet className="text-emerald-600" size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  Wallet Balance
                </p>
                <p className="text-xl font-bold text-zinc-900 mt-0.5">
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
            <div className="mt-auto">
              <TopUpwallet />
            </div>
          </CardContent>
        </Card>

        <Link href="/dashboard/orders" className="group h-full">
          <Card className="overflow-hidden border-zinc-200/80 hover:border-slate-300 hover:shadow-sm transition-all duration-200 h-full">
            <CardContent className="p-5 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center shrink-0">
                  <ShoppingBag className="text-slate-600" size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Total Orders</p>
                  <p className="text-xl font-bold text-zinc-900 leading-tight">{totalOrders}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                  <CheckCircle2 size={11} />
                  {delivered} Delivered
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700">
                  <Clock size={11} />
                  {pending} Pending
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-500">
                  <RefreshCw size={11} />
                  {processing} Processing
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Navigation hint card */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white/60 p-5">
        <p className="text-zinc-600 text-sm">
          Use the menu on the left to jump to <strong>Quick Actions</strong> or{" "}
          <strong>Orders History</strong>.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link
            href="/dashboard/quick-actions"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E42320] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Quick Actions <ArrowRight size={14} />
          </Link>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 transition-colors"
          >
            Orders History <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Premium Upgrade CTA */}
      <div className="bg-zinc-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 blur-[80px] rounded-full -mr-10 -mt-10" />
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Crown className="text-amber-400" size={22} />
              <span className="text-lg font-black tracking-tight">Upgrade to Premium</span>
            </div>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-zinc-300 text-sm">
                <CheckCircle size={14} className="text-amber-400 shrink-0" /> Lifetime access to agent rates
              </li>
              <li className="flex items-center gap-2 text-zinc-300 text-sm">
                <CheckCircle size={14} className="text-amber-400 shrink-0" /> No monthly subscription
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="text-center">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-0.5">One-time</p>
              <p className="text-3xl font-black text-white">{formatCurrency(30)}</p>
            </div>
            <div className="w-full min-w-[160px]">
              <BecomeAgent />
            </div>
          </div>
        </div>
      </div>

      {/* Buy Data Bundles */}
      <div>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Buy Data Bundles
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "MTN", bg: "#FFCC00", text: "#1a1200", letter: "M", network: "MTN" },
            { name: "Telecel", bg: "#E60000", text: "#ffffff", letter: "T", network: "Telecel" },
            { name: "AirtelTigo", bg: "#0077C8", text: "#ffffff", letter: "A", network: "AirtelTigo" },
          ].map((net) => (
            <Link
              key={net.network}
              href={`/buy?network=${net.network}`}
              className="group rounded-2xl overflow-hidden border border-zinc-200/80 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
            >
              <div
                className="p-4 flex flex-col items-center gap-2 text-center"
                style={{ backgroundColor: net.bg }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow"
                  style={{ backgroundColor: "rgba(0,0,0,0.15)", color: net.text }}
                >
                  {net.letter}
                </div>
                <span className="text-xs font-bold" style={{ color: net.text }}>{net.name}</span>
                <span className="text-[10px] font-medium opacity-70" style={{ color: net.text }}>Buy Data</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
