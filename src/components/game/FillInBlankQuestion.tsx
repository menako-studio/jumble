import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface FillInBlankQuestionProps {
  prompt: string;
  options?: string[];
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  disabled?: boolean;
}

export const FillInBlankQuestion: React.FC<FillInBlankQuestionProps> = ({
  prompt,
  options = [],
  selectedAnswer,
  onSelect,
  disabled = false,
}) => {
  const { t } = useTranslation();

  // Render prompt with filled answer chip or blank slot
  const renderSentenceWithBlank = () => {
    const parts = prompt.split('_____');
    if (parts.length < 2) {
      return <p className="text-ink-900 font-black text-xl leading-relaxed">{prompt}</p>;
    }

    return (
      <p className="text-ink-900 font-black text-xl leading-relaxed flex flex-wrap items-center justify-center gap-2">
        <span>{parts[0]}</span>
        <motion.span
          key={selectedAnswer || 'blank'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`
            px-4 py-1.5 rounded-xl border-2 font-black text-lg min-w-28 text-center inline-block
            ${selectedAnswer
              ? 'bg-sky-50 border-duo-blue text-sky-800'
              : 'bg-slate-50 border-dashed border-slate-400 text-ink-500'
            }
          `}
        >
          <span aria-hidden="true">{selectedAnswer || '____?____'}</span>
          <span className="sr-only">{selectedAnswer || t('game.blank')}</span>
        </motion.span>
        <span>{parts[1]}</span>
      </p>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Target Sentence Card */}
      <div className="bg-white rounded-xl3 p-6 border-2 border-b-4 border-surface-border shadow-card text-center min-h-36 flex flex-col justify-center items-center">
        <h2 className="text-ink-500 text-xs font-black uppercase tracking-widest mb-3">{t('game.fibLabel')}</h2>
        {renderSentenceWithBlank()}
      </div>

      {/* Option Chips Bank */}
      <div className="bg-surface-panel rounded-xl2 p-4 border-2 border-surface-border">
        <p id="fib-hint" className="text-ink-500 text-xs font-bold uppercase tracking-wider mb-3 text-center">
          {t('game.fibHint')}
        </p>
        <div role="group" aria-labelledby="fib-hint" className="flex flex-wrap items-center justify-center gap-3">
          {options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            return (
              <motion.button
                key={opt}
                type="button"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => !disabled && onSelect(opt)}
                disabled={disabled}
                aria-pressed={isSelected}
                className={`
                  min-h-12 px-5 py-3 rounded-xl2 font-black text-base transition-[background-color,border-color,color] duration-150 border-2 border-b-4
                  ${isSelected
                    ? 'bg-sky-700 border-sky-900 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-ink-900'
                  }
                  ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer active:translate-y-0.5 active:border-b-2'}
                `}
                id={`fib-option-${idx}`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
