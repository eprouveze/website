import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy - My Voice Twin',
  description: '14-Day Satisfaction Guarantee - My Voice Twin Refund Policy',
}

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-purple-300 hover:text-purple-200 transition-colors mb-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Refund Policy
          </h1>
          <p className="mt-2 text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Guarantee Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 mb-8 text-center shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            14-Day Satisfaction Guarantee
          </h2>
          <p className="text-green-100 max-w-xl mx-auto">
            We stand behind My Voice Twin. If you&apos;re not satisfied, we&apos;ll give you a full refund.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-8 sm:p-12">
          <div className="prose prose-slate max-w-none">
            {/* Our Promise */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Promise to You
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At My Voice Twin, we&apos;re confident that our voice cloning methodology will help you create an AI that truly sounds like you. This system was built from real daily use by a multilingual executive—not theory.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We want you to feel completely confident in your purchase. That&apos;s why we offer a straightforward 14-day satisfaction guarantee with no hoops to jump through.
              </p>
            </section>

            {/* Guarantee Details */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                14-Day Satisfaction Guarantee
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you follow the My Voice Twin methodology and don&apos;t feel like your Digital Twin captures your authentic voice, you can request a full refund within 14 days of your purchase.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-green-900 mb-3">What This Means:</h3>
                <ul className="space-y-3 text-green-800">
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong>No questions asked</strong> — We trust you to be honest about your experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Full refund</strong> — 100% of your purchase price, no deductions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Fast processing</strong> — Refunds typically processed within 5-7 business days</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Eligible Products */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Eligible Products
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our 14-day satisfaction guarantee applies to all My Voice Twin product tiers:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Starter Package</li>
                <li>Complete Package</li>
                <li>Executive Package</li>
                <li>Done-For-You Service</li>
              </ul>
            </section>

            {/* How to Request */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How to Request a Refund
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Requesting a refund is simple. Just follow these steps:
              </p>
              <ol className="space-y-4 mb-6">
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">Send an email</p>
                    <p className="text-gray-600">
                      Contact us at{' '}
                      <a
                        href="mailto:[COMPANY_EMAIL]"
                        className="text-purple-600 hover:text-purple-800 underline"
                      >
                        [COMPANY_EMAIL]
                      </a>{' '}
                      with the subject line &quot;Refund Request&quot;
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">Include your details</p>
                    <p className="text-gray-600">
                      Provide the email address used for purchase and your order number (from your receipt)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">We&apos;ll process your request</p>
                    <p className="text-gray-600">
                      You&apos;ll receive a confirmation email, and your refund will be processed to your original payment method
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            {/* Refund Timeline */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Refund Timeline
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Request acknowledgment</span>
                    <span className="font-semibold text-gray-900">Within 24 hours</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Refund processing</span>
                    <span className="font-semibold text-gray-900">1-3 business days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Funds returned to your account</span>
                    <span className="font-semibold text-gray-900">3-7 business days*</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  *The time for funds to appear in your account depends on your bank or payment provider.
                </p>
              </div>
            </section>

            {/* Important Notes */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Important Notes
              </h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span><strong>14-day window:</strong> Refund requests must be submitted within 14 days of your original purchase date.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Original payment method:</strong> Refunds are issued to the original payment method used for the purchase.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Access revocation:</strong> Upon refund, your download access and license to use the materials will be revoked.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span><strong>One refund per customer:</strong> The satisfaction guarantee is offered once per customer.</span>
                </li>
              </ul>
            </section>

            {/* Exceptions */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Exceptions
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                While we offer a generous refund policy, the following situations are not eligible for refunds:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Requests made more than 14 days after purchase</li>
                <li>Abuse of the refund policy (e.g., multiple purchases and refunds)</li>
                <li>Chargebacks initiated without first contacting us for a refund</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                If you&apos;re experiencing any issues, please reach out to us first. We&apos;re here to help and want to ensure you have a positive experience.
              </p>
            </section>

            {/* Done-For-You Service */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Done-For-You Service Refunds
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                For our Done-For-You service, the following terms apply:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Before work begins:</strong> Full refund available within 14 days of purchase</li>
                <li><strong>After voice interview:</strong> 50% refund if you are not satisfied with the direction before final delivery</li>
                <li><strong>After final delivery:</strong> We offer up to 2 rounds of refinement to ensure satisfaction before the refund window closes</li>
              </ul>
            </section>

            {/* Questions */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Questions?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about our refund policy or need assistance, please don&apos;t hesitate to reach out.
              </p>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700">
                  <strong>[COMPANY_NAME]</strong>
                </p>
                <p className="text-gray-600 mt-2">
                  Email:{' '}
                  <a
                    href="mailto:[COMPANY_EMAIL]"
                    className="text-purple-600 hover:text-purple-800"
                  >
                    [COMPANY_EMAIL]
                  </a>
                </p>
                <p className="text-gray-500 text-sm mt-3">
                  We typically respond within 24-48 hours.
                </p>
              </div>
            </section>

            {/* Commitment */}
            <section>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <h3 className="font-semibold text-purple-900 mb-2">
                  Our Commitment to You
                </h3>
                <p className="text-purple-800">
                  We believe in the quality of My Voice Twin because we use it ourselves every day. Your satisfaction is our priority, and we stand behind our product with this guarantee.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-purple-600 transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-purple-600 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/" className="hover:text-purple-600 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
