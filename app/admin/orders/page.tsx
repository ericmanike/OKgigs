"use client";

import { useState, useEffect } from "react";
import {
  Search, CheckCircle2, XCircle, Clock, ShoppingBag, Trash2, Copy, RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) setOrders(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleMarkOrderDelivered = async (orderId: string) => {
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
        alert("This error occurred " + data.error || "Failed to update order");
      }
    } catch {
      alert("Error updating order");
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
      <div>
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
                          onClick={() => handleMarkOrderDelivered(order._id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all
                            ${order.transaction_id?.startsWith('paid_')
                              ? "border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
                              : "border-green-600 text-green-700 hover:bg-green-600 hover:text-white"}`}
                        >

                            
                            Retry
                            
                         
                               
                          
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
                    onClick={() => handleMarkOrderDelivered(order._id)}
                    className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-all text-sm font-medium
                      ${order.transaction_id?.startsWith('paid_')
                        ? "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                        : "text-green-600 border-green-600 hover:bg-green-600 hover:text-white"}`}
                  >
                    {order.transaction_id?.startsWith('paid_') ? (
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
