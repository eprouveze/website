'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, User, ArrowRight, CheckCircle, Loader2, Sparkles } from 'lucide-react'
import { signUpWithMagicLink } from '@/lib/auth'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await signUpWithMagicLink(email, fullName || undefined)

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
          Click the link in your email to complete your signup. The link will
          expire in 1 hour.
        </p>
        <button
          onClick={() => {
            setIsSuccess(false)
            setEmail('')
            setFullName('')
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
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          <span>Start your journey</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create your account
        </h1>
        <p className="text-gray-600">
          Build an AI that writes and speaks like you
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name input (optional) */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Full name{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                       text-gray-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                       transition-shadow"
            />
          </div>
        </div>

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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        {/* Benefits */}
        <div className="pt-4 space-y-2">
          <p className="text-xs text-gray-500 text-center">
            Free to start. No credit card required.
          </p>
        </div>
      </form>

      {/* Divider */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
