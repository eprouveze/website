import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Emmanuel Prouvèze',
    template: '%s | Emmanuel Prouvèze',
  },
  description: 'Enterprise sales leader. 20+ years in Japanese tech market. I build AI tools as a hobby.',
  metadataBase: new URL('https://emmanuel.prouveze.fr'),
  openGraph: {
    title: 'Emmanuel Prouvèze',
    description: 'Enterprise sales leader. 20+ years in Japanese tech market. I build AI tools as a hobby.',
    url: 'https://emmanuel.prouveze.fr',
    siteName: 'Emmanuel Prouvèze',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emmanuel Prouvèze',
    description: 'Enterprise sales leader. 20+ years in Japanese tech market. I build AI tools as a hobby.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
