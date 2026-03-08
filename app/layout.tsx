import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import PwaProvider from "@/components/providers/PwaProvider";
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

//https://documenter.getpostman.com/view/9357868/2sB3BBqrsR  api docs

export const metadata: Metadata = {
  title: "MegaGigs - Buy Data Bundles Instantly",
  description: "Cheapest data bundles for all stydies and research (MTN, Telecel, AirtelTigo). Simple checkout, instant delivery with no hidden charges.",
  keywords: ["data bundles", "Ghana data", "MTN data", "Telecel data", "AirtelTigo data", "buy data online", "instant data delivery", "MegaGigs"],
  authors: [{ name: "MegaGigs Team" }],
  creator: "MegaGigs",
  publisher: "MegaGigs",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://megagigs.vercel.app",
    title: "MegaGigs - Buy Data Bundles Instantly",
    description: "Cheapest data bundles for all networks in Ghana. Instant delivery.",
    siteName: "MegaGigs",
    images: [
      {
        url: "https://megagigs.vercel.app/og-image.jpg",
        width: 683,
        height: 1024,
        alt: "MegaGigs - Data Bundles for MTN, Telecel & AirtelTigo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MegaGigs - Buy Data Bundles Instantly",
    description: "Cheapest data bundles for your research and studies. Instant delivery.",
    creator: "@megagigs",
    images: ["https://megagigs.vercel.app/og-image.jpg"],
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
          <PwaProvider />
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
                "name": "MegaGigs",
                "url": "https://megagigs.vercel.app",
                "logo": "https://megagigs.vercel.app/logo.png",
                "sameAs": [
                  "https://twitter.com/megagigs",
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
                "name": "MegaGigs",
                "url": "https://megagigs.vercel.app",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://megagigs.vercel.app/buy?search={search_term_string}",
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
