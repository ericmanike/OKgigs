"use client";

import { useState, useEffect } from "react";
import {
  Search, CheckCircle2, XCircle, Clock, ShoppingBag, Trash2, Copy, RefreshCw,
  CreditCard, Users, Shield, Megaphone
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [stats, setStats] = useState({ users: 0, orders: 0, sales: 0 });
  const [dakaziStats, setDakaziStats] = useState({ AccountBalance: { "Wallet Balance": 0 } });
  const [ordersClosed, setOrdersClosed] = useState(false);
  const [ordersClosedUpdating, setOrdersClosedUpdating] = useState(false);

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        const [ordersRes, statsRes, dakaziRes, ordersClosedRes] = await Promise.all([
          fetch("/api/admin/orders"),
          fetch("/api/admin/stats"),
          fetch("/api/testingDakazi"),
          fetch("/api/admin/settings/orders-closed"),
        ]);

        if (ordersRes.ok) setOrders(await ordersRes.json());
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
    fetchEverything();
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

  const handleMarkOrderDelivered = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "delivered" }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map((o) => (o._id === orderId ? updatedOrder : o)));
      } else {
        const data = await res.json().catch(() => ({}));
        alert("Error: " + (data.error || "Failed to update order"));
      }
    } catch {
      alert("Error updating order");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRetryOrder = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "pending" }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map((o) => (o._id === orderId ? updatedOrder : o)));
      } else {
        const data = await res.json().catch(() => ({}));
        alert("Retry failed: " + (data.error || "Failed to retry order"));
      }
    } catch {
      alert("Error retrying order");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) setOrders(orders.filter((o) => o._id !== orderId));
      else alert("Failed to delete order");
    } catch {
      alert("Error deleting order");
    }
  };

  const filteredOrders = orders.filter((order) =>
    (order.transaction_id?.toLowerCase() || "").includes(orderSearchQuery.toLowerCase()) ||
    (order.user?.name?.toLowerCase() || "").includes(orderSearchQuery.toLowerCase()) ||
    (order.phoneNumber?.toLowerCase() || "").includes(orderSearchQuery.toLowerCase()) ||
    (order.network?.toLowerCase() || "").includes(orderSearchQuery.toLowerCase()) ||
    (order.bundleName?.toLowerCase() || "").includes(orderSearchQuery.toLowerCase()) ||
    (order.status?.toLowerCase() || "").includes(orderSearchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-400">
      {/* Stats Header */}
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
          <ShoppingBag size={14} />
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
          { href: "/admin/orders", label: "Manage Orders", icon: ShoppingBag, color: "bg-purple-600 text-white border-purple-600 hover:bg-purple-700" },
          { href: "/admin/users", label: "Manage Users", icon: Users, color: "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100" },
          { href: "/admin/bundles", label: "Manage Bundles", icon: Shield, color: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100" },
          { href: "/admin/broadcast", label: "Broadcast", icon: Megaphone, color: "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100" },
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

      <div className="pt-4">
        <h2 className="text-lg font-bold text-zinc-900">Orders</h2>
        <p className="text-sm text-zinc-500 mt-0.5">View and manage all customer orders</p>
      </div>

      <Card className="border-zinc-200 bg-white overflow-hidden">
        <div className="p-4 md:p-6 border-b border-zinc-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
          <h3 className="text-base font-semibold text-zinc-900">
            All Orders <span className="text-zinc-400 font-normal text-sm">({filteredOrders.length})</span>
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search orders..."
              value={orderSearchQuery}
              onChange={(e) => setOrderSearchQuery(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-900 focus:outline-none focus:border-slate-400 transition-colors w-full placeholder-zinc-400"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-zinc-500 font-medium whitespace-nowrap">
              <tr>
                <th className="px-6 py-4 border-b">Order ID</th>
                <th className="px-6 py-4 border-b">User</th>
                <th className="px-6 py-4 border-b">Bundle</th>
                <th className="px-6 py-4 border-b">Amount</th>
                <th className="px-6 py-4 border-b">Date</th>
                <th className="px-6 py-4 border-b">Status</th>
                <th className="px-6 py-4 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 whitespace-nowrap">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-500 max-w-[140px] truncate">
                        #{order.transaction_id}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(order.transaction_id).catch(() => alert("Failed to copy ID"))}
                        className="p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
                        title="Copy transaction ID"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-900">{order.user?.name || "Unknown"}</span>
                      <span className="text-xs text-zinc-500">{order.phoneNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium
                      ${order.network === "MTN" ? "bg-yellow-400 text-yellow-950" :
                        order.network === "Telecel" ? "bg-red-500 text-white" : "bg-blue-600 text-white"}`}>
                      {order.network} {order.bundleName} GB
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-700">{formatCurrency(order.price)}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-zinc-600">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          weekday: "short", year: "numeric", month: "short", day: "numeric",
                        })}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                      ${order.status === "delivered" ? "bg-green-600 text-white border-green-700" :
                        order.status === "completed" ? "bg-green-100 text-green-700 border-green-200" :
                          order.status === "failed" ? "bg-red-100 text-red-700 border-red-200" :
                            "bg-orange-100 text-orange-700 border-orange-200"}`}>
                      {order.status === "delivered" && <CheckCircle2 size={12} />}
                      {order.status === "completed" && <CheckCircle2 size={12} />}
                      {order.status === "failed" && <XCircle size={12} />}
                      {order.status === "pending" && <Clock size={12} />}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(order.status !== "delivered" && order.transaction_id?.startsWith('paid_')) && (
                        <button
                          onClick={() => handleRetryOrder(order._id)}
                          disabled={processingId === order._id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all
                            ${processingId === order._id
                              ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
                              : "border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"}`}
                        >
                          {processingId === order._id ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              Retrying...
                            </>
                          ) : (
                            "Retry"
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    <ShoppingBag size={32} className="mx-auto mb-2 opacity-30 text-zinc-400" />
                    <p>No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-zinc-500 max-w-[160px] truncate">
                      #{order.transaction_id}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(order.transaction_id).catch(() => alert("Failed to copy"))}
                      className="p-1 rounded hover:bg-zinc-100 text-zinc-400"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                  <span className="font-semibold text-zinc-900">{order.user?.name || "Unknown"}</span>
                  <span className="text-xs text-zinc-500">{order.phoneNumber}</span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium
                  ${order.network === "MTN" ? "bg-yellow-400 text-yellow-950" :
                    order.network === "Telecel" ? "bg-red-500 text-white" : "bg-blue-600 text-white"}`}>
                  {order.network} {order.bundleName} GB
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-zinc-500 text-xs">Amount</p>
                  <p className="font-semibold text-zinc-900">{formatCurrency(order.price)}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs">Date</p>
                  <p className="text-[11px] text-zinc-700">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border
                  ${order.status === "delivered" ? "bg-green-600 text-white border-green-700" :
                    order.status === "failed" ? "bg-red-100 text-red-700 border-red-200" :
                      "bg-orange-100 text-orange-700 border-orange-200"}`}>
                  {order.status === "delivered" && <CheckCircle2 size={11} />}
                  {order.status === "failed" && <XCircle size={11} />}
                  {order.status === "pending" && <Clock size={11} />}
                  <span className="capitalize">{order.status}</span>
                </span>
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t border-zinc-100">
                {order.status !== "delivered" && (
                  <button
                    onClick={() => order.transaction_id?.startsWith('paid_') ? handleRetryOrder(order._id) : handleMarkOrderDelivered(order._id)}
                    disabled={processingId === order._id}
                    className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-all text-sm font-medium
                      ${processingId === order._id
                        ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
                        : order.transaction_id?.startsWith('paid_')
                          ? "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                          : "text-green-600 border-green-600 hover:bg-green-600 hover:text-white"}`}
                  >
                    {processingId === order._id ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : order.transaction_id?.startsWith('paid_') ? (
                      <>
                        <RefreshCw size={16} /> 
                        Retry order
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} /> 
                        Mark delivered
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg transition-all text-sm font-medium"
                >
                  <Trash2 size={16} /> Delete order
                </button>
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && (
            <div className="py-12 text-center text-zinc-500">
              <ShoppingBag size={32} className="mx-auto mb-2 opacity-30 text-zinc-400" />
              <p>No orders found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
