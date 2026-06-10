/**
 * GameOverModal.tsx — Game over screen shown when lives reach 0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

interface GameOverModalProps {
  score: number;
  onPlayAgain: () => void;
  onBackToLessons: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  onPlayAgain,
  onBackToLessons,
}) => {
  const { t } = useTranslation();

  return (
    <div className="modal-overlay" id="gameover-modal">
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="glass rounded-xl4 p-8 w-full max-w-sm text-center shadow-card"
        id="gameover-modal-content"
      >
        {/* Broken heart */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-7xl mb-4 leading-none"
        >
          💔
        </motion.div>

        <h2 className="text-3xl font-black text-white mb-2">
          {t('ui.gameover')}
        </h2>

        <p className="text-white/60 font-semibold text-sm mb-6">
          {t('ui.incorrect')}
        </p>

        {/* Score */}
        <div className="flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-xl glass-light">
          <span className="text-2xl">⚡</span>
          <div className="text-left">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wide">
              {t('ui.yourScore')}
            </p>
            <p className="text-white font-black text-2xl leading-tight">{score.toLocaleString()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={onPlayAgain} id="gameover-play-again-btn">
            🔁 {t('ui.playAgain')}
          </Button>
          <Button variant="ghost" onClick={onBackToLessons} id="gameover-back-btn">
            {t('ui.backToLessons')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
