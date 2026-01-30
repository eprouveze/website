'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { signInWithMagicLink } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await signInWithMagicLink(email)

    setIsLoading(false)

    if (result.success) {
      setIsSuccess(true)
    } else {
      setError(result.error || 'Something went wrong. Please try again.')
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Check your email
        </h1>
        <p className="text-gray-600 mb-6">
          We sent a magic link to{' '}
          <span className="font-medium text-gray-900">{email}</span>
        </p>
        <p className="text-sm text-gray-500">
          Click the link in your email to sign in. The link will expire in 1
          hour.
        </p>
        <button
          onClick={() => {
            setIsSuccess(false)
            setEmail('')
          }}
          className="mt-6 text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-600">
          Sign in to your My Voice Twin account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                       text-gray-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                       transition-shadow"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full flex items-center justify-center gap-2 px-4 py-3
                   bg-gradient-to-r from-brand-600 to-accent-600
                   hover:from-brand-700 hover:to-accent-700
                   text-white font-semibold rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Sending magic link...</span>
            </>
          ) : (
            <>
              <span>Send Magic Link</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  )
}
