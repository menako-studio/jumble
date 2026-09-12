import React from 'react';
import { motion } from 'framer-motion';

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
  // Render prompt with filled answer chip or blank slot
  const renderSentenceWithBlank = () => {
    const parts = prompt.split('_____');
    if (parts.length < 2) {
      return (
        <p className="text-ink-900 font-black text-xl leading-relaxed">
          {prompt}
        </p>
      );
    }

    return (
      <div className="text-ink-900 font-black text-xl leading-relaxed flex flex-wrap items-center justify-center gap-2">
        <span>{parts[0]}</span>
        <motion.span
          key={selectedAnswer || 'blank'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`
            px-4 py-1.5 rounded-xl border-2 font-black text-lg min-w-28 text-center transition-all inline-block
            ${selectedAnswer
              ? 'bg-sky-50 border-duo-blue text-duo-blue-dark'
              : 'bg-slate-50 border-dashed border-slate-300 text-ink-400'
            }
          `}
        >
          {selectedAnswer || '____?____'}
        </motion.span>
        <span>{parts[1]}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Target Sentence Card */}
      <div className="bg-white rounded-xl3 p-6 border-2 border-b-4 border-surface-border shadow-card text-center min-h-36 flex flex-col justify-center items-center">
        <p className="text-ink-500 text-xs font-black uppercase tracking-widest mb-3">
          Fill in the Blank
        </p>
        {renderSentenceWithBlank()}
      </div>

      {/* Option Chips Bank */}
      <div className="bg-surface-panel rounded-xl2 p-4 border-2 border-surface-border">
        <p className="text-ink-500 text-xs font-bold uppercase tracking-wider mb-3 text-center">
          Tap the correct word to fill the gap:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            return (
              <motion.button
                key={opt}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => !disabled && onSelect(opt)}
                disabled={disabled}
                className={`
                  px-5 py-3 rounded-xl2 font-black text-base transition-all duration-150 border-2 border-b-4
                  ${isSelected
                    ? 'bg-duo-blue border-duo-blue-shadow text-white scale-105'
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
