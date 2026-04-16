'use client'

import Link from "next/link";
import { ArrowRight, AlertCircle, Zap, Infinity } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import Pattern from "@/components/ui/Pattern";
import BuyingModal from "@/components/ui/buyingModal";
import { useRouter } from "next/navigation";
import ContactHeader from "@/components/ui/contactHeader";
import SamplePrices from "@/components/ui/SamplePrices";



const BANNERS = [
  {
    id: "mtn",
    bg: "#FFCC00",
    blob1: "rgba(180,120,0,0.18)",
    blob2: "rgba(255,220,0,0.35)",
    logoBg: "#1a1200",
    logoText: "#FFCC00",
    labelColor: "rgba(100,60,0,0.7)",
    nameColor: "#1a1200",
    subColor: "rgba(100,60,0,0.8)",
    pillBg: "rgba(100,60,0,0.12)",
    pillText: "#1a1200",
    iconBoxBg: "rgba(100,60,0,0.10)",
    iconBoxBorder: "rgba(100,60,0,0.20)",
    iconText: "#1a1200",
    iconLabel: "#5a3800",
    deliveryText: "rgba(100,60,0,0.7)",
    shadowColor: "rgba(255,200,0,0.4)",
    letter: "M",
    network: "MTN",
    sizes: ["1GB", "2GB", "5GB", "10GB"],
  },
  {
    id: "telecel",
    bg: "#E60000",
    blob1: "rgba(255,255,255,0.12)",
    blob2: "rgba(255,100,100,0.18)",
    logoBg: "#ffffff",
    logoText: "#E60000",
    labelColor: "rgba(255,255,255,0.75)",
    nameColor: "#ffffff",
    subColor: "rgba(255,255,255,0.80)",
    pillBg: "rgba(255,255,255,0.20)",
    pillText: "#ffffff",
    iconBoxBg: "rgba(255,255,255,0.12)",
    iconBoxBorder: "rgba(255,255,255,0.25)",
    iconText: "#ffffff",
    iconLabel: "rgba(255,255,255,0.9)",
    deliveryText: "rgba(255,255,255,0.75)",
    shadowColor: "rgba(220,0,0,0.4)",
    letter: "T",
    network: "Telecel",
    sizes: ["1GB", "2GB", "5GB", "10GB"],
  },
  {
    id: "airteltigo",
    bg: "#0077C8",
    blob1: "rgba(255,255,255,0.10)",
    blob2: "rgba(0,60,140,0.25)",
    logoBg: "#ffffff",
    logoText: "#0077C8",
    labelColor: "rgba(255,255,255,0.75)",
    nameColor: "#ffffff",
    subColor: "rgba(255,255,255,0.80)",
    pillBg: "rgba(255,255,255,0.20)",
    pillText: "#ffffff",
    iconBoxBg: "rgba(255,255,255,0.12)",
    iconBoxBorder: "rgba(255,255,255,0.25)",
    iconText: "#ffffff",
    iconLabel: "rgba(255,255,255,0.9)",
    deliveryText: "rgba(255,255,255,0.75)",
    shadowColor: "rgba(0,100,200,0.4)",
    letter: "A",
    network: "AirtelTigo",
    sizes: ["1GB", "2GB", "5GB", "10GB"],
  },
];

export default function Home() {
  const [activeBanner, setActiveBanner] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('/buy');
  const router = useRouter();

  const handleCtaClick = (url: string) => {  
  router.push(url)
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % BANNERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (localStorage.getItem("okgigs_skip_buying_notice") === "true") {
      return
    } else {
      setTimeout(() => {
        setShowModal(true);
      }, 1500);
    }
   
  }, []);

  const banner = BANNERS[activeBanner];

  return (
    <>
      <Pattern />
      <div className="min-h-screen flex flex-col">
        {/* Hero image - full width */}
        <section className="relative w-full min-h-[60vh] flex items-center pt-24 md:pt-28 overflow-hidden">
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
                 Buy Ghana Data bundles
                </span>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
                  Save More ,Browse <Infinity className="inline text-blue-600" size={34} />  <br /> <span className="text-[#E42320]">  Cheap Internet Data Bundles.</span><br /> <span className=" text-blue-600">  Fastest </span> delivery.
                </h1>
                <p className="text-slate-600 text-base md:text-lg mt-5 leading-relaxed">
                  MTN, Telecel, and AirtelTigo. Simple checkout, secure payments, and data delivered in seconds.
                </p>
              </div>
              <div className="flex flex-col gap-8 shrink-0 md:pt-4">
                {/* Network Banner Carousel */}
                <div className="flex flex-col items-center gap-3">
                    <button
                      onClick={() => handleCtaClick(`/buy?network=${banner.network}`)}
                      className="relative w-full h-44 md:h-52 max-w-sm sm:max-w-lg rounded-[30px] overflow-hidden border-4 border-white shadow-2xl group transition-all duration-500 cursor-pointer text-left"
                      style={{ backgroundColor: banner.bg }}
                    >
                      {/* Background blobs */}
                      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-[20px] blur-2xl" style={{ backgroundColor: banner.blob1 }} />
                      <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-[20px] blur-xl" style={{ backgroundColor: banner.blob2 }} />

                      {/* Content */}
                      <div className="relative h-full flex items-center justify-between px-7 py-5">
                        {/* Left side */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: banner.labelColor }}>Network</span>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shadow-lg" style={{ backgroundColor: banner.logoBg, color: banner.logoText }}>
                              {banner.letter}
                            </div>
                            <span className="text-2xl font-black tracking-tight" style={{ color: banner.nameColor }}>{banner.network}</span>
                          </div>
                          <span className="text-xs font-semibold mt-1" style={{ color: banner.subColor }}>Data Bundles Available</span>
                          <div className="flex gap-1.5 mt-1 flex-wrap">
                            {banner.sizes.map(size => (
                              <span key={size} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: banner.pillBg, color: banner.pillText }}>
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right side */}
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="w-20 h-20 rounded-[10px] border-2 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-500"
                            style={{ borderColor: banner.iconBoxBorder }}
                          >
                            <Zap size={36} strokeWidth={2.5} style={{ color: banner.iconText }} />
                            <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: banner.iconLabel }}>Instant</span>
                          </div>
                          <span className="text-[10px] font-bold text-center" style={{ color: banner.deliveryText }}>Delivered in<br />seconds</span>
                        </div>
                      </div>
                    </button>

                  {/* Dot indicators */}
                  <div className="flex gap-2">
                    {BANNERS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveBanner(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === activeBanner ? "w-5 bg-slate-700" : "w-1.5 bg-slate-300"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleCtaClick('/buy')}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3  bg-slate-900 text-white font-bold text-base hover:shadow-lg transition-all shadow-xl hover:shadow-slate-900/30 active:scale-[0.95] cursor-pointer"
                  >
                    Buy data <ArrowRight size={20} />
                  </button>
                  <Link
                    href="/track-order"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3  border-2 border-slate-200 bg-white text-slate-700 font-bold text-base hover:bg-zinc-50 transition-all active:scale-[0.95]"
                  >
                    Check order Status
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

        {/* Sample Prices */}
        <SamplePrices />

        {/* CTA block */}
        <section className=" md:w-[80%] w-full mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={() => handleCtaClick('/buy')}
              className="w-full text-left cursor-pointer"
            >
              <div className="rounded-2xl bg-[#E42320] text-white p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-[#E42320]/95 transition-colors shadow-lg">
                <div>
                  <h2 className="text-lg md:text-xl font-bold">Ready to get your data?</h2>
                  <p className="text-white/80 text-sm mt-1">A simple 3-step process. No delays, no hidden charges.</p>
                </div>
                <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#E42320] font-semibold text-sm shrink-0">
                  Place order <ArrowRight size={18} />
                </span>
              </div>
            </button>
          </motion.div>
        </section>

        {/* Important Notice section */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/70 backdrop-blur-sm border border-zinc-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-zinc-100 pb-8">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="w-2 h-8 bg-[#E42320] rounded-full" />
                  Important Notice
                </h2>
                <p className="text-slate-500 font-medium italic">Please read these guidelines carefully before purchasing.</p>
              </div>
              <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-600" />
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Required Reading</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Group 1: Eligibility */}
              <div className="bg-zinc-50/50 rounded-3xl p-6 border border-zinc-100 hover:border-[#E42320]/20 transition-colors relative">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                  <span className="text-[#E42320] text-base">01.</span>
                  Device Eligibility
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                  Turbonet and Broadband Sim Cards are <span className="text-[#E42320]">not eligible</span> for this offer.
                </p>
              </div>

              {/* Group 2: Ordering Rules */}
              <div className="bg-zinc-50/50 rounded-3xl p-6 border border-zinc-100 hover:border-[#E42320]/20 transition-colors relative">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                  <span className="text-[#E42320] text-base">02.</span>
                  Timing & Volume
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Do not place multiple orders for the same number at the <span className="font-bold text-slate-900">same time interval</span>. Duplicate orders will be rejected with no refund.
                </p>
              </div>

              {/* Group 3: Delivery Info */}
              <div className="bg-zinc-50/50 rounded-3xl p-6 border border-zinc-100 hover:border-[#E42320]/20 transition-colors relative">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                  <span className="text-[#E42320] text-base">03.</span>
                  Delivery Time
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Bundle delivery is <span className="font-bold text-slate-900">not always instant</span>. Some numbers may take longer to process than others.
                </p>
              </div>

              {/* Group 4: Verification (Spans 3 columns on large) */}
              <div className="lg:col-span-3 bg-[#E42320]/5 rounded-3xl p-6 border border-[#E42320]/10 border-dashed relative">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E42320] flex items-center justify-center text-white shrink-0 font-black text-lg">
                    04
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#E42320] uppercase tracking-widest mb-1.5">Zero Refund Policy</h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      No refunds will be issued for <span className="font-bold">wrong transactions or incorrect phone numbers</span>. Please verify your phone number carefully before finalizing your purchase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer actions */}
       <ContactHeader />  
      </div>

      {/* Pre-purchase disclaimer modal */}
      <BuyingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => router.push(pendingUrl)}
      />
    </>
  );
}
