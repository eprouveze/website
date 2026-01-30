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
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-yellow-600"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Missing Session Information
          </h1>
          <p className="text-gray-600 mb-6">
            We could not find your purchase session. If you just completed a
            purchase, please check your email for confirmation.
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
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
      purchase = data
    }
  } catch (e) {
    console.error('Error fetching purchase:', e)
    error = 'server_error'
  }

  // Handle purchase not found
  if (error === 'not_found' || !purchase) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Purchase Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            We could not locate your purchase. This can happen if:
          </p>
          <ul className="text-left text-gray-600 mb-6 space-y-2">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">-</span>
              The payment is still being processed (please wait a few minutes)
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">-</span>
              The session has expired or is invalid
            </li>
          </ul>
          <p className="text-gray-600 mb-6">
            If you completed a purchase and are seeing this message, please
            contact us at{' '}
            <a
              href="mailto:support@myvoicetwin.io"
              className="text-blue-600 hover:underline"
            >
              support@myvoicetwin.io
            </a>{' '}
            with your receipt.
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
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
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something Went Wrong
          </h1>
          <p className="text-gray-600 mb-6">
            We encountered an error while retrieving your purchase. Please try
            refreshing the page or contact us at{' '}
            <a
              href="mailto:support@myvoicetwin.io"
              className="text-blue-600 hover:underline"
            >
              support@myvoicetwin.io
            </a>
            .
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  // Calculate remaining downloads and expiry
  const remainingDownloads = purchase.max_downloads - purchase.download_count
  const expiresAt = new Date(purchase.expires_at)
  const isExpired = expiresAt < new Date()
  const daysUntilExpiry = Math.ceil(
    (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  // Success state
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-10 text-center">
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
            Payment Confirmed!
          </h1>
          <p className="text-emerald-100 text-lg">
            Thank you for your purchase
          </p>
        </div>

        {/* Purchase Details */}
        <div className="px-8 py-8">
          {/* Product Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Product</span>
              <span className="font-semibold text-gray-900">
                My Voice Twin {productNames[purchase.product] || purchase.product}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-900">{purchase.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Downloads Remaining</span>
              <span
                className={`font-semibold ${
                  remainingDownloads > 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {remainingDownloads} of {purchase.max_downloads}
              </span>
            </div>
          </div>

          {/* Download Section */}
          {isExpired ? (
            <div className="text-center mb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <svg
                  className="w-12 h-12 text-red-500 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="font-semibold text-red-800 mb-2">
                  Download Link Expired
                </h3>
                <p className="text-red-600 text-sm">
                  Your download link has expired. Please contact{' '}
                  <a
                    href="mailto:support@myvoicetwin.io"
                    className="underline hover:no-underline"
                  >
                    support@myvoicetwin.io
                  </a>{' '}
                  for assistance.
                </p>
              </div>
            </div>
          ) : remainingDownloads <= 0 ? (
            <div className="text-center mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <svg
                  className="w-12 h-12 text-yellow-500 mx-auto mb-3"
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
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Download Limit Reached
                </h3>
                <p className="text-yellow-600 text-sm">
                  You have used all available downloads. If you need additional
                  downloads, please contact{' '}
                  <a
                    href="mailto:support@myvoicetwin.io"
                    className="underline hover:no-underline"
                  >
                    support@myvoicetwin.io
                  </a>
                  .
                </p>
              </div>
            </div>
          ) : (
            <>
              <a
                href={`/api/download?token=${purchase.download_token}`}
                className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center px-6 py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl mb-4"
              >
                <span className="flex items-center justify-center">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Your Files
                </span>
              </a>
              <p className="text-center text-sm text-gray-500">
                Link expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
              </p>
            </>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Next Steps */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Next Steps</h3>
            <ol className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  1
                </span>
                <span>
                  Download and unzip your My Voice Twin package
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  2
                </span>
                <span>
                  Open <strong>00-START-HERE.pdf</strong> for your personalized
                  guide
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  3
                </span>
                <span>
                  Follow the step-by-step instructions to create your Digital
                  Twin
                </span>
              </li>
            </ol>
          </div>

          {/* Support Info */}
          <div className="mt-8 bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-blue-800 text-sm">
              Need help? Contact us at{' '}
              <a
                href="mailto:support@myvoicetwin.io"
                className="font-medium underline hover:no-underline"
              >
                support@myvoicetwin.io
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
