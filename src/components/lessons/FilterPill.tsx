/**
 * FilterPill.tsx — Toggle chip for level / category / sub-category filters.
 * Uses aria-pressed so screen readers announce the selected state.
 */

import React from 'react';
import { clsx } from 'clsx';

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  tone?: 'blue' | 'yellow' | 'soft';
  className?: string;
  id?: string;
  children: React.ReactNode;
}

const ACTIVE = {
  blue: 'bg-duo-blue text-white border-duo-blue-shadow shadow-3d-blue',
  yellow: 'bg-duo-yellow text-amber-950 border-duo-yellow-shadow shadow-3d-yellow',
  soft: 'bg-duo-blue text-white border-duo-blue-shadow',
} as const;

const INACTIVE = {
  blue: 'bg-slate-50 text-ink-500 hover:bg-slate-100 border-transparent',
  yellow: 'bg-slate-50 text-ink-700 hover:bg-slate-100 border-transparent',
  soft: 'bg-white text-ink-500 hover:bg-slate-100 border-slate-200',
} as const;

export const FilterPill: React.FC<FilterPillProps> = ({
  active,
  onClick,
  tone = 'blue',
  className,
  id,
  children,
}) => (
  <button
    type="button"
    id={id}
    aria-pressed={active}
    onClick={onClick}
    className={clsx(
      'inline-flex items-center justify-center gap-2 min-h-11 px-4 py-1.5 rounded-2xl text-xs font-black shrink-0 border-2 cursor-pointer',
      'transition-[background-color,color,border-color,box-shadow] duration-150',
      active ? ACTIVE[tone] : INACTIVE[tone],
      className,
    )}
  >
    {children}
  </button>
);
