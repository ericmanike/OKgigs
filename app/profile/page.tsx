"use client";

import { useSession, signOut } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/Card";
import { User, Mail, Phone, LogOut, Shield, Edit2, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [phone, setPhone] = useState<string | null>(null);
    const [editingPhone, setEditingPhone] = useState(false);
    const [phoneInput, setPhoneInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        (async () => {
            await update();
        });
    }, []);

    useEffect(() => {
        fetchPhone();
    }, []);

    const fetchPhone = async () => {
        try {
            setFetching(true);
            const res = await fetch('/api/profile/phone');
            if (res.ok) {
                const data = await res.json();
                setPhone(data.phone);
                setPhoneInput(data.phone || "");
            }
        } catch (error) {
            console.error('Error fetching phone:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleSavePhone = async () => {
        const trimmedPhone = phoneInput.trim();
        if (trimmedPhone === (phone || "")) {
            setEditingPhone(false);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/profile/phone', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: trimmedPhone || null })
            });

            if (res.ok) {
                const data = await res.json();
                setPhone(data.phone);
                setPhoneInput(data.phone || "");
                setEditingPhone(false);
            } else {
                const error = await res.json();
                alert(error.message || 'Failed to update phone number');
            }
        } catch (error) {
            console.error('Error updating phone:', error);
            alert('Error updating phone number');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSavePhone();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    const handleCancelEdit = () => {
        setPhoneInput(phone || "");
        setEditingPhone(false);
    };

    return (
        <div className="p-4 max-w-md mx-auto space-y-6 md:pt-25 pt-24 z-0">
            <h1 className="text-2xl font-bold">Profile</h1>

            <Card className="text-center py-8">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                    <User size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">{session?.user?.name}</h2>
                <p className="text-slate-500 text-sm">{session?.user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium uppercase tracking-wider text-slate-700 border border-slate-200">
                    {session?.user?.role === 'admin' && <Shield size={12} />} {session?.user?.role || 'Undefined'}
                </div>
            </Card>

            <div className="space-y-3">
                <h3 className="text-sm font-medium text-zinc-500 px-1">Account Info</h3>
                <Card>
                    <CardContent className="divide-y divide-slate-100 p-0">
                        <div className="flex items-center gap-4 p-4">
                            <User size={20} className="text-slate-500" />
                            <div>
                                <p className="text-xs text-slate-400">Full Name</p>
                                <p className="font-medium text-sm text-slate-700">{session?.user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4">
                            <Mail size={20} className="text-slate-500" />
                            <div>
                                <p className="text-xs text-slate-400">Email Address</p>
                                <p className="font-medium text-sm text-slate-700">{session?.user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4">
                            <Phone size={20} className="text-slate-500" />
                            <div className="flex-1">
                                <p className="text-xs text-slate-400 mb-1">Phone Number</p>
                                {editingPhone ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="tel"
                                            value={phoneInput}
                                            onChange={(e) => setPhoneInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="024 XXX XXXX"
                                            className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-900"
                                            autoFocus
                                            disabled={loading}
                                        />
                                        <button
                                            onClick={handleSavePhone}
                                            disabled={loading}
                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Save (Enter)"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            disabled={loading}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Cancel (Esc)"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-sm text-slate-700">
                                            {fetching ? "Loading..." : (phone || "Not set")}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setPhoneInput(phone || "");
                                                setEditingPhone(true);
                                            }}
                                            className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                            title="Edit phone number"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <button
                onClick={() => signOut()}
                className="w-full text-white hover:bg-red-700 bg-red-600 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm border border-red-100"
            >
                <LogOut size={18} /> Sign Out
            </button>

            <p className="text-center text-xs text-zinc-400 pt-4">
                OKGigs v1.0.0
            </p>
        </div>
    );
}
