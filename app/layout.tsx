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
  title: "RiskWhiz - Buy Data Bundles Instantly",
  description: "Buy Data Bundles Instantly, No delays , No hidden charges, Best prices",
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
        </AuthProvider>
      </body>
    </html>
  );
}
