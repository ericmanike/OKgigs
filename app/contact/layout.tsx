import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - MegaGigs',
  description: 'Get in touch with MegaGigs support for any inquiries about our data bundle services in Ghana.',
  keywords: 'contact, support, help, customer service, MegaGigs data',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


