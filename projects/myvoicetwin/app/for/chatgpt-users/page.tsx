'use client';

import Link from 'next/link';
import PricingCard from '@/components/PricingCard';

export default function ChatGPTUsersLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* ChatGPT Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-sm mb-8 backdrop-blur-sm border border-emerald-500/30">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6099-1.4997z"/>
              </svg>
              For ChatGPT Plus & Pro Subscribers
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              You&apos;re Paying $20/month.
              <span className="block mt-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Are You Getting Your Money&apos;s Worth?
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 sm:text-xl">
              18 million people pay for ChatGPT Plus. Most still rewrite every AI draft.
              Create a Custom GPT that actually sounds like you—and finally get the value you&apos;re paying for.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:scale-105"
              >
                Build Your Custom GPT Voice — Free
              </Link>
              <p className="text-sm text-gray-400">
                No credit card required
              </p>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">18M+</p>
                <p className="text-sm text-gray-400">Plus subscribers</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">3M+</p>
                <p className="text-sm text-gray-400">Custom GPTs created</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">12%</p>
                <p className="text-sm text-gray-400">Daily GPT usage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              The Custom GPT Promise vs Reality
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-8 text-gray-600">
              <p>
                When Custom GPTs launched, OpenAI promised personalized AI assistants.
                You tried creating one. Maybe a &ldquo;Write like me&rdquo; GPT.
              </p>
              <p className="text-xl font-semibold text-gray-900">
                It didn&apos;t work.
              </p>

              <div className="rounded-xl bg-red-50 p-6 border border-red-100">
                <p className="font-semibold text-red-900 mb-4">Why most &ldquo;voice&rdquo; Custom GPTs fail:</p>
                <ul className="space-y-3 text-red-800">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    Vague instructions like &ldquo;write in a professional tone&rdquo;
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    No actual analysis of YOUR specific patterns
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    Same generic output as base ChatGPT
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    No context-switching (email vs Slack vs presentation)
                  </li>
                </ul>
              </div>

              <p>
                The problem isn&apos;t Custom GPTs. It&apos;s that you need a <em>methodology</em> to capture
                your voice—not just a text box to fill in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What If Your Custom GPT Actually Worked?
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-8 text-gray-600">
              <p>
                Imagine a Custom GPT that:
              </p>

              <div className="rounded-xl bg-emerald-50 p-6 border border-emerald-200">
                <ul className="space-y-4 text-emerald-900">
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Knows your sentence rhythm</strong> — not just &ldquo;professional&rdquo; but YOUR specific patterns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Adapts to context</strong> — different tone for CEO vs team, email vs Slack</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Handles multiple languages</strong> — with appropriate cultural patterns for each</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Produces drafts you barely edit</strong> — actually saving time</span>
                  </li>
                </ul>
              </div>

              <p className="text-xl font-semibold text-gray-900">
                That&apos;s what My Voice Twin creates.
              </p>
              <p>
                A complete system to extract your voice DNA and generate Custom GPT instructions
                that actually capture how you write.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works for ChatGPT */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              From Generic to Personal in 3 Hours
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              A proven methodology that works with your existing ChatGPT Plus subscription.
            </p>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <span className="text-xl font-bold text-emerald-600">1</span>
                  </div>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Collect Your Writing Samples</h3>
                  <p className="text-gray-600">
                    Our guided questionnaire helps you gather the right samples from emails, Slack, documents.
                    Takes about 1-2 hours (one-time).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <span className="text-xl font-bold text-emerald-600">2</span>
                  </div>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Run the Extraction Process</h3>
                  <p className="text-gray-600">
                    Paste your samples into ChatGPT with our Forensic Linguist prompt.
                    It analyzes your patterns across 6 dimensions. Takes 30-60 minutes.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <span className="text-xl font-bold text-emerald-600">3</span>
                  </div>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Your Runtime Block</h3>
                  <p className="text-gray-600">
                    Our meta-prompt creates optimized instructions specifically designed for
                    ChatGPT Custom GPTs. Copy, paste, done.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <span className="text-xl font-bold text-emerald-600">4</span>
                  </div>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your Custom GPT</h3>
                  <p className="text-gray-600">
                    Follow our step-by-step guide to create a Custom GPT with your voice profile.
                    10-15 minutes and you&apos;re done.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
              The Math on Your ChatGPT Subscription
            </h2>

            <div className="mt-12 rounded-2xl bg-gray-50 p-8 border border-gray-200">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-red-600 mb-4">Without My Voice Twin</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex justify-between">
                      <span>ChatGPT Plus</span>
                      <span className="font-mono">$20/mo</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Time rewriting drafts</span>
                      <span className="font-mono">8+ hrs/week</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Actual time saved</span>
                      <span className="font-mono text-red-600">~2 hrs/week</span>
                    </li>
                    <li className="flex justify-between border-t pt-3 mt-3">
                      <span>Effective cost per hour saved</span>
                      <span className="font-mono text-red-600">$10/hr</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-600 mb-4">With My Voice Twin</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex justify-between">
                      <span>ChatGPT Plus</span>
                      <span className="font-mono">$20/mo</span>
                    </li>
                    <li className="flex justify-between">
                      <span>My Voice Twin (one-time)</span>
                      <span className="font-mono">$99</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Time actually saved</span>
                      <span className="font-mono text-emerald-600">6+ hrs/week</span>
                    </li>
                    <li className="flex justify-between border-t pt-3 mt-3">
                      <span>ROI payback</span>
                      <span className="font-mono text-emerald-600">&lt; 1 month</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-lg text-gray-600">
              You&apos;re already paying for ChatGPT. Make it actually work for you.
            </p>
          </div>
        </div>
      </section>

      {/* Also Works With */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Works Beyond ChatGPT Too
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Your voice profile is platform-agnostic. Use it everywhere.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-gray-900">ChatGPT</h3>
              <p className="text-sm text-gray-600 mt-2">Custom GPTs with your voice</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-semibold text-gray-900">Claude</h3>
              <p className="text-sm text-gray-600 mt-2">Projects with persistent context</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-semibold text-gray-900">Gemini</h3>
              <p className="text-sm text-gray-600 mt-2">Gems with your instructions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              One-Time Investment. Permanent Upgrade.
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Pay once, use your voice profile forever
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 max-w-5xl mx-auto">
            <PricingCard
              tier="Starter"
              price={49}
              description="Get started with essentials"
              features={[
                { text: '1 language', included: true },
                { text: '3 voice matrix sections', included: true },
                { text: 'ChatGPT Custom GPT guide', included: true },
                { text: 'All deployment guides', included: true },
                { text: 'Basic documentation', included: true },
              ]}
              bestFor="Single-language ChatGPT users"
              ctaLink="/signup"
              ctaText="Start Free"
              highlighted={false}
            />

            <PricingCard
              tier="Pro"
              price={99}
              description="Best Value for Power Users"
              features={[
                { text: 'Unlimited languages', included: true },
                { text: 'Unlimited voice matrix sections', included: true },
                { text: 'Full Custom GPT optimization', included: true },
                { text: 'All deployment guides + video', included: true },
                { text: 'Example corpus + sample outputs', included: true },
                { text: 'Edit subscription: $10 first year', included: true },
              ]}
              bestFor="Power ChatGPT users"
              ctaLink="/signup"
              ctaText="Start Free"
              highlighted={true}
              badge="Most Popular"
            />

            <PricingCard
              tier="Executive"
              price={249}
              description="Premium experience"
              features={[
                { text: 'Everything in Pro', included: true },
                { text: '1 year edit subscription included', included: true },
                { text: 'Audio credits for voice notes', included: true },
                { text: 'Priority email support', included: true },
                { text: 'Personalized recommendations', included: true },
              ]}
              bestFor="Heavy communicators"
              ctaLink="/signup"
              ctaText="Start Free"
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stop Wasting Your ChatGPT Subscription
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            You&apos;re paying $240/year for ChatGPT Plus. Make it actually write like you.
          </p>

          <div className="mt-10 rounded-2xl bg-white/10 p-8 backdrop-blur-sm max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Pro Package — $99</h3>
            <ul className="space-y-3 text-left text-gray-200 mb-8">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Optimized for ChatGPT Custom GPTs
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Step-by-step GPT creation guide
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Works with Plus, Team, and Enterprise
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                14-day satisfaction guarantee
              </li>
            </ul>
            <Link
              href="/signup"
              className="block w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:scale-105 text-center"
            >
              Build Your Custom GPT Voice — Free
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
              Make your ChatGPT subscription actually worth it.
            </p>
            <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm mt-4 inline-block">
              ← Back to main site
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
