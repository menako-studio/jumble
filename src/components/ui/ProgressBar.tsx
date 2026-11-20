/**
 * ProgressBar.tsx — Lesson progress bar with animated fill
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ProgressBarProps {
  current: number;   // e.g. 2
  total: number;     // e.g. 5
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const { t } = useTranslation();
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className="progress-track flex-1" role="progressbar"
      aria-label={t('ui.progressLabel')}
      aria-valuemin={0}
      aria-valuenow={current}
      aria-valuemax={total}
    >
      <motion.div
        className="progress-fill"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
};
