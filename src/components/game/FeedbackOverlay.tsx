/**
 * FeedbackOverlay.tsx — Full-screen overlay for correct/incorrect feedback
 * Uses Framer Motion for smooth entrance/exit animations.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { GamePhase } from '../../types';

interface FeedbackOverlayProps {
  phase: GamePhase;
  explanation?: string | null;
  onContinue: () => void;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  phase,
  explanation,
  onContinue,
}) => {
  const { t } = useTranslation();
  const isCorrect = phase === 'correct';
  const isVisible = phase === 'correct' || phase === 'incorrect';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="feedback"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className={`
            fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-5
            ${isCorrect
              ? 'bg-gradient-to-t from-success-600/95 to-success-500/80 border-t-2 border-success-400'
              : 'bg-gradient-to-t from-danger-600/95 to-danger-500/80 border-t-2 border-danger-400'
            }
          `}
          style={{ backdropFilter: 'blur(12px)' }}
          id="feedback-overlay"
        >
          <div className="max-w-lg mx-auto">
            {/* Icon + message */}
            <div className="flex items-center gap-3 mb-3">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
                className="text-4xl leading-none"
              >
                {isCorrect ? '🎉' : '💪'}
              </motion.span>
              <div>
                <p className="text-white font-black text-xl leading-tight">
                  {isCorrect ? t('ui.correct') : t('ui.incorrect')}
                </p>
                {!isCorrect && explanation && (
                  <p className="text-white/80 text-sm mt-0.5 font-medium leading-snug">
                    {t('ui.explanation')}: {explanation}
                  </p>
                )}
              </div>
            </div>

            {/* Continue button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onClick={onContinue}
              className={`
                w-full py-4 rounded-xl2 font-black text-lg text-white transition-all duration-100
                ${isCorrect
                  ? 'bg-white/20 hover:bg-white/30 border border-white/30'
                  : 'bg-white/20 hover:bg-white/30 border border-white/30'
                }
              `}
              style={{ boxShadow: '0 3px 0 rgba(0,0,0,0.2)' }}
              id="feedback-continue-btn"
            >
              {t('ui.nextQuestion')}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
