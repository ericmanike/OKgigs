import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact- NyameKye Loans',
  description: 'Contact page for NyameKye Loans, providing support and customer service.',
  keywords: 'contact, support, help, customer service',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


