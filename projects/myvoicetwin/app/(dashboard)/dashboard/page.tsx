'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import ProgressTracker from '@/components/dashboard/ProgressTracker';
import { FileText, Globe, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  userName: string | null;
  questionnaireCompleted: boolean;
  samplesCount: number;
  languagesDetected: string[];
  hasPaid: boolean;
  voiceProfileGenerated: boolean;
}

const MIN_SAMPLES = 5;

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    userName: null,
    questionnaireCompleted: false,
    samplesCount: 0,
    languagesDetected: [],
    hasPaid: false,
    voiceProfileGenerated: false,
  });
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const userId = session.user.id;

        // Fetch all data in parallel
        const [profileResult, questionnaireResult, samplesResult, purchasesResult, voiceProfileResult] = await Promise.all([
          supabase.from('profiles').select('full_name').eq('id', userId).single(),
          supabase.from('questionnaire_responses').select('completed_at').eq('user_id', userId).single(),
          supabase.from('samples').select('id, language').eq('user_id', userId),
          supabase.from('purchases').select('id, status').eq('user_id', userId).eq('status', 'completed'),
          supabase.from('voice_profiles').select('id, is_active').eq('user_id', userId).eq('is_active', true).single(),
        ]);

        // Extract unique languages from samples
        const languages = new Set<string>();
        const samplesData = samplesResult.data as Array<{ id: string; language: string }> | null;
        if (samplesData) {
          samplesData.forEach((sample) => {
            if (sample.language) {
              languages.add(sample.language);
            }
          });
        }

        const profileData = profileResult.data as { full_name: string | null } | null;
        const questionnaireData = questionnaireResult.data as { completed_at: string | null } | null;
        const purchasesData = purchasesResult.data as Array<{ id: string; status: string }> | null;

        setData({
          userName: profileData?.full_name || null,
          questionnaireCompleted: !!questionnaireData?.completed_at,
          samplesCount: samplesData?.length || 0,
          languagesDetected: Array.from(languages),
          hasPaid: !!(purchasesData && purchasesData.length > 0),
          voiceProfileGenerated: !!voiceProfileResult.data,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  // Determine the CTA based on progress
  const getNextAction = () => {
    if (!data.questionnaireCompleted) {
      return { label: 'Start Questionnaire', href: '/dashboard/questionnaire' };
    }
    if (data.samplesCount < MIN_SAMPLES) {
      return { label: 'Add Writing Samples', href: '/dashboard/samples' };
    }
    if (!data.hasPaid) {
      return { label: 'Unlock Voice Profile', href: '/dashboard/upgrade' };
    }
    if (!data.voiceProfileGenerated) {
      return { label: 'Generate Voice Profile', href: '/dashboard/voice-twin' };
    }
    return { label: 'View Your Twin', href: '/dashboard/voice-twin' };
  };

  const nextAction = getNextAction();

  // Get language display names
  const getLanguageName = (code: string) => {
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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Welcome back{data.userName ? `, ${data.userName.split(' ')[0]}` : ''}!
        </h1>
        <p className="mt-2 text-gray-600">
          {data.voiceProfileGenerated
            ? 'Your Voice Twin is ready. Explore and use it with your favorite AI tools.'
            : "Let's build your Voice Twin. Complete the steps below to get started."}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Samples Count */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.samplesCount}</p>
              <p className="text-sm text-gray-500">Writing Samples</p>
            </div>
          </div>
          {data.samplesCount < MIN_SAMPLES && (
            <p className="mt-3 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              Add {MIN_SAMPLES - data.samplesCount} more sample{MIN_SAMPLES - data.samplesCount !== 1 ? 's' : ''} to continue
            </p>
          )}
        </div>

        {/* Languages */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Globe className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data.languagesDetected.length || 0}
              </p>
              <p className="text-sm text-gray-500">Languages Detected</p>
            </div>
          </div>
          {data.languagesDetected.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {data.languagesDetected.slice(0, 3).map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700"
                >
                  {getLanguageName(lang)}
                </span>
              ))}
              {data.languagesDetected.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{data.languagesDetected.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Voice Profile Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                data.voiceProfileGenerated
                  ? 'bg-emerald-100'
                  : 'bg-gray-100'
              }`}
            >
              <Sparkles
                className={`h-5 w-5 ${
                  data.voiceProfileGenerated
                    ? 'text-emerald-600'
                    : 'text-gray-400'
                }`}
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data.voiceProfileGenerated ? 'Ready' : 'Pending'}
              </p>
              <p className="text-sm text-gray-500">Voice Profile</p>
            </div>
          </div>
          {!data.voiceProfileGenerated && !data.hasPaid && (
            <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
              Complete free steps first, then upgrade to generate
            </p>
          )}
        </div>
      </div>

      {/* Continue CTA */}
      <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Continue where you left off</h2>
            <p className="text-indigo-100 text-sm mt-1">
              {!data.questionnaireCompleted
                ? 'Tell us about your communication style to personalize your Voice Twin.'
                : data.samplesCount < MIN_SAMPLES
                ? `Add ${MIN_SAMPLES - data.samplesCount} more writing sample${MIN_SAMPLES - data.samplesCount !== 1 ? 's' : ''} to unlock the next stage.`
                : !data.hasPaid
                ? 'Your samples are ready! Upgrade to generate your Voice Profile.'
                : !data.voiceProfileGenerated
                ? 'Everything is ready. Generate your Voice Profile now!'
                : 'Your Voice Twin is ready to use.'}
            </p>
          </div>
          <Link
            href={nextAction.href}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0"
          >
            {nextAction.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker
        questionnaireCompleted={data.questionnaireCompleted}
        samplesCount={data.samplesCount}
        minSamples={MIN_SAMPLES}
        hasPaid={data.hasPaid}
        voiceProfileGenerated={data.voiceProfileGenerated}
      />
    </div>
  );
}
