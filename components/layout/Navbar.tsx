"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User, ArrowUpRight, Menu } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import MobileNavSidebar from './MobileNavSidebar';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (sidebarOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    const isAuthPage = pathname?.startsWith('/auth');
    if (isAuthPage) return null;

    return (
        <>
            <MobileNavSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <nav className="fixed top-0 left-0 right-0 z-10 bg-[#0e0947] text-white flex items-center justify-between px-6 py-4  shadow-lg shadow-black/10">
                <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/15 transition-colors border border-white/10">
                    <ArrowUpRight className="text-white" size={22} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="font-logo text-lg sm:text-xl font-bold text-white tracking-tight">
                        Eric&apos;s Gigs
                    </span>
                    <span className="text-[10px] sm:text-xs font-medium text-white/70 tracking-widest uppercase">
                        Data & more
                    </span>
                </div>
            </Link>
                </div>

            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard"
                    className={clsx(
                        "hidden md:block text-sm md:text-[16px] font-medium text-white hover:text-blue-700 transition-colors",
                        pathname === '/dashboard' ? "text-gray-600 font-bold" : "text-slate-950"
                    )}
                >
                    Dashboard
                </Link>
                <Link
                    href="/buy"
                    className={clsx(
                        "hidden md:block text-sm md:text-[16px] font-medium text-white hover:text-blue-700 transition-colors",
                        pathname === '/buy' ? "text-blue-600 font-bold" : "text-slate-950"
                    )}
                >
                    Buy Data
                </Link>
                
                {/* <Link
                    href="/agents"
                    className={clsx(
                        " text-sm md:text-[16px] font-medium hover:text-blue-700 transition-colors",
                        pathname === '/agents' ? "text-blue-600 font-bold" : "text-slate-950"
                    )}
                >
                    Become an Agent
                </Link> */}

                {session ? (
                    <div className="hidden md:flex items-center gap-4 pl-6 border-l border-blue-500">
                        <Link href="/profile" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            
                            <div className="w-8 h-8 rounded-full  flex items-center justify-center text-white bg-blue-600">
                                <User size={16} />
                            </div>
                           
                            <span className="text-sm font-medium">{session.user?.name}</span>
                        </div>
                         </Link>
                        <button
                            onClick={() => signOut()}
                            className="p-2 hover:bg-white/10 rounded-full text-slate-600 transition-colors"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/auth/login"
                        className="hidden md:block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Login
                    </Link>
                )}
                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>
            </div>
        </nav>
        </>
    );
}
