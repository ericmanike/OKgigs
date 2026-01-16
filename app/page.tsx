'use client'
import Link from "next/link";
import { ArrowRight, Wifi, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import {FaBlenderPhone, FaPhone, FaWhatsapp} from 'react-icons/fa'


export default function Home() {
  return (
    <div className="flex z-0 flex-col min-h-[80vh] bg-zinc-50  pt-20">
      {/* Hero Section */}
      <main className="flex-1  flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto mt-10">

       <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        
       
       className=" text-2xl md:text-4xl font-bold mb-4 text-slate-900">
          Buy and sell Data Bundles for all networks with risk whiz data bundles
        </motion.div> 


        <div className="mb-2 p-4 bg-blue-100 text-blue-600 rounded-2xl animate-bounce">
          <Wifi size={40} />
        </div>

       

   

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full text-left">
          <div className="p-6  rounded-2xl border  shadow-lg shadow-blue-600/10">
            <Zap className="text-yellow-400 mb-3" size={24} />
            <h3 className="font-bold mb-1 ">Instant Delivery</h3>
            <p className="text-sm ">Get your data bundle within seconds of payment.</p>
          </div>
          <div className="p-6  rounded-2xl border  shadow-lg shadow-blue-600/10">
            <Shield className="text-green-400 mb-3" size={24} />
            <h3 className="font-bold mb-1">Affordable Prices</h3>
            <p className="text-sm ">Get the best value for your money </p>
          </div>
          <div className="p-6  rounded-2xl border  shadow-lg shadow-blue-600/10">
            <Wifi className="text-blue-700 mb-3" size={24} />
            <h3 className="font-bold mb-1">All Networks</h3>
            <p className="text-sm ">Support for MTN, Telecel, and AirtelTigo.</p>
          </div>

       

        
        </div>
         <div className="rounded-lg p-5 mt-10 bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer w-full">
                    <Link href="/buy">
            <div className="flex  justify-between p-4">
              <div>
                <h4 className="font-bold text-left ">Place Your Order Now</h4>
                <p className="text-sm">A simple 3-step process to get your data bundle.</p>
              </div>
       
                <ArrowRight size={24} className="text-white" />

            </div>
            </Link>
       

          </div>


       
      </main>
        <div className="px-5 w-full py-10 bg-black/5 grid grid-cols-1 gap-4 md:flex md:justify-around md:gap-5 mt-10 text-sm text-slate-500 text-center">

  <a
    href="https://wa.me/233543442518"
    className="flex px-5 underline-none items-center justify-center bg-slate-900 text-white  rounded-lg p-3 hover:text-blue-700"
    target="_blank"
    rel="noopener noreferrer"
  >
    Join us on WhatsApp <FaWhatsapp className="inline-block ml-2" />
  </a>

  <a
    href="/contact"
    className=" px-5 flex underline-none items-center bg-slate-900 text-white  rounded-lg p-3 justify-center  hover:text-blue-700"
  >
    Contact Support <FaPhone className="inline-block ml-2 rotate-270" />
  </a>

  <a
    href="/terms"
    className="px-5 flex underline-none bg-slate-900 text-white  p-3 rounded-lg items-center justify-center hover:text-blue-700 "
  >
    Terms of Service
  </a>

</div>

    </div>
  );
}
