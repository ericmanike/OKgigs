"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader2, Wifi, Store, Search, MessageCircle } from "lucide-react";
import clsx from "clsx";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Wallet } from "lucide-react";



const NETWORKS = [
    { id: "MTN", name: "MTN", color: "bg-[#FFCC00]", textColor: "text-[#51291e]" },
    { id: "Telecel", name: "Telecel", color: "bg-[#E60000]", textColor: "text-white" },
    { id: "AirtelTigo", name: "AirtelTigo", color: "bg-blue-600", textColor: "text-white" },
];

export default function StoreFrontend({ slug }: { slug: string }) {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [selectedNetwork, setSelectedNetwork] = useState("MTN");
    const [selectedBundle, setSelectedBundle] = useState<any>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();

    const [storeData, setStoreData] = useState<any>(null);
    const [bundles, setBundles] = useState<any[]>([]);
    const [loadingStore, setLoadingStore] = useState(true);
    const [message, setMessage] = useState("");
    const [activeCategory, setActiveCategory] = useState<'all' | 'promo'>('all');

    const networkConfig = NETWORKS.find(n => n.id === selectedNetwork);

    useEffect(() => {
        const loadPaystackScript = () => {
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            document.body.appendChild(script);
        };
        loadPaystackScript();
        fetchStoreData();
    }, [slug]);

    const fetchStoreData = async () => {
        setLoadingStore(true);
        try {
            const res = await fetch(`/api/store/${slug}/bundles`);
            if (res.ok) {
                const data = await res.json();
                setStoreData(data);
                // initial filter
                filterBundles(data.bundles, selectedNetwork, activeCategory);
            } else {
                setStoreData(null);
            }
        } catch (error) {
            console.error('Failed to fetch store data:', error);
        } finally {
            setLoadingStore(false);
        }
    };

    const filterBundles = (allBundles: any[], network: string, category: string) => {
        if (!allBundles) return;
        const filtered = allBundles.filter((b: any) => {
            if (b.network !== network) return false;
            // Promo filter logic if needed (e.g. if the store has promo bundles)
            if (category === 'promo' && b.audience !== 'promo') return false;
            return true;
        });
        setBundles(filtered);
    };

    // Update bundles when network or category changes
    useEffect(() => {
        if (storeData) {
            filterBundles(storeData.bundles, selectedNetwork, activeCategory);
        }
    }, [selectedNetwork, activeCategory, storeData]);

    const handlePurchase = async () => {
        if (phoneNumber.length < 10) {
            alert("Valid Phone number is required");
            return;
        }

        setLoading(true);
        try {
            const reference = Date.now().toString();
            const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

            if (!paystackKey || !(window as any).PaystackPop) {
                throw new Error('Payment gateway not ready');
            }

            const price = selectedBundle.price;
            const tax = 0.02 * price;
            const total = price + tax;

            (window as any).PaystackPop.setup({
                key: paystackKey,
                email: 'guest@megagigs.net',
                currency: 'GHS',
                amount: Math.round(total * 100),
                ref: reference,
                onClose: () => {
                    setLoading(false);
                },
                callback: function (response: any) {
                    (async () => {
                        try {
                            const verifyResponse = await fetch('/api/orders', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    network: selectedNetwork,
                                    bundleName: selectedBundle.name.replace(/GB|MB/g, ''),
                                    price: selectedBundle.price,
                                    phoneNumber,
                                    reference,
                                    agentId: storeData?.agentId,
                                    agentProfit: selectedBundle?.profit
                                }),
                            });

                            if (verifyResponse.ok) {
                                setMessage("Payment successful! Your data will arrive shortly.");
                                setTimeout(() => {
                                    router.push('/');
                                }, 3000);
                            } else {
                                setMessage("Payment verification failed. Please contact support.");
                            }
                        } catch (err) {
                            setMessage("An error occurred after payment.");
                        } finally {
                            setLoading(false);
                        }
                    })();
                }
            }).openIframe();
        } catch (error) {
            console.error(error);
            setLoading(false);
            alert("Payment initiation failed.");
        }
    };

    const handleWalletPurchase = async () => {
        if (phoneNumber.length !== 10) {
            alert("Valid Phone number is required");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/agent/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: storeData.agentId,
                    bundleId: selectedBundle._id,
                    phoneNumber
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Order placed successfully! Redirecting...");
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                alert(data.message || "Wallet purchase failed");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during wallet purchase.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingStore) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
                <Loader2 className="animate-spin text-zinc-600 mb-4" size={32} />
                <p className="text-zinc-500 font-medium">Loading store...</p>
            </div>
        );
    }

    if (!storeData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
                <Store size={48} className="text-zinc-300 mb-4" />
                <h1 className="text-2xl font-bold text-zinc-900 mb-2">Store Not Found</h1>
                <p className="text-zinc-500 text-center">We couldn't find the requested agent store.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto pb-12 pt-28 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Store Header */}
            <div className="text-center mb-8 bg-white p-6 rounded-[5px] shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store className="text-blue-600" size={32} />
                </div>
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">
                    {storeData.storeName}
                </h1>
                <p className="text-zinc-500 text-sm">{storeData.description || 'Welcome to my data store! Grab the best bundles here.'}</p>

                <div className="flex items-center justify-center gap-3 mt-6">
                    <Link href={`/store/${slug}/track-order`} className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 font-medium transition-colors">
                        <Search size={16} />
                        Track Order
                    </Link>
                    <a href="https://wa.me/233551043686" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 font-medium transition-colors border border-green-100">
                        <MessageCircle size={16} />
                        Contact Support
                    </a>
                </div>
            </div>

            {/* SELECTION VIEW */}
            {step === 1 && (
                <div className="space-y-6">
                    {/* Network Selection */}
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider pl-1">Select Network</p>
                    <div className="grid grid-cols-3 gap-3">
                        {NETWORKS.map((network) => (
                            <button
                                key={network.id}
                                onClick={() => setSelectedNetwork(network.id)}
                                className={clsx(
                                    "flex flex-col items-center justify-center py-2 rounded-[5px] transition-all border-2",
                                    selectedNetwork === network.id
                                        ? `${network.color} ${network.textColor} border-transparent shadow-lg scale-105  font-bold`
                                        : "bg-white text-zinc-600 border-transparent hover:border-zinc-200 hover:bg-zinc-50"
                                )}
                            >
                                {network.name}
                            </button>
                        ))}
                    </div>

                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider pl-1 pt-2">Select Bundle</p>

                    {bundles.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-zinc-100">
                            <p className="text-zinc-500">No bundles available for {selectedNetwork}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                            {bundles.map((bundle: any) => (
                                <button
                                    key={bundle._id}
                                    onClick={() => {
                                        setSelectedBundle(bundle);
                                        setStep(2);
                                    }}
                                    className={clsx(
                                        "flex flex-col items-center justify-between p-4 py-8 rounded-[5px] transition-all text-center min-h-[160px] relative overflow-hidden",
                                        "hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-sm border-2 border-transparent",
                                        networkConfig ? `${networkConfig.color} ${networkConfig.textColor}` : "bg-white text-zinc-900"
                                    )}
                                >
                                    {/* Network Badge */}
                                    <div className="absolute top-0 left-0">
                                        <div className="bg-black/20 backdrop-blur-md text-[9px] font-black px-3 py-1.5 rounded-br-2xl uppercase tracking-widest border-r border-b border-white/10">
                                            {bundle.network}
                                        </div>
                                    </div>

                                    <div className={clsx(
                                        "w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-xl border-2 border-white/20",
                                        networkConfig ? "bg-black/15" : "bg-zinc-100"
                                    )}>
                                        <Wifi size={24} className={networkConfig ? "text-white" : "text-black"} />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center w-full min-h-[40px] mb-4">
                                        <h3 className="font-black text-[12px] tracking-tighter leading-none break-words">
                                            {bundle.name} - {formatCurrency(bundle.price)}
                                        </h3>
                                    </div>

                                    <div className={clsx(
                                        "w-full py-2 px-2 rounded  font-black text-sm shadow-inner text-center block",
                                        networkConfig ? "bg-white text-black" : "bg-zinc-900 text-white"
                                    )}>
                                        Buy Now
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* CHECKOUT VIEW */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4 bg-white px-4 py-3 rounded-xl shadow-sm max-w-lg mx-auto">
                        <button onClick={() => setStep(1)} className="text-sm font-semibold text-zinc-500 hover:text-zinc-900">
                            ← Back
                        </button>
                        <span className="text-zinc-300">/</span>
                        <span className="text-sm font-semibold">{selectedNetwork}</span>
                        <span className="text-zinc-300">/</span>
                        <span className="text-sm font-semibold text-blue-600">{selectedBundle?.name}</span>
                    </div>

                    <Card className="border-none shadow-xl max-w-lg mx-auto">
                        <CardContent className="p-6">
                            <div className="mb-6">
                                <label className="text-sm font-medium text-black mb-2 block">
                                    Recipient Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-900 bg-white text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 text-lg tracking-wide"
                                    placeholder="024XXXXXXX"
                                    autoFocus
                                />
                            </div>

                            <div className={clsx(
                                "p-4 rounded-xl space-y-2 mb-6 border shadow-inner",
                                networkConfig ? `${networkConfig.color} ${networkConfig.textColor} border-transparent` : "bg-slate-600 text-white border-slate-500"
                            )}>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-80">Network</span>
                                    <span className="font-bold">{selectedNetwork}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-80">Package</span>
                                    <span className="font-bold">{selectedBundle?.name}</span>
                                </div>
                                <div className="border-t border-black/10 my-2 pt-2 flex justify-between items-center">
                                    <span className="opacity-80">Transaction Fee</span>
                                    <span className="text-xl font-black">{formatCurrency(0.02 * selectedBundle?.price)}</span>
                                </div>
                                <div className="border-t border-black/10 my-2 pt-2 flex justify-between items-center">
                                    <span className="opacity-80">Total Price</span>
                                    <span className="text-xl font-black">{formatCurrency(selectedBundle?.price + 0.02 * selectedBundle?.price)}</span>
                                </div>
                            </div>

                            {message && (
                                <div className="mb-4 text-center p-3 rounded-lg bg-green-50 text-green-700 font-semibold border border-green-200">
                                    {message}
                                </div>
                            )}

                            <button
                                onClick={handlePurchase}
                                disabled={loading || phoneNumber.length !== 10}
                                className="w-full py-2 text-white hover:bg-slate-700 bg-slate-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer text-lg"
                            >
                                {loading ? <Loader2 className="animate-spin" size={24} /> : "Pay Now"}
                            </button>

                            {session && (
                                <button
                                    onClick={handleWalletPurchase}
                                    disabled={loading || phoneNumber.length !== 10}
                                    className="w-full py-2 bg-green-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer text-lg mt-3"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                        <>
                                            <Wallet size={20} />
                                            Buy with Wallet
                                        </>
                                    )}
                                </button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
