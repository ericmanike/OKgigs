'use client'
import { useState } from 'react';
import { Crown, Zap, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';

import { formatCurrency } from '@/lib/utils'


function BecomeAgent() {
    const router = useRouter();
    const { data: session, update } = useSession()

    

  
    const [loading, setLoading] = useState(false);
    
    const handleCreateShop = async() => {
        setLoading(true);
        try {
          const res= await fetch('/api/registerAgent', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: session?.user?.email!,
                                    
                                }),
                            });
          if(res.ok){
            const data = await res.json();
            router.push('/dashboard/store');

            
           
          }else{
            const data = await res.json();
          }
          window.location.reload();
        } catch (error) {
            console.error("Failed to create shop:", error);
        } finally {
            setLoading(false);
        }
    };
    

    
    const isAgent = session?.user?.role === 'agent'

    return (
        <button
            onClick={handleCreateShop}
            disabled={isAgent || loading}
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
                    Agent  Shop
                </>
            ) : (
                <>
                    {loading ? (
                        <>
                            <Loader2 size={14} className="animate-spin text-amber-800" />
                            <span>Creating shop...</span>
                        </>
                    ) : (
                        <>
                            <Zap size={14} className="fill-current animate-pulse text-amber-800" />
                            <span>Create shop • {formatCurrency(0.00)}</span>
                        </>
                    )}
                </>
            )}
        </button>
    )
}

export default BecomeAgent