"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Loader2, Save, Store, Link as LinkIcon, TrendingUp, Wallet, Copy, Check, MessageCircle, DownloadCloud, Wifi, CheckCircle2, XCircle, Clock, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import WithdrawalModal from "./WithdrawalModal";

export default function AgentStoreSettings() {
    const [storeName, setStoreName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [bundleProfits, setBundleProfits] = useState<Record<string, number>>({});
    const [bundles, setBundles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [totalSalesCount, setTotalSalesCount] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [storeOrders, setStoreOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        fetchStoreData();
        fetchStoreOrders();
    }, []);

    const fetchStoreData = async () => {
        try {
            const [storeRes, bundlesRes] = await Promise.all([
                fetch('/api/agent/store'),
                fetch('/api/bundles')
            ]);

            if (bundlesRes.ok) {
                const data = await bundlesRes.json();
                // Agents use active bundles that are for agents
                const availableBundles = data.filter((b: any) => b.isActive && b.audience === 'agent');
                setBundles(availableBundles);
            }

            if (storeRes.ok) {
                const store = await storeRes.json();
                if (store) {
                    setStoreName(store.storeName || "");
                    setSlug(store.slug || "");
                    setDescription(store.description || "");
                    setBundleProfits(store.bundleProfits || {});
                    setTotalSalesCount(store.totalSalesCount || 0);
                    setTotalProfit(store.totalProfit || 0);
                }
            }
        } catch (error) {
            console.error("Error fetching store data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStoreOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await fetch('/api/agent/orders');
            if (res.ok) {
                const data = await res.json();
                setStoreOrders(data);
            }
        } catch (error) {
            console.error("Error fetching store orders:", error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleProfitChange = (bundleId: string, amount: string) => {
        const val = parseFloat(amount);
        setBundleProfits(prev => ({
            ...prev,
            [bundleId]: isNaN(val) ? 0 : val
        }));
    };

    const handleSave = async () => {
        if (!storeName || !slug) {
            setMessage({ type: 'error', text: "Store Name and Store URL Slug are required." });
            return;
        }

        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/agent/store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeName,
                    slug,
                    description,
                    bundleProfits
                })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: "Store settings saved successfully!" });
            } else {
                setMessage({ type: 'error', text: data.error || "Failed to save settings." });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "An error occurred while saving." });
        } finally {
            setSaving(false);
        }
    };

    const handleWithdraw = async () => {
        if (totalProfit <= 0) return;
        
        if (!confirm(`Are you sure you want to withdraw ${formatCurrency(totalProfit)} to your wallet balance?`)) {
            return;
        }

        setWithdrawing(true);
        setMessage(null);
        try {
            const res = await fetch('/api/agent/withdraw', {
                method: 'POST',
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: `Successfully withdrawn ${formatCurrency(totalProfit)} to your wallet!` });
                setTotalProfit(0);
                // Also update session wallet balance if needed, but a reload or manual fetch would be better
                // For now just clearing the current profit display
            } else {
                setMessage({ type: 'error', text: data.error || "Failed to process withdrawal." });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "An error occurred during withdrawal." });
        } finally {
            setWithdrawing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-zinc-500" size={32} />
            </div>
        );
    }

    const storeUrl = typeof window !== 'undefined' ? `${window.location.origin}/store/${slug}` : `https://megagigs.net/store/${slug}`;

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(storeUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleWhatsAppShare = () => {
        const text = `Buy cheap data bundles instantly at my store! Check it out here: ${storeUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <TrendingUp size={13} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500">Total Store Sales</p>
                            <h3 className="text-sm font-black text-zinc-900">{totalSalesCount}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex flex-col items-center  gap-4">
                        <div className="flex items-center gap-4 self-start">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                                <Wallet size={15} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-500">Total Profit Earned</p>
                                <h3 className="text-sm font-black text-zinc-900">{formatCurrency(totalProfit)}</h3>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsWithdrawModalOpen(true)}
                            disabled={totalProfit <= 0 || withdrawing}
                            className={clsx(
                                "px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-500 transition-colors flex items-center gap-2 self-center w-full",
                                (totalProfit != 0 || withdrawing) && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {withdrawing ? <Loader2 className="animate-spin" size={16} /> : <DownloadCloud size={13} />}
                            Withdraw
                        </button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Store className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <CardTitle>My Store Setup</CardTitle>
                            <CardDescription>Configure your personal data store</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {message && (
                        <div className={clsx("p-3 rounded-lg text-sm font-medium", message.type === 'success' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Store Name</label>
                            <input
                                type="text"
                                value={storeName}
                                onChange={e => {
                                    const name = e.target.value;
                                    setStoreName(name);
                                    // Auto-generate slug: lowercase, replace spaces with hyphens, remove non-alphanumeric (except hyphens)
                                    setSlug(name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                                }}
                                className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. John's Data Plug"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-500 uppercase tracking-wider text-[10px]">Store URL </label>
                            <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 rounded-xl border border-dashed border-zinc-200 text-sm font-mono overflow-hidden">
                                <div className="flex items-center truncate mr-2">
                                    <span className="text-zinc-400 select-none">megagigs.net/store/</span>
                                    <span className="text-blue-600 font-bold truncate">{slug || 'your-slug'}</span>
                                </div>
                                <button
                                    onClick={handleCopyUrl}
                                    title="Copy Store URL"
                                    className="p-2 border-l border-zinc-200 pl-3 hover:text-blue-600 transition-colors shrink-0"
                                >
                                    {copied ? <Check size={16} className="text-green-600 animate-in zoom-in" /> : <Copy size={16} className="text-zinc-400" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {slug && (
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                            <Link href={`/store/${slug}`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 font-medium transition-colors">
                                <LinkIcon size={16} />
                                View Store
                            </Link>

                            <button
                                onClick={handleWhatsAppShare}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 font-medium transition-colors border border-green-200"
                            >
                                <MessageCircle size={16} />
                                Share on WhatsApp
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Set Bundle Prices</CardTitle>
                    <CardDescription>Determine your profit over the base price for each bundle</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 text-zinc-500">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Network</th>
                                    <th className="px-4 py-3">Bundle</th>
                                    <th className="px-4 py-3">Base Price</th>
                                    <th className="px-4 py-3">Your Profit (GHS)</th>
                                    <th className="px-4 py-3 rounded-r-lg">Final Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {bundles.map(bundle => {
                                    const profit = bundleProfits[bundle._id] || 0;
                                    const finalPrice = bundle.price + profit;
                                    return (
                                        <tr key={bundle._id}>
                                            <td className="px-4 py-3 font-medium">{bundle.network}</td>
                                            <td className="px-4 py-3">{bundle.name}</td>
                                            <td className="px-4 py-3">{formatCurrency(bundle.price)}</td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.5"
                                                    value={profit}
                                                    onChange={e => handleProfitChange(bundle._id, e.target.value)}
                                                    className="w-24 px-2 py-1 rounded border focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-bold text-zinc-900">
                                                {formatCurrency(finalPrice)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-500 disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Save Store Settings
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Store Orders */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <ShoppingBag className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <CardTitle>Orders Through Your Store</CardTitle>
                            <CardDescription>Orders placed by customers via your store link</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-zinc-100">
                    {loadingOrders ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="animate-spin text-zinc-400" size={24} />
                        </div>
                    ) : storeOrders.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag size={24} className="text-zinc-400" />
                            </div>
                            <p className="text-zinc-600 font-medium">No store orders yet</p>
                            <p className="text-sm text-zinc-400 mt-1">Share your store link to start receiving orders</p>
                        </div>
                    ) : (
                        storeOrders.map((order) => {
                            const profit = order.originalPrice ? order.price - order.originalPrice : 0;
                            return (
                                <div
                                    key={order._id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 hover:bg-zinc-50/80 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className={clsx(
                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                                order.network === "MTN" && "bg-amber-400 text-amber-950",
                                                order.network === "Telecel" && "bg-red-500 text-white",
                                                order.network !== "MTN" && order.network !== "Telecel" && "bg-blue-600 text-white"
                                            )}
                                        >
                                            <Wifi size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-zinc-900 text-sm truncate">
                                                {order.network} {order.bundleName}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                <span className="text-xs text-zinc-500">{order.phoneNumber}</span>
                                                <span className="text-xs text-zinc-300">•</span>
                                                <span className="text-xs text-zinc-400">
                                                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="text-right">
                                            <p className="font-bold text-zinc-900 text-sm">{formatCurrency(order.price)}</p>
                                            {profit > 0 && (
                                                <p className="text-[11px] font-semibold text-green-600">+{formatCurrency(profit)} profit</p>
                                            )}
                                        </div>
                                        <span
                                            className={clsx(
                                                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
                                                order.status === "delivered" && "bg-green-500 text-white",
                                                order.status === "pending" && "bg-amber-100 text-amber-700 border border-amber-200",
                                                order.status === "placed" && "bg-amber-100 text-amber-700 border border-amber-200",
                                                order.status === "failed" && "bg-red-50 text-red-700 border border-red-200",
                                                order.status === "reversed" && "bg-red-50 text-red-700 border border-red-200"
                                            )}
                                        >
                                            {order.status === "delivered" && <CheckCircle2 size={12} className="text-green-200" />}
                                            {(order.status === "pending" || order.status === "placed") && <Clock size={12} />}
                                            {(order.status === "failed" || order.status === "reversed") && <XCircle size={12} />}
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </CardContent>
            </Card>

            <WithdrawalModal 
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                maxAmount={totalProfit}
                onSuccess={(amount) => {
                    setTotalProfit(prev => prev - amount);
                    setMessage({ type: 'success', text: `Withdrawal request for ${formatCurrency(amount)} submitted! Your balance will update once approved.` });
                }}
            />
        </div>
    );
}
