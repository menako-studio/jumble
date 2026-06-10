/**
 * WinModal.tsx — 1-3 star lesson completion modal with confetti
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { StarRating } from '../ui/StarRating';
import { Button } from '../ui/Button';

interface WinModalProps {
  stars: number;
  score: number;
  onPlayAgain: () => void;
  onBackToLessons: () => void;
}

const messageKey: Record<number, string> = {
  3: 'perfect',
  2: 'great',
  1: 'good',
  0: 'gameover',
};

export const WinModal: React.FC<WinModalProps> = ({
  stars,
  score,
  onPlayAgain,
  onBackToLessons,
}) => {
  const { t } = useTranslation();
  const msg = t(`ui.${messageKey[stars] ?? 'good'}`);

  return (
    <div className="modal-overlay" id="win-modal">
      {/* Rotating background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-spin-slow"
            style={{
              width: `${120 + i * 60}px`,
              height: `${120 + i * 60}px`,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%)`,
              border: '2px solid rgba(108,79,246,0.5)',
              animationDuration: `${8 + i * 3}s`,
              animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="glass rounded-xl4 p-8 w-full max-w-sm relative z-10 text-center shadow-card"
        id="win-modal-content"
      >
        {/* Trophy */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-7xl mb-4 leading-none"
        >
          🏆
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-black text-white mb-1"
        >
          {t('ui.levelclear')}
        </motion.h2>

        {/* Stars */}
        <div className="my-6">
          <StarRating stars={stars} size="lg" animate={true} />
        </div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/70 font-semibold text-base mb-4"
        >
          {msg}
        </motion.p>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-xl glass-light"
        >
          <span className="text-2xl">⚡</span>
          <div className="text-left">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wide">
              {t('ui.yourScore')}
            </p>
            <p className="text-white font-black text-2xl leading-tight">{score.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-3"
        >
          <Button variant="success" onClick={onPlayAgain} id="play-again-btn">
            🔁 {t('ui.playAgain')}
          </Button>
          <Button variant="ghost" onClick={onBackToLessons} id="back-to-lessons-btn">
            {t('ui.backToLessons')}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
