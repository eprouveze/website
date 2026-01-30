'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient, type Sample, type SampleType, type QuestionnaireResponse } from '@/lib/supabase';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  FileText,
  Mail,
  MessageSquare,
  FileBarChart,
  Presentation,
  Share2,
  BookOpen,
  Mic,
  MoreHorizontal,
  X,
  Check,
  ChevronRight,
  Lightbulb,
  AlertCircle,
  Globe,
  Calendar,
  Type,
  ArrowLeft,
  Upload,
  DollarSign,
  Clock,
  Loader2,
  AlertTriangle,
  Users,
  Wrench,
} from 'lucide-react';

// Types
interface SampleFormData {
  title: string;
  sample_type: SampleType;
  language: string;
  context: string;
  audience: string;
  content: string;
  is_transcript: boolean;
}

interface MatrixSection {
  id: string;
  language: string;
  tool: string;
  target: string;
  label: string;
}

interface SectionProgress {
  section: MatrixSection;
  samples: Sample[];
  count: number;
  isComplete: boolean;
}

// Constants
const SAMPLE_TYPES: { value: SampleType; label: string; icon: typeof Mail }[] = [
  { value: 'email_formal', label: 'Email (Formal)', icon: Mail },
  { value: 'email_casual', label: 'Email (Casual)', icon: Mail },
  { value: 'email_internal', label: 'Email (Internal)', icon: Mail },
  { value: 'email_external', label: 'Email (External)', icon: Mail },
  { value: 'slack_message', label: 'Slack/Teams Message', icon: MessageSquare },
  { value: 'report', label: 'Report/Document', icon: FileBarChart },
  { value: 'presentation', label: 'Presentation', icon: Presentation },
  { value: 'social_post', label: 'Social Media Post', icon: Share2 },
  { value: 'blog_article', label: 'Blog Article', icon: BookOpen },
  { value: 'meeting_transcript', label: 'Meeting Transcript', icon: FileText },
  { value: 'voice_memo', label: 'Voice Memo Transcript', icon: Mic },
  { value: 'other', label: 'Other', icon: MoreHorizontal },
];

const LANGUAGES = [
  { value: 'en', label: 'English', fullName: 'English' },
  { value: 'ja', label: 'Japanese', fullName: 'Japanese' },
  { value: 'fr', label: 'French', fullName: 'French' },
  { value: 'es', label: 'Spanish', fullName: 'Spanish' },
  { value: 'de', label: 'German', fullName: 'German' },
  { value: 'other', label: 'Other', fullName: 'Other' },
];

const TOOLS_MAP: Record<string, { label: string; sampleTypes: SampleType[] }> = {
  email: { label: 'Email', sampleTypes: ['email_formal', 'email_casual', 'email_internal', 'email_external'] },
  slack: { label: 'Slack/Teams', sampleTypes: ['slack_message'] },
  reports: { label: 'Reports', sampleTypes: ['report'] },
  presentations: { label: 'Presentations', sampleTypes: ['presentation'] },
  social: { label: 'Social Media', sampleTypes: ['social_post'] },
  blog: { label: 'Blog/Articles', sampleTypes: ['blog_article'] },
};

const AUDIENCES_MAP: Record<string, string> = {
  executives: 'Executives',
  clients: 'Clients',
  team: 'Team Members',
  public: 'Public/Social',
  other: 'Other',
};

const MIN_SAMPLES_PER_SECTION = 5;

// Audio upload constants
const ACCEPTED_AUDIO_FORMATS = '.mp3,.wav,.m4a,.webm';
const ACCEPTED_AUDIO_MIMES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/x-m4a', 'audio/webm'];
const MAX_FILE_SIZE_MB = 25;
const PRICE_PER_MINUTE = 0.009;
const MINIMUM_CHARGE = 0.01;

const INITIAL_FORM_DATA: SampleFormData = {
  title: '',
  sample_type: 'email_formal' as SampleType,
  language: 'en',
  context: '',
  audience: '',
  content: '',
  is_transcript: false,
};

// Helper functions
function getTypeLabel(type: SampleType): string {
  return SAMPLE_TYPES.find((t) => t.value === type)?.label || type;
}

function getTypeIcon(type: SampleType) {
  return SAMPLE_TYPES.find((t) => t.value === type)?.icon || FileText;
}

function getLanguageLabel(code: string): string {
  return LANGUAGES.find((l) => l.value === code)?.label || code;
}

function getLanguageCode(fullName: string): string {
  const lang = LANGUAGES.find((l) => l.fullName === fullName || l.label === fullName);
  return lang?.value || 'en';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function calculateAudioPrice(durationSeconds: number): { price: number; minutes: number } {
  const minutes = Math.ceil(durationSeconds / 60);
  const rawPrice = minutes * PRICE_PER_MINUTE;
  const price = Math.max(MINIMUM_CHARGE, Math.round(rawPrice * 100) / 100);
  return { price, minutes };
}

function getToolForSampleType(sampleType: SampleType): string | null {
  for (const [tool, config] of Object.entries(TOOLS_MAP)) {
    if (config.sampleTypes.includes(sampleType)) {
      return tool;
    }
  }
  return null;
}

function getSampleTypeForTool(tool: string): SampleType {
  const config = TOOLS_MAP[tool];
  return config?.sampleTypes[0] || 'other';
}

// Components
function SampleCard({
  sample,
  onDelete,
}: {
  sample: Sample;
  onDelete: (id: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const Icon = getTypeIcon(sample.sample_type);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    await onDelete(sample.id);
    setIsDeleting(false);
  };

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 p-5 hover:border-brand-300 hover:shadow-md transition-all duration-200">
      <div className="absolute -top-3 left-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-100 text-brand-600 shadow-sm">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
        title="Delete sample"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="mt-3">
        <h3 className="font-semibold text-slate-900 truncate pr-8">{sample.title}</h3>
        <p className="text-sm text-slate-500 mt-1">{getTypeLabel(sample.sample_type)}</p>

        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            {getLanguageLabel(sample.language)}
          </span>
          <span className="flex items-center gap-1">
            <Type className="w-3.5 h-3.5" />
            {sample.word_count} words
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(sample.created_at)}
          </span>
        </div>

        {sample.is_transcript && (
          <div className="mt-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-700">
              <Mic className="w-3 h-3" />
              Transcript
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  progress,
  onAddSample,
  samples,
  onDeleteSample,
}: {
  progress: SectionProgress;
  onAddSample: (section: MatrixSection) => void;
  samples: Sample[];
  onDeleteSample: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const progressPercent = Math.min((progress.count / MIN_SAMPLES_PER_SECTION) * 100, 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${progress.isComplete ? 'bg-green-500' : 'bg-amber-500'}`} />
            <h3 className="font-semibold text-slate-900">{progress.section.label}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${progress.isComplete ? 'text-green-600' : 'text-amber-600'}`}>
              {progress.count}/{MIN_SAMPLES_PER_SECTION}
            </span>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
        </div>

        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progress.isComplete
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            {LANGUAGES.find((l) => l.value === progress.section.language)?.label || progress.section.language}
          </span>
          <span className="flex items-center gap-1">
            <Wrench className="w-3 h-3" />
            {TOOLS_MAP[progress.section.tool]?.label || progress.section.tool}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {AUDIENCES_MAP[progress.section.target] || progress.section.target}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          {samples.length > 0 ? (
            <div className="grid gap-3">
              {samples.map((sample) => (
                <div
                  key={sample.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                >
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{sample.title}</p>
                    <p className="text-xs text-slate-500">{sample.word_count} words</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSample(sample.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-2">No samples yet</p>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddSample(progress.section);
            }}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Sample to Section
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onAdd, onUploadAudio }: { onAdd: () => void; onUploadAudio: () => void }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-6">
        <FileText className="w-8 h-8 text-brand-600" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">No writing samples yet</h3>
      <p className="text-slate-600 max-w-md mx-auto mb-8">
        Add your writing samples to help us understand your unique voice. Include emails, messages,
        documents, or any text that represents how you communicate.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onUploadAudio}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-accent-300 text-accent-700 font-semibold hover:bg-accent-50 hover:border-accent-400 shadow-sm hover:shadow transition-all duration-200"
        >
          <Upload className="w-5 h-5" />
          Upload Audio
        </button>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold shadow-brand hover:shadow-brand-lg hover:scale-[1.02] transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Your First Sample
        </button>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Audio transcription: $0.009/min (minimum $0.01)
      </p>
    </div>
  );
}

function GuidancePanel({
  sectionProgress,
  totalSamples,
}: {
  sectionProgress: SectionProgress[];
  totalSamples: number;
}) {
  const completeSections = sectionProgress.filter((p) => p.isComplete).length;
  const totalSections = sectionProgress.length;
  const overallProgress = totalSections > 0 ? (completeSections / totalSections) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl border border-brand-100 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Section Coverage</span>
          <span className={`text-sm font-semibold ${completeSections === totalSections && totalSections > 0 ? 'text-green-600' : 'text-brand-600'}`}>
            {totalSections > 0 ? `${completeSections} of ${totalSections} sections complete` : `${totalSamples} of ${MIN_SAMPLES_PER_SECTION} minimum`}
          </span>
        </div>
        <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              (completeSections === totalSections && totalSections > 0) || (totalSections === 0 && totalSamples >= MIN_SAMPLES_PER_SECTION)
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-brand-500 to-accent-500'
            }`}
            style={{ width: `${totalSections > 0 ? overallProgress : Math.min((totalSamples / MIN_SAMPLES_PER_SECTION) * 100, 100)}%` }}
          />
        </div>
        {completeSections === totalSections && totalSections > 0 && (
          <div className="flex items-center gap-2 mt-2 text-green-600">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">All sections complete!</span>
          </div>
        )}
        <p className="text-xs text-slate-500 mt-2">
          Total samples: {totalSamples} | Min {MIN_SAMPLES_PER_SECTION} per section
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm">Tips for Great Samples</h4>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-brand-500 mt-0.5">&#8226;</span>
                <span>
                  <strong>Cover each section</strong> - Samples for each language + tool + audience combo
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 mt-0.5">&#8226;</span>
                <span>
                  <strong>Use authentic samples</strong> - Text you wrote yourself, not edited by others
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 mt-0.5">&#8226;</span>
                <span>
                  <strong>Quality over quantity</strong> - Real examples are better than filler
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-4 border-t border-brand-200/50">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm">Why Sections Matter</h4>
            <p className="mt-1 text-sm text-slate-600">
              Each section represents a unique communication context. The more coverage you provide,
              the better your Voice Twin will adapt to different situations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BypassWarningModal({
  isOpen,
  onClose,
  onConfirm,
  incompleteSections,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  incompleteSections: SectionProgress[];
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-amber-50 rounded-t-2xl">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Incomplete Coverage</h2>
              <p className="text-sm text-slate-600">Some sections don&apos;t have enough samples</p>
            </div>
          </div>

          <div className="p-6">
            <p className="text-slate-700 mb-4">
              The following sections will <strong>not be representative</strong> in your Voice Twin
              because they have fewer than {MIN_SAMPLES_PER_SECTION} samples:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-2 mb-6">
              {incompleteSections.map((progress) => (
                <div
                  key={progress.section.id}
                  className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200"
                >
                  <span className="text-sm font-medium text-slate-900">{progress.section.label}</span>
                  <span className="text-sm text-amber-700">
                    {progress.count}/{MIN_SAMPLES_PER_SECTION} samples
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-lg mb-6">
              <p className="text-sm text-slate-600">
                <strong>What this means:</strong> Your Voice Twin may not accurately capture your style
                for these specific communication contexts. You can always come back and add more samples later.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-slate-700 font-medium hover:bg-slate-100 transition-colors"
              >
                Go Back & Add More
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
              >
                I Understand, Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddSampleModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  matrixSections,
  preselectedSection,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SampleFormData) => Promise<void>;
  isLoading: boolean;
  matrixSections: MatrixSection[];
  preselectedSection: MatrixSection | null;
}) {
  const [formData, setFormData] = useState<SampleFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof SampleFormData, string>>>({});
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const wordCount = countWords(formData.content);

  useEffect(() => {
    if (preselectedSection) {
      setSelectedSectionId(preselectedSection.id);
      setFormData((prev) => ({
        ...prev,
        language: preselectedSection.language,
        sample_type: getSampleTypeForTool(preselectedSection.tool),
        audience: AUDIENCES_MAP[preselectedSection.target] || preselectedSection.target,
      }));
    } else {
      setSelectedSectionId(null);
    }
  }, [preselectedSection]);

  const handleSectionChange = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    const section = matrixSections.find((s) => s.id === sectionId);
    if (section) {
      setFormData((prev) => ({
        ...prev,
        language: section.language,
        sample_type: getSampleTypeForTool(section.tool),
        audience: AUDIENCES_MAP[section.target] || section.target,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SampleFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (wordCount < 20) {
      newErrors.content = 'Please provide at least 20 words';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit(formData);
    setFormData(INITIAL_FORM_DATA);
    setSelectedSectionId(null);
    setErrors({});
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedSectionId(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Add Writing Sample</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {matrixSections.length > 0 && (
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Section (from your matrix)
                </label>
                <select
                  id="section"
                  value={selectedSectionId || ''}
                  onChange={(e) => handleSectionChange(e.target.value)}
                  className="input-field"
                >
                  <option value="">Choose a section or customize below...</option>
                  {matrixSections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  Selecting a section will pre-fill language, type, and audience
                </p>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Q4 Strategy Email to CEO"
                className={`input-field ${errors.title ? 'border-red-300 focus:ring-red-500' : ''}`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="sample_type" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Type
                </label>
                <select
                  id="sample_type"
                  value={formData.sample_type}
                  onChange={(e) => setFormData({ ...formData, sample_type: e.target.value as SampleType })}
                  className="input-field"
                >
                  {SAMPLE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Language
                </label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="input-field"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="context" className="block text-sm font-medium text-slate-700 mb-1.5">
                Context
              </label>
              <textarea
                id="context"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                placeholder="Brief description of when/why this was written..."
                rows={2}
                className="input-field resize-none"
              />
              <p className="mt-1 text-xs text-slate-500">
                Help us understand the situation this was written in
              </p>
            </div>

            <div>
              <label htmlFor="audience" className="block text-sm font-medium text-slate-700 mb-1.5">
                Audience
              </label>
              <input
                type="text"
                id="audience"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                placeholder="Who was this written for? e.g., Executive team, Direct reports, Clients"
                className="input-field"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="content" className="block text-sm font-medium text-slate-700">
                  Content <span className="text-red-500">*</span>
                </label>
                <span className={`text-xs ${wordCount < 20 ? 'text-amber-600' : 'text-slate-500'}`}>
                  {wordCount} words
                </span>
              </div>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Paste your writing sample here..."
                rows={8}
                className={`input-field resize-none font-mono text-sm ${
                  errors.content ? 'border-red-300 focus:ring-red-500' : ''
                }`}
              />
              {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Is this a transcript?</p>
                  <p className="text-sm text-slate-500">Toggle if this was transcribed from audio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_transcript: !formData.is_transcript })}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  formData.is_transcript ? 'bg-accent-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    formData.is_transcript ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl text-slate-700 font-medium hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold shadow-brand hover:shadow-brand-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Sample
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface AudioUploadResult {
  transcription: string;
  durationMinutes: number;
  wordCount: number;
}

function AudioUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: AudioUploadResult) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'confirm' | 'processing' | 'complete'>('select');
  const [acknowledged, setAcknowledged] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  const pricing = duration ? calculateAudioPrice(duration) : null;

  const resetState = () => {
    setFile(null);
    setDuration(null);
    setError(null);
    setStep('select');
    setAcknowledged(false);
    setProcessingStatus('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);

    if (!ACCEPTED_AUDIO_MIMES.includes(selectedFile.type)) {
      setError('Please select a valid audio file (MP3, WAV, M4A, or WebM)');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setFile(selectedFile);

    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await selectedFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      setDuration(audioBuffer.duration);
      setStep('confirm');
      await audioContext.close();
    } catch (err) {
      console.error('Error getting audio duration:', err);
      setDuration(null);
      setStep('confirm');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStep('processing');
    setProcessingStatus('Uploading audio...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('action', 'transcribe');

      setProcessingStatus('Transcribing audio...');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to transcribe audio');
      }

      if (data.requiresPayment && data.checkoutUrl) {
        setProcessingStatus('Redirecting to payment...');
        window.location.href = data.checkoutUrl;
        return;
      }

      if (data.transcription) {
        setStep('complete');
        onSuccess({
          transcription: data.transcription,
          durationMinutes: data.durationMinutes,
          wordCount: data.wordCount,
        });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload audio');
      setStep('confirm');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                <Mic className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Upload Audio</h2>
                <p className="text-sm text-slate-500">Transcribe audio to create a sample</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-brand-50 to-accent-50 border border-brand-100">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-brand-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">$0.009 per minute of audio</p>
                  <p className="text-xs text-slate-600">Minimum charge: $0.01 | Billed per minute (rounded up)</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {step === 'select' && (
              <div className="space-y-4">
                <label className="block">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-brand-400 hover:bg-brand-50/50 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Click to select audio file
                    </p>
                    <p className="text-xs text-slate-500">
                      MP3, WAV, M4A, or WebM (max {MAX_FILE_SIZE_MB}MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept={ACCEPTED_AUDIO_FORMATS}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {step === 'confirm' && file && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{file.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                        {duration && (
                          <>
                            <span>|</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(duration)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null);
                        setDuration(null);
                        setStep('select');
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {pricing && (
                  <div className="p-4 rounded-xl bg-brand-50 border border-brand-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Estimated Cost</p>
                        <p className="text-xs text-slate-500">{pricing.minutes} minute{pricing.minutes !== 1 ? 's' : ''} of audio</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-brand-600">${pricing.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-brand-300 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">I acknowledge the cost</p>
                    <p className="text-slate-500">
                      {pricing
                        ? `I agree to pay $${pricing.price.toFixed(2)} for transcribing this audio.`
                        : 'I agree to pay the calculated cost based on audio duration.'}
                    </p>
                  </div>
                </label>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setFile(null);
                      setDuration(null);
                      setStep('select');
                      setAcknowledged(false);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl text-slate-700 font-medium hover:bg-slate-100 transition-colors"
                  >
                    Change File
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!acknowledged}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold shadow-brand hover:shadow-brand-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Upload className="w-4 h-4" />
                    Upload & Transcribe
                  </button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-100 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
                </div>
                <p className="text-lg font-medium text-slate-900 mb-1">{processingStatus}</p>
                <p className="text-sm text-slate-500">This may take a few moments...</p>
              </div>
            )}

            {step === 'complete' && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-slate-900 mb-1">Transcription Complete!</p>
                <p className="text-sm text-slate-500">Creating your sample now...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function WritingSamplesPage() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isBypassModalOpen, setIsBypassModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [preselectedSection, setPreselectedSection] = useState<MatrixSection | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // Build matrix sections from questionnaire data
  const matrixSections = useMemo<MatrixSection[]>(() => {
    if (!questionnaireData) return [];

    const sections: MatrixSection[] = [];

    const languages: string[] = [];
    if (questionnaireData.primary_language) {
      languages.push(getLanguageCode(questionnaireData.primary_language));
    }
    if (questionnaireData.additional_languages) {
      questionnaireData.additional_languages.forEach((lang) => {
        const code = getLanguageCode(lang);
        if (!languages.includes(code)) {
          languages.push(code);
        }
      });
    }
    if (languages.length === 0) languages.push('en');

    const tools = questionnaireData.communication_contexts || [];
    if (tools.length === 0) tools.push('email');

    const targets = questionnaireData.typical_audiences || [];
    if (targets.length === 0) targets.push('team');

    for (const language of languages) {
      for (const tool of tools) {
        for (const target of targets) {
          const langLabel = LANGUAGES.find((l) => l.value === language)?.label || language;
          const toolLabel = TOOLS_MAP[tool]?.label || tool;
          const targetLabel = AUDIENCES_MAP[target] || target;

          sections.push({
            id: `${language}-${tool}-${target}`,
            language,
            tool,
            target,
            label: `${langLabel} / ${toolLabel} / ${targetLabel}`,
          });
        }
      }
    }

    return sections;
  }, [questionnaireData]);

  // Calculate progress for each section
  const sectionProgress = useMemo<SectionProgress[]>(() => {
    return matrixSections.map((section) => {
      const matchingSamples = samples.filter((sample) => {
        if (sample.language !== section.language) return false;

        const sampleTool = getToolForSampleType(sample.sample_type);
        if (sampleTool !== section.tool) return false;

        const targetLabel = AUDIENCES_MAP[section.target]?.toLowerCase() || section.target.toLowerCase();
        const sampleAudience = (sample.audience || '').toLowerCase();

        if (sampleAudience && !sampleAudience.includes(targetLabel) && !targetLabel.includes(sampleAudience)) {
          const audienceMatches: Record<string, string[]> = {
            executives: ['executive', 'ceo', 'cfo', 'leadership', 'management', 'director', 'vp'],
            clients: ['client', 'customer', 'external', 'vendor', 'partner'],
            team: ['team', 'colleague', 'internal', 'coworker', 'direct report', 'peer'],
            public: ['public', 'social', 'community', 'follower', 'audience'],
            other: [],
          };

          const matchTerms = audienceMatches[section.target] || [];
          const hasMatch = matchTerms.some((term) => sampleAudience.includes(term));
          if (!hasMatch && sampleAudience !== '') return false;
        }

        return true;
      });

      return {
        section,
        samples: matchingSamples,
        count: matchingSamples.length,
        isComplete: matchingSamples.length >= MIN_SAMPLES_PER_SECTION,
      };
    });
  }, [matrixSections, samples]);

  // Calculate CTA state
  const ctaState = useMemo(() => {
    if (matrixSections.length === 0) {
      return {
        canProceed: samples.length >= MIN_SAMPLES_PER_SECTION,
        needsWarning: false,
        allComplete: samples.length >= MIN_SAMPLES_PER_SECTION,
        incompleteSections: [] as SectionProgress[],
        completeSections: samples.length >= MIN_SAMPLES_PER_SECTION ? 1 : 0,
        totalSections: 1,
      };
    }

    const completeSections = sectionProgress.filter((p) => p.isComplete);
    const incompleteSections = sectionProgress.filter((p) => !p.isComplete);

    return {
      canProceed: completeSections.length > 0,
      needsWarning: incompleteSections.length > 0 && completeSections.length > 0,
      allComplete: incompleteSections.length === 0,
      incompleteSections,
      completeSections: completeSections.length,
      totalSections: sectionProgress.length,
    };
  }, [sectionProgress, matrixSections.length, samples.length]);

  // Fetch user, questionnaire data, and samples
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('Please sign in to view your samples');
        setIsLoading(false);
        return;
      }

      setUserId(user.id);

      const [questionnaireResult, samplesResult] = await Promise.all([
        supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('samples')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (questionnaireResult.error) {
        console.error('Error fetching questionnaire:', questionnaireResult.error);
      } else {
        setQuestionnaireData(questionnaireResult.data as QuestionnaireResponse | null);
      }

      if (samplesResult.error) {
        throw samplesResult.error;
      }

      setSamples((samplesResult.data as Sample[]) || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load samples. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddSample = async (formData: SampleFormData) => {
    if (!userId) return;

    try {
      setIsSaving(true);

      const insertData = {
        user_id: userId,
        title: formData.title.trim(),
        sample_type: formData.sample_type,
        language: formData.language,
        context: formData.context.trim() || null,
        audience: formData.audience.trim() || null,
        content: formData.content.trim(),
        is_transcript: formData.is_transcript,
        original_audio_url: null,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await supabase.from('samples').insert(insertData as any);

      if (insertError) {
        throw insertError;
      }

      setIsModalOpen(false);
      setPreselectedSection(null);
      await fetchData();
    } catch (err) {
      console.error('Error adding sample:', err);
      setError('Failed to add sample. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSample = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sample?')) return;

    try {
      const { error: deleteError } = await supabase.from('samples').delete().eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setSamples(samples.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Error deleting sample:', err);
      setError('Failed to delete sample. Please try again.');
    }
  };

  const handleAudioUploadSuccess = async (result: AudioUploadResult) => {
    if (!userId) return;

    try {
      setIsSaving(true);

      const insertData = {
        user_id: userId,
        title: `Audio Transcript (${result.durationMinutes} min)`,
        sample_type: 'voice_memo' as SampleType,
        language: 'en',
        context: 'Transcribed from audio upload',
        audience: null,
        content: result.transcription,
        is_transcript: true,
        original_audio_url: null,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await supabase.from('samples').insert(insertData as any);

      if (insertError) {
        throw insertError;
      }

      setIsAudioModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error('Error creating sample from transcription:', err);
      setError('Failed to create sample from transcription. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToSection = (section: MatrixSection) => {
    setPreselectedSection(section);
    setIsModalOpen(true);
  };

  const handleContinueClick = () => {
    if (ctaState.needsWarning) {
      setIsBypassModalOpen(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Collect Your Writing Samples</h1>
        <p className="mt-2 text-lg text-slate-600">
          Add examples of your authentic writing to train your Voice Twin. Cover each section from your
          communication matrix for the best results.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto p-1 hover:bg-red-100 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {samples.length > 0 && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-slate-600">
                <span className="font-semibold text-slate-900">{samples.length}</span>{' '}
                {samples.length === 1 ? 'sample' : 'samples'} collected
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAudioModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-accent-300 text-accent-700 font-medium hover:bg-accent-50 hover:border-accent-400 shadow-sm hover:shadow transition-all duration-200"
                >
                  <Upload className="w-4 h-4" />
                  Upload Audio
                </button>
                <button
                  onClick={() => {
                    setPreselectedSection(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 shadow-sm hover:shadow transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Sample
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm">
              <div className="flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-500">Loading samples...</p>
              </div>
            </div>
          ) : samples.length === 0 && matrixSections.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <EmptyState onAdd={() => setIsModalOpen(true)} onUploadAudio={() => setIsAudioModalOpen(true)} />
            </div>
          ) : matrixSections.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Communication Matrix</h2>
              {sectionProgress.map((progress) => (
                <SectionCard
                  key={progress.section.id}
                  progress={progress}
                  onAddSample={handleAddToSection}
                  samples={progress.samples}
                  onDeleteSample={handleDeleteSample}
                />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {samples.map((sample) => (
                <SampleCard key={sample.id} sample={sample} onDelete={handleDeleteSample} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <GuidancePanel sectionProgress={sectionProgress} totalSamples={samples.length} />

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">Ready to continue?</h3>
            <p className="text-sm text-slate-600 mb-4">
              {ctaState.allComplete
                ? 'All sections have enough samples. Great job!'
                : ctaState.canProceed
                ? `${ctaState.completeSections} of ${ctaState.totalSections} sections complete. You can continue with partial coverage.`
                : matrixSections.length > 0
                ? 'Complete at least one section with 5+ samples to continue.'
                : `Add at least ${MIN_SAMPLES_PER_SECTION} samples to continue.`}
            </p>

            {ctaState.needsWarning ? (
              <button
                onClick={handleContinueClick}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-brand hover:shadow-brand-lg hover:scale-[1.02]"
              >
                <AlertTriangle className="w-5 h-5" />
                Continue with Warning
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <Link
                href={ctaState.canProceed ? '/dashboard/generate' : '#'}
                onClick={(e) => !ctaState.canProceed && e.preventDefault()}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  ctaState.canProceed
                    ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-brand hover:shadow-brand-lg hover:scale-[1.02]'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Continue to Generate
                <ChevronRight className="w-5 h-5" />
              </Link>
            )}

            {!ctaState.canProceed && (
              <p className="text-xs text-center text-slate-500 mt-3">
                {matrixSections.length > 0
                  ? 'At least one section needs 5+ samples'
                  : `Minimum ${MIN_SAMPLES_PER_SECTION} samples required`}
              </p>
            )}
          </div>
        </div>
      </div>

      <AddSampleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPreselectedSection(null);
        }}
        onSubmit={handleAddSample}
        isLoading={isSaving}
        matrixSections={matrixSections}
        preselectedSection={preselectedSection}
      />

      <AudioUploadModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        onSuccess={handleAudioUploadSuccess}
      />

      <BypassWarningModal
        isOpen={isBypassModalOpen}
        onClose={() => setIsBypassModalOpen(false)}
        onConfirm={() => {
          setIsBypassModalOpen(false);
          window.location.href = '/dashboard/generate';
        }}
        incompleteSections={ctaState.incompleteSections}
      />
    </div>
  );
}
