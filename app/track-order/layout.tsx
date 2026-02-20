import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Track Order - OKGigs",
    description: "Check the status of your data bundle purchase instantly using your transaction ID.",
};

export default function TrackOrderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
