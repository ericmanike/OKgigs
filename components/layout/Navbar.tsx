"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User, HouseWifi, Menu, ChevronDown } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';
import MobileNavSidebar from './MobileNavSidebar';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (sidebarOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
        }

        if (profileDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileDropdownOpen]);

    const isAuthPage = pathname?.startsWith('/auth');
    if (isAuthPage) return null;

    // Get user initials
    const getUserInitials = (name: string | undefined | null): string => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    return (
        <>
            <MobileNavSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <nav className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-zinc-100 flex items-center justify-between px-4 md:px-6 py-4 shadow-sm">
                <div className="flex items-center gap-2 md:gap-3">
                    <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#E42320]/10 group-hover:bg-[#E42320]/20 transition-colors border border-[#E42320]/10">
                            <HouseWifi className="text-[#E42320]" size={22} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="font-logo text-lg sm:text-xl font-bold text-[#E42320] tracking-tight">
                                OK GIGS
                            </span>
                            <span className="text-[9px] md:text-[9px] text-[#E42320]/80">
                                Data & Digital Services
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard"
                        className={clsx(
                            "hidden md:block text-sm md:text-[16px] font-medium transition-colors",
                            pathname === '/dashboard' ? "text-[#E42320] font-bold underline underline-offset-4" : "text-zinc-600 hover:text-[#E42320]"
                        )}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/buy"
                        className={clsx(
                            "hidden md:block text-sm md:text-[16px] font-medium transition-colors",
                            pathname === '/buy' ? "text-[#E42320] font-bold underline underline-offset-4" : "text-zinc-600 hover:text-[#E42320]"
                        )}
                    >
                        Buy Data
                    </Link>

                    {session ? (
                        <div className="hidden md:flex items-center gap-2 pl-8 ml-2 border-l border-zinc-200 relative" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-[#E42320] font-semibold text-xs shadow-sm">
                                    {getUserInitials(session.user?.name)}
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={clsx(
                                        "transition-transform text-zinc-600",
                                        profileDropdownOpen && "rotate-180"
                                    )}
                                />
                            </button>

                            {profileDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-zinc-200 overflow-hidden z-50">
                                    <Link
                                        href="/profile"
                                        onClick={() => setProfileDropdownOpen(false)}
                                        className={clsx(
                                            "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                                            pathname === '/profile'
                                                ? "bg-[#E42320] text-white"
                                                : "text-zinc-700 hover:bg-zinc-100"
                                        )}
                                    >
                                        <User size={16} />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setProfileDropdownOpen(false);
                                            signOut();
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="hidden md:block px-4 py-2 bg-[#E42320] text-white hover:bg-[#E42320]/90 text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                            Login
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-2 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>
        </>
    );
}
