import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | MegaGigs',
    description: 'Read the Terms of Service for MegaGigs — the rules and guidelines governing your use of our data bundle platform.',
};

const sections = [
    {
        title: '1. Acceptance of Terms',
        body: 'By accessing or using MegaGigs ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time, and continued use of the Service after changes constitutes your acceptance of the new terms.',
    },
    {
        title: '2. Description of Service',
        body: 'MegaGigs provides a platform for purchasing mobile data bundles for MTN, Telecel, and AirtelTigo networks in Ghana. Bundles are delivered digitally after successful payment. We do not guarantee specific delivery times but aim to process all orders instantly.',
    },
    {
        title: '3. User Accounts',
        body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when registering. We reserve the right to suspend or terminate accounts that violate these terms.',
    },
    {
        title: '4. Payments & Refunds',
        body: 'All payments are processed securely through our payment partners. Prices are displayed in Ghana Cedis (GHS) and are subject to change without prior notice. Once a bundle order is placed and payment is confirmed, refunds are only issued if the bundle was not delivered within 24 hours. Contact our support team for refund requests.',
    },
    {
        title: '5. Acceptable Use',
        body: 'You agree not to use MegaGigs for any unlawful purpose or in any way that could damage, disable, or impair the Service. You must not attempt to gain unauthorised access to any part of the platform, other user accounts, or any systems connected to MegaGigs.',
    },
    {
        title: '6. Limitation of Liability',
        body: 'MegaGigs shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability in any matter arising from these terms shall not exceed the amount you paid for the specific transaction giving rise to the claim.',
    },
    {
        title: '7. Privacy',
        body: 'Your use of MegaGigs is also governed by our Privacy Policy. By using our Service, you consent to the collection and use of your information as described therein. We do not sell your personal data to third parties.',
    },
    {
        title: '8. Changes to Service',
        body: 'We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or without notice. MegaGigs will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.',
    },
    {
        title: '9. Contact Us',
        body: 'If you have any questions about these Terms of Service, please reach out to us via our Contact page or email us directly. We are happy to clarify any concerns you may have.',
    },
];

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-zinc-50 py-14 px-4 mt-16">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3">
                        Terms of Service
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Last updated: <span className="font-medium text-zinc-700">March 5, 2025</span>
                    </p>
                    <p className="mt-4 text-zinc-600 text-base leading-relaxed">
                        Please read these terms carefully before using MegaGigs. They outline your rights,
                        responsibilities, and the rules governing use of our platform.
                    </p>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-200 mb-10" />

                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section) => (
                        <section key={section.title}>
                            <h2 className="text-lg font-semibold text-zinc-900 mb-2">
                                {section.title}
                            </h2>
                            <p className="text-zinc-600 leading-relaxed text-sm sm:text-base">
                                {section.body}
                            </p>
                        </section>
                    ))}
                </div>

                {/* Footer note */}
                <div className="mt-12 border-t border-zinc-200 pt-8 text-center">
                    <p className="text-zinc-500 text-sm">
                        By using MegaGigs, you acknowledge that you have read, understood, and agree to
                        be bound by these Terms of Service.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block mt-4 text-sm font-semibold text-white bg-[#191097] hover:bg-[#0b3eb4] transition-colors px-6 py-2.5 rounded-lg"
                    >
                        Contact Support
                    </a>
                </div>

            </div>
        </div>
    );
}
