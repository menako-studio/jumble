/**
 * LessonCard.tsx — Single syllabus topic card with locked / active / completed states.
 */

import React from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { StarRating } from '../ui/StarRating';
import { Button } from '../ui/Button';
import type { GrammarModule } from '../../types';

interface LessonCardProps {
  lesson: GrammarModule;
  title: string;
  description?: string;
  categoryLabel?: string;
  categoryIcon?: string;
  stars: number;
  isUnlocked: boolean;
  onOpen: (lesson: GrammarModule, isUnlocked: boolean) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  title,
  description,
  categoryLabel,
  categoryIcon,
  stars,
  isUnlocked,
  onOpen,
}) => {
  const { t } = useTranslation();
  const isCompleted = stars > 0;
  const isActive = isUnlocked && !isCompleted;
  const titleId = `lesson-title-${lesson.id}`;

  return (
    <li
      id={`lesson-card-${lesson.id}`}
      aria-labelledby={titleId}
      className={clsx(
        'p-5 rounded-3xl bg-white border-2 flex flex-col justify-between gap-4 relative transition-[border-color,box-shadow] duration-200',
        isActive && 'border-duo-green shadow-card-lg ring-2 ring-emerald-400/20',
        isCompleted && 'border-surface-border hover:border-slate-300 shadow-card',
        isUnlocked && !isActive && !isCompleted && 'border-surface-border hover:border-sky-300 shadow-card',
        !isUnlocked && 'border-slate-100 bg-slate-50/60',
      )}
    >
      {isActive && (
        <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-duo-green-dark text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1 border-2 border-white">
          <span>{t('lessons.active')}</span>
          <span aria-hidden="true">🚀</span>
        </span>
      )}

      {/* Badges & stars */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-slate-100 text-ink-700 border border-slate-200">
            {lesson.sequenceOrder ? `#${lesson.sequenceOrder}` : t('lessons.topic')}
          </span>
          <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            {lesson.cefrLevel ? lesson.cefrLevel.replace('_PLUS', '+') : 'A1'}
          </span>
          {categoryLabel && (
            <span className="text-xs font-bold px-2 py-1 rounded-xl bg-slate-50 text-ink-500 border border-slate-200 hidden sm:inline-block">
              <span aria-hidden="true">{categoryIcon} </span>
              {categoryLabel}
            </span>
          )}
        </div>
        <StarRating stars={stars} size="sm" animate={false} />
      </div>

      {/* Title, description, learning flow */}
      <div className="flex flex-col gap-2">
        <h4 id={titleId} className="font-black text-base md:text-lg text-ink-900 leading-snug">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-ink-500 font-semibold line-clamp-2 leading-relaxed">{description}</p>
        )}

        <div className="mt-1 p-2.5 rounded-2xl bg-surface-panel border border-surface-border flex items-center justify-between gap-2 text-xs font-extrabold text-ink-700">
          <div className="flex items-center gap-1">
            <span aria-hidden="true">💡</span>
            <span>{t('lessons.stepConcept')}</span>
          </div>
          <span className="text-slate-400" aria-hidden="true">➔</span>
          <div className="flex items-center gap-1">
            <span aria-hidden="true">🎯</span>
            <span>{t('lessons.stepPractice')}</span>
          </div>
        </div>
      </div>

      {/* Action */}
      {isCompleted ? (
        <Button variant="secondary" size="sm" className="w-full" onClick={() => onOpen(lesson, true)}>
          <span>✓ {t('lessons.review')}</span>
          <span aria-hidden="true">🔁</span>
        </Button>
      ) : isActive ? (
        <Button variant="success" size="sm" className="w-full" onClick={() => onOpen(lesson, true)}>
          <span>{t('lessons.start')}</span>
          <span aria-hidden="true">🚀</span>
        </Button>
      ) : isUnlocked ? (
        <Button variant="primary" size="sm" className="w-full" onClick={() => onOpen(lesson, true)}>
          <span>{t('lessons.open')}</span>
          <span aria-hidden="true">→</span>
        </Button>
      ) : (
        // aria-disabled (not disabled) so the tap still explains *why* it's locked via the toast
        <Button
          variant="secondary"
          size="sm"
          className="w-full opacity-70 cursor-not-allowed"
          aria-disabled="true"
          title={t('lessons.lockedHint')}
          onClick={() => onOpen(lesson, false)}
        >
          <span aria-hidden="true">🔒</span>
          <span>{t('lessons.locked')}</span>
          <span className="sr-only">. {t('lessons.lockedHint')}</span>
        </Button>
      )}
    </li>
  );
};
