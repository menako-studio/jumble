/**
 * ComboDisplay.tsx — Animated combo counter badge
 */

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ComboDisplayProps {
  combo: number;
}

export const ComboDisplay: React.FC<ComboDisplayProps> = ({ combo }) => {
  const { t } = useTranslation();

  if (combo < 2) return null;

  const color =
    combo >= 5 ? 'from-yellow-400 to-orange-400' :
    combo >= 3 ? 'from-purple-400 to-pink-400' :
                 'from-brand-400 to-accent-400';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={combo}
        initial={{ scale: 0, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        className={`flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white font-black text-sm shadow-lg`}
      >
        <span className="text-base">🔥</span>
        <span>{combo}x {t('ui.combo')}</span>
      </motion.div>
    </AnimatePresence>
  );
};
