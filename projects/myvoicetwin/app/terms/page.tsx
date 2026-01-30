import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - My Voice Twin',
  description: 'Terms of Service for My Voice Twin - Your AI Digital Twin',
}

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mt-2 text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-8 sm:p-12">
          <div className="prose prose-slate max-w-none">
            {/* Introduction */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Welcome to My Voice Twin. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the My Voice Twin website, products, and services (collectively, the &quot;Service&quot;) provided by [COMPANY_NAME] (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
              </p>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Service.
              </p>
            </section>

            {/* Definitions */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Definitions
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>&quot;Service&quot;</strong> refers to the My Voice Twin digital product, including all prompts, guides, templates, and related materials.</li>
                <li><strong>&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;</strong> refers to any individual who accesses or uses the Service.</li>
                <li><strong>&quot;Content&quot;</strong> refers to all materials included in the Service, including text, images, prompts, and documentation.</li>
                <li><strong>&quot;User Content&quot;</strong> refers to any content you provide or create while using the Service.</li>
              </ul>
            </section>

            {/* Account and Purchase */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Account and Purchase
              </h2>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                3.1 Purchase
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                To access the Service, you must complete a purchase through our website. By making a purchase, you represent that you are at least 18 years old or have the consent of a parent or legal guardian.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                3.2 Payment
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                All payments are processed securely through Stripe. You agree to provide accurate and complete payment information. All prices are in USD unless otherwise specified.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                3.3 Access
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Upon successful payment, you will receive access to download the Service materials. Download links have limited validity and download attempts as specified at the time of purchase.
              </p>
            </section>

            {/* License and Usage */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. License and Usage Rights
              </h2>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                4.1 License Grant
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to use the Service for your personal or internal business purposes.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                4.2 Permitted Uses
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Use the prompts and materials to create your own voice profile</li>
                <li>Deploy your voice profile on AI platforms for personal or business use</li>
                <li>Modify and adapt the materials for your own use</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                4.3 Prohibited Uses
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Resell, redistribute, or share the Service materials with third parties</li>
                <li>Create derivative products for sale based on the Service</li>
                <li>Remove any copyright or proprietary notices from the materials</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Impersonate others or create voice profiles without consent</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Intellectual Property
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The Service and all its contents, features, and functionality are owned by [COMPANY_NAME] and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Your purchase grants you a license to use the materials as described in Section 4, but does not transfer any ownership rights to you.
              </p>
            </section>

            {/* User Content */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. User Content
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You retain ownership of any content you create using the Service, including your voice profiles and outputs generated using your materials.
              </p>
              <p className="text-gray-600 leading-relaxed">
                You are solely responsible for the content you create and must ensure it does not violate any laws or third-party rights.
              </p>
            </section>

            {/* Disclaimers */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Disclaimers
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We do not guarantee that the Service will meet your specific requirements or produce particular results. The effectiveness of the voice cloning methodology may vary based on individual factors.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We are not responsible for the outputs generated by third-party AI platforms when using the Service materials.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, [COMPANY_NAME] SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our total liability for any claims arising from or related to these Terms or the Service shall not exceed the amount you paid for the Service.
              </p>
            </section>

            {/* Refund Policy */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Refund Policy
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We offer a 14-day satisfaction guarantee. If you are not satisfied with the Service, you may request a refund within 14 days of purchase. Please see our full <Link href="/refund" className="text-purple-600 hover:text-purple-800 underline">Refund Policy</Link> for details.
              </p>
            </section>

            {/* Termination */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Termination
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We reserve the right to terminate or suspend your access to the Service immediately, without prior notice, for any breach of these Terms.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Upon termination, your license to use the Service materials will be revoked, and you must destroy all copies in your possession.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Changes to Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting the updated Terms on our website. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Governing Law
              </h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of [JURISDICTION], without regard to its conflict of law provisions.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
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
              </div>
            </section>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-purple-600 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/refund" className="hover:text-purple-600 transition-colors">
            Refund Policy
          </Link>
          <Link href="/" className="hover:text-purple-600 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
