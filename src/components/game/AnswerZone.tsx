/**
 * AnswerZone.tsx — Drop target and reorderable answer area
 *
 * Words dropped here can be reordered by dragging within the zone,
 * or tapped to send back to the word bank.
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { SortableWordBlock } from './WordBlock';
import type { WordBlockVariant } from './WordBlock';

interface AnswerZoneProps {
  items: Array<{ id: string; word: string }>;
  variant?: Extract<WordBlockVariant, 'answer' | 'correct' | 'incorrect'>;
  onWordClick?: (id: string, word: string) => void;
  disabled?: boolean;
}

export const AnswerZone: React.FC<AnswerZoneProps> = ({
  items,
  variant = 'answer',
  onWordClick,
  disabled,
}) => {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({ id: 'answer-zone' });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'min-h-[80px] w-full rounded-xl3 p-4 transition-all duration-200',
        'flex flex-wrap gap-2 items-center justify-center',
        'border-2 border-dashed',
        isOver
          ? 'border-brand-400 bg-brand-900/40 shadow-glow'
          : items.length === 0
          ? 'border-surface-border bg-surface-card/40'
          : 'border-brand-600/50 bg-surface-card/60',
        variant === 'correct'   && 'border-success-500/60 bg-success-600/10 shadow-success',
        variant === 'incorrect' && 'border-danger-500/60 bg-danger-600/10 shadow-danger',
      )}
      id="answer-zone"
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={horizontalListSortingStrategy}
      >
        {items.length === 0 ? (
          <p className="text-white/30 text-sm font-medium pointer-events-none select-none">
            {t('ui.dragWords')}
          </p>
        ) : (
          items.map(({ id, word }) => (
            <SortableWordBlock
              key={id}
              id={id}
              word={word}
              variant={variant}
              onClick={() => onWordClick?.(id, word)}
              disabled={disabled}
            />
          ))
        )}
      </SortableContext>
    </div>
  );
};
