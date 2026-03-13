"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { ShoppingBag, Clock, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function ModeratorPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) setStats(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-slate-600" size={32} />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Delivered Orders",
      value: stats?.deliveredOrders || 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-400">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Daily Operations</h2>
          <p className="text-zinc-500 text-sm mt-1">Quick check on today's order flow.</p>
        </div>
        <Link 
          href="/moderator/orders"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
        >
          Manage Orders <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-zinc-900">{stat.value}</h3>
                </div>
                <div className={`${stat.bg} ${stat.color} p-4 rounded-[1.25rem] group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={24} strokeWidth={2.5} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <Card className="border-none shadow-sm bg-white p-8 group hover:shadow-md transition-shadow">
           <div className="max-w-md">
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Order Processing</h3>
              <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                As a moderator, your primary goal is ensuring all pending orders are processed and marked as delivered as quickly as possible.
              </p>
              <Link 
                href="/moderator/orders"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors"
              >
                Go to Orders
              </Link>
           </div>
        </Card>

        <Card className="border-none shadow-sm bg-slate-900 p-8 text-white">
           <div className="max-w-md">
              <h3 className="text-lg font-bold mb-2">Need Support?</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                If you encounter any issues with an order or account that requires full Admin access, please contact the system administrator.
              </p>
              <div className="w-12 h-1 bg-blue-500 rounded-full mb-2"></div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Moderator Guidelines</p>
           </div>
        </Card>
      </div>
    </div>
  );
}
