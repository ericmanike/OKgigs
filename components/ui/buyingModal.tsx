"use client"
import { useRouter } from "next/navigation"
type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function BuyingModal({ isOpen, onClose }: Props) {

  const router = useRouter()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative bg-white w-full max-w-md mx-4 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-center bg-red-600 text-white p-2"> <strong>Important Notice !</strong>   </h3>
        <ol className="list-decimal list-outside pl-5 font-semibold  space-y-3 text-sm text-gray-900">
          <li>We are not responsible for any loss  as a result of entering a <strong>wrong phone number</strong>. kindly double check your phone number before proceeding.</li>
           <li>We ensure you get the best service possible</li>
          <li>A typical transaction can take up to 15- 30 minutes to complete. However, downtimes may sometimes delay transactions.</li>
          <li> One thing is assure that we will not<strong> charge you for any transaction that is not successful</strong>.  All bundle purchases will be delivered</li>
        </ol>

        <div className="flex  justify-between mt-6">
          <button onClick={() => router.push('/dashboard')}
            className="px-6 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
            Disagree and exit
          </button>
          <button
            className="px-6 py-2 text-sm rounded-md bg-slate-800 text-white hover:bg-slate-900 transition-colors"
            onClick={onClose}
          >
            Agree and continue
          </button>
        </div>
      </div>
    </div>
  )
}