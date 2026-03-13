"use client";

import Link from "next/link";
import { Lock, ArrowRight, Home, PackageSearch, MessageSquare, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";

export default function OrdersClosedPage() {
    return (
        <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full" />
            
            <div className="w-full max-w-md relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-white border border-white rounded-[2.5rem] p-5 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden relative"
                >
                    <div className="flex flex-col items-center text-center">
                        {/* Animated Icon Container */}
                        <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                                repeat: Infinity, 
                                repeatType: "reverse", 
                                duration: 2,
                                ease: "easeInOut" 
                            }}
                            className="w-14 h-14 rounded-2xl bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_10px_20px_rgba(239,68,68,0.15)] mb-5"
                        >
                            <Lock className="text-white" size={24} strokeWidth={2.5} />
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="text-xl md:text-2xl font-black text-zinc-900 mb-2 tracking-tight"
                        >
                            System Maintenance
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 }}
                            className="text-zinc-500 text-sm mb-6 leading-relaxed max-w-[280px] mx-auto font-medium"
                        >
                            Our order desk is taking a short break. We&apos;ll be back online processing deliveries shortly.
                        </motion.p>

                        {/* Status Grid */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="grid grid-cols-2 gap-2.5 w-full mb-6"
                        >
                            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-2.5 text-left">
                                <p className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-0.5">Status</p>
                                <p className="text-zinc-900 text-xs font-bold flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                                    Paused
                                </p>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-2.5 text-left">
                                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Estimated</p>
                                <p className="text-zinc-900 text-xs font-bold flex items-center gap-1.5">
                                    <RefreshCcw size={10} className="animate-spin text-zinc-400" />
                                    Soon
                                </p>
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <div className="flex flex-col w-full gap-2.5">
                            <Link href="/track-order">
                                <motion.div 
                                    whileHover={{ backgroundColor: "#18181b" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-zinc-900 text-white py-3 rounded-2xl font-black text-[13px] flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10 transition-all"
                                >
                                    <PackageSearch size={16} />
                                    Track Existing Order
                                    <ArrowRight size={14} />
                                </motion.div>
                            </Link>

                            <div className="grid grid-cols-2 gap-2.5">
                                <Link href="/">
                                    <motion.div 
                                        whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                                        className="py-3 rounded-2xl border border-zinc-200 text-zinc-700 font-bold text-[11px] flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Home size={12} /> Home
                                    </motion.div>
                                </Link>
                                <Link href="/contact">
                                    <motion.div 
                                        whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                                        className="py-3 rounded-2xl border border-zinc-200 text-zinc-700 font-bold text-[11px] flex items-center justify-center gap-2 transition-all"
                                    >
                                        <MessageSquare size={12} /> Support
                                    </motion.div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 text-center"
                >
                    <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-[0.3em]">
                        &copy; {new Date().getFullYear()} MegaGigs Network
                    </p>
                </motion.div>
            </div>

        </div>
    );
}

