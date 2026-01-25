import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
    default: 'Emmanuel Prouvèze | Global Account Manager & AI Builder',
    template: '%s | Emmanuel Prouvèze',
  },
  description: 'Global Account Manager at Salesforce Japan with 20+ years in Japanese tech. Co-founder with successful exit. I build AI-powered tools as a hobby.',
  metadataBase: new URL('https://emmanuel.prouveze.fr'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-for-light-mode.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-for-dark-mode.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Emmanuel Prouvèze | Global Account Manager & AI Builder',
    description: 'Global Account Manager at Salesforce Japan with 20+ years in Japanese tech. Co-founder with successful exit. I build AI-powered tools as a hobby.',
    url: 'https://emmanuel.prouveze.fr',
    siteName: 'Emmanuel Prouvèze',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emmanuel Prouvèze | Global Account Manager & AI Builder',
    description: 'Global Account Manager at Salesforce Japan with 20+ years in Japanese tech. Co-founder with successful exit. I build AI-powered tools as a hobby.',
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
        <Analytics />
      </body>
    </html>
  )
}
