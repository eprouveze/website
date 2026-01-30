'use client';

import Link from 'next/link';
import PricingCard from '@/components/PricingCard';

export default function MultilingualLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Language flags/indicators */}
            <div className="flex justify-center gap-4 mb-8">
              <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-sm">English</span>
              <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-sm">日本語</span>
              <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-sm">Français</span>
              <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-sm">Español</span>
              <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-sm">中文</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Same Voice.
              <span className="block mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Any Language.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 sm:text-xl">
              For multilingual professionals who need AI that understands keigo, formality levels,
              and cultural context—not just translation.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-xl hover:scale-105"
              >
                Build Your Multilingual Voice Twin — Free
              </Link>
              <p className="text-sm text-gray-400">
                No credit card required
              </p>
            </div>

            {/* Social Proof */}
            <div className="mt-12 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-lg italic text-gray-200">
                &ldquo;Finally, my Japanese emails have the right keigo and my English stays direct.
                Same professional voice, perfect cultural fit.&rdquo;
              </p>
              <p className="mt-2 text-sm text-gray-400">— Bilingual Executive, Tokyo/NYC</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Multilingual Problem */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              The Multilingual AI Problem
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-8 text-gray-600">
              <p>
                You switch between languages daily. English for global stakeholders.
                Japanese for Tokyo HQ. French for the Paris team. Spanish for LATAM clients.
              </p>
              <p className="text-xl font-semibold text-gray-900">
                AI tools treat them all the same. They shouldn&apos;t.
              </p>

              <div className="rounded-xl bg-red-50 p-6 border border-red-100">
                <p className="font-semibold text-red-900 mb-4">What AI gets wrong across languages:</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="font-medium text-red-800 mb-2">Japanese</p>
                    <ul className="space-y-2 text-red-700 text-sm">
                      <li>• Wrong keigo level for the relationship</li>
                      <li>• Too direct (失礼 to superiors)</li>
                      <li>• Missing appropriate 挨拶</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-red-800 mb-2">French</p>
                    <ul className="space-y-2 text-red-700 text-sm">
                      <li>• Wrong tu/vous choice</li>
                      <li>• Missing formality markers</li>
                      <li>• Anglo-Saxon directness</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-red-800 mb-2">Spanish</p>
                    <ul className="space-y-2 text-red-700 text-sm">
                      <li>• Mixed regional vocabulary</li>
                      <li>• Wrong register for context</li>
                      <li>• Unnatural sentence flow</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-red-800 mb-2">German</p>
                    <ul className="space-y-2 text-red-700 text-sm">
                      <li>• Sie/du confusion</li>
                      <li>• Missing compound precision</li>
                      <li>• Wrong formality in business</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p>
                You end up rewriting every AI draft to match the cultural context.
                That defeats the purpose of using AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Career Advantage */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your Multilingual Skills Are Worth More
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-8 text-gray-600">
              <div className="rounded-xl bg-green-50 p-8 border border-green-200">
                <p className="font-semibold text-green-900 mb-4">The bilingual earnings advantage:</p>
                <div className="grid gap-6 sm:grid-cols-3 text-center">
                  <div>
                    <p className="text-3xl font-bold text-green-700">5-20%</p>
                    <p className="text-green-800 text-sm mt-1">Higher salary premium</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-700">$67K-$128K</p>
                    <p className="text-green-800 text-sm mt-1">Lifetime earnings boost</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-700">3x</p>
                    <p className="text-green-800 text-sm mt-1">Demand growth (5 years)</p>
                  </div>
                </div>
                <p className="text-green-800 text-sm mt-6 text-center">
                  Source: The Economist, American Immigration Council
                </p>
              </div>

              <p className="text-xl font-semibold text-gray-900">
                Don&apos;t let generic AI undermine your competitive advantage.
              </p>
              <p>
                Your ability to communicate authentically across cultures is valuable.
                My Voice Twin ensures AI amplifies that skill instead of erasing it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How My Voice Twin Works for Multilinguals
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Capture your authentic voice in <em>each</em> language, with cultural context preserved.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {/* Step 1 */}
            <div className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <span className="text-xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Collect Per-Language Samples</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Gather your best writing in each language. The system guides you to find:
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  Formal vs casual registers in each language
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  Culture-specific patterns (keigo, formality markers)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  Your natural rhythm in each language (not translated)
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <span className="text-xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Extract Cultural Patterns</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Our Forensic Linguist prompt analyzes each language separately:
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  Identifies your keigo/formality preferences
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  Maps relationship → tone patterns
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  Captures culture-specific opening/closing conventions
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Generate Unified Voice Profile</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Your Digital Twin understands:
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  Your core professional identity (consistent across languages)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  Language-specific adaptations (cultural fit)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  Context detection (auto-switches based on detected language)
                </li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <span className="text-xl font-bold text-purple-600">4</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Deploy Once, Use Everywhere</h3>
              </div>
              <p className="text-gray-600 mb-4">
                One voice profile works across:
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  ChatGPT Custom GPTs, Claude Projects, Gemini Gems
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  Auto-detects language and applies correct cultural patterns
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  Same authentic you, culturally appropriate every time
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
              Real Examples: Before vs After
            </h2>

            {/* Japanese Example */}
            <div className="mb-12 rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200">
              <div className="bg-gray-50 px-6 py-4">
                <h3 className="font-semibold text-gray-900">Japanese Business Email</h3>
              </div>
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <div className="p-6 bg-red-50/50">
                  <p className="text-sm font-medium text-red-600 mb-3">Generic AI Output</p>
                  <p className="text-gray-700 text-sm font-mono">
                    田中様、<br/>
                    お世話になっております。<br/>
                    ミーティングについてお知らせします。<br/>
                    よろしくお願いします。
                  </p>
                  <p className="mt-4 text-xs text-red-600">
                    Too abrupt, missing proper 挨拶, wrong keigo level for senior executive
                  </p>
                </div>
                <div className="p-6 bg-green-50/50">
                  <p className="text-sm font-medium text-green-600 mb-3">With My Voice Twin</p>
                  <p className="text-gray-700 text-sm font-mono">
                    田中部長、<br/>
                    いつも大変お世話になっております。<br/>
                    先日のご提案について、心より御礼申し上げます。<br/>
                    来週のミーティングにつきまして、ご連絡させていただきます。<br/>
                    ご多忙のところ恐れ入りますが、ご確認いただけますと幸いです。
                  </p>
                  <p className="mt-4 text-xs text-green-600">
                    Appropriate keigo, proper respect markers, natural business flow
                  </p>
                </div>
              </div>
            </div>

            {/* French Example */}
            <div className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200">
              <div className="bg-gray-50 px-6 py-4">
                <h3 className="font-semibold text-gray-900">French Client Communication</h3>
              </div>
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <div className="p-6 bg-red-50/50">
                  <p className="text-sm font-medium text-red-600 mb-3">Generic AI Output</p>
                  <p className="text-gray-700 text-sm font-mono">
                    Bonjour,<br/>
                    Je vous écris pour le projet.<br/>
                    Pouvez-vous confirmer?<br/>
                    Cordialement
                  </p>
                  <p className="mt-4 text-xs text-red-600">
                    Too direct, missing formality markers, abrupt tone
                  </p>
                </div>
                <div className="p-6 bg-green-50/50">
                  <p className="text-sm font-medium text-green-600 mb-3">With My Voice Twin</p>
                  <p className="text-gray-700 text-sm font-mono">
                    Cher Monsieur Dupont,<br/>
                    J&apos;espère que vous allez bien.<br/>
                    Je me permets de revenir vers vous concernant notre projet commun.<br/>
                    Serait-il possible de convenir d&apos;un moment pour en discuter?<br/>
                    Dans l&apos;attente de votre retour, je vous prie d&apos;agréer mes salutations distinguées.
                  </p>
                  <p className="mt-4 text-xs text-green-600">
                    Proper formality, elegant flow, culturally appropriate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built for Multilingual Professionals In
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
              <div className="text-3xl mb-3">🏥</div>
              <h3 className="font-semibold text-gray-900">Healthcare</h3>
              <p className="text-sm text-gray-600 mt-2">64% expect increased bilingual demand</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="font-semibold text-gray-900">Professional Services</h3>
              <p className="text-sm text-gray-600 mt-2">Consulting, legal, financial</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="font-semibold text-gray-900">Education</h3>
              <p className="text-sm text-gray-600 mt-2">57% growth in bilingual roles</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-semibold text-gray-900">Trade & Commerce</h3>
              <p className="text-sm text-gray-600 mt-2">International business communication</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Pricing for Multilingual Professionals
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Pro tier recommended — unlimited languages included
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 max-w-5xl mx-auto">
            <PricingCard
              tier="Starter"
              price={49}
              description="Single language focus"
              features={[
                { text: '1 language', included: true },
                { text: '3 voice matrix sections', included: true },
                { text: '1 regeneration included', included: true },
                { text: 'All deployment guides', included: true },
                { text: 'Basic documentation', included: true },
              ]}
              bestFor="Testing with one language first"
              ctaLink="/signup"
              ctaText="Start Free"
              highlighted={false}
            />

            <PricingCard
              tier="Pro"
              price={99}
              description="Full Multilingual Power"
              features={[
                { text: 'Unlimited languages', included: true },
                { text: 'Unlimited voice matrix sections', included: true },
                { text: 'Per-language cultural patterns', included: true },
                { text: 'All deployment guides + video', included: true },
                { text: 'Example corpus + sample outputs', included: true },
                { text: 'Edit subscription: $10 first year', included: true },
              ]}
              bestFor="Multilingual professionals"
              ctaLink="/signup"
              ctaText="Start Free"
              highlighted={true}
              badge="Best for Multilinguals"
            />

            <PricingCard
              tier="Executive"
              price={249}
              description="Premium multilingual experience"
              features={[
                { text: 'Everything in Pro', included: true },
                { text: '1 year edit subscription included', included: true },
                { text: 'Audio credits for voice notes', included: true },
                { text: 'Priority email support', included: true },
                { text: 'Personalized recommendations', included: true },
              ]}
              bestFor="Leaders managing global teams"
              ctaLink="/signup"
              ctaText="Start Free"
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your Multilingual Voice, Preserved
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            Stop letting AI erase your cultural fluency. Create a Digital Twin that speaks
            like you—in every language.
          </p>

          <div className="mt-10 rounded-2xl bg-white/10 p-8 backdrop-blur-sm max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Pro Package — $99</h3>
            <ul className="space-y-3 text-left text-gray-200 mb-8">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited languages with cultural context
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Keigo, formality, register detection
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Auto-detects language and adapts
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                14-day satisfaction guarantee
              </li>
            </ul>
            <Link
              href="/signup"
              className="block w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-xl hover:scale-105 text-center"
            >
              Build Your Multilingual Voice Twin — Free
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
              Same voice. Any language. Culturally authentic.
            </p>
            <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm mt-4 inline-block">
              ← Back to main site
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
