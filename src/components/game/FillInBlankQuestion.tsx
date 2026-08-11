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
        <p className="text-white font-black text-xl leading-relaxed">
          {prompt}
        </p>
      );
    }

    return (
      <div className="text-white font-black text-xl leading-relaxed flex flex-wrap items-center justify-center gap-2">
        <span>{parts[0]}</span>
        <motion.span
          key={selectedAnswer || 'blank'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`
            px-4 py-1.5 rounded-xl border-2 font-black text-lg min-w-28 text-center transition-all inline-block
            ${selectedAnswer
              ? 'bg-brand-500/30 border-brand-400 text-brand-200 shadow-glow'
              : 'bg-white/10 border-dashed border-white/30 text-white/40'
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
      <div className="glass rounded-xl3 p-6 border border-white/10 shadow-glow text-center min-h-36 flex flex-col justify-center items-center">
        <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-3">
          Fill in the Blank
        </p>
        {renderSentenceWithBlank()}
      </div>

      {/* Option Chips Bank */}
      <div className="glass rounded-xl2 p-4 border border-surface-border">
        <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3 text-center">
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
                  px-5 py-3 rounded-xl2 font-black text-base transition-all duration-150 border-2
                  ${isSelected
                    ? 'bg-brand-500 border-brand-300 text-white scale-105 shadow-glow'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }
                  ${disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
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
