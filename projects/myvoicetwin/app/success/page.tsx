import { createServiceClient, type Purchase } from '@/lib/supabase'
import Link from 'next/link'

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>
}

// Product display names
const productNames: Record<string, string> = {
  starter: 'Starter',
  complete: 'Complete',
  executive: 'Executive',
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const sessionId = params.session_id

  // Handle missing session ID
  if (!sessionId) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Missing Session Information
          </h1>
          <p className="text-slate-600 mb-6">
            We could not find your purchase session. If you just completed a
            purchase, please check your email for confirmation.
          </p>
          <Link
            href="/"
            className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </main>
    )
  }

  // Look up purchase in Supabase
  let purchase: Purchase | null = null
  let error: string | null = null

  try {
    const supabase = createServiceClient()
    const { data, error: dbError } = await supabase
      .from('purchases')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single()

    if (dbError) {
      if (dbError.code === 'PGRST116') {
        // No rows returned
        error = 'not_found'
      } else {
        console.error('Database error:', dbError)
        error = 'database_error'
      }
    } else {
      purchase = data as Purchase
    }
  } catch (e) {
    console.error('Error fetching purchase:', e)
    error = 'server_error'
  }

  // Handle purchase not found
  if (error === 'not_found' || !purchase) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Purchase Not Found
          </h1>
          <p className="text-slate-600 mb-4">
            We could not locate your purchase. This can happen if:
          </p>
          <ul className="text-left text-slate-600 mb-6 space-y-2">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">-</span>
              The payment is still being processed (please wait a few minutes)
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">-</span>
              The session has expired or is invalid
            </li>
          </ul>
          <p className="text-slate-600 mb-6">
            If you completed a purchase and are seeing this message, please
            contact us at{' '}
            <a
              href="mailto:support@myvoicetwin.io"
              className="text-indigo-600 hover:underline"
            >
              support@myvoicetwin.io
            </a>{' '}
            with your receipt.
          </p>
          <Link
            href="/"
            className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </main>
    )
  }

  // Handle database/server errors
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Something Went Wrong
          </h1>
          <p className="text-slate-600 mb-6">
            We encountered an error while retrieving your purchase. Please try
            refreshing the page or contact us at{' '}
            <a
              href="mailto:support@myvoicetwin.io"
              className="text-indigo-600 hover:underline"
            >
              support@myvoicetwin.io
            </a>
            .
          </p>
          <Link
            href={`/success?session_id=${sessionId}`}
            className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </main>
    )
  }

  // Format order date
  const orderDate = purchase.created_at
    ? new Date(purchase.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Today'

  // Success state - Payment confirmed, show next steps for voice profile generation
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-indigo-100 text-lg">
              Thank you for your purchase. You&apos;re ready to create your Voice Twin.
            </p>
          </div>

          {/* Order Details */}
          <div className="px-8 py-8">
            {/* Order Confirmation Box */}
            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Order Confirmation
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Product</span>
                  <span className="font-semibold text-slate-900">
                    My Voice Twin {productNames[purchase.product] || purchase.product}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Email</span>
                  <span className="font-medium text-slate-900">{purchase.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Order Date</span>
                  <span className="font-medium text-slate-900">{orderDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Confirmed
                  </span>
                </div>
              </div>

              {/* Receipt/Invoice Link */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  View Receipt / Invoice
                </a>
                <p className="mt-1 text-xs text-slate-500">
                  A copy has also been sent to your email
                </p>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                What Happens Next
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Generate Your Voice Profile</h3>
                    <p className="text-slate-600 text-sm mt-0.5">
                      Our AI will analyze your writing samples and questionnaire responses to extract your unique voice DNA.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Test Your Voice Twin</h3>
                    <p className="text-slate-600 text-sm mt-0.5">
                      Try out your personalized Voice Twin in our testing interface. See how it captures your unique writing style.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Deploy Anywhere</h3>
                    <p className="text-slate-600 text-sm mt-0.5">
                      Use your Voice Twin with ChatGPT, Claude, Gemini, or any AI platform of your choice.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary CTA */}
            <Link
              href="/dashboard/generate"
              className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center px-6 py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                Generate My Voice Profile
              </span>
            </Link>

            <p className="mt-4 text-center text-sm text-slate-500">
              This usually takes about 30 seconds
            </p>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            Need help? Contact us at{' '}
            <a
              href="mailto:support@myvoicetwin.io"
              className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              support@myvoicetwin.io
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
