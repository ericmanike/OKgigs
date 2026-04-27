"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ContactDeveloper() {
    const pathname = usePathname();

    if (pathname?.startsWith("/dashboard")) {
        return null;
    }

    return (
        <div className="w-full bg-slate-800 flex justify-center py-5">
            <Link 
                href="https://ericmanike.tech" 
                target="_blank" 
                className="text-center text-white text-sm text-3xl hover:text-slate-300 flex justify-center items-center gap-2 hover:text-[16px] transition-all duration-200 w-fit"
            >
                Contact <span className="font-bold">Developer</span> <Send size={14}/>
            </Link>
        </div>
    );
}
