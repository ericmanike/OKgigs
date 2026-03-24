'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Wifi, Loader2 } from "lucide-react"
import { motion } from "motion/react"
import { formatCurrency } from "@/lib/utils"

interface Bundle {
    _id: string
    network: 'MTN' | 'Telecel' | 'AirtelTigo'
    name: string
    price: number
    audience: string
}

const NETWORK_STYLES: Record<string, { bg: string; text: string; accent: string; letter: string; dot: string }> = {
    MTN: {
        bg: "bg-gradient-to-br from-[#FFCC00] to-[#FFB800]",
        text: "text-[#1a1200]",
        accent: "#FFCC00",
        letter: "M",
        dot: "bg-[#1a1200]",
    },
    Telecel: {
        bg: "bg-gradient-to-br from-[#E60000] to-[#CC0000]",
        text: "text-white",
        accent: "#E60000",
        letter: "T",
        dot: "bg-white",
    },
    AirtelTigo: {
        bg: "bg-gradient-to-br from-[#0077C8] to-[#005FA3]",
        text: "text-white",
        accent: "#0077C8",
        letter: "A",
        dot: "bg-white",
    },
}

export default function SamplePrices() {
    const [bundles, setBundles] = useState<Bundle[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchSampleBundles = async () => {
            try {
                const res = await fetch('/api/bundles')
                if (res.ok) {
                    const data = await res.json()
                    // Only show user-facing bundles (not agent or promo)
                    const userBundles = data.filter(
                        (b: any) => b.isActive && b.audience === 'user'
                    )
                    setBundles(userBundles)
                }
            } catch (error) {
                console.error('Failed to fetch sample bundles:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSampleBundles()
    }, [])

    // Pick the first bundle from each network
    const filteredBundles = (() => {
        const seen = new Set<string>()
        return bundles.filter((b) => {
            if (seen.has(b.network)) return false
            seen.add(b.network)
            return true
        })
    })()

    return (
        <section className="w-full md:w-[80%] mx-auto px-6 pb-14">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                {/* Header row: title + View All */}
                <div className="flex items-end justify-between mb-6">
                    <div className="space-y-1">
                        <span className="inline-block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                          Trending
                        </span>
                        <h2 className="text-[14px] md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                            <span className="w-1.5 h-6 bg-[#E42320] rounded-full" />
                           Data Bundles
                        </h2>
                    </div>
                    <Link
                        href="/buy"
                        className="group flex items-center gap-1.5 text-sm font-bold text-[#E42320] hover:text-[#c01f1d] transition-colors"
                    >
                        See More
                        <ArrowRight
                            size={16}
                            className="group-hover:translate-x-0.5 transition-transform"
                        />
                    </Link>
                </div>



                {/* Bundle grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Loader2 className="animate-spin text-slate-400" size={28} />
                        <p className="text-xs font-medium text-slate-400 animate-pulse">
                            Loading prices...
                        </p>
                    </div>
                ) : filteredBundles.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-zinc-400 text-sm">No bundles available right now.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-10">
                        {filteredBundles.map((bundle, i) => {
                            const style = NETWORK_STYLES[bundle.network] || NETWORK_STYLES.MTN
                            return (
                                <motion.div
                                    key={bundle._id}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: i * 0.06 }}
                                    viewport={{ once: true }}
                                >
                                    <Link href={`/buy?network=${bundle.network}`}>
                                        <div
                                            className={`relative  rounded-2xl p-4 py-5 ${style.bg} ${style.text} overflow-hidden
                                                hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group`}
                                        >
                                            {/* Decorative blur */}
                                            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />

                                            {/* Network badge */}
                                            <div className="absolute top-0 left-0">
                                                <div className="bg-white text-black text-[10px] font-black px-2.5 py-1 rounded-br-xl uppercase tracking-widest">
                                                    {bundle.network}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col items-center text-center pt-5 pb-1 gap-2">
                                                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center border-2 border-white/20">
                                                    <Wifi size={18} strokeWidth={2.5} />
                                                </div>
                                                <h3 className="text-base font-black tracking-tight leading-none">
                                                    {bundle.name}
                                                </h3>
                                                <span className="text-[9px] font-black uppercase tracking-[0.15em] opacity-70">
                                                    Non-Expiry Data
                                                </span>
                                                <div className="w-full mt-1 py-2 rounded-xl bg-white text-black font-black text-sm shadow-inner group-hover:scale-[1.02] transition-transform">
                                                    {formatCurrency(bundle.price)}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                )}


            </motion.div>
        </section>
    )
}
