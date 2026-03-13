"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function WhatsAppWidget() {
    const pathname = usePathname();

    // Hide on mobile (using CSS) and hide on specific routes
    const hiddenRoutes = ["/dashboard", "/admin", "/moderator"];
    const isHiddenRoute = hiddenRoutes.some(route => pathname?.startsWith(route));

    if (isHiddenRoute) return null;

    return (
        <div className="hidden md:block">
            <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
            <div 
                className="elfsight-app-560e9bc9-3a5e-4820-8629-56cde29d1bb0" 
                data-elfsight-app-lazy 
            />
        </div>
    );
}
