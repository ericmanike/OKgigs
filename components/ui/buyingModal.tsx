"use client"
import { useRouter } from "next/navigation"
import { AlertTriangle, Clock, CheckCircle, Shield, X } from "lucide-react"
import { useState, useEffect } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const STORAGE_KEY = "okgigs_skip_buying_notice"

export default function BuyingModal({ isOpen, onClose, onConfirm }: Props) {
  const router = useRouter()
  const [dontShowAgain, setDontShowAgain] = useState(false)

  // Effect to handle automatic confirmation if "Don't show again" was previously checked
  useEffect(() => {
    if (isOpen) {
      const skip = localStorage.getItem(STORAGE_KEY) === "true"
      if (skip) {
        onConfirm()
        onClose()
      }
    }
  }, [isOpen, onConfirm, onClose])

  if (!isOpen) return null

  // Check if we should skip rendering if already confirmed (prevents flicker)
  if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === "true") {
    return null
  }

  const handleConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, "true")
    }
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-modal-in">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 pt-6 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X size={14} className="text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-black text-base tracking-tight">Important Notice</h2>
              <p className="text-slate-400 text-xs mt-0.5">Please read before proceeding</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3 max-h-[60vh] overflow-y-auto font-medium">
          {/* Notice items */}
          <NoticeItem
            icon={<AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />}
            text={
              <>  
               Kindly double-check your number before proceeding.<strong>wrong phone number</strong>
               cannot be refunded.
               
              </>
            }
            accent="red"
          />

          <NoticeItem
            icon={<Clock size={15} className="text-amber-500 shrink-0 mt-0.5" />}
            text={
              <>
                A typical transaction takes <strong>15–30 minutes</strong>. Network downtimes may occasionally cause delays.
              </>
            }
            accent="amber"
          />

        

          <NoticeItem
            icon={<CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />}
            text={
              <>
                after momo approval wait for  the transaction to be confirmed <strong>to ensure your order is created</strong>. 
              </>
            }
            accent="green"
          />
        </div>

        {/* Checkbox */}
        <div className="px-6 pb-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="peer appearance-none w-5 h-5 rounded-md border-2 border-slate-300 checked:bg-slate-900 checked:border-slate-900 transition-all cursor-pointer"
              />
              <CheckCircle size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
              Don't show this notice again
            </span>
          </label>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mx-6" />

        {/* Actions */}
        <div className="flex gap-4 px-6 py-2">
          <button
            onClick={() => {
                onClose();
                router.push('/');
            }}
            className="flex-1 md:px-3 px-2 text-sm py-3 text-sm rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
          Exit
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 text-sm rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
          >
            Agree & Continue
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
function NoticeItem({
  icon,
  text,
  accent,
}: {
  icon: React.ReactNode
  text: React.ReactNode
  accent: "red" | "amber" | "blue" | "green"
}) {
  const bg: Record<typeof accent, string> = {
    red: "bg-red-50 border-red-100",
    amber: "bg-amber-50 border-amber-100",
    blue: "bg-blue-50 border-blue-100",
    green: "bg-green-50 border-green-100",
  }

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${bg[accent]}`}>
      {icon}
      <p className="text-xs text-slate-700 leading-relaxed font-semibold">{text}</p>
    </div>
  )
}