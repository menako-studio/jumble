import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { AudioButton } from '../ui/AudioButton';
import { IconButton } from '../ui/IconButton';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AITutorModal } from './AITutorModal';
import { getHeartsState, MAX_HEARTS } from '../../lib/heartsManager';
import type { ConceptIntro } from '../../types';

interface ConceptIntroWalkthroughProps {
  conceptIntro: ConceptIntro;
  lessonTitle: string;
  cefrLevel?: string;
  onStartChallenge: () => void;
  onClose?: () => void;
  onSkip?: () => void;
}

export const ConceptIntroWalkthrough: React.FC<ConceptIntroWalkthroughProps> = ({
  conceptIntro,
  lessonTitle,
  cefrLevel,
  onStartChallenge,
  onClose,
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
    <Modal
      isOpen
      variant="fullscreen"
      dismissible={false}
      label={t('intro.dialog', { title: lessonTitle })}
      className="flex flex-col bg-jumble text-ink-900 overflow-hidden"
    >
      {/* Dynamic Background Subtle Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-duo-blue/8 rounded-full blur-3xl" />
      </div>

      {/* TOP HEADER (Matching intro.png: Close btn left, Segmented progress bar, Hearts/Stars right) */}
      <header className="px-4 py-3 border-b border-surface-border bg-white/80 backdrop-blur-sm flex items-center justify-between gap-4 max-w-5xl mx-auto w-full z-20">
        {/* Left: Close Button (✕) */}
        <IconButton
          label={t('game.exit')}
          onClick={onClose || onSkip || onStartChallenge}
          className="bg-slate-100 !rounded-xl"
          id="exit-intro-btn"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </IconButton>

        {/* Center: Segmented Progress Bar */}
        <div
          role="progressbar"
          aria-label={t('intro.progress')}
          aria-valuemin={1}
          aria-valuemax={slides.length}
          aria-valuenow={currentSlideIndex + 1}
          className="flex-1 max-w-xs md:max-w-md flex items-center gap-1.5 h-2.5 bg-slate-100 rounded-full p-0.5 overflow-hidden"
        >
          {slides.map((_, idx) => {
            const isCompleted = idx < currentSlideIndex;
            const isCurrent = idx === currentSlideIndex;
            return (
              <div
                key={idx}
                className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                  isCurrent
                    ? 'bg-duo-green shadow-glow'
                    : isCompleted
                    ? 'bg-duo-green-dark'
                    : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>

        {/* Right: Hearts & Stars Indicator */}
        <div className="flex items-center gap-3">
          <div
            role="img"
            aria-label={heartsState.isProUser ? t('game.heartsPro') : t('game.heartsLabel', { count: heartsState.heartsCount, max: MAX_HEARTS })}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface-panel border border-surface-border text-xs font-black text-ink-900"
          >
            <span aria-hidden="true">{heartsState.isProUser ? '♾️' : '❤️'}</span>
            <span aria-hidden="true">{heartsState.isProUser ? 'PRO' : `${heartsState.heartsCount}/${MAX_HEARTS}`}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-800 font-black text-xs">
            <span aria-hidden="true">⚡</span>
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
              <span className="text-green-800 text-xs font-black uppercase tracking-widest block mb-1">
                {lessonTitle} • {t('intro.step', { current: currentSlideIndex + 1, total: slides.length })}
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-ink-900 leading-tight">
                {title}
              </h1>

              {currentSlide.formula && (
                <div className="mt-4 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border-2 border-duo-blue/20 flex items-center justify-between gap-3">
                  <span className="text-xs text-amber-800 font-black uppercase tracking-wider">{t('intro.formula')}</span>
                  <code className="text-ink-900 font-mono font-black text-sm md:text-base tracking-wide">
                    {currentSlide.formula}
                  </code>
                </div>
              )}
            </div>

            {/* Explanation Body */}
            <div className="p-5 rounded-2xl bg-white border-2 border-surface-border text-ink-700 text-sm md:text-base font-medium leading-relaxed shadow-card">
              {ruleExplanation}
            </div>

            {/* Key Examples with Audio */}
            {examples && examples.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-ink-500 text-xs font-black uppercase tracking-wider">
                  {t('ui.keyExamples')}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-surface-panel border border-surface-border flex items-center justify-between gap-3 group hover:border-emerald-300 transition-colors"
                    >
                      <p className="text-ink-900 font-bold text-sm md:text-base">{ex}</p>
                      <AudioButton text={ex} size="sm" variant="glass" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brilliant.org Interactive Micro Warm-up Card */}
            {warmup && (
              <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex flex-col gap-4 shadow-card">
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">🎯</span>
                  <span className="text-emerald-800 text-xs font-black uppercase tracking-wider">
                    {t('intro.warmup')}
                  </span>
                </div>

                <p className="text-ink-900 font-black text-base md:text-lg">
                  {lang === 'id' && warmup.prompt_id ? warmup.prompt_id : warmup.prompt}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {warmup.options.map((opt, i) => {
                    const isSelected = warmupSelected === opt;
                    const isCorrectOption = opt.trim().toLowerCase() === warmup.correctAnswer.trim().toLowerCase();

                    let btnStyle = 'bg-white text-ink-900 hover:bg-slate-50 border-slate-200';
                    if (warmupChecked) {
                      if (isCorrectOption) {
                        btnStyle = 'bg-duo-green text-white border-duo-green-shadow font-black';
                      } else if (isSelected) {
                        btnStyle = 'bg-red-700 text-white border-red-900 font-black';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-sky-700 text-white border-sky-900 font-black';
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={warmupChecked}
                        aria-pressed={isSelected}
                        onClick={() => setWarmupSelected(opt)}
                        className={`min-h-12 p-4 rounded-2xl border-2 text-sm font-bold text-left transition-colors cursor-pointer ${btnStyle}`}
                      >
                        {opt}
                        {/* Result is never colour-only: icon + screen-reader text */}
                        {warmupChecked && isCorrectOption && (
                          <>
                            <span aria-hidden="true"> ✓</span>
                            <span className="sr-only"> ({t('intro.correctOption')})</span>
                          </>
                        )}
                        {warmupChecked && isSelected && !isCorrectOption && (
                          <>
                            <span aria-hidden="true"> ✕</span>
                            <span className="sr-only"> ({t('intro.wrongOption')})</span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>

                {!warmupChecked ? (
                  <Button
                    variant="success"
                    size="sm"
                    disabled={!warmupSelected}
                    onClick={() => setWarmupChecked(true)}
                    className="self-end"
                  >
                    {t('intro.check')}
                  </Button>
                ) : (
                  <motion.div
                    role="status"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl text-sm font-bold ${
                      isWarmupCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {isWarmupCorrect ? t('intro.spotOn') : t('intro.explanation')}{' '}
                    {lang === 'id' && warmup.explanation_id ? warmup.explanation_id : warmup.explanation}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* BOTTOM ACTION BAR (Matching intro.png: AI Tutor Button Bottom-Left, Action CTA Bottom-Right) */}
      <footer className="p-4 bg-white border-t border-surface-border z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          {/* Bottom Left: Groq AI Assistant LLM Button */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            aria-haspopup="dialog"
            className="px-4 min-h-12 rounded-2xl bg-gradient-to-r from-sky-700 to-indigo-600 hover:from-sky-800 hover:to-indigo-700 text-white font-black text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-glow"
            id="open-ai-tutor-btn"
          >
            <span className="text-base" aria-hidden="true">⚡</span>
            <span>{t('intro.ask')}</span>
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
                <span aria-hidden="true">←</span> {t('intro.prev')}
              </Button>
            )}

            <Button
              variant="success"
              size="lg"
              onClick={handleNextSlide}
              className="py-3 px-8 text-sm md:text-base font-black"
              id="intro-next-btn"
            >
              {isLastSlide ? t('ui.startChallenge') : t('ui.nextStep')}
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
    </Modal>
  );
};
