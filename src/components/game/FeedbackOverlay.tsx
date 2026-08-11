import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AudioButton } from '../ui/AudioButton';
import type { GamePhase, QuestionExplanation } from '../../types';

interface FeedbackOverlayProps {
  phase: GamePhase;
  isCorrect?: boolean | null;
  explanation?: QuestionExplanation | string | null;
  correctAnswerText?: string;
  onContinue: () => void;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  phase,
  isCorrect: isCorrectProp,
  explanation,
  correctAnswerText,
  onContinue,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'id';
  const isCorrect = isCorrectProp ?? (phase === 'FEEDBACK');
  const isVisible = phase === 'FEEDBACK';

  // Format explanation object or string
  const expObj: QuestionExplanation = typeof explanation === 'object' && explanation !== null
    ? explanation
    : {
        rule: 'Grammar Rule Summary',
        detailedReason: typeof explanation === 'string' ? explanation : 'Review sentence structure and verb agreement.',
      };

  const getRule = () => {
    if (lang === 'id' && expObj.rule_id) return expObj.rule_id;
    return expObj.rule;
  };

  const getReason = () => {
    if (lang === 'id' && expObj.detailedReason_id) return expObj.detailedReason_id;
    return expObj.detailedReason;
  };

  const getPitfall = () => {
    if (lang === 'id' && expObj.commonMistakeNote_id) return expObj.commonMistakeNote_id;
    return expObj.commonMistakeNote;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="feedback"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className={`
            fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-5 max-h-[85vh] overflow-y-auto
            ${isCorrect
              ? 'bg-gradient-to-t from-emerald-950/95 via-emerald-900/90 to-emerald-800/85 border-t-2 border-emerald-400'
              : 'bg-gradient-to-t from-rose-950/95 via-rose-900/90 to-rose-800/85 border-t-2 border-rose-400'
            }
          `}
          style={{ backdropFilter: 'blur(16px)', boxShadow: '0 -10px 40px rgba(0,0,0,0.5)' }}
          id="feedback-overlay"
        >
          <div className="max-w-lg mx-auto flex flex-col gap-4">
            {/* Header: Icon + Title + Audio CTA */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black shadow-lg shrink-0
                    ${isCorrect ? 'bg-emerald-400 text-emerald-950' : 'bg-rose-500 text-white'}
                  `}
                >
                  {isCorrect ? '✓' : '✕'}
                </motion.div>
                <div>
                  <h3 className="text-white font-black text-2xl leading-tight">
                    {isCorrect ? t('ui.correct', 'Excellent!') : t('ui.incorrect', 'Not quite right')}
                  </h3>
                  <p className="text-white/80 text-sm font-bold">
                    {isCorrect ? 'Great job applying this rule!' : 'Here is what you need to know:'}
                  </p>
                </div>
              </div>

              {/* Audio playback CTA for sentence */}
              {correctAnswerText && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/70 font-bold hidden sm:inline">Listen:</span>
                  <AudioButton text={correctAnswerText} variant="glass" size="lg" />
                </div>
              )}
            </div>

            {/* Revealed Correct Answer (For Error state) */}
            {!isCorrect && correctAnswerText && (
              <div className="bg-black/30 rounded-xl p-3.5 border border-white/10 flex items-center justify-between gap-3">
                <div>
                  <p className="text-rose-300 text-xs font-black uppercase tracking-wider mb-0.5">
                    Correct Answer:
                  </p>
                  <p className="text-white font-black text-lg font-mono">
                    {correctAnswerText}
                  </p>
                </div>
                <AudioButton text={correctAnswerText} variant="accent" size="md" />
              </div>
            )}

            {/* Granular Conceptual Breakdown Drawer */}
            <div className="bg-black/25 rounded-xl2 p-4 border border-white/10 flex flex-col gap-3">
              {/* 1. Rule Summary */}
              {getRule() && (
                <div className="flex items-start gap-2.5">
                  <span className="text-lg">📌</span>
                  <div>
                    <span className="text-amber-300 text-xs font-black uppercase tracking-wider block">
                      Rule Summary
                    </span>
                    <p className="text-white/95 font-bold text-sm leading-snug">
                      {getRule()}
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Detailed Reason / Why Incorrect */}
              {getReason() && (
                <div className="flex items-start gap-2.5 border-t border-white/10 pt-2.5">
                  <span className="text-lg">{isCorrect ? '💡' : '🔍'}</span>
                  <div>
                    <span className="text-sky-300 text-xs font-black uppercase tracking-wider block">
                      {isCorrect ? 'Why this works' : 'Why your answer was incorrect'}
                    </span>
                    <p className="text-white/90 text-xs sm:text-sm font-medium leading-relaxed">
                      {getReason()}
                    </p>
                  </div>
                </div>
              )}

              {/* 3. Example Context */}
              {expObj.exampleContext && (
                <div className="flex items-start gap-2.5 border-t border-white/10 pt-2.5">
                  <span className="text-lg">📝</span>
                  <div>
                    <span className="text-emerald-300 text-xs font-black uppercase tracking-wider block">
                      Example Context
                    </span>
                    <p className="text-white/90 text-xs sm:text-sm font-mono italic">
                      "{expObj.exampleContext}"
                    </p>
                  </div>
                </div>
              )}

              {/* 4. Common Mistake Note */}
              {getPitfall() && (
                <div className="flex items-start gap-2.5 border-t border-white/10 pt-2.5">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <span className="text-amber-400 text-xs font-black uppercase tracking-wider block">
                      Common Pitfall
                    </span>
                    <p className="text-white/80 text-xs font-medium">
                      {getPitfall()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Unlocked Continue Button */}
            <motion.button
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              onClick={onContinue}
              className={`
                w-full py-4 rounded-xl2 font-black text-lg text-white transition-all duration-150 shadow-lg cursor-pointer hover:scale-[1.01] active:scale-[0.99]
                ${isCorrect
                  ? 'bg-emerald-500 hover:bg-emerald-400 border-2 border-emerald-300 shadow-emerald-950/50'
                  : 'bg-rose-600 hover:bg-rose-500 border-2 border-rose-300 shadow-rose-950/50'
                }
              `}
              id="feedback-continue-btn"
            >
              {t('ui.nextQuestion', 'Continue →')}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
