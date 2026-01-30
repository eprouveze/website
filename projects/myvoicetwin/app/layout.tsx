import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'My Voice Twin — Create an AI That Writes & Speaks Like You',
  description:
    'Transform your unique writing and speaking style into an AI-powered digital twin. My Voice Twin captures your voice, tone, and personality across languages and contexts. Stop spending hours rewriting AI drafts — let your twin handle it.',
  keywords: [
    'AI writing assistant',
    'digital twin',
    'voice cloning',
    'content creation',
    'writing style AI',
    'personal AI writer',
    'brand voice AI',
    'multilingual AI',
    'speech to text voice',
  ],
  authors: [{ name: 'My Voice Twin' }],
  creator: 'My Voice Twin',
  publisher: 'My Voice Twin',
  metadataBase: new URL('https://myvoicetwin.io'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://myvoicetwin.io',
    siteName: 'My Voice Twin',
    title: 'My Voice Twin — Create an AI That Writes & Speaks Like You',
    description:
      'Transform your unique writing and speaking style into an AI-powered digital twin. Create content that sounds authentically you.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'My Voice Twin - Your AI Writing & Speaking Twin',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Voice Twin — Create an AI That Writes & Speaks Like You',
    description:
      'Transform your unique writing and speaking style into an AI-powered digital twin.',
    images: ['/og-image.png'],
    creator: '@myvoicetwin',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1e1b4b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans text-slate-900">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
