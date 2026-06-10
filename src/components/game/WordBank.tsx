/**
 * WordBank.tsx — Source pool of draggable word tokens
 * Words here have not yet been placed in the answer zone.
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { clsx } from 'clsx';
import { SortableWordBlock } from './WordBlock';

interface WordBankProps {
  items: Array<{ id: string; word: string }>;
  onWordClick?: (id: string, word: string) => void;
  disabled?: boolean;
}

export const WordBank: React.FC<WordBankProps> = ({ items, onWordClick, disabled }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'word-bank' });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'min-h-[72px] w-full rounded-xl2 p-3 transition-all duration-200',
        'flex flex-wrap gap-2 items-center justify-center',
        isOver
          ? 'bg-brand-900/30 ring-2 ring-brand-500/40'
          : 'bg-surface-panel/50'
      )}
      id="word-bank"
    >
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        {items.map(({ id, word }) => (
          <SortableWordBlock
            key={id}
            id={id}
            word={word}
            variant="bank"
            onClick={() => onWordClick?.(id, word)}
            disabled={disabled}
          />
        ))}
      </SortableContext>
    </div>
  );
};
