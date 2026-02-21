'use client'
import { Crown, Zap } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'

function BecomeAgent() {
    const { data: session, update } = useSession()

    const loadPaystackScript = () => {
        const script = document.createElement('script')
        script.src = 'https://js.paystack.co/v1/inline.js'
        script.async = true
        document.body.appendChild(script)
    }

    useEffect(() => {
        loadPaystackScript()
    }, [])

    const handleUpgrade = () => {
        if (!session) {
            alert('Please login to continue')
            return;
        }
        try {
            if (!session?.user?.email) {
                alert('Please login to continue')
                return;
            }
            if (session?.user?.role === 'agent') {
                alert('You are already a premium agent')
                return;
            }

            const reference = Date.now().toString()
            const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

            if (!paystackKey) throw new Error('Paystack public key not found');
            if (!window.PaystackPop) return;

            const handler = window.PaystackPop.setup({
                key: paystackKey!,
                email: session?.user?.email!,
                currency: 'GHS',
                amount: Math.round((30 + 30 * 0.02) * 100),
                ref: reference,
                onClose: () => { },
                callback: function (response) {
                    (async () => {
                        try {
                            const verifyResponse = await fetch('/api/registerAgent', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: session?.user?.email!,
                                    reference,
                                }),
                            });

                            if (verifyResponse.ok) {
                                await update({ role: 'agent' })
                                window.location.reload()
                            }
                        } catch (err) {
                            console.error('Error verifying payment', err);
                        }
                    })();
                },
            })
            handler.openIframe()
        } catch (error) {
            console.error(error);
            alert("Something went wrong with the purchase.");
        }
    }

    const isAgent = session?.user?.role === 'agent'

    return (
        <button
            onClick={handleUpgrade}
            disabled={isAgent}
            className={`w-full group relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all overflow-hidden
                ${isAgent
                    ? 'bg-gradient-to-r from-zinc-800 to-zinc-700 text-amber-400 border border-amber-400/30'
                    : 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-600 text-amber-950 border-t border-white/40 active:scale-[0.98]'
                }`}
        >
            {/* Shimmer Effect */}
            {!isAgent && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            )}

            {isAgent ? (
                <>
                    <Crown size={14} className="fill-current" />
                    Premium Agent
                </>
            ) : (
                <>
                    <Zap size={14} className="fill-current animate-pulse text-amber-800" />
                    <span>Upgrade to Premium • {formatCurrency(30)}</span>
                </>
            )}
        </button>
    )
}

export default BecomeAgent