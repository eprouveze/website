'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

// Types
interface QuestionnaireData {
  // Step 1: About You
  profession: string;
  industry: string;
  years_experience: number | null;
  primary_language: string;
  additional_languages: string[];

  // Step 2: Communication Style
  formality_level: string;
  typical_audiences: string[];
  communication_contexts: string[];

  // Step 3: Your Voice
  described_tone: string[];
  pet_phrases: string;
  things_to_avoid: string;

  // Step 4: Goals
  primary_use_case: string;
  biggest_challenge: string;
}

const initialData: QuestionnaireData = {
  profession: '',
  industry: '',
  years_experience: null,
  primary_language: 'English',
  additional_languages: [],
  formality_level: 'neutral',
  typical_audiences: [],
  communication_contexts: [],
  described_tone: [],
  pet_phrases: '',
  things_to_avoid: '',
  primary_use_case: '',
  biggest_challenge: '',
};

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Marketing',
  'Education',
  'Legal',
  'Other',
];

const LANGUAGES = [
  'English',
  'Japanese',
  'French',
  'Spanish',
  'German',
  'Other',
];

const FORMALITY_LEVELS = [
  { value: 'very_formal', label: 'Very Formal' },
  { value: 'formal', label: 'Formal' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'casual', label: 'Casual' },
  { value: 'very_casual', label: 'Very Casual' },
];

const AUDIENCES = [
  { value: 'executives', label: 'Executives' },
  { value: 'clients', label: 'Clients' },
  { value: 'team', label: 'Team members' },
  { value: 'public', label: 'Public/Social' },
  { value: 'other', label: 'Other' },
];

const CONTEXTS = [
  { value: 'email', label: 'Email' },
  { value: 'slack', label: 'Slack/Teams' },
  { value: 'reports', label: 'Reports' },
  { value: 'presentations', label: 'Presentations' },
  { value: 'social', label: 'Social media' },
  { value: 'blog', label: 'Blog/Articles' },
];

const TONE_OPTIONS = [
  { value: 'direct', label: 'Direct' },
  { value: 'warm', label: 'Warm' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'professional', label: 'Professional' },
  { value: 'empathetic', label: 'Empathetic' },
  { value: 'concise', label: 'Concise' },
  { value: 'detailed', label: 'Detailed' },
];

const USE_CASES = [
  'Email drafting',
  'Content creation',
  'Meeting prep',
  'Client communication',
  'Internal updates',
  'All of the above',
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<QuestionnaireData>(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [responseId, setResponseId] = useState<string | null>(null);

  const totalSteps = 4;

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
        const { data: existing, error: fetchError } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching questionnaire:', fetchError);
        }

        if (existing) {
          setResponseId(existing.id);
          setData({
            profession: existing.profession || '',
            industry: existing.industry || '',
            years_experience: existing.years_experience,
            primary_language: existing.primary_language || 'English',
            additional_languages: existing.additional_languages || [],
            formality_level: existing.formality_level || 'neutral',
            typical_audiences: existing.typical_audiences || [],
            communication_contexts: existing.communication_contexts || [],
            described_tone: existing.described_tone || [],
            pet_phrases: existing.pet_phrases || '',
            things_to_avoid: existing.things_to_avoid || '',
            primary_use_case: existing.primary_use_case || '',
            biggest_challenge: existing.biggest_challenge || '',
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
        profession: data.profession || null,
        industry: data.industry || null,
        years_experience: data.years_experience,
        primary_language: data.primary_language || 'en',
        additional_languages: data.additional_languages,
        formality_level: data.formality_level || null,
        typical_audiences: data.typical_audiences,
        communication_contexts: data.communication_contexts,
        described_tone: data.described_tone,
        pet_phrases: data.pet_phrases || null,
        things_to_avoid: data.things_to_avoid || null,
        primary_use_case: data.primary_use_case || null,
        biggest_challenge: data.biggest_challenge || null,
        updated_at: new Date().toISOString(),
      };

      if (responseId) {
        // Update existing
        const { error: updateError } = await supabase
          .from('questionnaire_responses')
          .update(payload)
          .eq('id', responseId);

        if (updateError) throw updateError;
      } else {
        // Insert new
        const { data: newResponse, error: insertError } = await supabase
          .from('questionnaire_responses')
          .insert(payload)
          .select('id')
          .single();

        if (insertError) throw insertError;
        if (newResponse) setResponseId(newResponse.id);
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
        })
        .eq('id', responseId);

      if (completeError) throw completeError;

      router.push('/dashboard/samples');
    } catch (err) {
      console.error('Error completing questionnaire:', err);
      setError('Failed to complete questionnaire. Please try again.');
      setSaving(false);
    }
  };

  const updateField = <K extends keyof QuestionnaireData>(
    field: K,
    value: QuestionnaireData[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (
    field: 'additional_languages' | 'typical_audiences' | 'communication_contexts' | 'described_tone',
    value: string
  ) => {
    setData((prev) => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Voice Discovery Questionnaire
          </h1>
          <p className="mt-2 text-gray-600">
            Help us understand your communication style to create your Voice Twin
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
            <span>About You</span>
            <span>Style</span>
            <span>Voice</span>
            <span>Goals</span>
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
          {/* Step 1: About You */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                About You
              </h2>

              {/* Profession */}
              <div>
                <label
                  htmlFor="profession"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Profession
                </label>
                <input
                  type="text"
                  id="profession"
                  value={data.profession}
                  onChange={(e) => updateField('profession', e.target.value)}
                  placeholder="e.g., Product Manager, Marketing Director"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Industry */}
              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Industry
                </label>
                <select
                  id="industry"
                  value={data.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select an industry</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* Years of Experience */}
              <div>
                <label
                  htmlFor="years_experience"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="years_experience"
                  value={data.years_experience ?? ''}
                  onChange={(e) =>
                    updateField(
                      'years_experience',
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  min="0"
                  max="50"
                  placeholder="e.g., 10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Primary Language */}
              <div>
                <label
                  htmlFor="primary_language"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Primary Language
                </label>
                <select
                  id="primary_language"
                  value={data.primary_language}
                  onChange={(e) => updateField('primary_language', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-white"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Languages
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {LANGUAGES.filter((lang) => lang !== data.primary_language).map(
                    (lang) => (
                      <label
                        key={lang}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={data.additional_languages.includes(lang)}
                          onChange={() =>
                            toggleArrayField('additional_languages', lang)
                          }
                          className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                        />
                        <span className="text-sm text-gray-700">{lang}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Communication Style */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Communication Style
              </h2>

              {/* Formality Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Formality Level
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  {FORMALITY_LEVELS.map((level, index) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => updateField('formality_level', level.value)}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                        data.formality_level === level.value
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>Very Formal</span>
                  <span>Very Casual</span>
                </div>
              </div>

              {/* Typical Audiences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Typical Audiences
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {AUDIENCES.map((audience) => (
                    <label
                      key={audience.value}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        data.typical_audiences.includes(audience.value)
                          ? 'border-brand-600 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={data.typical_audiences.includes(audience.value)}
                        onChange={() =>
                          toggleArrayField('typical_audiences', audience.value)
                        }
                        className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                      />
                      <span className="text-sm text-gray-700">
                        {audience.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Communication Contexts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Communication Contexts
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {CONTEXTS.map((context) => (
                    <label
                      key={context.value}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        data.communication_contexts.includes(context.value)
                          ? 'border-brand-600 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={data.communication_contexts.includes(
                          context.value
                        )}
                        onChange={() =>
                          toggleArrayField('communication_contexts', context.value)
                        }
                        className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                      />
                      <span className="text-sm text-gray-700">
                        {context.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Your Voice */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Your Voice
              </h2>

              {/* Tone Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you describe your tone?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TONE_OPTIONS.map((tone) => (
                    <label
                      key={tone.value}
                      className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                        data.described_tone.includes(tone.value)
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={data.described_tone.includes(tone.value)}
                        onChange={() =>
                          toggleArrayField('described_tone', tone.value)
                        }
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{tone.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pet Phrases */}
              <div>
                <label
                  htmlFor="pet_phrases"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phrases or expressions you commonly use
                </label>
                <textarea
                  id="pet_phrases"
                  value={data.pet_phrases}
                  onChange={(e) => updateField('pet_phrases', e.target.value)}
                  rows={4}
                  placeholder="e.g., &quot;Let me be direct...&quot;, &quot;The bottom line is...&quot;, &quot;Here's my take...&quot;"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  These help capture your authentic voice patterns
                </p>
              </div>

              {/* Things to Avoid */}
              <div>
                <label
                  htmlFor="things_to_avoid"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Things you consciously avoid in your communication
                </label>
                <textarea
                  id="things_to_avoid"
                  value={data.things_to_avoid}
                  onChange={(e) => updateField('things_to_avoid', e.target.value)}
                  rows={4}
                  placeholder="e.g., Corporate jargon, passive voice, overly casual language, emojis in professional contexts..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Knowing what NOT to do is just as important
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Goals</h2>

              {/* Primary Use Case */}
              <div>
                <label
                  htmlFor="primary_use_case"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Primary Use Case
                </label>
                <select
                  id="primary_use_case"
                  value={data.primary_use_case}
                  onChange={(e) => updateField('primary_use_case', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select your primary use case</option>
                  {USE_CASES.map((useCase) => (
                    <option key={useCase} value={useCase}>
                      {useCase}
                    </option>
                  ))}
                </select>
              </div>

              {/* Biggest Challenge */}
              <div>
                <label
                  htmlFor="biggest_challenge"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  What&apos;s your biggest challenge with AI writing tools?
                </label>
                <textarea
                  id="biggest_challenge"
                  value={data.biggest_challenge}
                  onChange={(e) =>
                    updateField('biggest_challenge', e.target.value)
                  }
                  rows={5}
                  placeholder="e.g., The tone is always off, it doesn't capture my sarcasm, outputs are too generic..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This helps us understand what to focus on when creating your
                  Voice Twin
                </p>
              </div>

              {/* Summary Preview */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Quick Summary
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <span className="font-medium">Profession:</span>{' '}
                    {data.profession || 'Not specified'}
                  </li>
                  <li>
                    <span className="font-medium">Industry:</span>{' '}
                    {data.industry || 'Not specified'}
                  </li>
                  <li>
                    <span className="font-medium">Languages:</span>{' '}
                    {[data.primary_language, ...data.additional_languages].join(
                      ', '
                    ) || 'Not specified'}
                  </li>
                  <li>
                    <span className="font-medium">Formality:</span>{' '}
                    {FORMALITY_LEVELS.find((f) => f.value === data.formality_level)
                      ?.label || 'Not specified'}
                  </li>
                  <li>
                    <span className="font-medium">Tone:</span>{' '}
                    {data.described_tone.length > 0
                      ? data.described_tone
                          .map(
                            (t) =>
                              TONE_OPTIONS.find((o) => o.value === t)?.label
                          )
                          .join(', ')
                      : 'Not specified'}
                  </li>
                </ul>
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
                className="px-8 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-all shadow-sm hover:shadow-md"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={saving}
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
                  'Complete'
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
