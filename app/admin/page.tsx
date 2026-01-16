"use client";

import { useState, useEffect } from "react";
import { Users, ShoppingBag, CreditCard, Plus, Trash2, Edit, Package, Search, ChevronRight, CheckCircle2, XCircle, Clock, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, orders: 0, sales: 0 });
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users' | 'bundles'>('overview');
    const [loading, setLoading] = useState(true);

    // Data States
    const [users, setUsers] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [bundles, setBundles] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Stats
            const statsRes = await fetch('/api/admin/stats');
            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            }

            // Fetch Bundles
            const bundlesRes = await fetch('/api/bundles');
            if (bundlesRes.ok) setBundles(await bundlesRes.json());

            // Load extra data if authenticated
            loadTabSpecificData('orders'); // Preload or load lazy
            loadTabSpecificData('users');

        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const loadTabSpecificData = async (tab: string) => {
        try {
            if (tab === 'orders') {
                const res = await fetch('/api/admin/orders');
                if (res.ok) setOrders(await res.json());
            }
            if (tab === 'users') {
                const res = await fetch('/api/admin/users');
                if (res.ok) setUsers(await res.json());
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Effect to lazy load data when tab changes if needed (already preloaded above for simplicity)
    useEffect(() => {
        // if (activeTab === 'users' && users.length === 0) loadTabSpecificData('users');
        // if (activeTab === 'orders' && orders.length === 0) loadTabSpecificData('orders');
    }, [activeTab]);


    if (loading && !stats.users) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 pt-24 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">Admin Dashboard</h1>
                        <p className="text-slate-400 mt-1">Manage users, orders, and system settings.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-lg flex items-center gap-2 text-sm text-blue-200">
                            <Shield size={16} /> Admin Access
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-white/10">
                    <div className="flex gap-6 overflow-x-auto pb-1">
                        {[
                            { id: 'overview', label: 'Overview', icon: CheckCircle2 }, // Using dummy icon
                            { id: 'orders', label: 'Orders', icon: ShoppingBag },
                            { id: 'users', label: 'Users', icon: Users },
                            { id: 'bundles', label: 'Bundles', icon: Package },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-all relative
                                    ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-400 hover:text-white'}
                                `}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="space-y-6">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                                            <Users size={24} />
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-400 rounded-lg flex items-center gap-1">
                                            +4% <span className="opacity-50">vs last week</span>
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium">Total Users</p>
                                    <h3 className="text-3xl font-bold mt-1">{stats.users}</h3>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-400 rounded-lg flex items-center gap-1">
                                            +12% <span className="opacity-50">vs last week</span>
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium">Total Orders</p>
                                    <h3 className="text-3xl font-bold mt-1">{stats.orders}</h3>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-green-500/20 text-green-400 rounded-xl">
                                            <CreditCard size={24} />
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-400 rounded-lg flex items-center gap-1">
                                            +8% <span className="opacity-50">vs last week</span>
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium">Total Sales</p>
                                    <h3 className="text-3xl font-bold mt-1">GHS {stats.sales.toLocaleString()}</h3>
                                </div>
                            </div>

                            {/* Recent Activity Section could go here */}
                        </>
                    )}

                    {/* ORDERS TAB */}
                    {activeTab === 'orders' && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Recent Orders</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search orders..."
                                        className="bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors w-64"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white/5 text-slate-300 font-medium">
                                        <tr>
                                            <th className="px-6 py-4">Order ID</th>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Bundle</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {orders.map((order) => (
                                            <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs text-slate-400">#{order._id.slice(-6)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-white">{order.user?.name || 'Unknown'}</span>
                                                        <span className="text-xs text-slate-500">{order.phoneNumber}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium 
                                                        ${order.network === 'MTN' ? 'bg-yellow-500/10 text-yellow-400' :
                                                            order.network === 'Telecel' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                        {order.network} {order.bundleName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-200">GHS {order.price.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                                                        ${order.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                            order.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                                'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                                        {order.status === 'completed' && <CheckCircle2 size={12} />}
                                                        {order.status === 'failed' && <XCircle size={12} />}
                                                        {order.status === 'pending' && <Clock size={12} />}
                                                        <span className="capitalize">{order.status}</span>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Registered Users</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white/5 text-slate-300 font-medium">
                                        <tr>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Joined</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        {user.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase
                                                        ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-700 text-slate-300'}
                                                    `}>{user.role}</span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-slate-400 hover:text-white transition-colors">
                                                        <Edit size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* BUNDLES TAB */}
                    {activeTab === 'bundles' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Data Bundles</h2>
                                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">
                                    <Plus size={16} /> Add Bundle
                                </button>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-blue-900/20 text-blue-100">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Network</th>
                                            <th className="px-6 py-4 font-medium">Bundle Name</th>
                                            <th className="px-6 py-4 font-medium">Price (GHS)</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {bundles.map((bundle) => (
                                            <tr key={bundle._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-medium">
                                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase w-16 text-center
                                                        ${bundle.network === 'MTN' ? 'bg-yellow-400 text-yellow-900' :
                                                            bundle.network === 'Telecel' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                                                        {bundle.network}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-white font-medium">{bundle.name}</td>
                                                <td className="px-6 py-4 text-slate-300">{bundle.price.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                        ${bundle.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {bundle.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 flex gap-2 justify-end">
                                                    <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {bundles.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                    <Package size={32} className="mx-auto mb-2 opacity-50" />
                                                    <p>No bundles found</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
