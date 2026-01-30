import StageCard, { StageStatus } from './StageCard';

interface ProgressTrackerProps {
  questionnaireCompleted: boolean;
  samplesCount: number;
  minSamples: number;
  hasPaid: boolean;
  voiceProfileGenerated: boolean;
}

export default function ProgressTracker({
  questionnaireCompleted,
  samplesCount,
  minSamples,
  hasPaid,
  voiceProfileGenerated,
}: ProgressTrackerProps) {
  const samplesReady = samplesCount >= minSamples;
  const canGenerateProfile = questionnaireCompleted && samplesReady && hasPaid;
  const canDeploy = voiceProfileGenerated;

  // Determine stage statuses
  const getStage1Status = (): StageStatus => {
    if (questionnaireCompleted) return 'completed';
    return 'current';
  };

  const getStage2Status = (): StageStatus => {
    if (samplesReady) return 'completed';
    if (questionnaireCompleted) return 'current';
    return 'available';
  };

  const getStage3Status = (): StageStatus => {
    if (voiceProfileGenerated) return 'completed';
    if (canGenerateProfile) return 'current';
    if (!hasPaid) return 'locked';
    if (!samplesReady || !questionnaireCompleted) return 'locked';
    return 'available';
  };

  const getStage4Status = (): StageStatus => {
    if (canDeploy) return 'current';
    return 'locked';
  };

  // Find the current stage for the progress bar
  const getCurrentStage = () => {
    if (!questionnaireCompleted) return 1;
    if (!samplesReady) return 2;
    if (!voiceProfileGenerated) return 3;
    return 4;
  };

  const currentStage = getCurrentStage();
  const progressPercent = ((currentStage - 1) / 3) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
        <p className="text-sm text-gray-500 mt-1">
          Complete all stages to create and deploy your Voice Twin
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="flex justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">Stage {currentStage} of 4</span>
          <span className="text-xs font-medium text-indigo-600">{Math.round(progressPercent)}% complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stage Cards */}
      <div className="space-y-4">
        {/* Stage 1: Questionnaire */}
        <StageCard
          number={1}
          title="Complete Questionnaire"
          description="Tell us about your communication style, preferences, and goals."
          status={getStage1Status()}
          href="/dashboard/questionnaire"
          ctaLabel={questionnaireCompleted ? 'Review' : 'Start Questionnaire'}
        />

        {/* Stage 2: Writing Samples */}
        <StageCard
          number={2}
          title="Add Writing Samples"
          description={`Upload at least ${minSamples} writing samples so we can learn your unique voice.`}
          status={getStage2Status()}
          progress={`${samplesCount} of ${minSamples} minimum samples`}
          href="/dashboard/samples"
          ctaLabel={samplesReady ? 'Add More' : 'Upload Samples'}
        />

        {/* Stage 3: Generate Profile */}
        <div className="relative">
          {!hasPaid && (
            <div className="absolute -top-2 -right-2 z-10">
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 shadow-sm">
                $99 - Unlock
              </span>
            </div>
          )}
          <StageCard
            number={3}
            title="Generate Voice Profile"
            description="Our AI analyzes your samples to create your unique voice profile."
            status={getStage3Status()}
            href={hasPaid ? '/dashboard/voice-twin' : '/dashboard/upgrade'}
            ctaLabel={hasPaid ? 'Generate Profile' : 'Unlock Feature'}
            isPaid={hasPaid}
          />
        </div>

        {/* Stage 4: Deploy */}
        <StageCard
          number={4}
          title="Deploy Your Twin"
          description="Get your Voice Twin ready to use with ChatGPT, Claude, or any AI tool."
          status={getStage4Status()}
          href="/dashboard/voice-twin"
          ctaLabel="Deploy"
        />
      </div>

      {/* Free vs Paid Info */}
      <div className="mt-6 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 text-lg">i</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              {hasPaid ? 'Full Access Unlocked' : 'Free Features Available'}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {hasPaid
                ? 'You have full access to all features. Generate your Voice Profile when ready!'
                : 'Complete the questionnaire and add samples for free. Upgrade to generate your Voice Profile and deploy your twin.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
