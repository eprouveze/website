'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient, type VoiceProfile, type VoiceTestContext } from '@/lib/supabase';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  CreditCard,
  FileText,
  ClipboardList,
  Zap,
  Mail,
  MessageSquare,
  FileBarChart,
  Share2,
  Globe,
  Users,
  ChevronDown,
  Rocket,
  Brain,
  Eye,
} from 'lucide-react';

// Types
interface PageData {
  questionnaireCompleted: boolean;
  samplesCount: number;
  hasPaid: boolean;
  voiceProfile: VoiceProfile | null;
  languagesDetected: string[];
  corpusAnalysis: CorpusAnalysis | null;
}

interface TestFormData {
  message: string;
  context: VoiceTestContext;
  audience: string;
  language: string;
}

interface TestResult {
  twinResponse: string;
  genericResponse: string | null;
}

interface CorpusAnalysis {
  coverage: {
    totalSamples: number;
    languages: string[];
    languageNames: string[];
    contexts: string[];
    sampleTypes: string[];
  };
  overallStyle: string;
  contextNotes: {
    context: string;
    note: string;
  }[];
  quirks: string[];
  corpusQuality: 'excellent' | 'good' | 'adequate';
}

type PageState = 'not_ready' | 'analyzing' | 'ready_with_analysis' | 'ready_not_paid' | 'generating' | 'generated';

// Constants
const MIN_SAMPLES = 5;

const CONTEXTS: { value: VoiceTestContext; label: string; icon: typeof Mail }[] = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'slack', label: 'Slack/Teams', icon: MessageSquare },
  { value: 'report', label: 'Report/Document', icon: FileBarChart },
  { value: 'social', label: 'Social Post', icon: Share2 },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
];

const TARGET_PLATFORMS = [
  { value: 'chatgpt', label: 'ChatGPT', icon: '🤖' },
  { value: 'claude', label: 'Claude', icon: '🟠' },
  { value: 'gemini', label: 'Gemini', icon: '✨' },
  { value: 'other', label: 'Other LLM', icon: '🔧' },
];

const GENERATION_STEPS = [
  { label: 'Formatting corpus...', duration: 3000 },
  { label: 'Analyzing voice patterns...', duration: 8000 },
  { label: 'Extracting unique characteristics...', duration: 6000 },
  { label: 'Generating master prompt...', duration: 8000 },
  { label: 'Finalizing voice profile...', duration: 5000 },
];

// Helper functions
function getLanguageName(code: string): string {
  return LANGUAGES.find((l) => l.value === code)?.label || code.toUpperCase();
}

// Components
function RequirementsChecklist({
  questionnaireCompleted,
  samplesCount,
}: {
  questionnaireCompleted: boolean;
  samplesCount: number;
}) {
  const hasSamples = samplesCount >= MIN_SAMPLES;

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Almost There!
        </h2>
        <p className="text-slate-600">
          Complete these steps to generate your Voice Twin
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
        {/* Questionnaire */}
        <div className="p-5 flex items-center gap-4">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              questionnaireCompleted
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {questionnaireCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <ClipboardList className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Complete Questionnaire</h3>
            <p className="text-sm text-slate-500">
              {questionnaireCompleted
                ? 'Voice profile questionnaire completed'
                : 'Tell us about your communication style'}
            </p>
          </div>
          {!questionnaireCompleted && (
            <Link
              href="/dashboard/questionnaire"
              className="flex-shrink-0 px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
            >
              Start
            </Link>
          )}
        </div>

        {/* Samples */}
        <div className="p-5 flex items-center gap-4">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              hasSamples
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {hasSamples ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <FileText className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Add Writing Samples</h3>
            <p className="text-sm text-slate-500">
              {hasSamples
                ? `${samplesCount} samples collected`
                : `${samplesCount} of ${MIN_SAMPLES} minimum samples`}
            </p>
          </div>
          {!hasSamples && (
            <Link
              href="/dashboard/samples"
              className="flex-shrink-0 px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
            >
              Add Samples
            </Link>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Need help? Check out our{' '}
          <a href="#" className="text-brand-600 hover:underline">
            setup guide
          </a>
        </p>
      </div>
    </div>
  );
}

function AnalyzingState() {
  return (
    <div className="max-w-xl mx-auto text-center">
      {/* Animated Icon */}
      <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 animate-pulse opacity-30" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 animate-pulse opacity-50" />
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 flex items-center justify-center">
          <Brain className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Analyzing Your Corpus...
      </h2>
      <p className="text-slate-600 mb-8">
        We&apos;re taking a quick look at your writing samples to show you what we found.
      </p>

      {/* Loading Steps */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 text-left">
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-brand-500 flex-shrink-0 animate-spin" />
            <span className="text-sm text-slate-900">Reading your writing samples...</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex-shrink-0" />
            <span className="text-sm text-slate-400">Identifying patterns and style...</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex-shrink-0" />
            <span className="text-sm text-slate-400">Generating preview...</span>
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        This usually takes just a few seconds
      </p>
    </div>
  );
}

function CorpusPreviewSection({
  analysis,
  onCheckout,
  isLoading,
}: {
  analysis: CorpusAnalysis;
  onCheckout: (tier: PricingTier) => void;
  isLoading: boolean;
}) {
  const qualityMessages = {
    excellent: 'Excellent corpus!',
    good: 'Great corpus!',
    adequate: 'Good start!',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Analysis Preview Card */}
      <div className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl border border-brand-200 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-200 bg-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {qualityMessages[analysis.corpusQuality]} Here&apos;s what I see:
              </h3>
              <p className="text-sm text-slate-600">
                A preview of your Voice Twin based on {analysis.coverage.totalSamples} samples
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Coverage Stats */}
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
            <p className="text-slate-700">
              <span className="font-semibold">{analysis.coverage.totalSamples} samples</span>
              {analysis.coverage.languageNames.length > 0 && (
                <> across <span className="font-semibold">{analysis.coverage.languageNames.length} language{analysis.coverage.languageNames.length > 1 ? 's' : ''}</span> ({analysis.coverage.languageNames.join(', ')})</>
              )}
            </p>
          </div>

          {/* Overall Style */}
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
            <p className="text-slate-700">
              Your overall style is <span className="font-semibold text-brand-700">{analysis.overallStyle}</span>
            </p>
          </div>

          {/* Context-specific Notes */}
          {analysis.contextNotes.map((note, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
              <p className="text-slate-700">
                <span className="capitalize">{note.context}</span> is <span className="font-semibold">{note.note}</span>
              </p>
            </div>
          ))}

          {/* Quirks */}
          {analysis.quirks.map((quirk, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-500 mt-2 flex-shrink-0" />
              <p className="text-slate-700 italic">{quirk}</p>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-white/50 border-t border-brand-200">
          <p className="text-center text-slate-700 font-medium">
            Ready to generate your full Voice Twin?
          </p>
        </div>
      </div>

      {/* Pricing Section Below */}
      <UnlockSectionWithoutHeader onCheckout={onCheckout} isLoading={isLoading} />
    </div>
  );
}

function UnlockSectionWithoutHeader({
  onCheckout,
  isLoading,
}: {
  onCheckout: (tier: PricingTier) => void;
  isLoading: boolean;
}) {
  const [selectedTier, setSelectedTier] = useState<PricingTier>('pro');
  const tier = PRICING_TIERS_UI[selectedTier];

  return (
    <>
      {/* Tier Selection Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {(Object.keys(PRICING_TIERS_UI) as PricingTier[]).map((tierKey) => {
          const tierData = PRICING_TIERS_UI[tierKey];
          const isSelected = selectedTier === tierKey;
          const isPopular = 'popular' in tierData && tierData.popular;

          return (
            <button
              key={tierKey}
              onClick={() => setSelectedTier(tierKey)}
              className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-brand-500 bg-brand-50 shadow-lg'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-brand-500 to-accent-500 text-white rounded-full">
                  Most Popular
                </span>
              )}
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold ${isSelected ? 'text-brand-700' : 'text-slate-900'}`}>
                  {tierData.name}
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-brand-500 bg-brand-500' : 'border-slate-300'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-2xl font-bold ${isSelected ? 'text-brand-700' : 'text-slate-900'}`}>
                  ${tierData.price}
                </span>
                <span className="text-sm text-slate-500">one-time</span>
              </div>
              <p className="text-sm text-slate-500">{tierData.description}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        {/* What you get - Dynamic based on selected tier */}
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            What You&apos;ll Get with {tier.name}
          </h3>
          <ul className="space-y-3">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                {feature.included ? (
                  <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    'highlight' in feature && feature.highlight ? 'text-brand-500' : 'text-emerald-500'
                  }`} />
                ) : (
                  <XCircle className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                )}
                <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
                  {feature.text}
                  {'highlight' in feature && feature.highlight && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-brand-100 text-brand-700 rounded-full">
                      Included
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {/* Subscription discount notice for Pro tier */}
          {selectedTier === 'pro' && (
            <div className="mt-6 p-4 bg-brand-50 rounded-xl border border-brand-200">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-800">
                    First Year Subscription Discount
                  </p>
                  <p className="text-sm text-brand-700 mt-1">
                    Pro tier members are eligible for a $10 first year subscription to keep your Voice Twin updated with new features.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-slate-50 to-brand-50 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">${tier.price}</span>
                <span className="text-sm text-slate-500">one-time</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                14-day satisfaction guarantee
              </p>
            </div>
            <button
              onClick={() => onCheckout(selectedTier)}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold shadow-brand hover:shadow-brand-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Unlock {tier.name}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Secure payment via Stripe
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Instant access after payment
        </div>
      </div>
    </>
  );
}

// Pricing tiers configuration for UI
const PRICING_TIERS_UI = {
  starter: {
    name: 'Starter',
    price: 49,
    description: 'Perfect for getting started',
    features: [
      { text: 'Personalized Voice Profile', included: true },
      { text: '1 language support', included: true },
      { text: '3 matrix sections', included: true },
      { text: '1 regeneration', included: true },
      { text: 'Deploy to any LLM', included: true },
      { text: 'Unlimited languages', included: false },
      { text: 'Subscription discount', included: false },
      { text: '1 year subscription', included: false },
      { text: 'Audio credits', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  pro: {
    name: 'Pro',
    price: 99,
    description: 'Most popular for professionals',
    popular: true,
    features: [
      { text: 'Personalized Voice Profile', included: true },
      { text: 'Unlimited languages', included: true },
      { text: 'Unlimited matrix sections', included: true },
      { text: '1 regeneration', included: true },
      { text: 'Deploy to any LLM', included: true },
      { text: '$10 first year subscription', included: true, highlight: true },
      { text: '1 year subscription', included: false },
      { text: 'Audio credits', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  executive: {
    name: 'Executive',
    price: 249,
    description: 'Everything you need',
    features: [
      { text: 'Personalized Voice Profile', included: true },
      { text: 'Unlimited languages', included: true },
      { text: 'Unlimited matrix sections', included: true },
      { text: '1 regeneration', included: true },
      { text: 'Deploy to any LLM', included: true },
      { text: '1 year subscription included', included: true, highlight: true },
      { text: 'Audio credits included', included: true, highlight: true },
      { text: 'Priority support', included: true, highlight: true },
    ],
  },
} as const;

type PricingTier = keyof typeof PRICING_TIERS_UI;

function UnlockSection({
  onCheckout,
  isLoading,
}: {
  onCheckout: (tier: PricingTier) => void;
  isLoading: boolean;
}) {
  const [selectedTier, setSelectedTier] = useState<PricingTier>('pro');
  const tier = PRICING_TIERS_UI[selectedTier];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Unlock Your Voice Twin
        </h2>
        <p className="text-slate-600">
          Your samples are ready! Choose a plan to generate your personalized Voice Twin.
        </p>
      </div>

      {/* Tier Selection Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {(Object.keys(PRICING_TIERS_UI) as PricingTier[]).map((tierKey) => {
          const tierData = PRICING_TIERS_UI[tierKey];
          const isSelected = selectedTier === tierKey;
          const isPopular = 'popular' in tierData && tierData.popular;

          return (
            <button
              key={tierKey}
              onClick={() => setSelectedTier(tierKey)}
              className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-brand-500 bg-brand-50 shadow-lg'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-brand-500 to-accent-500 text-white rounded-full">
                  Most Popular
                </span>
              )}
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold ${isSelected ? 'text-brand-700' : 'text-slate-900'}`}>
                  {tierData.name}
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-brand-500 bg-brand-500' : 'border-slate-300'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-2xl font-bold ${isSelected ? 'text-brand-700' : 'text-slate-900'}`}>
                  ${tierData.price}
                </span>
                <span className="text-sm text-slate-500">one-time</span>
              </div>
              <p className="text-sm text-slate-500">{tierData.description}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        {/* What you get - Dynamic based on selected tier */}
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            What You&apos;ll Get with {tier.name}
          </h3>
          <ul className="space-y-3">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                {feature.included ? (
                  <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    'highlight' in feature && feature.highlight ? 'text-brand-500' : 'text-emerald-500'
                  }`} />
                ) : (
                  <XCircle className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                )}
                <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
                  {feature.text}
                  {'highlight' in feature && feature.highlight && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-brand-100 text-brand-700 rounded-full">
                      Included
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {/* Subscription discount notice for Pro tier */}
          {selectedTier === 'pro' && (
            <div className="mt-6 p-4 bg-brand-50 rounded-xl border border-brand-200">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-800">
                    First Year Subscription Discount
                  </p>
                  <p className="text-sm text-brand-700 mt-1">
                    Pro tier members are eligible for a $10 first year subscription to keep your Voice Twin updated with new features.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-slate-50 to-brand-50 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">${tier.price}</span>
                <span className="text-sm text-slate-500">one-time</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                14-day satisfaction guarantee
              </p>
            </div>
            <button
              onClick={() => onCheckout(selectedTier)}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold shadow-brand hover:shadow-brand-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Unlock {tier.name}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Secure payment via Stripe
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Instant access after payment
        </div>
      </div>
    </div>
  );
}

function GeneratingState({
  currentStep,
  progress,
}: {
  currentStep: number;
  progress: number;
}) {
  return (
    <div className="max-w-xl mx-auto text-center">
      {/* Animated Icon */}
      <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 animate-pulse opacity-30" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 animate-pulse opacity-50 animation-delay-200" />
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Generating Your Voice Twin
      </h2>
      <p className="text-slate-600 mb-8">
        This usually takes about 30 seconds. Please don&apos;t close this page.
      </p>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-slate-500">
          <span>Processing...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 text-left">
        <ul className="space-y-3">
          {GENERATION_STEPS.map((step, index) => (
            <li key={index} className="flex items-center gap-3">
              {index < currentStep ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : index === currentStep ? (
                <Loader2 className="w-5 h-5 text-brand-500 flex-shrink-0 animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex-shrink-0" />
              )}
              <span
                className={`text-sm ${
                  index <= currentStep ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Estimated time remaining: ~{Math.max(0, Math.round((100 - progress) * 0.3))} seconds
      </p>
    </div>
  );
}

function TestingInterface({
  voiceProfile,
  languagesDetected,
}: {
  voiceProfile: VoiceProfile;
  languagesDetected: string[];
}) {
  const [formData, setFormData] = useState<TestFormData>({
    message: '',
    context: 'email',
    audience: '',
    language: languagesDetected[0] || 'en',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextDropdownOpen, setContextDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [targetPlatform, setTargetPlatform] = useState('chatgpt');
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: formData.message,
          context: formData.context,
          audience: formData.audience || undefined,
          language: formData.language,
          includeComparison: showComparison,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate response');
      }

      setResult({
        twinResponse: data.withTwin,
        genericResponse: data.withoutTwin || null,
      });
    } catch (err) {
      console.error('Error testing voice:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.twinResponse) {
      await navigator.clipboard.writeText(result.twinResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTryAnother = () => {
    setResult(null);
    setFormData({ ...formData, message: '', audience: '' });
  };

  const selectedContext = CONTEXTS.find((c) => c.value === formData.context);
  const availableLanguages = languagesDetected.length > 0
    ? LANGUAGES.filter((l) => languagesDetected.includes(l.value))
    : LANGUAGES;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Your Voice Twin is Ready!
        </h2>
        <p className="text-slate-600">
          Test it below or deploy it to your favorite AI tools
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-900">Test Your Voice Twin</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Message Textarea */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                Write a sample message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="E.g., Write an email to my team about the Q4 launch timeline..."
                rows={5}
                className="input-field resize-none"
              />
            </div>

            {/* Context & Language Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Context Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Context
                </label>
                <button
                  type="button"
                  onClick={() => setContextDropdownOpen(!contextDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-300 rounded-lg text-left hover:border-slate-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {selectedContext && <selectedContext.icon className="w-4 h-4 text-slate-500" />}
                    <span className="text-slate-900">{selectedContext?.label}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {contextDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setContextDropdownOpen(false)}
                    />
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                      {CONTEXTS.map((context) => (
                        <button
                          key={context.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, context: context.value });
                            setContextDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-slate-50 ${
                            formData.context === context.value
                              ? 'bg-brand-50 text-brand-700'
                              : 'text-slate-700'
                          }`}
                        >
                          <context.icon className="w-4 h-4" />
                          {context.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Language Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Language
                </label>
                <button
                  type="button"
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-300 rounded-lg text-left hover:border-slate-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-900">
                      {getLanguageName(formData.language)}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {languageDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setLanguageDropdownOpen(false)}
                    />
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
                      {availableLanguages.map((lang) => (
                        <button
                          key={lang.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, language: lang.value });
                            setLanguageDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-slate-50 ${
                            formData.language === lang.value
                              ? 'bg-brand-50 text-brand-700'
                              : 'text-slate-700'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Target Platform Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Target Platform
              </label>
              <button
                type="button"
                onClick={() => setPlatformDropdownOpen(!platformDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-300 rounded-lg text-left hover:border-slate-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {TARGET_PLATFORMS.find((p) => p.value === targetPlatform)?.icon}
                  </span>
                  <span className="text-slate-900">
                    {TARGET_PLATFORMS.find((p) => p.value === targetPlatform)?.label}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {platformDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setPlatformDropdownOpen(false)}
                  />
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                    {TARGET_PLATFORMS.map((platform) => (
                      <button
                        key={platform.value}
                        type="button"
                        onClick={() => {
                          setTargetPlatform(platform.value);
                          setPlatformDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-slate-50 ${
                          targetPlatform === platform.value
                            ? 'bg-brand-50 text-brand-700'
                            : 'text-slate-700'
                        }`}
                      >
                        <span className="text-base">{platform.icon}</span>
                        {platform.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <p className="mt-1.5 text-xs text-slate-500">
                Testing uses Claude. Results may vary slightly on other platforms.
              </p>
            </div>

            {/* Audience */}
            <div>
              <label htmlFor="audience" className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Who is this for?
                </div>
              </label>
              <input
                type="text"
                id="audience"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                placeholder="E.g., My direct reports, CEO, clients..."
                className="input-field"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.message.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold shadow-brand hover:shadow-brand-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Generate Response
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Response</h3>
            {result && (
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                {showComparison ? 'Single View' : 'Compare with Generic'}
              </button>
            )}
          </div>

          <div className="p-6 min-h-[400px] flex flex-col">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 mb-4">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!result && !isLoading && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
                <Sparkles className="w-12 h-12 mb-4 opacity-30" />
                <p>Your response will appear here</p>
              </div>
            )}

            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
                <p className="text-slate-500">Generating your response...</p>
              </div>
            )}

            {result && !showComparison && (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-brand-500" />
                    <span className="text-sm font-semibold text-brand-700">With Your Voice Twin</span>
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {result.twinResponse}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Response
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleTryAnother}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Another
                  </button>
                </div>
              </div>
            )}

            {result && showComparison && (
              <div className="flex-1 flex flex-col gap-4">
                {/* Twin Response */}
                <div className="flex-1 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">With Your Voice Twin</span>
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {result.twinResponse}
                  </p>
                </div>

                {/* Generic Response */}
                <div className="flex-1 p-4 bg-slate-100 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-600">Generic AI</span>
                  </div>
                  <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">
                    {result.genericResponse || 'Generic comparison not available'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Twin Response
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleTryAnother}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deploy CTA */}
      <div className="mt-8 bg-gradient-to-r from-brand-600 to-accent-600 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Ready to Deploy?</h3>
            <p className="text-brand-100">
              Set up your Voice Twin on ChatGPT, Claude, Gemini, or any AI platform
            </p>
          </div>
          <Link
            href="/dashboard/deploy"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-semibold hover:bg-brand-50 transition-colors shrink-0"
          >
            Go to Deploy
            <Rocket className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function GeneratePage() {
  const [data, setData] = useState<PageData>({
    questionnaireCompleted: false,
    samplesCount: 0,
    hasPaid: false,
    voiceProfile: null,
    languagesDetected: [],
    corpusAnalysis: null,
  });
  const [loading, setLoading] = useState(true);
  const [pageState, setPageState] = useState<PageState>('not_ready');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);

  const supabase = useMemo(() => createClient(), []);

  // Fetch corpus analysis
  const fetchCorpusAnalysis = useCallback(async () => {
    try {
      const response = await fetch('/api/analyze-corpus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to analyze corpus');
      }

      const result = await response.json();
      setData((prev) => ({ ...prev, corpusAnalysis: result.analysis }));
      setPageState('ready_with_analysis');
    } catch (error) {
      console.error('Error analyzing corpus:', error);
      // Fallback to showing payment without analysis
      setPageState('ready_not_paid');
    }
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // Fetch all data in parallel
      const [questionnaireResult, samplesResult, purchasesResult, voiceProfileResult] = await Promise.all([
        supabase.from('questionnaire_responses').select('completed_at').eq('user_id', userId).single(),
        supabase.from('samples').select('id, language').eq('user_id', userId),
        supabase.from('purchases').select('id, status').eq('user_id', userId).eq('status', 'completed'),
        supabase.from('voice_profiles').select('*').eq('user_id', userId).eq('is_active', true).single(),
      ]);

      // Extract unique languages
      const languages = new Set<string>();
      const samplesData = samplesResult.data as Array<{ id: string; language: string }> | null;
      if (samplesData) {
        samplesData.forEach((sample) => {
          if (sample.language) languages.add(sample.language);
        });
      }

      const questionnaireData = questionnaireResult.data as { completed_at: string | null } | null;
      const purchasesData = purchasesResult.data as Array<{ id: string; status: string }> | null;
      const voiceProfileData = voiceProfileResult.data as VoiceProfile | null;

      const newData: PageData = {
        questionnaireCompleted: !!questionnaireData?.completed_at,
        samplesCount: samplesData?.length || 0,
        hasPaid: !!(purchasesData && purchasesData.length > 0),
        voiceProfile: voiceProfileData,
        languagesDetected: Array.from(languages),
        corpusAnalysis: null,
      };

      setData(newData);

      // Determine page state
      if (newData.voiceProfile) {
        setPageState('generated');
      } else if (!newData.questionnaireCompleted || newData.samplesCount < MIN_SAMPLES) {
        setPageState('not_ready');
      } else if (!newData.hasPaid) {
        // Ready but hasn't paid - start corpus analysis
        setPageState('analyzing');
      } else {
        // Has paid but no profile - trigger generation
        setPageState('generating');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Start generation process
  const startGeneration = useCallback(async () => {
    try {
      // Simulate generation progress while API processes
      let currentStep = 0;
      let totalDuration = 0;
      const totalTime = GENERATION_STEPS.reduce((sum, step) => sum + step.duration, 0);

      // Start API call in parallel with animation
      const apiPromise = fetch('/api/generate-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      for (const step of GENERATION_STEPS) {
        setGenerationStep(currentStep);

        // Animate progress during this step
        const startProgress = (totalDuration / totalTime) * 100;
        const endProgress = ((totalDuration + step.duration) / totalTime) * 100;

        await new Promise<void>((resolve) => {
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const stepProgress = Math.min(elapsed / step.duration, 1);
            setGenerationProgress(startProgress + (endProgress - startProgress) * stepProgress);

            if (elapsed < step.duration) {
              requestAnimationFrame(animate);
            } else {
              resolve();
            }
          };
          requestAnimationFrame(animate);
        });

        totalDuration += step.duration;
        currentStep++;
      }

      // Wait for API to complete
      const response = await apiPromise;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate profile');
      }

      // Refetch the voice profile from the database
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: voiceProfileData } = await supabase
          .from('voice_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .single();

        if (voiceProfileData) {
          setData((prev) => ({ ...prev, voiceProfile: voiceProfileData as VoiceProfile }));
        }
      }

      setPageState('generated');
    } catch (error) {
      console.error('Error generating profile:', error);
      // Reset to payment state on error
      setPageState('ready_not_paid');
    }
  }, [supabase]);

  // Handle checkout
  const handleCheckout = async (tier: PricingTier) => {
    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: tier,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      setIsCheckingOut(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Start corpus analysis when state changes to 'analyzing'
  useEffect(() => {
    if (pageState === 'analyzing') {
      fetchCorpusAnalysis();
    }
  }, [pageState, fetchCorpusAnalysis]);

  // Start generation when state changes to 'generating'
  useEffect(() => {
    if (pageState === 'generating') {
      startGeneration();
    }
  }, [pageState, startGeneration]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Page Header */}
      {pageState !== 'generating' && pageState !== 'analyzing' && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {pageState === 'generated' ? 'Test Your Voice Twin' : 'Generate Your Voice Twin'}
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            {pageState === 'generated'
              ? 'Try out your Voice Twin and see how it captures your unique style'
              : 'Create an AI that writes exactly like you'}
          </p>
        </div>
      )}

      {/* Content based on state */}
      {pageState === 'not_ready' && (
        <RequirementsChecklist
          questionnaireCompleted={data.questionnaireCompleted}
          samplesCount={data.samplesCount}
        />
      )}

      {pageState === 'analyzing' && (
        <AnalyzingState />
      )}

      {pageState === 'ready_with_analysis' && data.corpusAnalysis && (
        <CorpusPreviewSection
          analysis={data.corpusAnalysis}
          onCheckout={handleCheckout}
          isLoading={isCheckingOut}
        />
      )}

      {pageState === 'ready_not_paid' && (
        <UnlockSection onCheckout={handleCheckout} isLoading={isCheckingOut} />
      )}

      {pageState === 'generating' && (
        <GeneratingState currentStep={generationStep} progress={generationProgress} />
      )}

      {pageState === 'generated' && data.voiceProfile && (
        <TestingInterface
          voiceProfile={data.voiceProfile}
          languagesDetected={data.languagesDetected}
        />
      )}
    </div>
  );
}
