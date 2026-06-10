/**
 * ProgressBar.tsx — Lesson progress bar with animated fill
 */

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;   // e.g. 2
  total: number;     // e.g. 5
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const pct = Math.min((current / total) * 100, 100);

  return (
    <div className="progress-track flex-1" role="progressbar" aria-valuenow={current} aria-valuemax={total}>
      <motion.div
        className="progress-fill"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
};
