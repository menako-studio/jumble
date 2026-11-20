/**
 * UnitHeader.tsx — Theme/unit heading with completion progress.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

interface UnitHeaderProps {
  title: string;
  done: number;
  total: number;
}

export const UnitHeader: React.FC<UnitHeaderProps> = ({ title, done, total }) => {
  const { t } = useTranslation();
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="p-5 rounded-3xl bg-white border-2 border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-duo-blue-dark flex items-center justify-center text-2xl shrink-0 shadow-sm"
          aria-hidden="true"
        >
          📘
        </div>
        <div className="min-w-0">
          <span className="text-xs font-black uppercase tracking-wider text-duo-blue-dark bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
            {t('lessons.unitLabel')}
          </span>
          <h3 className="text-lg font-black text-ink-900 mt-1 leading-snug">{title}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:self-auto">
        <span className="text-xs font-black text-ink-500">
          {t('lessons.unitProgress', { done, total, pct })}
        </span>
        <div
          role="progressbar"
          aria-label={title}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200"
        >
          <div
            className="h-full bg-duo-green rounded-full transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
};
