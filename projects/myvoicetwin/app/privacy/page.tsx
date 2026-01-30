import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - My Voice Twin',
  description: 'Privacy Policy for My Voice Twin - How we collect, use, and protect your information',
}

export default function PrivacyPage() {
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
            Privacy Policy
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
                [COMPANY_NAME] (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the My Voice Twin website and service. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or purchase our products.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Please read this Privacy Policy carefully. By using our Service, you consent to the data practices described in this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                2.1 Personal Information
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you make a purchase, we collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Name</li>
                <li>Email address</li>
                <li>Billing address</li>
                <li>Payment information (processed securely by Stripe)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                2.2 Automatically Collected Information
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you visit our website, we may automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device type and operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website or source</li>
                <li>Other browsing information</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                2.3 Cookies and Tracking Technologies
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website and store certain information. These may include essential cookies required for the website to function, analytics cookies to understand how visitors interact with our website, and marketing cookies if applicable.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Process and fulfill your purchase</li>
                <li>Send you order confirmations and download links</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send important updates about the Service</li>
                <li>Improve and optimize our website and Service</li>
                <li>Analyze usage patterns and trends</li>
                <li>Prevent fraud and protect against unauthorized transactions</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                4.1 Service Providers
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may share your information with trusted third-party service providers who assist us in operating our business, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li><strong>Stripe</strong> - Payment processing</li>
                <li><strong>Vercel</strong> - Website hosting and analytics</li>
                <li><strong>Email service providers</strong> - Sending transactional emails</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                4.2 Legal Requirements
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may disclose your information if required to do so by law or in response to valid requests by public authorities.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                4.3 Business Transfers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
              </p>
            </section>

            {/* Data Security */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure payment processing through Stripe (PCI-DSS compliant)</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Regular security assessments and updates</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Data Retention
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Purchase records and transaction data are retained for accounting, tax, and legal compliance purposes.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Your Rights and Choices
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information, subject to legal requirements</li>
                <li><strong>Portability:</strong> Request a copy of your data in a structured, machine-readable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                To exercise any of these rights, please contact us using the information provided below.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Children&apos;s Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our Service is not intended for children under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will take steps to delete such information.
              </p>
            </section>

            {/* International Transfers */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws different from your country. By using our Service, you consent to the transfer of your information to these countries.
              </p>
            </section>

            {/* Third-Party Links */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Third-Party Links
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read the privacy policies of any third-party sites you visit.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* GDPR Compliance */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. GDPR Compliance (For EU/EEA Residents)
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you are a resident of the European Union or European Economic Area, you have additional rights under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Right to be informed about how your data is used</li>
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Rights related to automated decision-making and profiling</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Our legal basis for processing your data is typically the performance of a contract (to fulfill your purchase) or your consent.
              </p>
            </section>

            {/* CCPA Compliance */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. CCPA Compliance (For California Residents)
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Right to know what personal information is collected</li>
                <li>Right to know if personal information is sold or disclosed</li>
                <li>Right to say no to the sale of personal information</li>
                <li>Right to access your personal information</li>
                <li>Right to equal service and price, even if you exercise your privacy rights</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                We do not sell personal information to third parties.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                14. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
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
                <p className="text-gray-600 mt-2">
                  For data protection inquiries, please include &quot;Privacy&quot; in the subject line.
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
