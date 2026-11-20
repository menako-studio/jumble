/**
 * Pagination.tsx — Prev / numbered pages / Next with range summary.
 */

import React from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

/** Windowed page list: first, last, current ±1, with '…' gaps (keeps the bar compact for 20+ pages). */
function getPageItems(current: number, total: number): (number | 'gap-start' | 'gap-end')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const items: (number | 'gap-start' | 'gap-end')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push(i === 1 ? 'gap-start' : 'gap-end');
    items.push(p);
  });
  return items;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onChange,
}) => {
  const { t } = useTranslation();
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, totalItems);

  return (
    <nav
      aria-label={t('lessons.pagination')}
      className="mt-8 flex flex-col items-center gap-3 p-4 rounded-3xl bg-surface-panel border border-surface-border"
    >
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage === 1}
          id="pagination-prev-btn"
        >
          <span aria-hidden="true">←</span> {t('lessons.prev')}
        </Button>

        {getPageItems(currentPage, totalPages).map((p) => {
          if (typeof p === 'string') {
            return (
              <span key={p} aria-hidden="true" className="w-6 text-center font-black text-ink-500">
                …
              </span>
            );
          }
          const isCurrent = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              id={`page-btn-${p}`}
              onClick={() => onChange(p)}
              aria-label={t('lessons.pageLabel', { page: p })}
              aria-current={isCurrent ? 'page' : undefined}
              className={clsx(
                'w-11 h-11 rounded-xl font-black text-sm cursor-pointer border transition-[background-color,color,box-shadow] duration-150',
                isCurrent
                  ? 'bg-duo-blue text-white border-duo-blue-shadow shadow-3d-blue'
                  : 'bg-white hover:bg-slate-50 text-ink-500 border-slate-200',
              )}
            >
              {p}
            </button>
          );
        })}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          id="pagination-next-btn"
        >
          {t('lessons.next')} <span aria-hidden="true">→</span>
        </Button>
      </div>

      <p className="text-xs text-ink-500 font-bold text-center" aria-live="polite">
        {t('lessons.range', { from, to, total: totalItems, page: currentPage, pages: totalPages })}
      </p>
    </nav>
  );
};
