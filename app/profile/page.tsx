"use client";

import { useSession, signOut } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/Card";
import { User, Mail, Phone, LogOut, Shield } from "lucide-react";
import { useEffect } from "react";
import clsx from "clsx";

export default function ProfilePage() {
    const { data: session, update } = useSession();

    useEffect(() => {
          (async () => {
            await update();
          });
    
    }, []);

    return (
        <div className="p-4 max-w-md mx-auto space-y-6 md:pt-25 pt-24 z-0">
            <h1 className="text-2xl font-bold">Profile</h1>

            <Card className="text-center py-8">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    <User size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-600">{session?.user?.name}</h2>
                <p className="text-slate-900 text-sm">{session?.user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-blue-700 rounded-full text-xs font-medium uppercase tracking-wider text-blue-100 border border-blue-400">
                    {session?.user?.role === 'admin' && <Shield size={12} />} {session?.user?.role || 'Undefined'}
                </div>
            </Card>

            <div className="space-y-3">
                <h3 className="text-sm font-medium text-zinc-500 px-1">Account Info</h3>
                <Card>
                    <CardContent className="divide-y divide-blue-500 p-0">
                        <div className="flex items-center gap-4 p-4">
                            <User size={20} className="text-slate-600" />
                            <div>
                                <p className="text-xs text-slate-600">Full Name</p>
                                <p className="font-medium text-sm text-slate-600">{session?.user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4">
                            <Mail size={20} className="text-slate-600" />
                            <div>
                                <p className="text-xs text-slate-600">Email Address</p>
                                <p className="font-medium text-sm text-slate-600">{session?.user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4">
                            <Phone size={20} className="text-slate-600" />
                            <div>
                                <p className="text-xs text-slate-600">Phone Number</p>
                                <p className="font-medium text-sm text-slate-600">Not set</p>
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
                RiskWhiz v1.0.0
            </p>
        </div>
    );
}
