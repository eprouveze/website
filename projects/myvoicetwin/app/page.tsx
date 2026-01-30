'use client';

import PricingCard from '@/components/PricingCard';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              ChatGPT Writes Like ChatGPT.
              <span className="block mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                I Wanted It to Write Like Me.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 sm:text-xl">
              Here&apos;s the exact system I built to clone my voice across 3 languages and 6 contexts.
              A proven methodology that captures your authentic voice and deploys it on ChatGPT, Claude, Gemini—or any AI platform.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="#pricing"
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-xl hover:scale-105"
              >
                Get My Voice Twin — $99
              </a>
              <p className="text-sm text-gray-400">
                <span className="line-through">$149</span> Launch Price
              </p>
            </div>
            {/* Social Proof */}
            <div className="mt-12 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-lg italic text-gray-200">
                &ldquo;I spend 3 hours less on email every week. The drafts just... sound like me.&rdquo;
              </p>
              <p className="mt-2 text-sm text-gray-400">— Early Access User</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              The Problem with AI Writing
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-8 text-gray-600">
              <p>
                You&apos;ve tried using ChatGPT for emails. Claude for documents. Gemini for drafts.
              </p>
              <p className="text-xl font-semibold text-gray-900">
                They all have the same problem: they don&apos;t sound like you.
              </p>
              <p>
                Every output needs heavy editing. The tone is off. The transitions are wrong.
                It uses words you&apos;d never use.
              </p>
              <p>
                You end up spending almost as much time fixing AI drafts as you would writing from scratch.
              </p>
              <div className="rounded-xl bg-red-50 p-6 border border-red-100">
                <p className="font-semibold text-red-900 mb-3">Worse if you&apos;re multilingual:</p>
                <ul className="space-y-2 text-red-800">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    Your English is direct and confident
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    Your Japanese needs the right level of keigo
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    Your French has a different rhythm entirely
                  </li>
                </ul>
                <p className="mt-4 text-red-900">
                  No AI tool handles this. You&apos;re stuck switching voices manually, losing time, losing consistency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agitation Section */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              The Hidden Cost of Generic AI
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-8 text-gray-600">
              <p className="text-xl font-semibold text-gray-900">
                Every email you rewrite is time you&apos;ll never get back.
              </p>
              <div className="rounded-xl bg-amber-50 p-8 border border-amber-200">
                <p className="font-semibold text-amber-900 mb-4">Let&apos;s do the math:</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-amber-900">
                      20 emails per day x 5 minutes of editing = <span className="font-bold">100 minutes lost daily</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-amber-900">
                      That&apos;s <span className="font-bold">8+ hours per week</span> fixing AI output
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-amber-900">
                      Over a year: <span className="font-bold">400+ hours</span> — ten full work weeks
                    </p>
                  </div>
                </div>
              </div>
              <p>
                And that&apos;s just email. Add Slack, documents, presentations...
              </p>
              <p className="text-xl font-semibold text-gray-900">
                The real cost isn&apos;t just time. It&apos;s cognitive load.
              </p>
              <p>
                Constantly switching between &ldquo;what AI wrote&rdquo; and &ldquo;what I would actually say&rdquo; is exhausting.
                It fragments your focus. It slows you down.
              </p>
              <p className="text-xl font-medium text-purple-700">
                You didn&apos;t adopt AI to work harder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Introducing My Voice Twin: Your Digital Twin System
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              <span className="font-semibold text-gray-900">My Voice Twin is a complete methodology for cloning your authentic voice.</span>
              {' '}Not a prompt. Not a template. A <em>system</em>—developed over months of real-world use by a multilingual executive
              who writes across English, Japanese, and French daily.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {/* Stage 1 */}
            <div className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <span className="text-xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Collect Your Voice DNA</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Guided questionnaire identifies your communication contexts</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Templates help you gather the right writing samples</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Works for any language, any context</span>
                </li>
              </ul>
            </div>

            {/* Stage 2 */}
            <div className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <span className="text-xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Extract Your Unique Patterns</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Forensic Linguist prompt analyzes your writing</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Extracts sentence rhythm, punctuation fingerprint, logical structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Identifies culture-specific patterns (keigo, formality levels)</span>
                </li>
              </ul>
            </div>

            {/* Stage 3 */}
            <div className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Generate Your Digital Twin</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Meta-prompt creates two outputs</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Master Voice Guide:</strong> Deep documentation of your style</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Runtime Block:</strong> Optimized instructions for any AI</span>
                </li>
              </ul>
            </div>

            {/* Stage 4 */}
            <div className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <span className="text-xl font-bold text-purple-600">4</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Deploy Anywhere</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Works with ChatGPT, Claude, Gemini—or any LLM</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Auto-detects context: email vs Slack, English vs Japanese</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 mt-0.5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Your voice, every time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
              Before vs After
            </h2>
            <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-red-600">
                      Before My Voice Twin
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-600">
                      After My Voice Twin
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="text-red-500 mr-2">x</span>
                      AI output sounds robotic
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="text-green-500 mr-2">&#10003;</span>
                      Output sounds authentically like you
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">
                      <span className="text-red-500 mr-2">x</span>
                      10+ minutes editing each email
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="text-green-500 mr-2">&#10003;</span>
                      Quick review, minimal edits
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="text-red-500 mr-2">x</span>
                      Different voice across platforms
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="text-green-500 mr-2">&#10003;</span>
                      Consistent voice everywhere
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">
                      <span className="text-red-500 mr-2">x</span>
                      Language switching is jarring
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="text-green-500 mr-2">&#10003;</span>
                      Seamless multilingual output
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="text-red-500 mr-2">x</span>
                      Context blindness (same tone for CEO and team)
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="text-green-500 mr-2">&#10003;</span>
                      Auto-detects audience and adapts
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">
                      <span className="text-red-500 mr-2">x</span>
                      Wasted AI subscription
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="text-green-500 mr-2">&#10003;</span>
                      AI that actually saves time
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What You Get
            </h2>
            <p className="mt-4 text-lg text-gray-600">The Complete My Voice Twin Kit</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Stage 1 Feature */}
            <div className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">&#128203;</span>
                <h3 className="text-xl font-semibold text-gray-900">Stage 1: Golden Corpus Generator</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>&#8226; Context Discovery Questionnaire</li>
                <li>&#8226; Sample Collection Guide (what to gather, where to find it)</li>
                <li>&#8226; Organization Template</li>
                <li>&#8226; Quality Checklist</li>
              </ul>
            </div>

            {/* Stage 2 Feature */}
            <div className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">&#128300;</span>
                <h3 className="text-xl font-semibold text-gray-900">Stage 2: Master Extraction Prompt</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>&#8226; Forensic Linguist analysis prompt</li>
                <li>&#8226; Extracts 6 Voice DNA dimensions</li>
                <li>&#8226; Works for any language combination</li>
              </ul>
            </div>

            {/* Stage 3 Feature */}
            <div className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">&#9881;</span>
                <h3 className="text-xl font-semibold text-gray-900">Stage 3: Universal Meta-Prompt</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>&#8226; Generates your Master Voice Guide (~15,000 words)</li>
                <li>&#8226; Creates your Runtime Execution Block (~5,000 tokens)</li>
                <li>&#8226; Auto-detect protocol included</li>
              </ul>
            </div>

            {/* Stage 4 Feature */}
            <div className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">&#128640;</span>
                <h3 className="text-xl font-semibold text-gray-900">Stage 4: Deployment Guides</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>&#8226; ChatGPT Custom GPT setup (step-by-step)</li>
                <li>&#8226; Claude Project setup</li>
                <li>&#8226; Gemini Gem setup</li>
                <li>&#8226; Manual/API usage guide</li>
                <li>&#8226; Testing & troubleshooting checklist</li>
              </ul>
            </div>
          </div>

          {/* Bonuses */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">&#127873;</span>
              <h3 className="text-xl font-semibold text-gray-900">Bonuses Included</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ul className="space-y-2 text-gray-700">
                <li>&#10003; Real anonymized example corpus</li>
                <li>&#10003; Sample Voice DNA output for reference</li>
              </ul>
              <ul className="space-y-2 text-gray-700">
                <li>&#10003; Iteration workflow guide</li>
                <li>&#10003; Video walkthrough (30 min)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Choose Your Path
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Select the tier that matches your needs
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
            {/* Starter Tier */}
            <PricingCard
              tier="Starter"
              price={49}
              description="For DIY experimenters"
              features={[
                { text: 'All 4 stages (prompts + guides)', included: true },
                { text: 'Basic documentation', included: true },
                { text: 'Video walkthrough', included: false },
                { text: 'Example corpus', included: false },
                { text: 'Email support', included: false },
              ]}
              bestFor="Technical users comfortable with prompts"
              priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER}
              highlighted={false}
            />

            {/* Complete Tier */}
            <PricingCard
              tier="Complete"
              price={99}
              originalPrice={149}
              description="Most Popular - Best Value"
              features={[
                { text: 'All 4 stages (prompts + guides)', included: true },
                { text: 'Comprehensive documentation', included: true },
                { text: '30-minute video walkthrough', included: true },
                { text: 'Anonymized example corpus', included: true },
                { text: 'Sample Voice DNA output', included: true },
                { text: 'Email support (48hr response)', included: true },
              ]}
              bestFor="Professionals who want the full system"
              priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_COMPLETE}
              highlighted={true}
              badge="Most Popular"
            />

            {/* Executive Tier */}
            <PricingCard
              tier="Executive"
              price={249}
              description="For time-constrained leaders"
              features={[
                { text: 'Everything in Complete', included: true },
                { text: 'Async review of your Voice DNA output', included: true },
                { text: 'Personalized recommendations', included: true },
                { text: 'Priority email support', included: true },
                { text: '1 round of refinement feedback', included: true },
              ]}
              bestFor="Executives who want expert review"
              priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_EXECUTIVE}
              highlighted={false}
            />

            {/* Done-For-You Tier */}
            <PricingCard
              tier="Done-For-You"
              price={499}
              description="Hands-off white-glove service"
              features={[
                { text: '30-min voice interview (async or live)', included: true },
                { text: 'We curate your Golden Corpus', included: true },
                { text: 'We run the full extraction', included: true },
                { text: 'Delivered: Complete Voice DNA system', included: true },
                { text: 'Deployed to your platform of choice', included: true },
                { text: '2 rounds of refinement', included: true },
              ]}
              bestFor="Those who want results without the work"
              priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_DONE_FOR_YOU}
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="bg-green-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            14-Day Satisfaction Guarantee
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            If you follow the methodology and don&apos;t feel like your Digital Twin captures your authentic voice,
            email us within 14 days for a full refund. No questions asked. No hoops to jump through.
          </p>
          <p className="mt-4 text-gray-600">
            We&apos;re confident because this system was built from real daily use—not theory.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How is this different from prompt packs?
              </h3>
              <p className="text-gray-600">
                Prompt packs give you generic templates. My Voice Twin gives you a <strong>complete system</strong> to clone
                <em>your specific voice</em>. The output is customized to your sentence rhythm, your transitions, your
                cultural context—not generic &ldquo;professional&rdquo; writing.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do I need technical skills?
              </h3>
              <p className="text-gray-600">
                No. If you can copy-paste and follow instructions, you can use VoiceDNA. The video walkthrough
                shows every step.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Which AI platforms does this work with?
              </h3>
              <p className="text-gray-600">
                All of them. We include specific guides for ChatGPT (Custom GPTs), Claude (Projects), and Gemini (Gems).
                The Runtime Block works with any LLM, including API usage.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How long does setup take?
              </h3>
              <p className="text-gray-600 mb-4">
                Here&apos;s the breakdown:
              </p>
              <ul className="space-y-2 text-gray-600 ml-4">
                <li>&#8226; <strong>Collecting samples:</strong> 1-2 hours (one-time)</li>
                <li>&#8226; <strong>Running extraction:</strong> 30-60 minutes</li>
                <li>&#8226; <strong>Deploying:</strong> 10-15 minutes</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Total: About 3 hours for a system you&apos;ll use daily.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What if I only speak one language?
              </h3>
              <p className="text-gray-600">
                VoiceDNA works great for single-language users too. You&apos;ll get voice consistency across different
                contexts (email vs Slack vs documents) even in one language.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What if it doesn&apos;t work for me?
              </h3>
              <p className="text-gray-600">
                We offer a 14-day satisfaction guarantee. If My Voice Twin doesn&apos;t help you create a Digital Twin
                that sounds like you, email us for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Clone Your Voice?
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            Stop wasting time rewriting AI drafts. Create a Digital Twin that actually sounds like you.
          </p>

          <div className="mt-10 rounded-2xl bg-white/10 p-8 backdrop-blur-sm max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Complete Package — $99</h3>
            <ul className="space-y-3 text-left text-gray-200 mb-8">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Full 4-stage methodology
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                All platform deployment guides
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Video walkthrough
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Example templates
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                14-day guarantee
              </li>
            </ul>
            <a
              href="#pricing"
              className="block w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-xl hover:scale-105"
            >
              Get My Voice Twin Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Trust Badges */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Trust & Security
              </h4>
              <ul className="space-y-3 text-gray-500">
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure checkout via Stripe
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Instant access after purchase
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  14-day money-back guarantee
                </li>
              </ul>
            </div>

            {/* Platform Compatibility */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Works With
              </h4>
              <ul className="space-y-2 text-gray-500">
                <li>ChatGPT (Custom GPTs)</li>
                <li>Claude (Projects)</li>
                <li>Gemini (Gems)</li>
                <li>Any LLM via API</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Support
              </h4>
              <p className="text-gray-500 mb-2">
                Questions? We respond within 48 hours.
              </p>
              <a href="mailto:support@myvoicetwin.io" className="text-purple-400 hover:text-purple-300 transition-colors">
                support@myvoicetwin.io
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} My Voice Twin. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Instant digital download. Start building your Digital Twin today.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
