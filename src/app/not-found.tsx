import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
}

export default function NotFound() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="text-center">
          <p className="text-6xl font-bold text-slate-300 mb-4">404</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Page not found
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go home
            </Link>
            <Link
              href="/writing"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Browse articles
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
