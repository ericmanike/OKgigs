import { Metadata } from "next";
import { Suspense } from "react";
import BuyContent from "./BuyContent";

export const metadata: Metadata = {
    title: "Buy Data Bundles - OKGigs",
    description: "Purchase affordable MTN, Telecel, and AirtelTigo data bundles. Instant delivery to your phone.",
};



export default function BuyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading...</div>}>
            <BuyContent />
        </Suspense>
    );
}
