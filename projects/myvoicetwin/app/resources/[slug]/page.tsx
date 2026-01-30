'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Lead magnet content configuration
const LEAD_MAGNETS: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  previewPoints: string[];
  pdfUrl: string;
  targetAudience: string;
}> = {
  'voice-assessment': {
    title: 'Voice Profile Self-Assessment',
    subtitle: 'Discover how well AI captures your writing voice',
    description: 'A 10-question assessment that helps you identify gaps between your natural writing style and what AI produces. Includes scoring guide and personalized recommendations.',
    benefits: [
      'Identify your unique voice characteristics',
      'Spot where AI falls short for your style',
      'Get actionable improvement suggestions',
    ],
    previewPoints: [
      '10 diagnostic questions about your writing patterns',
      'Scoring rubric to measure AI alignment',
      'Personalized recommendations based on results',
      'Checklist for improving AI output quality',
    ],
    pdfUrl: '/downloads/voice-assessment.pdf',
    targetAudience: 'Anyone who uses AI for writing',
  },
  'ai-prompts': {
    title: '10 Prompts to Test Your AI\'s Voice',
    subtitle: 'Copy-paste prompts that reveal voice gaps instantly',
    description: 'A collection of carefully crafted prompts that expose whether your AI truly sounds like you. Each prompt tests a different aspect of voice: tone, transitions, sentence rhythm, and more.',
    benefits: [
      'Instantly test any AI tool',
      'Works with ChatGPT, Claude, Gemini',
      'Compare before/after results',
    ],
    previewPoints: [
      'Prompt 1: Formal email to leadership',
      'Prompt 2: Casual Slack message to team',
      'Prompt 3: Technical explanation simplification',
      '...and 7 more targeted prompts',
    ],
    pdfUrl: '/downloads/ai-voice-prompts.pdf',
    targetAudience: 'ChatGPT/Claude power users',
  },
  'multilingual-checklist': {
    title: 'Multilingual AI Writing Checklist',
    subtitle: 'Ensure consistent voice across all your languages',
    description: 'A comprehensive checklist for bilingual and multilingual professionals who need AI to maintain voice consistency across languages. Covers formality levels, cultural nuances, and language-specific patterns.',
    benefits: [
      'Maintain voice consistency across languages',
      'Handle formality differences (keigo, vous/tu)',
      'Avoid cultural missteps',
    ],
    previewPoints: [
      'Language-specific formality mapping',
      'Cultural context checklist by language',
      'Transition pattern differences guide',
      'Sample voice profile template (multilingual)',
    ],
    pdfUrl: '/downloads/multilingual-checklist.pdf',
    targetAudience: 'Bilingual/multilingual professionals',
  },
};

export default function ResourcePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Get UTM parameters
  const utmSource = searchParams.get('utm_source');
  const utmMedium = searchParams.get('utm_medium');
  const utmCampaign = searchParams.get('utm_campaign');

  const resource = LEAD_MAGNETS[slug];

  // Handle invalid slug
  if (!resource) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Resource Not Found</h1>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            Return to homepage
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || null,
          source: slug,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong');
        return;
      }

      setStatus('success');

      // Trigger download after short delay
      setTimeout(() => {
        window.open(resource.pdfUrl, '_blank');
      }, 500);
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white">
              My Voice Twin
            </Link>
            <Link
              href="/signup"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Resource Preview */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm mb-4">
              Free Resource
            </span>
            <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              {resource.title}
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              {resource.subtitle}
            </p>
            <p className="text-gray-400 mb-8">
              {resource.description}
            </p>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                What You'll Get
              </h3>
              <ul className="space-y-3">
                {resource.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-white">
                    <svg className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Preview */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                What's Inside
              </h3>
              <ul className="space-y-2">
                {resource.previewPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="text-purple-400">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Best for: {resource.targetAudience}
            </p>
          </div>

          {/* Right: Email Capture Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Check Your Downloads!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your PDF should be downloading now. If not, click the button below.
                </p>
                <a
                  href={resource.pdfUrl}
                  download
                  className="inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
                >
                  Download PDF
                </a>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">
                    Want to create your own AI voice profile?
                  </p>
                  <Link
                    href="/signup"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Create Free Account
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Get Instant Access
                </h2>
                <p className="text-gray-600 mb-6">
                  Enter your email to download the free PDF.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name (optional)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="John"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 font-semibold text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Processing...' : 'Download Free PDF'}
                  </button>
                </form>

                <p className="mt-4 text-xs text-gray-500 text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
