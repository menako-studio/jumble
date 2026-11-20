/**
 * WinModal.tsx — 1-3 star lesson completion modal
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { StarRating } from '../ui/StarRating';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

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

export const WinModal: React.FC<WinModalProps> = ({ stars, score, onPlayAgain, onBackToLessons }) => {
  const { t } = useTranslation();
  const message = stars === 0 ? t('modals.noStars') : t(`ui.${messageKey[stars] ?? 'good'}`);
  const title = stars > 0 ? t('ui.levelclear') : t('modals.needsPractice');

  return (
    <Modal
      isOpen
      label={title}
      dismissible={false}
      className="max-w-sm rounded-xl4 p-8 text-center border-slate-100"
      backdrop={
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
                border: '2px solid rgba(88,204,2,0.4)',
                animationDuration: `${8 + i * 3}s`,
                animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
              }}
            />
          ))}
        </div>
      }
    >
      <div id="win-modal-content">
        <motion.div
          aria-hidden="true"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-7xl mb-4 leading-none"
        >
          {stars > 0 ? '🏆' : '💪'}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-black text-ink-900 mb-1"
        >
          {title}
        </motion.h2>

        <div className="my-6">
          <StarRating stars={stars} size="lg" animate={true} />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-ink-500 font-semibold text-base mb-4"
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-xl bg-amber-50 border-2 border-amber-100"
        >
          <span className="text-2xl" aria-hidden="true">⚡</span>
          <div className="text-left">
            <p className="text-amber-800 text-xs font-semibold uppercase tracking-wide">{t('ui.yourScore')}</p>
            <p className="text-amber-800 font-black text-2xl leading-tight">{score.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-3"
        >
          <Button variant="success" onClick={onPlayAgain} id="play-again-btn">
            <span aria-hidden="true">🔁</span> {stars === 0 ? t('modals.tryAgain') : t('ui.playAgain')}
          </Button>
          <Button variant="ghost" onClick={onBackToLessons} id="back-to-lessons-btn">
            {t('ui.backToLessons')}
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
};
