/**
 * GameOverModal.tsx — Game over screen shown when lives reach 0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface GameOverModalProps {
  score: number;
  onPlayAgain: () => void;
  onBackToLessons: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ score, onPlayAgain, onBackToLessons }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen
      label={t('ui.gameover')}
      dismissible={false}
      className="max-w-sm rounded-xl4 p-8 text-center border-slate-100"
    >
      <div id="gameover-modal-content">
        <motion.div
          aria-hidden="true"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-7xl mb-4 leading-none"
        >
          💔
        </motion.div>

        <h2 className="text-3xl font-black text-ink-900 mb-2">{t('ui.gameover')}</h2>
        <p className="text-ink-500 font-semibold text-sm mb-6">{t('ui.incorrect')}</p>

        <div className="flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-xl bg-amber-50 border-2 border-amber-100">
          <span className="text-2xl" aria-hidden="true">⚡</span>
          <div className="text-left">
            <p className="text-amber-800 text-xs font-semibold uppercase tracking-wide">{t('ui.yourScore')}</p>
            <p className="text-amber-800 font-black text-2xl leading-tight">{score.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={onPlayAgain} id="gameover-play-again-btn">
            <span aria-hidden="true">🔁</span> {t('ui.playAgain')}
          </Button>
          <Button variant="ghost" onClick={onBackToLessons} id="gameover-back-btn">
            {t('ui.backToLessons')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
