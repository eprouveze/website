'use client';

import Link from 'next/link';
import PricingCard from '@/components/PricingCard';

export default function ExecutivesLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              You&apos;re Too Busy to
              <span className="block mt-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Rewrite AI Drafts.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 sm:text-xl">
              Executives spend 28% of their workweek on email.
              AI was supposed to help—but every draft needs heavy editing.
              Get a Digital Twin that writes like you from the first try.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-xl hover:scale-105"
              >
                Start Building Your Voice Twin — Free
              </Link>
              <p className="text-sm text-gray-400">
                No credit card required
              </p>
            </div>

            {/* Social Proof */}
            <div className="mt-12 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-lg italic text-gray-200">
                &ldquo;I was skeptical, but now my board updates take 10 minutes instead of an hour.
                The AI actually sounds like me.&rdquo;
              </p>
              <p className="mt-2 text-sm text-gray-400">— VP of Operations, Series B Startup</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Executive Problem */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              The Executive Communication Burden
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-8 text-gray-600">
              <p>
                You communicate with everyone: board members, investors, direct reports, partners,
                customers, vendors. Each requires a different register.
              </p>

              <div className="rounded-xl bg-amber-50 p-8 border border-amber-200">
                <p className="font-semibold text-amber-900 mb-4">The time cost of executive communication:</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-amber-900">
                      <span className="font-bold">28%</span> of workweek on email (McKinsey)
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-amber-900">
                      <span className="font-bold">5+ audiences</span> requiring different tones
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-amber-900">
                      <span className="font-bold">100+ emails</span> per week for senior execs
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-amber-900">
                      <span className="font-bold">10+ min</span> editing each AI draft
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xl font-semibold text-gray-900">
                AI promised to help. Instead, it creates more work.
              </p>
              <p>
                Every ChatGPT draft sounds the same—whether it&apos;s for your board chair or
                a junior team member. You end up rewriting everything anyway.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Context Switching Problem */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Different Audience. Same Generic AI.
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-8 text-gray-600">
              <p>
                Your communication varies dramatically by context. AI doesn&apos;t understand this.
              </p>

              <div className="rounded-xl bg-red-50 p-6 border border-red-100">
                <p className="font-semibold text-red-900 mb-4">What generic AI misses:</p>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="font-medium text-red-800 mb-2">To Board/Investors</p>
                    <p className="text-sm text-red-700">
                      Strategic, concise, data-driven. Not the wordy summaries AI produces.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-red-800 mb-2">To Direct Reports</p>
                    <p className="text-sm text-red-700">
                      Supportive but direct. Not the overly formal tone AI defaults to.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-red-800 mb-2">To External Partners</p>
                    <p className="text-sm text-red-700">
                      Professional warmth with appropriate boundaries. AI is either too cold or too casual.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-red-800 mb-2">All-Hands Updates</p>
                    <p className="text-sm text-red-700">
                      Inspiring but authentic. Not the corporate-speak AI generates.
                    </p>
                  </div>
                </div>
              </div>

              <p>
                You have a voice. It adapts to context while staying authentically you.
                AI should do the same.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              My Voice Twin: Your Executive Communication System
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              A proven methodology to capture your authentic voice and deploy it across all
              your communication contexts.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Benefit 1 */}
            <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Save 5+ Hours Weekly</h3>
              </div>
              <p className="text-gray-600">
                Stop rewriting every AI draft. Get output that sounds like you the first time,
                across email, Slack, documents, and presentations.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Context-Aware Output</h3>
              </div>
              <p className="text-gray-600">
                Auto-detects audience and adjusts. Board memo vs team update vs customer email—
                the right tone every time.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Multilingual Support</h3>
              </div>
              <p className="text-gray-600">
                Leading global teams? Maintain your executive voice across English, Japanese,
                French, Spanish, German—any language with cultural nuance.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Privacy-First Design</h3>
              </div>
              <p className="text-gray-600">
                Your voice profile stays with you. Deployed to your own AI accounts—ChatGPT,
                Claude, or Gemini. We never see your ongoing conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI for Executives */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
              The ROI of Executive Time
            </h2>

            <div className="mt-12 rounded-2xl bg-indigo-50 p-8 border border-indigo-200">
              <div className="text-center mb-8">
                <p className="text-gray-600 mb-2">If your time is worth</p>
                <p className="text-4xl font-bold text-indigo-700">$200+/hour</p>
                <p className="text-gray-600 mt-2">and you save 5 hours/week on communication...</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3 text-center">
                <div>
                  <p className="text-3xl font-bold text-indigo-700">$1,000</p>
                  <p className="text-gray-600 text-sm mt-1">Value saved per week</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-indigo-700">$52,000</p>
                  <p className="text-gray-600 text-sm mt-1">Annual time value recovered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-indigo-700">200x</p>
                  <p className="text-gray-600 text-sm mt-1">ROI on $249 investment</p>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-lg text-gray-600">
              This isn&apos;t a productivity hack. It&apos;s executive infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Setup Once. Use Forever.
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Total setup time: ~3 hours. That&apos;s less than your weekly email rewriting.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">1</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Gather Your Best Writing</h3>
                  <p className="text-gray-600 mt-1">
                    We guide you to collect samples from emails, memos, presentations—your actual communication across contexts.
                  </p>
                </div>
                <div className="text-sm text-gray-500 font-mono">1-2 hrs</div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">2</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Extract Your Voice Patterns</h3>
                  <p className="text-gray-600 mt-1">
                    Our Forensic Linguist prompt analyzes your sentence rhythm, transition patterns, formality levels—what makes you, you.
                  </p>
                </div>
                <div className="text-sm text-gray-500 font-mono">30-60 min</div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">3</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Deploy to Your AI Tools</h3>
                  <p className="text-gray-600 mt-1">
                    Copy your voice profile into ChatGPT, Claude, or Gemini. Step-by-step guides included.
                  </p>
                </div>
                <div className="text-sm text-gray-500 font-mono">15 min</div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">✓</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Done. Use It Daily.</h3>
                  <p className="text-gray-600 mt-1">
                    Your voice profile works indefinitely. Update it when your style evolves (Executive tier includes 1 year of updates).
                  </p>
                </div>
                <div className="text-sm text-green-600 font-mono">Forever</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Executive-Grade Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              One-time investment. Permanent productivity gain.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 max-w-5xl mx-auto">
            <PricingCard
              tier="Starter"
              price={49}
              description="Basic voice cloning"
              features={[
                { text: '1 language', included: true },
                { text: '3 voice matrix sections', included: true },
                { text: '1 regeneration included', included: true },
                { text: 'All deployment guides', included: true },
                { text: 'Basic documentation', included: true },
              ]}
              bestFor="Testing the methodology"
              ctaLink="/signup"
              ctaText="Start Free"
              highlighted={false}
            />

            <PricingCard
              tier="Pro"
              price={99}
              description="Full voice system"
              features={[
                { text: 'Unlimited languages', included: true },
                { text: 'Unlimited voice matrix sections', included: true },
                { text: '1 regeneration included', included: true },
                { text: 'All deployment guides + video', included: true },
                { text: 'Example corpus + sample outputs', included: true },
                { text: 'Edit subscription: $10 first year', included: true },
              ]}
              bestFor="Most professionals"
              ctaLink="/signup"
              ctaText="Start Free"
              highlighted={false}
            />

            <PricingCard
              tier="Executive"
              price={249}
              description="Premium Executive Package"
              features={[
                { text: 'Everything in Pro', included: true },
                { text: '1 year edit subscription included', included: true },
                { text: 'Audio credits for voice notes', included: true },
                { text: 'Priority email support (30 days)', included: true },
                { text: 'Personalized recommendations', included: true },
              ]}
              bestFor="Senior leaders & executives"
              ctaLink="/signup"
              ctaText="Start Free"
              highlighted={true}
              badge="Recommended for Executives"
            />
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-green-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            14-Day Executive Guarantee
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            If your Digital Twin doesn&apos;t capture your authentic voice and save you meaningful time,
            email us within 14 days for a complete refund. No questions, no friction.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your Time Is Too Valuable to Waste on AI Rewrites
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            Create a Digital Twin that communicates like you—to any audience,
            in any context, from the first draft.
          </p>

          <div className="mt-10 rounded-2xl bg-white/10 p-8 backdrop-blur-sm max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Executive Package — $249</h3>
            <ul className="space-y-3 text-left text-gray-200 mb-8">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited languages and contexts
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                1 year of updates included
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                30-day priority support
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                14-day satisfaction guarantee
              </li>
            </ul>
            <Link
              href="/signup"
              className="block w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-xl hover:scale-105 text-center"
            >
              Start Building Your Voice Twin — Free
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              No credit card required. Pay when you&apos;re ready.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} My Voice Twin. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Executive communication infrastructure for leaders.
            </p>
            <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm mt-4 inline-block">
              ← Back to main site
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
