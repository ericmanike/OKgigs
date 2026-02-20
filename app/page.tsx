'use client'

import Link from "next/link";
import Image from "next/image";
import { ArrowBigDownDash, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { FaPhone, FaWhatsapp } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero image - full width */}
      <section className="relative w-full min-h-screen pt-24 md:pt-28 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/Hero.png"
            alt="Data bundles"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={95}
          />
          <div className="absolute inset-0 bg-[#0e0947]/60" />
        </div>
        <div className="relative h-full min-h-[calc(100vh-6rem)] flex flex-col justify-center max-w-6xl mx-auto px-6 py-12 md:py-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
          >
            <div>
              <span className="inline-block text-xs font-medium text-white/70 uppercase tracking-widest mb-3">
                Data bundles in Ghana
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight max-w-xl">
                Affordable data for all networks. Delivered in seconds.
              </h1>
              <p className="text-white/80 text-sm md:text-base mt-4 max-w-lg">
                MTN, Telecel, and AirtelTigo. Simple checkout. Instant delivery.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/buy"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#0e0947] font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Buy data <ArrowRight size={18} />
              </Link>
              <Link
                href="/track-order"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/30 text-white font-medium text-sm hover:bg-white/10 transition-colors"
              >
                <ArrowBigDownDash size={18} /> Track order
              </Link>
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
            <div className="rounded-2xl bg-[#0e0947] text-white p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-[#0e0947]/95 transition-colors shadow-lg">
              <div>
                <h2 className="text-lg md:text-xl font-bold">Ready to get your data?</h2>
                <p className="text-white/80 text-sm mt-1">A simple 3-step process. No delays, no hidden charges.</p>
              </div>
              <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0e0947] font-semibold text-sm shrink-0">
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
            className="flex items-center justify-center gap-2 bg-[#0e0947] text-white rounded-xl px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <FaWhatsapp size={18} /> Join WhatsApp
          </a>
          <a
            href="https://wa.me/233551043686"
            className="flex items-center justify-center gap-2 bg-[#0e0947] text-white rounded-xl px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <FaPhone size={18} /> Contact support
          </a>
          <Link
            href="/terms"
            className="flex items-center justify-center gap-2 bg-[#0e0947] text-white rounded-xl px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
