import { Shield, Zap, RefreshCcw, Dna } from 'lucide-react';

interface FooterProps {
  contactEmail?: string;
}

export default function Footer({
  contactEmail = 'support@voicedna.com'
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const trustBadges = [
    {
      icon: Shield,
      title: 'Secure Checkout',
      description: 'Powered by Stripe',
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Download immediately',
    },
    {
      icon: RefreshCcw,
      title: '14-Day Guarantee',
      description: 'Full refund, no questions',
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Badges Section */}
      <div className="border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-3"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-800">
                  <badge.icon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{badge.title}</h4>
                  <p className="text-sm text-gray-400">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Dna className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold">My Voice Twin</span>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400">
              Questions?{' '}
              <a
                href={`mailto:${contactEmail}`}
                className="text-blue-400 hover:text-blue-300 transition-colors underline"
              >
                {contactEmail}
              </a>
            </p>
            <p className="mt-1 text-sm text-gray-500">
              We respond within 48 hours
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-800 pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              &copy; {currentYear} My Voice Twin. All rights reserved.
            </p>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <a
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/refund"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Refund Policy
              </a>
            </div>
          </div>
        </div>

        {/* Mini FAQ */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
          <span>Works with ChatGPT, Claude, Gemini, and any LLM</span>
          <span className="hidden sm:inline">|</span>
          <span>Instant digital download</span>
          <span className="hidden sm:inline">|</span>
          <span>14-day satisfaction guarantee</span>
        </div>
      </div>
    </footer>
  );
}
