import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AudioButton } from '../ui/AudioButton';
import { Button } from '../ui/Button';
import { AITutorModal } from './AITutorModal';
import { getHeartsState, MAX_HEARTS } from '../../lib/heartsManager';
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
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const heartsState = getHeartsState();
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
    <div className="fixed inset-0 z-50 flex flex-col bg-[#121214] font-nunito text-white overflow-hidden">
      {/* Dynamic Background Subtle Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      </div>

      {/* TOP HEADER (Matching intro.png: Close btn left, Segmented progress bar, Hearts/Stars right) */}
      <header className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-4 max-w-5xl mx-auto w-full z-20">
        {/* Left: Close Button (✕) */}
        <button
          onClick={onSkip || onStartChallenge}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-all cursor-pointer text-lg"
          title="Exit Intro"
          id="exit-intro-btn"
        >
          ✕
        </button>

        {/* Center: Segmented Progress Bar */}
        <div className="flex-1 max-w-xs md:max-w-md flex items-center gap-1.5 h-2.5 bg-white/10 rounded-full p-0.5 overflow-hidden">
          {slides.map((_, idx) => {
            const isCompleted = idx < currentSlideIndex;
            const isCurrent = idx === currentSlideIndex;
            return (
              <div
                key={idx}
                className={`h-full flex-1 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'bg-emerald-400 shadow-glow scale-y-110'
                    : isCompleted
                    ? 'bg-emerald-600'
                    : 'bg-white/20'
                }`}
              />
            );
          })}
        </div>

        {/* Right: Hearts & Stars Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-xs font-black">
            <span>{heartsState.isProUser ? '♾️' : '❤️'}</span>
            <span>{heartsState.isProUser ? 'PRO' : `${heartsState.heartsCount}/${MAX_HEARTS}`}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-black text-xs">
            <span>⚡</span>
            <span>{cefrLevel ? cefrLevel.replace('_PLUS', '+') : 'A1'}</span>
          </div>
        </div>
      </header>

      {/* MAIN STEP CONTENT AREA (Matching intro.png layout) */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 md:py-10 flex flex-col justify-between overflow-y-auto z-10 no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-6"
          >
            {/* Title Header */}
            <div>
              <span className="text-emerald-400 text-xs font-black uppercase tracking-widest block mb-1">
                {lessonTitle} • STEP {currentSlideIndex + 1} OF {slides.length}
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
                {title}
              </h1>

              {currentSlide.formula && (
                <div className="mt-4 px-4 py-3 rounded-2xl bg-gradient-to-r from-brand-600/30 via-purple-600/30 to-sky-600/30 border border-brand-400/40 shadow-inner flex items-center justify-between gap-3">
                  <span className="text-xs text-amber-300 font-black uppercase tracking-wider">Formula</span>
                  <code className="text-white font-mono font-black text-sm md:text-base tracking-wide">
                    {currentSlide.formula}
                  </code>
                </div>
              )}
            </div>

            {/* Explanation Body */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white/90 text-sm md:text-base font-medium leading-relaxed shadow-sm">
              {ruleExplanation}
            </div>

            {/* Key Examples with Audio */}
            {examples && examples.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-white/60 text-xs font-black uppercase tracking-wider">
                  {t('ui.keyExamples', 'Key Examples')}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-surface-panel/80 border border-surface-border flex items-center justify-between gap-3 group hover:border-emerald-500/40 transition-colors"
                    >
                      <p className="text-white font-bold text-sm md:text-base">{ex}</p>
                      <AudioButton text={ex} size="sm" variant="glass" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brilliant.org Interactive Micro Warm-up Card */}
            {warmup && (
              <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <span className="text-emerald-400 text-xs font-black uppercase tracking-wider">
                    Interactive Warm-up
                  </span>
                </div>

                <p className="text-white font-black text-base md:text-lg">
                  {lang === 'id' && warmup.prompt_id ? warmup.prompt_id : warmup.prompt}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {warmup.options.map((opt, i) => {
                    const isSelected = warmupSelected === opt;
                    const isCorrectOption = opt.trim().toLowerCase() === warmup.correctAnswer.trim().toLowerCase();

                    let btnStyle = 'bg-white/10 text-white hover:bg-white/20 border-white/10';
                    if (warmupChecked) {
                      if (isCorrectOption) {
                        btnStyle = 'bg-emerald-500 text-white border-emerald-400 font-black shadow-glow scale-[1.01]';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500 text-white border-rose-400 font-black';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-duo-blue text-white border-duo-blue-light font-black shadow-3d-blue scale-[1.01]';
                    }

                    return (
                      <button
                        key={i}
                        disabled={warmupChecked}
                        onClick={() => setWarmupSelected(opt)}
                        className={`p-4 rounded-2xl border text-sm font-bold text-left transition-all cursor-pointer ${btnStyle}`}
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
                    className="self-end px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white transition-all cursor-pointer shadow-md"
                  >
                    Check Understanding
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl text-xs md:text-sm font-bold ${
                      isWarmupCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
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
      </main>

      {/* BOTTOM ACTION BAR (Matching intro.png: AI Tutor Button Bottom-Left, Action CTA Bottom-Right) */}
      <footer className="p-4 bg-[#18181c] border-t border-white/10 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          {/* Bottom Left: Groq AI Assistant LLM Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-duo-blue to-purple-600 hover:from-duo-blue-light hover:to-purple-500 text-white font-black text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-glow animate-pulse-glow"
            id="open-ai-tutor-btn"
          >
            <span className="text-base">⚡</span>
            <span>Ask Groq AI</span>
          </button>

          {/* Bottom Right / CTA Action Button */}
          <div className="flex items-center gap-2">
            {currentSlideIndex > 0 && (
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
            )}

            <Button
              variant="success"
              size="lg"
              onClick={handleNextSlide}
              className="py-3 px-8 text-sm md:text-base font-black"
              id="intro-next-btn"
            >
              {isLastSlide ? t('ui.startChallenge', 'Start Challenge 🚀') : t('ui.nextStep', 'Continue →')}
            </Button>
          </div>
        </div>
      </footer>

      {/* AI Tutor Modal Drawer */}
      <AITutorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        lessonTitle={lessonTitle}
        cefrLevel={cefrLevel}
        ruleExplanation={ruleExplanation}
        examples={examples}
      />
    </div>
  );
};
