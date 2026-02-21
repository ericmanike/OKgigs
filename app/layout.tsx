import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "OKGigs - Buy Data Bundles Instantly",
  description: "Affordable data bundles for all networks in Ghana (MTN, Telecel, AirtelTigo). Simple checkout, instant delivery with no hidden charges.",
  keywords: ["data bundles", "Ghana data", "MTN data", "Telecel data", "AirtelTigo data", "buy data online", "instant data delivery", "OKGigs"],
  authors: [{ name: "OKGigs Team" }],
  creator: "OKGigs",
  publisher: "OKGigs",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://okgigs.online",
    title: "OKGigs - Buy Data Bundles Instantly",
    description: "Affordable data bundles for all networks in Ghana. Instant delivery.",
    siteName: "OKGigs",
  },
  twitter: {
    card: "summary_large_image",
    title: "OKGigs - Buy Data Bundles Instantly",
    description: "Affordable data bundles for all networks in Ghana. Instant delivery.",
    creator: "@okgigs",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased bg-zinc-50 text-zinc-900`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen z-0">
            {children}
          </main>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "OKGigs",
                "url": "https://okgigs.online",
                "logo": "https://okgigs.online/logo.png",
                "sameAs": [
                  "https://twitter.com/okgigs",
                  "https://whatsapp.com/channel/..."
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+233-551-043-686",
                  "contactType": "customer service",
                  "areaServed": "GH",
                  "availableLanguage": "en"
                }
              })
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "OKGigs",
                "url": "https://okgigs.online",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://okgigs.online/buy?search={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              })
            }}
          />
        
        </AuthProvider>
      </body>
    </html>
  );
}
