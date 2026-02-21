'use client'

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { FaPhone, FaWhatsapp } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero image - full width */}
      <section className="relative w-full min-h-[60vh] flex items-center pt-24 md:pt-28 overflow-hidden bg-linear-to-b from-zinc-50 to-white">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-200 to-transparent" />
        <div className="relative w-full max-w-6xl mx-auto px-6 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
          >
            <div className="max-w-xl">
              <span className="inline-block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Ghana Data bundles 
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
                Affordable data for all networks. <span className="text-[#E42320]">Instant</span> delivery.
              </h1>
              <p className="text-slate-600 text-base md:text-lg mt-5 leading-relaxed">
                MTN, Telecel, and AirtelTigo. Simple checkout, secure payments, and data delivered in seconds.
              </p>
            </div>
            <div className="flex flex-col gap-8 shrink-0 md:pt-4">
              <div className="relative group">
                {/* Visual Anchor: Clean Portrait */}
                <div className="relative w-full h-40 md:h-48 max-w-sm sm:max-w-md">
                  <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl shadow-slate-200">
                    <Image
                      src="/graduate.jpg"
                      alt="Satisfied Customer"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/buy"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-slate-900 text-white font-bold text-base hover:bg-slate-800 transition-all shadow-xl hover:shadow-slate-900/30 active:scale-[0.95]"
                >
                  Buy data <ArrowRight size={20} />
                </Link>
                <Link
                  href="/track-order"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-base hover:bg-zinc-50 transition-all active:scale-[0.95]"
                >
                  Track order
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features - horizontal strips with accent */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16 -mt-6 relative z-10">
        <div className="space-y-4">





        </div>
      </section>

      {/* CTA block */}
      <section className=" md:w-[80%] w-full mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/buy">
            <div className="rounded-2xl bg-[#E42320] text-white p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-[#E42320]/95 transition-colors shadow-lg">
              <div>
                <h2 className="text-lg md:text-xl font-bold">Ready to get your data?</h2>
                <p className="text-white/80 text-sm mt-1">A simple 3-step process. No delays, no hidden charges.</p>
              </div>
              <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#E42320] font-semibold text-sm shrink-0">
                Place order <ArrowRight size={18} />
              </span>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Footer actions */}
      <footer className="mt-auto w-full px-6 py-10 bg-zinc-100/80 border-t border-zinc-200/80">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row flex-wrap justify-around gap-3">

          <a
            href="https://chat.whatsapp.com/JxpJjBisX0BGOO5BY8yWJJ?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#E42320] text-white rounded-xl px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <FaWhatsapp size={18} /> Join WhatsApp
          </a>
          <a
            href="https://wa.me/233551043686"
            className="flex items-center justify-center gap-2 bg-[#E42320] text-white rounded-xl px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <FaPhone size={18} /> Contact support
          </a>
          <Link
            href="/terms"
            className="flex items-center justify-center gap-2 bg-[#E42320] text-white rounded-xl px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
