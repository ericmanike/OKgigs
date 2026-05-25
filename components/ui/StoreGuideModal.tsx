"use client"
import { AlertCircle, CheckCircle, Share2, DollarSign, Store, X, Info } from "lucide-react"
import { useState, useEffect } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const STORAGE_KEY = "megagigs_store_guide_seen"

export default function StoreGuideModal({ isOpen, onClose }: Props) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setDontShowAgain(localStorage.getItem(STORAGE_KEY) === "true")
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, "true")
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-modal-in">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 pt-6 pb-5 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X size={14} className="text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
              <Store size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-black text-lg tracking-tight">How to  Use Your Data Shop</h2>
              <p className="text-slate-300 text-xs mt-0.5">Quick guide to setting up your shop</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto font-medium">
          
          <GuideStep
            number={1}
            icon={<Store size={18} className="text-red-600" />}
            title="Name Your Store"
            description="Enter a unique name for your store. A custom URL will be automatically generated for you to share with your customers."
            color="red"
          />

          <GuideStep
            number={2}
            icon={<DollarSign size={18} className="text-green-600" />}
            title="Set Your Prices (Profit)"
            description="Decide how much profit you want to make on top of the base bundle price. The final price is what your customers will pay."
            color="green"
          />

          <GuideStep
            number={3}
            icon={<CheckCircle size={18} className="text-purple-600" />}
            title="Save Your Settings"
            description="Don't forget to click the 'Save Store Settings' button at the bottom so your store goes live with your custom prices."
            color="purple"
          />

          <GuideStep
            number={4}
            icon={<Share2 size={18} className="text-amber-600" />}
            title="Share & Earn"
            description="Copy your store URL or share it directly via WhatsApp. Whenever someone buys from your link, you instantly earn the profit you set!"
            color="amber"
          />

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex items-start gap-3 mt-4">
            <Info size={16} className="text-zinc-500 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-600 leading-relaxed">
              <strong>Withdrawals:</strong> Once your total profit reaches GHS 50.00, you can withdraw your earnings directly to your momo wallet.
            </p>
          </div>

        </div>
        
        {/* Divider */}
        <div className="h-px bg-slate-100 mx-6" />

        {/* Actions */}
        <div className="flex flex-col gap-3 px-6 py-4">
          <label className="flex items-center gap-2 cursor-pointer group w-fit">
            <input 
              type="checkbox" 
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
            />
            <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">Don't show this automatically next time</span>
          </label>
          <button
            onClick={handleClose}
            className="w-full py-2.5 text-sm rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]"
          >
            Got it, let's go!
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in {
          animation: modal-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  )
}

// ── Helper sub-component ──────────────────────────────────────────────────────
function GuideStep({
  number,
  icon,
  title,
  description,
  color,
}: {
  number: number
  icon: React.ReactNode
  title: string
  description: string
  color: "red" | "green" | "purple" | "amber"
}) {
  const bg: Record<typeof color, string> = {
    red: "bg-red-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    amber: "bg-amber-50",
  }
  
  const textTitle: Record<typeof color, string> = {
    red: "text-red-900",
    green: "text-green-900",
    purple: "text-purple-900",
    amber: "text-amber-900",
  }

  return (
    <div className="flex items-start gap-4">
      <div className={`w-8 h-8 rounded-full ${bg[color]} flex items-center justify-center shrink-0 shadow-sm border border-white`}>
        {icon}
      </div>
      <div>
        <h3 className={`text-sm font-bold ${textTitle[color]} mb-1 flex items-center gap-2`}>
          <span className="opacity-50 text-xs">Step {number}:</span> {title}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
