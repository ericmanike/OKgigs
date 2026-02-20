"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import {
  CreditCard,
  ChevronRight,
  Wifi,
  CheckCircle2,
  XCircle,
  Clock,
  LayoutDashboard,
  Zap,
  History,
  Wallet,
  ShoppingBag,
  ArrowRight,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import BecomeAgent from "@/components/ui/becomeAgent";
import TopUpwallet from "@/components/ui/topUpwallet";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type DashboardSection = "overview" | "quick-actions" | "orders";

type OrderRecord = {
  _id: string;
  transaction_id: string;
  bundleName: string;
  network: string;
  price: number;
  status: string;
  createdAt: string;
};

type Props = {
  userName: string;
  balance: number;
  recentOrders: OrderRecord[];
  isAdmin: boolean;
};

const sidebarItems: { id: DashboardSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "quick-actions", label: "Quick Actions", icon: Zap },
  { id: "orders", label: "Orders History", icon: History },
];

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardContent({ userName, balance, recentOrders, isAdmin }: Props) {
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleSectionClick = (id: DashboardSection) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex flex-col md:flex-row md:pt-28 pt-24 z-0 min-h-screen bg-linear-to-b from-zinc-50/80 to-white">
      {/* Mobile sidebar backdrop */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Close menu"
        onClick={() => setSidebarOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
        className={clsx(
          "fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Left sidebar - slide-in on mobile, fixed on desktop */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-full w-[min(280px,85vw)] md:w-60 md:min-h-[calc(100vh-7rem)] md:top-28",
          "flex flex-col gap-1.5 md:gap-1.5 overflow-y-auto md:overflow-x-visible",
          "px-4 py-6 md:py-6 bg-white md:bg-white border-r border-zinc-200/80",
          "md:shadow-[2px_0_24px_-8px_rgba(0,0,0,0.08)]",
          "transition-transform duration-300 ease-out md:translate-x-0",
          sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between mb-2 md:mb-0 md:hidden pb-4 border-b border-zinc-100">
          <span className="text-sm font-semibold text-zinc-500">Menu</span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-1.5 pt-2 md:pt-0">
          {/* Overview */}
          {sidebarItems.slice(0, 1).map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.id)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap text-left",
                activeSection === item.id
                  ? "bg-[#0e0947] text-white shadow-lg shadow-[#0e0947]/20 md:shadow-md"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:scale-[0.98]"
              )}
            >
              <span
                className={clsx(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-colors shrink-0",
                  activeSection === item.id ? "bg-white/15" : "bg-zinc-100"
                )}
              >
                <item.icon size={18} strokeWidth={2} />
              </span>
              {item.label}
            </button>
          ))}
          
          {/* Admin - only for admins, below Overview */}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setSidebarOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap text-left",
                pathname?.startsWith("/admin")
                  ? "bg-[#0e0947] text-white shadow-lg shadow-[#0e0947]/20 md:shadow-md"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:scale-[0.98]"
              )}
            >
              <span
                className={clsx(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-colors shrink-0",
                  pathname?.startsWith("/admin") ? "bg-white/15" : "bg-zinc-100"
                )}
              >
                <Shield size={18} strokeWidth={2} />
              </span>
              Admin
            </Link>
          )}
          
          {/* Rest of sidebar items */}
          {sidebarItems.slice(1).map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.id)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap text-left",
                activeSection === item.id
                  ? "bg-[#0e0947] text-white shadow-lg shadow-[#0e0947]/20 md:shadow-md"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:scale-[0.98]"
              )}
            >
              <span
                className={clsx(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-colors shrink-0",
                  activeSection === item.id ? "bg-white/15" : "bg-zinc-100"
                )}
              >
                <item.icon size={18} strokeWidth={2} />
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex justify-center p-4 md:p-6 md:pl-60 lg:pl-64 w-full">
        <div className="w-full max-w-4xl space-y-8">
        {/* Header with mobile menu toggle */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-white border border-zinc-200/80 shadow-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
                Hello, {userName} 👋
              </h1>
              <p className="text-zinc-500 text-sm mt-0.5">Welcome back to your dashboard</p>
            </div>
          </div>
          {!isAdmin && (
            <div className="hidden sm:flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-zinc-200/80 shadow-sm w-full sm:w-auto min-w-0">
                <Wallet className="text-zinc-500 shrink-0" size={20} />
                <span className="text-zinc-600 text-sm font-medium shrink-0">Balance</span>
                <span className="font-bold text-zinc-900 truncate min-w-0">{formatCurrency(balance)}</span>
              </div>
              <div className="w-full sm:w-auto shrink-0">
                <TopUpwallet />
              </div>
            </div>
          )}
        </div>

        {/* Overview */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!isAdmin && (
                <Card className="overflow-hidden border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Wallet className="text-emerald-600" size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                        Wallet balance
                      </p>
                      <p className="text-xl font-bold text-zinc-900 mt-0.5">
                        {formatCurrency(balance)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Card className="overflow-hidden border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <ShoppingBag className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                      Recent orders
                    </p>
                    <p className="text-xl font-bold text-zinc-900 mt-0.5">
                      {recentOrders.length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-white/60 p-5">
              <p className="text-zinc-600 text-sm">
                Use the menu on the left to jump to <strong>Quick Actions</strong> or{" "}
                <strong>Orders History</strong>.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => setActiveSection("quick-actions")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0e0947] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Quick Actions <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => setActiveSection("orders")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 transition-colors"
                >
                  Orders History <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {activeSection === "quick-actions" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Quick Actions</h2>
              <p className="text-sm text-zinc-500 mt-0.5">Buy data or manage your account</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/buy?network=MTN" className="group">
                <Card className="overflow-hidden border-zinc-200/80 shadow-sm hover:shadow-lg hover:border-amber-300/60 transition-all duration-200 group-hover:-translate-y-0.5">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-lg shadow-sm">
                      M
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-900">MTN</p>
                      <p className="text-xs text-zinc-500">Buy Data</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/buy?network=Telecel" className="group">
                <Card className="overflow-hidden border-zinc-200/80 shadow-sm hover:shadow-lg hover:border-red-300/60 transition-all duration-200 group-hover:-translate-y-0.5">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      T
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-900">Telecel</p>
                      <p className="text-xs text-zinc-500">Buy Data</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/buy?network=AT" className="group">
                <Card className="overflow-hidden border-zinc-200/80 shadow-sm hover:shadow-lg hover:border-blue-300/60 transition-all duration-200 group-hover:-translate-y-0.5">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      A
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-900">AirtelTigo</p>
                      <p className="text-xs text-zinc-500">Buy Data</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Card className="overflow-hidden border-zinc-200/80 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <Link href="/afa-registration" className="block">
                    <button className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold py-3 px-4 text-sm transition-colors shadow-sm">
                      AFA Registration
                    </button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            <div className="pt-2">
              <BecomeAgent />
            </div>
          </div>
        )}

        {/* Orders History */}
        {activeSection === "orders" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Orders History</h2>
                <p className="text-sm text-zinc-500 mt-0.5">Your recent data purchases</p>
              </div>
              <Link
                href="/history"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all <ChevronRight size={16} />
              </Link>
            </div>
            <Card className="overflow-hidden border-zinc-200/80 shadow-sm">
              <CardContent className="p-0 divide-y divide-zinc-100">
                {recentOrders.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                      <CreditCard size={24} className="text-zinc-400" />
                    </div>
                    <p className="text-zinc-600 font-medium">No recent orders</p>
                    <p className="text-sm text-zinc-500 mt-1">Your orders will appear here</p>
                    <Link
                      href="/buy"
                      className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Buy data <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 hover:bg-zinc-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={clsx(
                            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                            order.network === "MTN" && "bg-amber-400 text-amber-950",
                            order.network === "Telecel" && "bg-red-500 text-white",
                            order.network !== "MTN" &&
                              order.network !== "Telecel" &&
                              "bg-blue-600 text-white"
                          )}
                        >
                          <Wifi size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900 truncate">
                            {order.network} {order.bundleName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-zinc-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-zinc-400">•</span>
                            <span className="text-xs text-zinc-500 font-mono">
                              {order.transaction_id}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-start sm:items-end gap-1 sm:gap-1.5">
                        <p className="font-bold text-zinc-900">{formatCurrency(order.price)}</p>
                        <span
                          className={clsx(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                            order.status === "delivered" &&
                              "bg-emerald-50 text-emerald-700",
                            order.status === "failed" && "bg-red-50 text-red-700",
                            order.status === "pending" && "bg-amber-50 text-amber-700"
                          )}
                        >
                          {order.status === "delivered" && (
                            <CheckCircle2 size={12} className="shrink-0" />
                          )}
                          {order.status === "failed" && (
                            <XCircle size={12} className="shrink-0" />
                          )}
                          {order.status === "pending" && (
                            <Clock size={12} className="shrink-0" />
                          )}
                          {order.status === "delivered" ? "Delivered" : order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
