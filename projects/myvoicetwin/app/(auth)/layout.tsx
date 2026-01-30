import Link from 'next/link'
import { Dna } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 flex flex-col">
      {/* Header with logo */}
      <header className="w-full py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
          >
            <Dna className="h-8 w-8 text-accent-400" />
            <span className="text-xl font-bold tracking-tight">
              My Voice Twin
            </span>
          </Link>
        </div>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card container */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-brand-950/50 p-8 sm:p-10">
            {children}
          </div>

          {/* Footer text */}
          <p className="mt-8 text-center text-sm text-brand-200">
            By continuing, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-brand-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
