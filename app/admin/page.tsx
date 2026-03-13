"use client";

import { useState, useEffect } from "react";
import { CreditCard, ShoppingBag, Users, ShoppingBag as OrdersIcon, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function AdminStatsPage() {
  const [stats, setStats] = useState({ users: 0, orders: 0, sales: 0 });
  const [dakaziStats, setDakaziStats] = useState({ AccountBalance: { "Wallet Balance": 0 } });
  const [ordersClosed, setOrdersClosed] = useState(false);
  const [ordersClosedUpdating, setOrdersClosedUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, dakaziRes, ordersClosedRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/testingDakazi"),
          fetch("/api/admin/settings/orders-closed"),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (dakaziRes.ok) setDakaziStats(await dakaziRes.json());
        if (ordersClosedRes.ok) {
          const data = await ordersClosedRes.json();
          setOrdersClosed(Boolean(data?.ordersClosed));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleOrdersClosed = async () => {
    const nextValue = !ordersClosed;
    setOrdersClosedUpdating(true);
    try {
      const res = await fetch("/api/admin/settings/orders-closed", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ordersClosed: nextValue }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrdersClosed(Boolean(data?.ordersClosed));
      } else {
        alert("Failed to update setting");
      }
    } catch {
      alert("Error updating setting");
    } finally {
      setOrdersClosedUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-400">
      {/* Orders toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Platform Stats</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Live overview of your platform</p>
        </div>
        <button
          type="button"
          onClick={handleToggleOrdersClosed}
          disabled={ordersClosedUpdating}
          className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 text-xs md:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            ${ordersClosed
              ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            }`}
          title={ordersClosed ? "Orders are closed. Click to open." : "Orders are open. Click to close."}
        >
          <OrdersIcon size={14} />
          {ordersClosed ? "Open Orders" : "Close Orders"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-zinc-200 hover:border-green-400 transition-colors bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <CreditCard size={22} />
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium">Account Balance</p>
            <h3 className="text-3xl font-bold mt-1 text-zinc-900">
              {formatCurrency(dakaziStats.AccountBalance["Wallet Balance"])}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 hover:border-green-400 transition-colors bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <CreditCard size={22} />
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium">Total Sales</p>
            <h3 className="text-3xl font-bold mt-1 text-zinc-900">{formatCurrency(stats.sales)}</h3>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 hover:border-purple-400 transition-colors bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <ShoppingBag size={22} />
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium">Total Orders</p>
            <h3 className="text-3xl font-bold mt-1 text-zinc-900">{stats.orders}</h3>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 hover:border-slate-300 transition-colors bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                <Users size={22} />
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium">Total Users</p>
            <h3 className="text-3xl font-bold mt-1 text-zinc-900">{stats.users}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/orders", label: "Manage Orders", icon: ShoppingBag, color: "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100" },
          { href: "/admin/users", label: "Manage Users", icon: Users, color: "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100" },
          { href: "/admin/bundles", label: "Manage Bundles", icon: Shield, color: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100" },
          { href: "/admin/broadcast", label: "Broadcast", icon: Shield, color: "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${item.color}`}
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
