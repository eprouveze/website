'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient, type VoiceProfile } from '@/lib/supabase';
import {
  Copy,
  Check,
  Download,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Calendar,
  FileText,
  Globe,
  Hash,
  RefreshCw,
  Edit3,
  Beaker,
  Sparkles,
  ExternalLink,
  Code,
  Crown,
  Zap,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

// Platform icons as simple components
const ChatGPTIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
  </svg>
);

const ClaudeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-2-13v10l7-5-7-5z" />
  </svg>
);

const GeminiIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

// Platform configuration
type PlatformId = 'chatgpt' | 'claude' | 'gemini' | 'api';

interface PlatformConfig {
  id: PlatformId;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  hint: string;
  externalUrl?: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    subtitle: 'Custom GPT',
    icon: <ChatGPTIcon />,
    hint: 'Paste this prompt into the "Instructions" field when creating your Custom GPT.',
    externalUrl: 'https://chat.openai.com/gpts/editor',
  },
  {
    id: 'claude',
    name: 'Claude',
    subtitle: 'Projects',
    icon: <ClaudeIcon />,
    hint: 'Add this prompt as "Project Instructions" in your Claude Project settings.',
    externalUrl: 'https://claude.ai',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    subtitle: 'Gems',
    icon: <GeminiIcon />,
    hint: 'Use this prompt in the "Instructions" field when creating your Gem.',
    externalUrl: 'https://gemini.google.com',
  },
  {
    id: 'api',
    name: 'API/Other',
    subtitle: 'Developer Integration',
    icon: <Code className="w-5 h-5" />,
    hint: 'Use this prompt as the system message in your API calls.',
  },
];

interface ProfileStats {
  generatedAt: string;
  samplesAnalyzed: number;
  languages: string[];
  version: number;
  tokenCount: number;
}

interface SubscriptionInfo {
  isSubscribed: boolean;
  regenerationsRemaining: number;
  userTier: string | null;
}

// Accordion component for platform guides
function PlatformAccordion({
  title,
  icon,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
            {icon}
          </div>
          <span className="font-semibold text-slate-900">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[2000px]' : 'max-h-0'
        }`}
      >
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}

// Code block component
function CodeBlock({
  code,
  language = 'text',
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
        <code className="text-sm font-mono text-slate-100 whitespace-pre-wrap break-words">
          {code}
        </code>
      </pre>
      {language !== 'text' && (
        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-1 rounded text-xs font-mono text-slate-500 bg-slate-800">
            {language}
          </span>
        </div>
      )}
    </div>
  );
}

// Step component for platform guides
function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-semibold">
        {number}
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-slate-900 font-medium">{title}</p>
        {description && (
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

// Platform selection card
function PlatformCard({
  platform,
  isSelected,
  onToggle,
}: {
  platform: PlatformConfig;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? 'border-brand-500 bg-brand-50 shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 className="w-5 h-5 text-brand-600" />
        </div>
      )}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
          isSelected ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-600'
        }`}
      >
        {platform.icon}
      </div>
      <span className="font-semibold text-slate-900">{platform.name}</span>
      <span className="text-xs text-slate-500">{platform.subtitle}</span>
    </button>
  );
}

// Language name helper
function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ar: 'Arabic',
    ru: 'Russian',
    nl: 'Dutch',
  };
  return languages[code] || code.toUpperCase();
}

// Format date helper
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Estimate token count (rough approximation: ~4 chars per token)
function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

export default function DeployPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    isSubscribed: false,
    regenerationsRemaining: 0,
    userTier: null,
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [languages, setLanguages] = useState<string[]>([]);

  // Platform selection state
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [showPromptSection, setShowPromptSection] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Fetch voice profile and related data
  const fetchData = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const userId = session.user.id;

      // Fetch voice profile
      const { data: profileData, error: profileError } = await supabase
        .from('voice_profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      // If no voice profile exists, redirect to generate page
      if (profileError || !profileData) {
        router.push('/dashboard/generate');
        return;
      }

      const profile = profileData as unknown as VoiceProfile;
      setVoiceProfile(profile);

      // Fetch samples and purchases in parallel
      const [samplesResult, purchasesResult] = await Promise.all([
        supabase
          .from('samples')
          .select('id, language')
          .eq('user_id', userId),
        supabase
          .from('purchases')
          .select('id, status, product')
          .eq('user_id', userId)
          .eq('status', 'completed'),
      ]);

      // Extract unique languages
      const samplesData = (samplesResult.data || []) as Array<{ id: string; language: string }>;
      const uniqueLanguages = new Set<string>();
      if (samplesData) {
        samplesData.forEach((sample) => {
          if (sample.language) {
            uniqueLanguages.add(sample.language);
          }
        });
      }
      setLanguages(Array.from(uniqueLanguages));

      // Calculate profile stats
      const tokenCount = profile.master_prompt
        ? estimateTokenCount(profile.master_prompt)
        : 0;

      setProfileStats({
        generatedAt: profile.generated_at,
        samplesAnalyzed: profile.samples_analyzed || 0,
        languages: Array.from(uniqueLanguages),
        version: profile.version || 1,
        tokenCount,
      });

      // Check subscription status and user tier
      const purchasesData = (purchasesResult.data || []) as Array<{
        id: string;
        status: string;
        product: string;
      }>;
      const hasSubscription = purchasesData.length > 0;

      // Determine user tier (pro tiers include subscription benefits)
      const proTiers = ['complete', 'executive', 'done-for-you'];
      const userPurchase = purchasesData.find(p => proTiers.includes(p.product));
      const userTier = userPurchase?.product || (purchasesData[0]?.product || null);

      setSubscriptionInfo({
        isSubscribed: !!hasSubscription,
        regenerationsRemaining: hasSubscription ? 3 : 0,
        userTier,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle platform selection
  const togglePlatform = (platformId: PlatformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  // Handle continue to prompt section
  const handleContinueToPrompt = () => {
    if (selectedPlatforms.length > 0) {
      setShowPromptSection(true);
      // Auto-open the first selected platform's accordion
      setOpenAccordion(selectedPlatforms[0]);
    }
  };

  // Copy to clipboard handler
  const handleCopyPrompt = async () => {
    if (!voiceProfile?.master_prompt) return;
    await navigator.clipboard.writeText(voiceProfile.master_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download as .txt
  const handleDownloadTxt = () => {
    if (!voiceProfile?.master_prompt) return;

    const platformNames = selectedPlatforms
      .map((id) => PLATFORMS.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const content = `MY VOICE TWIN - MASTER PROMPT
Version: ${profileStats?.version || 1}
Generated: ${profileStats?.generatedAt ? formatDate(profileStats.generatedAt) : 'Unknown'}
Target Platforms: ${platformNames || 'All Platforms'}

================================================================================

${voiceProfile.master_prompt}

================================================================================

QUICK SETUP TIPS:
${selectedPlatforms.includes('chatgpt') ? '- ChatGPT: Paste into "Instructions" field in Custom GPT editor\n' : ''}${selectedPlatforms.includes('claude') ? '- Claude: Add as "Project Instructions" in your Project settings\n' : ''}${selectedPlatforms.includes('gemini') ? '- Gemini: Use in "Instructions" field when creating a Gem\n' : ''}${selectedPlatforms.includes('api') ? '- API: Use as system message in your API calls\n' : ''}
Generated by My Voice Twin - myvoicetwin.com
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-profile-v${profileStats?.version || 1}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download as .md
  const handleDownloadMd = () => {
    if (!voiceProfile?.master_prompt) return;

    const platformNames = selectedPlatforms
      .map((id) => PLATFORMS.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const mdContent = `# My Voice Twin - Master Prompt

## Voice Profile v${profileStats?.version || 1}

| Property | Value |
|----------|-------|
| Generated | ${profileStats?.generatedAt ? formatDate(profileStats.generatedAt) : 'Unknown'} |
| Samples Analyzed | ${profileStats?.samplesAnalyzed || 0} |
| Languages | ${profileStats?.languages.map(getLanguageName).join(', ') || 'N/A'} |
| Target Platforms | ${platformNames || 'All Platforms'} |

---

## Master Prompt

\`\`\`
${voiceProfile.master_prompt}
\`\`\`

---

## Quick Setup Guide

${selectedPlatforms.includes('chatgpt') ? `### ChatGPT (Custom GPT)
1. Go to [chat.openai.com](https://chat.openai.com)
2. Navigate to Explore GPTs > Create
3. Paste this prompt into the "Instructions" field
4. Save and test your Custom GPT

` : ''}${selectedPlatforms.includes('claude') ? `### Claude (Projects)
1. Go to [claude.ai](https://claude.ai)
2. Create a new Project
3. Add this prompt as "Project Instructions"
4. Start chatting with your Voice Twin

` : ''}${selectedPlatforms.includes('gemini') ? `### Gemini (Gems)
1. Go to [gemini.google.com](https://gemini.google.com)
2. Click on Gems > New Gem
3. Paste this prompt into the "Instructions" field
4. Save and test your Gem

` : ''}${selectedPlatforms.includes('api') ? `### API Usage
Use this prompt as the \`system\` message in your API calls.

` : ''}---

*Generated by [My Voice Twin](https://myvoicetwin.com)*
`;
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-profile-v${profileStats?.version || 1}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Toggle accordion
  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  // Handle subscription checkout
  const handleSubscriptionCheckout = async () => {
    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'complete',
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

  // Check if user has a pro tier (for pricing display)
  const isProUser = subscriptionInfo.userTier &&
    ['complete', 'executive', 'done-for-you'].includes(subscriptionInfo.userTier);

  // API code snippets
  const openaiSnippet = `import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    {
      role: 'system',
      content: \`${voiceProfile?.master_prompt?.slice(0, 100)}...\`
    },
    {
      role: 'user',
      content: 'Your message here'
    }
  ],
});

console.log(response.choices[0].message.content);`;

  const claudeSnippet = `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.messages.create({
  model: 'claude-3-opus-20240229',
  max_tokens: 1024,
  system: \`${voiceProfile?.master_prompt?.slice(0, 100)}...\`,
  messages: [
    {
      role: 'user',
      content: 'Your message here'
    }
  ],
});

console.log(response.content[0].text);`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading your voice profile...</p>
        </div>
      </div>
    );
  }

  if (!voiceProfile || !voiceProfile.master_prompt) {
    return null; // Will redirect in useEffect
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Deploy Your Voice Twin</h1>
            <p className="text-slate-600">
              Your voice profile is ready. Choose where you want to use it.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Platform Selection */}
          {!showPromptSection && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Select Your Platforms</h2>
                    <p className="text-sm text-slate-500">Choose where you want to deploy your Voice Twin</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {PLATFORMS.map((platform) => (
                    <PlatformCard
                      key={platform.id}
                      platform={platform}
                      isSelected={selectedPlatforms.includes(platform.id)}
                      onToggle={() => togglePlatform(platform.id)}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500">
                    {selectedPlatforms.length === 0
                      ? 'Select at least one platform to continue'
                      : `${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''} selected`}
                  </p>
                  <button
                    onClick={handleContinueToPrompt}
                    disabled={selectedPlatforms.length === 0}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                      selectedPlatforms.length > 0
                        ? 'bg-brand-600 text-white hover:bg-brand-700'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Step 2: Master Prompt & Output Options (shown after platform selection) */}
          {showPromptSection && (
            <>
              {/* Platform Selection Summary */}
              <div className="bg-brand-50 border border-brand-100 rounded-xl px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-600" />
                  <span className="text-slate-700">
                    Deploying to:{' '}
                    <span className="font-semibold text-slate-900">
                      {selectedPlatforms
                        .map((id) => PLATFORMS.find((p) => p.id === id)?.name)
                        .join(', ')}
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => setShowPromptSection(false)}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                  Change
                </button>
              </div>

              {/* Platform-specific hint */}
              {selectedPlatforms.length === 1 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
                  <p className="text-sm text-amber-800">
                    <strong>Tip:</strong>{' '}
                    {PLATFORMS.find((p) => p.id === selectedPlatforms[0])?.hint}
                  </p>
                </div>
              )}

              {/* Master Prompt Section */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-brand-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Your Master Prompt</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">
                      ~{profileStats?.tokenCount.toLocaleString()} tokens
                    </span>
                  </div>
                </div>

                {/* Prompt Display */}
                <div className="p-4">
                  <div className="bg-slate-900 rounded-xl p-5 max-h-[400px] overflow-y-auto">
                    <pre className="font-mono text-sm text-slate-100 whitespace-pre-wrap break-words leading-relaxed">
                      {voiceProfile.master_prompt}
                    </pre>
                  </div>
                </div>

                {/* Quick Copy Button */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                  <button
                    onClick={handleCopyPrompt}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-brand-600 text-white hover:bg-brand-700'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Prompt to Clipboard
                      </>
                    )}
                  </button>
                </div>
              </section>

              {/* Output Options */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900">Export Options</h2>
                  <p className="text-sm text-slate-500 mt-1">Download your prompt or follow step-by-step guides</p>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* File Download Option */}
                    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                          <Download className="w-5 h-5 text-brand-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">Download Files</h3>
                          <p className="text-xs text-slate-500">Save prompt for offline use</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDownloadTxt}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          .txt
                        </button>
                        <button
                          onClick={handleDownloadMd}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          .md
                        </button>
                      </div>
                    </div>

                    {/* Step-by-Step Guides Option */}
                    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-brand-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">Step-by-Step Guides</h3>
                          <p className="text-xs text-slate-500">Platform-specific instructions</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        Detailed setup guides for each platform are available below.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Platform Deployment Guides */}
              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-600" />
                  Step-by-Step Setup Guides
                </h2>
                <p className="text-slate-600 mb-4">
                  Follow these detailed instructions for your selected platforms.
                </p>

                <div className="space-y-3">
                  {/* ChatGPT */}
                  {selectedPlatforms.includes('chatgpt') && (
                    <PlatformAccordion
                      title="ChatGPT (Custom GPT)"
                      icon={<ChatGPTIcon />}
                      isOpen={openAccordion === 'chatgpt'}
                      onToggle={() => toggleAccordion('chatgpt')}
                    >
                      <div className="space-y-4">
                        <Step
                          number={1}
                          title="Go to chat.openai.com"
                          description="Navigate to Explore GPTs in the sidebar, then click 'Create'"
                        />
                        <Step
                          number={2}
                          title='Name your GPT (e.g., "My Writing Assistant")'
                          description="Choose a memorable name that reflects your voice"
                        />
                        <Step
                          number={3}
                          title='In "Instructions", paste your master prompt'
                          description="Copy the entire prompt above and paste it in the Instructions field"
                        />
                        <Step
                          number={4}
                          title="Configure conversation starters"
                          description='Add helpful prompts like "Help me write an email to..." or "Draft a message for..."'
                        />
                        <Step
                          number={5}
                          title="Save and test"
                          description="Click Save, then start a conversation to test your Voice Twin"
                        />
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <a
                            href="https://chat.openai.com/gpts/editor"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
                          >
                            Open GPT Editor
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </PlatformAccordion>
                  )}

                  {/* Claude */}
                  {selectedPlatforms.includes('claude') && (
                    <PlatformAccordion
                      title="Claude (Projects)"
                      icon={<ClaudeIcon />}
                      isOpen={openAccordion === 'claude'}
                      onToggle={() => toggleAccordion('claude')}
                    >
                      <div className="space-y-4">
                        <Step
                          number={1}
                          title="Go to claude.ai"
                          description="Navigate to Projects in the sidebar, then click 'New Project'"
                        />
                        <Step
                          number={2}
                          title="Name your project"
                          description='Give it a descriptive name like "My Voice Twin" or "Writing Assistant"'
                        />
                        <Step
                          number={3}
                          title='In "Instructions", paste your master prompt'
                          description="Add the prompt as project instructions so Claude uses your voice in every conversation"
                        />
                        <Step
                          number={4}
                          title="Optionally upload reference docs"
                          description="Add writing samples or style guides for even better results"
                        />
                        <Step
                          number={5}
                          title="Start chatting"
                          description="Open the project and start a new conversation with your Voice Twin"
                        />
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <a
                            href="https://claude.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
                          >
                            Open Claude
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </PlatformAccordion>
                  )}

                  {/* Gemini */}
                  {selectedPlatforms.includes('gemini') && (
                    <PlatformAccordion
                      title="Gemini (Gems)"
                      icon={<GeminiIcon />}
                      isOpen={openAccordion === 'gemini'}
                      onToggle={() => toggleAccordion('gemini')}
                    >
                      <div className="space-y-4">
                        <Step
                          number={1}
                          title="Go to gemini.google.com"
                          description="Click on 'Gems' in the sidebar to access custom AI personas"
                        />
                        <Step
                          number={2}
                          title="Create a new Gem"
                          description='Click "New Gem" and give it a name'
                        />
                        <Step
                          number={3}
                          title='In "Instructions", paste your master prompt'
                          description="Add your voice profile to define how the Gem should communicate"
                        />
                        <Step
                          number={4}
                          title="Save and test"
                          description="Save your Gem and start a conversation to experience your Voice Twin"
                        />
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <a
                            href="https://gemini.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
                          >
                            Open Gemini
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </PlatformAccordion>
                  )}

                  {/* API Usage */}
                  {selectedPlatforms.includes('api') && (
                    <PlatformAccordion
                      title="API/Developer Integration"
                      icon={<Code className="w-5 h-5" />}
                      isOpen={openAccordion === 'api'}
                      onToggle={() => toggleAccordion('api')}
                    >
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                            <ChatGPTIcon />
                            OpenAI API
                          </h4>
                          <CodeBlock code={openaiSnippet} language="javascript" />
                        </div>

                        <div>
                          <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                            <ClaudeIcon />
                            Claude API
                          </h4>
                          <CodeBlock code={claudeSnippet} language="javascript" />
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <p className="text-sm text-amber-800">
                            <strong>Note:</strong> Replace the truncated system prompt with your full
                            master prompt for best results. Store it in an environment variable for
                            security.
                          </p>
                        </div>
                      </div>
                    </PlatformAccordion>
                  )}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-brand-600" />
              Profile Stats
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Generated
                </span>
                <span className="text-sm font-medium text-slate-900">
                  {profileStats?.generatedAt
                    ? new Date(profileStats.generatedAt).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Samples Analyzed
                </span>
                <span className="text-sm font-medium text-slate-900">
                  {profileStats?.samplesAnalyzed || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Languages
                </span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {languages.length > 0 ? (
                    languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-0.5 text-xs font-medium bg-brand-50 text-brand-700 rounded-full"
                      >
                        {getLanguageName(lang)}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">N/A</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Version
                </span>
                <span className="text-sm font-medium text-slate-900">
                  v{profileStats?.version || 1}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>

            <div className="space-y-3">
              {(subscriptionInfo.isSubscribed ||
                subscriptionInfo.regenerationsRemaining > 0) && (
                <Link
                  href="/dashboard/generate"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate Profile
                </Link>
              )}

              <Link
                href="/dashboard/samples"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Samples
              </Link>

              <Link
                href="/dashboard/generate"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Beaker className="w-4 h-4" />
                Test Your Twin
              </Link>
            </div>
          </div>

          {/* Subscription Upsell (if not subscribed) */}
          {!subscriptionInfo.isSubscribed && (
            <div className="bg-gradient-to-br from-brand-950 to-brand-800 rounded-2xl p-6 text-white shadow-brand">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold">Keep Your Twin Up to Date</h3>
              </div>

              <p className="text-brand-200 text-sm mb-4">
                Subscribe to regenerate your voice profile anytime and keep it evolving with you.
              </p>

              <ul className="space-y-2 mb-5">
                <li className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Unlimited regenerations</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Priority processing</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Version history</span>
                </li>
              </ul>

              <button
                onClick={handleSubscriptionCheckout}
                disabled={isCheckingOut}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold bg-white text-brand-600 hover:bg-brand-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    {isProUser ? 'First year $10, then $29/year' : 'Subscribe for $29/year'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
