import React from 'react';
import { motion } from 'framer-motion';

interface MultipleChoiceQuestionProps {
  prompt: string;
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  prompt,
  options,
  selectedOption,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Context Statement Card */}
      <div className="bg-white rounded-xl3 p-6 border-2 border-b-4 border-surface-border shadow-card text-center">
        <p className="text-ink-500 text-xs font-black uppercase tracking-widest mb-2">
          Multiple Choice Question
        </p>
        <h3 className="text-ink-900 font-black text-xl leading-snug">
          {prompt}
        </h3>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const letter = String.fromCharCode(65 + idx); // A, B, C, D

          return (
            <motion.button
              key={option}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => !disabled && onSelect(option)}
              disabled={disabled}
              className={`
                w-full p-4 rounded-xl2 flex items-center gap-3.5 text-left font-bold transition-all duration-150 border-2 border-b-4
                ${isSelected
                  ? 'bg-sky-50 border-duo-blue text-duo-blue-dark'
                  : 'bg-white hover:bg-slate-50 border-surface-border text-ink-700'
                }
                ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer active:translate-y-0.5 active:border-b-2'}
              `}
              id={`mc-option-${idx}`}
            >
              <div
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-colors shrink-0
                  ${isSelected ? 'bg-duo-blue text-white' : 'bg-slate-100 text-ink-500'}
                `}
              >
                {letter}
              </div>
              <span className="text-lg flex-1 font-extrabold">{option}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
