'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  createClient,
  QuestionnaireResponse,
  CorpusLanguage,
  CommunicationTool,
  CommunicationTarget,
  CommunicationFormat,
} from '@/lib/supabase';

// Types for the Corpus Matrix
interface CorpusMatrixData {
  languages: CorpusLanguage[];
  communication_tools: CommunicationTool[];
  communication_targets: CommunicationTarget[];
  communication_format: CommunicationFormat;
}

const initialData: CorpusMatrixData = {
  languages: [],
  communication_tools: [],
  communication_targets: [],
  communication_format: 'text_only',
};

// Options for each dimension
const LANGUAGES: { value: CorpusLanguage; label: string; flag: string }[] = [
  { value: 'english', label: 'English', flag: 'EN' },
  { value: 'french', label: 'French', flag: 'FR' },
  { value: 'spanish', label: 'Spanish', flag: 'ES' },
  { value: 'german', label: 'German', flag: 'DE' },
  { value: 'japanese', label: 'Japanese', flag: 'JP' },
  { value: 'chinese', label: 'Chinese', flag: 'CN' },
  { value: 'other', label: 'Other', flag: '...' },
];

const COMMUNICATION_TOOLS: { value: CommunicationTool; label: string; icon: string; description: string }[] = [
  { value: 'email', label: 'Email', icon: 'mail', description: 'Professional correspondence' },
  { value: 'slack_teams', label: 'Slack / Teams', icon: 'chat', description: 'Instant messaging & collaboration' },
  { value: 'documents_reports', label: 'Documents / Reports', icon: 'document', description: 'Formal documentation' },
  { value: 'presentations', label: 'Presentations', icon: 'presentation', description: 'Slides & keynotes' },
  { value: 'social_media', label: 'Social Media', icon: 'social', description: 'Public posts & updates' },
  { value: 'blog_articles', label: 'Blog / Articles', icon: 'blog', description: 'Long-form content' },
];

const COMMUNICATION_TARGETS: { value: CommunicationTarget; label: string; icon: string; description: string }[] = [
  { value: 'customers_clients', label: 'Customers / Clients', icon: 'users', description: 'External stakeholders' },
  { value: 'internal_team', label: 'Internal Team', icon: 'team', description: 'Colleagues & direct reports' },
  { value: 'executives_leadership', label: 'Executives / Leadership', icon: 'crown', description: 'C-suite & management' },
  { value: 'public_social', label: 'Public / Social', icon: 'globe', description: 'General audience' },
  { value: 'partners_vendors', label: 'Partners / Vendors', icon: 'handshake', description: 'Business partners' },
];

// Icon components
function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function PresentationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
    </svg>
  );
}

function SocialIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
  );
}

function BlogIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function TeamIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75l3.75-6 4.5 3 5.25-7.5 6 4.5v6H2.25z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75l3.75-6 4.5 3 5.25-7.5 6 4.5" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
    </svg>
  );
}

function getToolIcon(iconName: string, className?: string) {
  switch (iconName) {
    case 'mail': return <MailIcon className={className} />;
    case 'chat': return <ChatIcon className={className} />;
    case 'document': return <DocumentIcon className={className} />;
    case 'presentation': return <PresentationIcon className={className} />;
    case 'social': return <SocialIcon className={className} />;
    case 'blog': return <BlogIcon className={className} />;
    case 'users': return <UsersIcon className={className} />;
    case 'team': return <TeamIcon className={className} />;
    case 'crown': return <CrownIcon className={className} />;
    case 'globe': return <GlobeIcon className={className} />;
    case 'handshake': return <HandshakeIcon className={className} />;
    default: return null;
  }
}

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CorpusMatrixData>(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [responseId, setResponseId] = useState<string | null>(null);

  const totalSteps = 4;
  const stepLabels = ['Languages', 'Tools', 'Targets', 'Format'];

  // Load existing data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();

        // Get current user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push('/login');
          return;
        }

        setUserId(user.id);

        // Check for existing questionnaire response
        const { data: existingData, error: fetchError } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching questionnaire:', fetchError);
        }

        const existing = existingData as QuestionnaireResponse | null;

        if (existing) {
          setResponseId(existing.id);
          setData({
            languages: existing.languages || [],
            communication_tools: existing.communication_tools || [],
            communication_targets: existing.communication_targets || [],
            communication_format: existing.communication_format || 'text_only',
          });
        }
      } catch (err) {
        console.error('Error loading questionnaire:', err);
        setError('Failed to load questionnaire data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  // Auto-save function
  const saveProgress = useCallback(async () => {
    if (!userId) return;

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      const payload = {
        user_id: userId,
        languages: data.languages,
        communication_tools: data.communication_tools,
        communication_targets: data.communication_targets,
        communication_format: data.communication_format,
        updated_at: new Date().toISOString(),
      };

      if (responseId) {
        // Update existing
        const { error: updateError } = await supabase
          .from('questionnaire_responses')
          .update(payload as never)
          .eq('id', responseId);

        if (updateError) throw updateError;
      } else {
        // Insert new
        const { data: newResponse, error: insertError } = await supabase
          .from('questionnaire_responses')
          .insert(payload as never)
          .select('id')
          .single();

        if (insertError) throw insertError;
        if (newResponse) setResponseId((newResponse as { id: string }).id);
      }
    } catch (err) {
      console.error('Error saving questionnaire:', err);
      setError('Failed to save progress. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [userId, data, responseId]);

  // Save on step change
  useEffect(() => {
    if (!loading && userId) {
      const timeoutId = setTimeout(() => {
        saveProgress();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [currentStep, loading, userId, saveProgress]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = async () => {
    if (!userId || !responseId) return;

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: completeError } = await supabase
        .from('questionnaire_responses')
        .update({
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as never)
        .eq('id', responseId);

      if (completeError) throw completeError;

      router.push('/dashboard/samples');
    } catch (err) {
      console.error('Error completing questionnaire:', err);
      setError('Failed to complete questionnaire. Please try again.');
      setSaving(false);
    }
  };

  const toggleLanguage = (lang: CorpusLanguage) => {
    setData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const toggleTool = (tool: CommunicationTool) => {
    setData((prev) => ({
      ...prev,
      communication_tools: prev.communication_tools.includes(tool)
        ? prev.communication_tools.filter((t) => t !== tool)
        : [...prev.communication_tools, tool],
    }));
  };

  const toggleTarget = (target: CommunicationTarget) => {
    setData((prev) => ({
      ...prev,
      communication_targets: prev.communication_targets.includes(target)
        ? prev.communication_targets.filter((t) => t !== target)
        : [...prev.communication_targets, target],
    }));
  };

  const setFormat = (format: CommunicationFormat) => {
    setData((prev) => ({ ...prev, communication_format: format }));
  };

  // Calculate matrix cells count
  const matrixCellsCount =
    data.languages.length *
    data.communication_tools.length *
    data.communication_targets.length;

  // Check if step has valid selections
  const isStepValid = (step: number) => {
    switch (step) {
      case 1: return data.languages.length > 0;
      case 2: return data.communication_tools.length > 0;
      case 3: return data.communication_targets.length > 0;
      case 4: return data.communication_format !== null;
      default: return true;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Corpus Matrix Builder
          </h1>
          <p className="mt-2 text-gray-600">
            Define your communication dimensions to build your personalized sample corpus
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            {saving && (
              <span className="text-sm text-brand-600 flex items-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  index + 1 <= currentStep ? 'bg-brand-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {stepLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
          {/* Step 1: Languages */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Which languages do you communicate in?
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Select all languages you use for professional communication. We will analyze samples in each language separately.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => toggleLanguage(lang.value)}
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      data.languages.includes(lang.value)
                        ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`text-lg font-bold px-2 py-1 rounded ${
                        data.languages.includes(lang.value)
                          ? 'bg-brand-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {lang.flag}
                    </span>
                    <span
                      className={`font-medium ${
                        data.languages.includes(lang.value)
                          ? 'text-brand-700'
                          : 'text-gray-700'
                      }`}
                    >
                      {lang.label}
                    </span>
                  </button>
                ))}
              </div>

              {data.languages.length > 0 && (
                <div className="mt-4 p-3 bg-brand-50 rounded-lg">
                  <p className="text-sm text-brand-700">
                    <span className="font-semibold">{data.languages.length}</span> language{data.languages.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Communication Tools */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  What communication tools do you use?
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Select all the channels where you communicate professionally. Each tool may require different writing styles.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COMMUNICATION_TOOLS.map((tool) => (
                  <button
                    key={tool.value}
                    type="button"
                    onClick={() => toggleTool(tool.value)}
                    className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all text-left ${
                      data.communication_tools.includes(tool.value)
                        ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        data.communication_tools.includes(tool.value)
                          ? 'bg-brand-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {getToolIcon(tool.icon, 'w-6 h-6')}
                    </div>
                    <div>
                      <span
                        className={`font-semibold block ${
                          data.communication_tools.includes(tool.value)
                            ? 'text-brand-700'
                            : 'text-gray-700'
                        }`}
                      >
                        {tool.label}
                      </span>
                      <span className="text-sm text-gray-500">{tool.description}</span>
                    </div>
                  </button>
                ))}
              </div>

              {data.communication_tools.length > 0 && (
                <div className="mt-4 p-3 bg-brand-50 rounded-lg">
                  <p className="text-sm text-brand-700">
                    <span className="font-semibold">{data.communication_tools.length}</span> tool{data.communication_tools.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Communication Targets */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Who do you communicate with?
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Select all the audiences you regularly communicate with. Your tone and style likely varies for each.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COMMUNICATION_TARGETS.map((target) => (
                  <button
                    key={target.value}
                    type="button"
                    onClick={() => toggleTarget(target.value)}
                    className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all text-left ${
                      data.communication_targets.includes(target.value)
                        ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        data.communication_targets.includes(target.value)
                          ? 'bg-brand-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {getToolIcon(target.icon, 'w-6 h-6')}
                    </div>
                    <div>
                      <span
                        className={`font-semibold block ${
                          data.communication_targets.includes(target.value)
                            ? 'text-brand-700'
                            : 'text-gray-700'
                        }`}
                      >
                        {target.label}
                      </span>
                      <span className="text-sm text-gray-500">{target.description}</span>
                    </div>
                  </button>
                ))}
              </div>

              {data.communication_targets.length > 0 && (
                <div className="mt-4 p-3 bg-brand-50 rounded-lg">
                  <p className="text-sm text-brand-700">
                    <span className="font-semibold">{data.communication_targets.length}</span> target{data.communication_targets.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Format + Matrix Preview */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  What format do you communicate in?
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Do you primarily write text, or do you also give presentations and speeches?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormat('text_only')}
                  className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    data.communication_format === 'text_only'
                      ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      data.communication_format === 'text_only'
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <DocumentIcon className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <span
                      className={`font-semibold text-lg block ${
                        data.communication_format === 'text_only'
                          ? 'text-brand-700'
                          : 'text-gray-700'
                      }`}
                    >
                      Text Only
                    </span>
                    <span className="text-sm text-gray-500">
                      Written communication only
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('text_voice')}
                  className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    data.communication_format === 'text_voice'
                      ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      data.communication_format === 'text_voice'
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span
                      className={`font-semibold text-lg block ${
                        data.communication_format === 'text_voice'
                          ? 'text-brand-700'
                          : 'text-gray-700'
                      }`}
                    >
                      Text + Voice
                    </span>
                    <span className="text-sm text-gray-500">
                      Includes presentations & speeches
                    </span>
                  </div>
                </button>
              </div>

              {/* Matrix Preview */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Corpus Matrix
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Based on your selections, here are the communication contexts we will analyze.
                  Not all combinations need samples - you will define which cells matter most to you.
                </p>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-brand-600">{data.languages.length}</div>
                    <div className="text-xs text-gray-500 mt-1">Languages</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-brand-600">{data.communication_tools.length}</div>
                    <div className="text-xs text-gray-500 mt-1">Tools</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-brand-600">{data.communication_targets.length}</div>
                    <div className="text-xs text-gray-500 mt-1">Targets</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-accent-600">{matrixCellsCount}</div>
                    <div className="text-xs text-gray-500 mt-1">Potential Cells</div>
                  </div>
                </div>

                {/* Visual Matrix Preview */}
                {data.languages.length > 0 && data.communication_tools.length > 0 && data.communication_targets.length > 0 && (
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {data.languages.map((lang) => (
                        <div key={lang} className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="bg-brand-100 text-brand-700 px-2 py-0.5 rounded text-xs font-bold">
                              {LANGUAGES.find(l => l.value === lang)?.flag}
                            </span>
                            {LANGUAGES.find(l => l.value === lang)?.label}
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 gap-2">
                              {data.communication_tools.map((tool) => (
                                <div key={`${lang}-${tool}`} className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-medium text-gray-600 min-w-[120px]">
                                    {COMMUNICATION_TOOLS.find(t => t.value === tool)?.label}
                                  </span>
                                  <span className="text-gray-400 text-xs">with</span>
                                  <div className="flex flex-wrap gap-1">
                                    {data.communication_targets.map((target) => (
                                      <span
                                        key={`${lang}-${tool}-${target}`}
                                        className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-full text-gray-600"
                                      >
                                        {COMMUNICATION_TARGETS.find(t => t.value === target)?.label}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Help text */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Next step:</strong> After completing this setup, you will upload writing samples for the combinations that matter most to you. You do not need to fill every cell in the matrix.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className={`px-8 py-3 rounded-lg font-medium transition-all shadow-sm hover:shadow-md ${
                  isStepValid(currentStep)
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={saving || matrixCellsCount === 0}
                className="px-8 py-3 bg-gradient-to-r from-brand-600 to-accent-600 text-white rounded-lg font-medium hover:from-brand-700 hover:to-accent-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Completing...
                  </>
                ) : (
                  'Continue to Samples'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your progress is automatically saved. You can leave and come back
          anytime.
        </p>
      </div>
    </div>
  );
}
