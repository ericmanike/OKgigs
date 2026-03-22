"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckCircle2,
  ShoppingBag,
  Users,
  Package,
  Megaphone,
  Shield,
  X,
  Menu,
  Wallet,
} from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const navItems = [
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: Wallet, exact: false },
  { href: "/admin/users", label: "Users", icon: Users, exact: false },
  { href: "/admin/bundles", label: "Bundles", icon: Package, exact: false },
  { href: "/admin/broadcast", label: "Broadcast", icon: Megaphone, exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600" />
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center space-y-3">
          <Shield size={40} className="mx-auto text-red-400" />
          <h2 className="text-xl font-bold text-zinc-900">Access Denied</h2>
          <p className="text-zinc-500 text-sm">You don't have permission to view this page.</p>
          <Link href="/dashboard" className="inline-block mt-2 text-sm font-medium text-slate-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:pt-28 pt-24 z-0 min-h-screen bg-zinc-50">
      {/* Mobile backdrop */}
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

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-full w-[min(280px,85vw)] md:w-56 md:min-h-[calc(100vh-7rem)] md:top-28",
          "flex flex-col gap-1.5 overflow-y-auto",
          "px-3 py-6 bg-white border-r border-zinc-200/80",
          "transition-transform duration-300 ease-out md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Mobile close row */}
        <div className="flex items-center justify-between mb-2 md:hidden pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-slate-600" />
            <span className="text-sm font-semibold text-zinc-700">Admin Panel</span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Desktop label */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 mb-2">
          <div className="p-1.5 bg-slate-100 rounded-lg">
            <Shield size={14} className="text-slate-600" />
          </div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Admin Panel</span>
        </div>

        <div className="flex flex-col gap-1 pt-1 md:pt-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 whitespace-nowrap",
                isActive(item.href, item.exact)
                  ? "bg-slate-700 text-white shadow-md shadow-slate-700/20"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:scale-[0.98]"
              )}
            >
              <span className={clsx(
                "flex items-center justify-center w-8 h-8 rounded-lg transition-colors shrink-0",
                isActive(item.href, item.exact) ? "bg-white/15" : "bg-zinc-100"
              )}>
                <item.icon size={16} strokeWidth={2} />
              </span>
              {item.label}
            </Link>
          ))}

          <div className="my-2 border-t border-zinc-100" />

          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-all duration-200"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 shrink-0">
              <Shield size={16} strokeWidth={2} />
            </span>
            User Dashboard
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 w-full md:pl-56 lg:pl-60 min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 p-4 md:px-8 md:pt-6 border-b border-zinc-200 bg-white">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2.5 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Admin Dashboard</h1>
            <p className="text-zinc-500 text-xs mt-0.5">Manage users, orders, and system settings.</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <Shield size={13} /> Admin Access
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
