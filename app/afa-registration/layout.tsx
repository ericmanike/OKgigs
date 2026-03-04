import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AFA Registration - MegaGigs",
    description: "Register for the AFA Package on MegaGigs. Affordable data bundles for agents and individuals.",
};

export default function AFARegistrationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
