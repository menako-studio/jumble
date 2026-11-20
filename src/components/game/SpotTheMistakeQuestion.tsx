import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AudioButton } from '../ui/AudioButton';

interface SpotTheMistakeQuestionProps {
  prompt: string;
  sentenceWords?: string[];
  options?: string[];
  selectedWord: string | null;
  onSelect: (word: string) => void;
  disabled?: boolean;
}

export const SpotTheMistakeQuestion: React.FC<SpotTheMistakeQuestionProps> = ({
  prompt,
  sentenceWords = [],
  options = [],
  selectedWord,
  onSelect,
  disabled = false,
}) => {
  const { t } = useTranslation();

  // Words to display for interactive selection
  const wordsToDisplay = sentenceWords.length > 0 ? sentenceWords : options;
  const sentenceFullText = wordsToDisplay.join(' ');

  return (
    <div className="flex flex-col gap-6 w-full font-nunito">
      {/* Context Statement Card */}
      <div className="bg-white rounded-xl3 p-6 border-2 border-b-4 border-surface-border shadow-card text-center relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black uppercase tracking-wider">
            <span aria-hidden="true">🔍</span>
            <span>{t('game.spotLabel')}</span>
          </span>
          {sentenceFullText && (
            <AudioButton text={sentenceFullText} size="sm" variant="glass" />
          )}
        </div>

        <h2 id="spot-prompt" className="text-ink-900 font-black text-lg md:text-xl leading-snug mb-2">
          {prompt || t('game.spotPrompt')}
        </h2>
        <p className="text-xs text-ink-500 font-bold">{t('game.spotHint')}</p>
      </div>

      {/* Interactive Sentence Word Tokens Area */}
      <div className="bg-surface-panel rounded-xl3 p-5 md:p-6 border-2 border-surface-border shadow-sm">
        <div role="group" aria-labelledby="spot-prompt" className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3.5">
          {wordsToDisplay.map((word, idx) => {
            // Clean token for checking
            const isSelected = selectedWord === word;

            return (
              <motion.button
                key={`${word}-${idx}`}
                type="button"
                aria-pressed={isSelected}
                whileHover={!disabled ? { scale: 1.05 } : {}}
                whileTap={!disabled ? { scale: 0.96 } : {}}
                onClick={() => !disabled && onSelect(word)}
                disabled={disabled}
                className={`
                  min-h-12 px-4 py-2.5 md:px-5 md:py-3 rounded-2xl font-black text-base md:text-lg transition-[background-color,border-color,box-shadow] duration-150 border-2 border-b-4
                  ${
                    isSelected
                      ? 'bg-amber-100 border-amber-500 text-amber-950 shadow-md scale-105 ring-2 ring-amber-400/50'
                      : 'bg-white hover:bg-slate-50 border-surface-border text-ink-800 shadow-sm'
                  }
                  ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer active:translate-y-0.5 active:border-b-2'}
                `}
                id={`mistake-token-${idx}`}
              >
                {word}
              </motion.button>
            );
          })}
        </div>

        {selectedWord && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-xs font-bold text-amber-800 bg-amber-50 py-1.5 px-3 rounded-xl border border-amber-200 inline-block mx-auto w-full"
          >
            {t('game.selectedWord')} <span className="font-black text-amber-950 underline decoration-amber-500 underline-offset-2">"{selectedWord}"</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
