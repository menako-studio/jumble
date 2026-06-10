/**
 * WordBlock.tsx — Individual draggable word token
 *
 * Renders in two modes:
 *   - 'bank'   → sitting in the word bank (purple outline)
 *   - 'answer' → placed in the answer zone (filled purple)
 *   - 'overlay'→ the floating clone during an active drag
 *
 * Uses @dnd-kit's useSortable for answer zone reordering
 * and simple click-to-move fallback for touch accessibility.
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';

export type WordBlockVariant = 'bank' | 'answer' | 'overlay' | 'correct' | 'incorrect';

interface WordBlockProps {
  id: string;           // unique dnd-kit id
  word: string;
  variant?: WordBlockVariant;
  onClick?: () => void; // click-to-move fallback
  disabled?: boolean;
}

/**
 * Sortable version — used inside AnswerZone and WordBank
 */
export const SortableWordBlock: React.FC<WordBlockProps> = ({
  id,
  word,
  variant = 'bank',
  onClick,
  disabled,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={clsx(
        'word-block',
        variant === 'bank'      && 'word-block--bank',
        variant === 'answer'    && 'word-block--answer',
        variant === 'correct'   && 'word-block--correct',
        variant === 'incorrect' && 'word-block--incorrect',
        isDragging              && 'word-block--dragging',
        disabled                && 'opacity-50 cursor-not-allowed pointer-events-none'
      )}
      id={`word-${id}`}
    >
      {word}
    </div>
  );
};

/**
 * Static (non-sortable) word block — used for DragOverlay clone
 */
export const WordBlock: React.FC<Pick<WordBlockProps, 'word' | 'variant'>> = ({
  word,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant: _variant = 'overlay',
}) => (
  <div className={clsx('word-block', 'word-block--overlay')}>
    {word}
  </div>
);
