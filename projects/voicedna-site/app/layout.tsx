import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'VoiceDNA — Create an AI That Writes Like You',
  description:
    'Transform your unique writing style into an AI-powered digital twin. VoiceDNA captures your voice, tone, and personality to create content that sounds authentically you. Stop spending hours writing — let your AI twin handle it while you focus on what matters.',
  keywords: [
    'AI writing assistant',
    'digital twin',
    'voice cloning',
    'content creation',
    'writing style AI',
    'personal AI writer',
    'brand voice AI',
  ],
  authors: [{ name: 'VoiceDNA' }],
  creator: 'VoiceDNA',
  publisher: 'VoiceDNA',
  metadataBase: new URL('https://voicedna.ai'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://voicedna.ai',
    siteName: 'VoiceDNA',
    title: 'VoiceDNA — Create an AI That Writes Like You',
    description:
      'Transform your unique writing style into an AI-powered digital twin. Create content that sounds authentically you.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VoiceDNA - Your AI Writing Twin',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoiceDNA — Create an AI That Writes Like You',
    description:
      'Transform your unique writing style into an AI-powered digital twin.',
    images: ['/og-image.png'],
    creator: '@voicedna',
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
      </body>
    </html>
  )
}
