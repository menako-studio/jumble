import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AudioButton } from '../ui/AudioButton';
import { Button } from '../ui/Button';
import type { ConceptIntro } from '../../types';

interface ConceptIntroWalkthroughProps {
  conceptIntro: ConceptIntro;
  lessonTitle: string;
  cefrLevel?: string;
  onStartChallenge: () => void;
  onSkip?: () => void;
}

export const ConceptIntroWalkthrough: React.FC<ConceptIntroWalkthroughProps> = ({
  conceptIntro,
  lessonTitle,
  cefrLevel,
  onStartChallenge,
  onSkip,
}) => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as 'en' | 'id') || 'en';
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [warmupSelected, setWarmupSelected] = useState<string | null>(null);
  const [warmupChecked, setWarmupChecked] = useState(false);

  const slides = conceptIntro.slides || [];
  const currentSlide = slides[currentSlideIndex];
  const isLastSlide = currentSlideIndex >= slides.length - 1;

  if (!currentSlide) {
    return null;
  }

  const title = lang === 'id' && currentSlide.title_id ? currentSlide.title_id : currentSlide.title;
  const ruleExplanation =
    lang === 'id' && currentSlide.ruleExplanation_id
      ? currentSlide.ruleExplanation_id
      : currentSlide.ruleExplanation;
  const examples =
    lang === 'id' && currentSlide.examples_id
      ? currentSlide.examples_id
      : currentSlide.examples;

  const warmup = currentSlide.warmupQuestion;

  const handleNextSlide = () => {
    if (isLastSlide) {
      onStartChallenge();
    } else {
      setCurrentSlideIndex((prev) => prev + 1);
      setWarmupSelected(null);
      setWarmupChecked(false);
    }
  };

  const isWarmupCorrect =
    warmupSelected && warmup && warmupSelected.trim().toLowerCase() === warmup.correctAnswer.trim().toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jumble font-nunito overflow-y-auto">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-sky-500/15 rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="w-full max-w-xl glass rounded-xl4 p-6 md:p-8 border border-brand-400/40 shadow-glow relative z-10 flex flex-col gap-6 my-auto"
        id="concept-intro-modal"
      >
        {/* Top Navigation & Step Indicator */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-500/30 text-brand-300 border border-brand-400/40 uppercase tracking-wide">
              {cefrLevel ? cefrLevel.replace('_PLUS', '+') : 'CONCEPT'}
            </span>
            <span className="text-white/60 text-xs font-bold truncate max-w-[200px] md:max-w-xs">
              {lessonTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/50 text-xs font-mono font-bold">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            {onSkip && (
              <button
                onClick={onSkip}
                className="text-white/40 hover:text-white text-xs font-bold underline px-2 py-1 transition-colors cursor-pointer"
                id="skip-intro-btn"
              >
                {t('ui.skipIntro', 'Skip Intro')}
              </button>
            )}
          </div>
        </div>

        {/* Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-5"
          >
            {/* Title & Formula Card */}
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-2xl">💡</span>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  {title}
                </h2>
              </div>

              {currentSlide.formula && (
                <div className="mt-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-brand-600/30 via-purple-600/30 to-sky-600/30 border border-brand-400/50 shadow-inner flex items-center justify-between gap-3">
                  <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Formula</span>
                  <code className="text-white font-mono font-black text-sm md:text-base tracking-wide">
                    {currentSlide.formula}
                  </code>
                </div>
              )}
            </div>

            {/* Rule Explanation */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/90 text-sm md:text-base font-medium leading-relaxed">
              {ruleExplanation}
            </div>

            {/* Key Examples with TTS */}
            {examples && examples.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-white/60 text-xs font-black uppercase tracking-wider">
                  {t('ui.keyExamples', 'Key Examples')}
                </span>
                <div className="flex flex-col gap-2">
                  {examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-surface-panel/80 border border-surface-border flex items-center justify-between gap-3 group hover:border-brand-400/50 transition-colors"
                    >
                      <p className="text-white font-bold text-sm md:text-base">{ex}</p>
                      <AudioButton text={ex} size="sm" variant="glass" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brilliant.org Interactive Micro Warmup */}
            {warmup && (
              <div className="mt-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <span className="text-emerald-300 text-xs font-black uppercase tracking-wider">
                    Interactive Warm-up
                  </span>
                </div>

                <p className="text-white font-bold text-sm md:text-base">
                  {lang === 'id' && warmup.prompt_id ? warmup.prompt_id : warmup.prompt}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {warmup.options.map((opt, i) => {
                    const isSelected = warmupSelected === opt;
                    const isCorrectOption = opt.trim().toLowerCase() === warmup.correctAnswer.trim().toLowerCase();

                    let btnStyle = 'bg-white/10 text-white hover:bg-white/20 border-white/10';
                    if (warmupChecked) {
                      if (isCorrectOption) {
                        btnStyle = 'bg-emerald-500 text-white border-emerald-400 font-black shadow-glow';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500 text-white border-rose-400 font-black';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-brand-500 text-white border-brand-300 font-black';
                    }

                    return (
                      <button
                        key={i}
                        disabled={warmupChecked}
                        onClick={() => setWarmupSelected(opt)}
                        className={`p-3 rounded-xl border text-sm font-bold text-left transition-all cursor-pointer ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {!warmupChecked ? (
                  <button
                    disabled={!warmupSelected}
                    onClick={() => setWarmupChecked(true)}
                    className="self-end px-4 py-2 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white transition-all cursor-pointer"
                  >
                    Check Understanding
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl text-xs font-bold ${
                      isWarmupCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {isWarmupCorrect ? '✨ Spot on! ' : '💡 Explanation: '}
                    {lang === 'id' && warmup.explanation_id ? warmup.explanation_id : warmup.explanation}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA Action Button */}
        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 mt-2">
          {currentSlideIndex > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentSlideIndex((prev) => prev - 1);
                setWarmupSelected(null);
                setWarmupChecked(false);
              }}
            >
              ← Prev
            </Button>
          ) : (
            <div />
          )}

          <Button
            variant="success"
            size="lg"
            onClick={handleNextSlide}
            className="flex-1 py-3.5 text-base font-black"
            id="intro-next-btn"
          >
            {isLastSlide ? t('ui.startChallenge', 'Start Challenge 🚀') : t('ui.nextStep', 'Next Concept →')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
