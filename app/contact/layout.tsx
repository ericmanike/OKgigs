import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - OKGigs',
  description: 'Get in touch with OKGigs support for any inquiries about our data bundle services in Ghana.',
  keywords: 'contact, support, help, customer service, OKGigs data',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


