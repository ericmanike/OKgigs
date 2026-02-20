import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AFA Registration - OKGigs",
    description: "Register for the AFA Package on OKGigs. Affordable data bundles for agents and individuals.",
};

export default function AFARegistrationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
