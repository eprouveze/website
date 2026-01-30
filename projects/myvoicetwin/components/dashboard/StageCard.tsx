import { Check, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export type StageStatus = 'completed' | 'current' | 'locked' | 'available';

interface StageCardProps {
  number: number;
  title: string;
  description: string;
  status: StageStatus;
  progress?: string; // e.g., "3 of 5 samples"
  href?: string;
  ctaLabel?: string;
  isPaid?: boolean;
}

export default function StageCard({
  number,
  title,
  description,
  status,
  progress,
  href,
  ctaLabel = 'Continue',
}: StageCardProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';

  const statusStyles = {
    completed: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50',
      icon: 'bg-emerald-500 text-white',
      number: 'text-emerald-600',
    },
    current: {
      border: 'border-indigo-200',
      bg: 'bg-white',
      icon: 'bg-indigo-600 text-white',
      number: 'text-indigo-600',
    },
    available: {
      border: 'border-gray-200',
      bg: 'bg-white',
      icon: 'bg-gray-100 text-gray-600',
      number: 'text-gray-600',
    },
    locked: {
      border: 'border-gray-200',
      bg: 'bg-gray-50',
      icon: 'bg-gray-200 text-gray-400',
      number: 'text-gray-400',
    },
  };

  const styles = statusStyles[status];

  return (
    <div
      className={`
        relative rounded-xl border-2 p-5 transition-all duration-200
        ${styles.border} ${styles.bg}
        ${isLocked ? 'opacity-75' : 'hover:shadow-md'}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div
          className={`
            flex h-10 w-10 shrink-0 items-center justify-center rounded-full
            ${styles.icon} font-semibold text-sm
          `}
        >
          {isCompleted ? (
            <Check className="h-5 w-5" />
          ) : isLocked ? (
            <Lock className="h-4 w-4" />
          ) : (
            number
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`text-lg font-semibold ${
                isLocked ? 'text-gray-400' : 'text-gray-900'
              }`}
            >
              {title}
            </h3>
            {isCompleted && (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Complete
              </span>
            )}
          </div>
          <p
            className={`mt-1 text-sm ${
              isLocked ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {description}
          </p>

          {/* Progress */}
          {progress && !isLocked && (
            <p className="mt-2 text-sm font-medium text-indigo-600">
              {progress}
            </p>
          )}

          {/* Locked Message */}
          {isLocked && (
            <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Complete previous steps to unlock
            </p>
          )}

          {/* CTA */}
          {(isCurrent || status === 'available') && href && (
            <Link
              href={href}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Current indicator */}
      {isCurrent && (
        <div className="absolute -left-0.5 top-4 bottom-4 w-1 rounded-r-full bg-indigo-600" />
      )}
    </div>
  );
}
