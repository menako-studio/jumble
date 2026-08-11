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
      <div className="glass rounded-xl3 p-6 border border-white/10 shadow-glow text-center">
        <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-2">
          Multiple Choice Question
        </p>
        <h3 className="text-white font-black text-xl leading-snug">
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
                w-full p-4 rounded-xl2 flex items-center gap-3.5 text-left font-bold transition-all duration-200 border-2
                ${isSelected
                  ? 'bg-brand-500/25 border-brand-400 text-white shadow-glow'
                  : 'glass hover:bg-white/15 border-surface-border text-white/90'
                }
                ${disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:scale-[1.02]'}
              `}
              style={{
                boxShadow: isSelected ? '0 0 20px rgba(99,102,241,0.4)' : '0 4px 12px rgba(0,0,0,0.2)',
              }}
              id={`mc-option-${idx}`}
            >
              <div
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-colors
                  ${isSelected ? 'bg-brand-500 text-white' : 'bg-white/10 text-white/60'}
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
