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
            ${isCorrect ? 'feedback-drawer--correct' : 'feedback-drawer--incorrect'}
          `}
          style={{ boxShadow: '0 -10px 40px rgba(15,23,42,0.12)' }}
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
                    ${isCorrect ? 'bg-duo-green text-white' : 'bg-duo-red text-white'}
                  `}
                >
                  {isCorrect ? '✓' : '✕'}
                </motion.div>
                <div>
                  <h3 className={`font-black text-2xl leading-tight ${isCorrect ? 'text-feedback-mintText' : 'text-feedback-coralText'}`}>
                    {isCorrect ? t('ui.correct', 'Excellent!') : t('ui.incorrect', 'Not quite right')}
                  </h3>
                  <p className={`text-sm font-bold ${isCorrect ? 'text-feedback-mintText/70' : 'text-feedback-coralText/70'}`}>
                    {isCorrect ? 'Great job applying this rule!' : 'Here is what you need to know:'}
                  </p>
                </div>
              </div>

              {/* Audio playback CTA for sentence */}
              {correctAnswerText && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-500 font-bold hidden sm:inline">Listen:</span>
                  <AudioButton text={correctAnswerText} variant="glass" size="lg" />
                </div>
              )}
            </div>

            {/* Revealed Correct Answer (For Error state) */}
            {!isCorrect && correctAnswerText && (
              <div className="bg-white/70 rounded-xl p-3.5 border-2 border-white flex items-center justify-between gap-3">
                <div>
                  <p className="text-duo-red-dark text-xs font-black uppercase tracking-wider mb-0.5">
                    Correct Answer:
                  </p>
                  <p className="text-ink-900 font-black text-lg font-mono">
                    {correctAnswerText}
                  </p>
                </div>
                <AudioButton text={correctAnswerText} variant="accent" size="md" />
              </div>
            )}

            {/* Granular Conceptual Breakdown Drawer */}
            <div className="bg-white/70 rounded-xl2 p-4 border-2 border-white flex flex-col gap-3">
              {/* 1. Rule Summary */}
              {getRule() && (
                <div className="flex items-start gap-2.5">
                  <span className="text-lg">📌</span>
                  <div>
                    <span className="text-duo-orange-dark text-xs font-black uppercase tracking-wider block">
                      Rule Summary
                    </span>
                    <p className="text-ink-900 font-bold text-sm leading-snug">
                      {getRule()}
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Detailed Reason / Why Incorrect */}
              {getReason() && (
                <div className="flex items-start gap-2.5 border-t border-slate-900/10 pt-2.5">
                  <span className="text-lg">{isCorrect ? '💡' : '🔍'}</span>
                  <div>
                    <span className="text-duo-blue-dark text-xs font-black uppercase tracking-wider block">
                      {isCorrect ? 'Why this works' : 'Why your answer was incorrect'}
                    </span>
                    <p className="text-ink-700 text-xs sm:text-sm font-medium leading-relaxed">
                      {getReason()}
                    </p>
                  </div>
                </div>
              )}

              {/* 3. Example Context */}
              {expObj.exampleContext && (
                <div className="flex items-start gap-2.5 border-t border-slate-900/10 pt-2.5">
                  <span className="text-lg">📝</span>
                  <div>
                    <span className="text-duo-green-dark text-xs font-black uppercase tracking-wider block">
                      Example Context
                    </span>
                    <p className="text-ink-700 text-xs sm:text-sm font-mono italic">
                      "{expObj.exampleContext}"
                    </p>
                  </div>
                </div>
              )}

              {/* 4. Common Mistake Note */}
              {getPitfall() && (
                <div className="flex items-start gap-2.5 border-t border-slate-900/10 pt-2.5">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <span className="text-duo-orange-dark text-xs font-black uppercase tracking-wider block">
                      Common Pitfall
                    </span>
                    <p className="text-ink-500 text-xs font-medium">
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
                  ? 'bg-duo-green hover:bg-duo-green-dark border-2 border-b-4 border-duo-green-shadow'
                  : 'bg-duo-red hover:bg-duo-red-dark border-2 border-b-4 border-duo-red-shadow'
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
