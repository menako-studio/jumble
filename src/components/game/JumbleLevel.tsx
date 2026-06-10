/**
 * JumbleLevel.tsx ⭐ — The Core Gameplay Component
 *
 * This component orchestrates:
 *   1. DnD context (dnd-kit) for drag-and-drop between WordBank and AnswerZone
 *   2. Game state via useGameState reducer (lives, combo, score, phase)
 *   3. Question progression and phase transitions
 *   4. Visual feedback: shake animation, correct/incorrect highlighting
 *   5. Win/GameOver modals with confetti
 *
 * State Machine Phases:
 *   loading → playing → correct/incorrect → playing → ... → win | gameover
 *
 * Word ID system:
 *   Each word gets a unique id: `{zone}_{word}_{originalIndex}`
 *   This handles duplicate words correctly (e.g. "the the cat")
 */

import React, { useState } from 'react';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';


import { useConfetti } from '../../hooks/useConfetti';
import { calculateStars } from '../../lib/starCalculator';
import { checkAnswer } from '../../lib/evaluator';

import { ProgressBar } from '../ui/ProgressBar';
import { HeartBar } from '../ui/HeartBar';
import { ComboDisplay } from '../ui/ComboDisplay';
import { Button } from '../ui/Button';
import { WordBank } from './WordBank';
import { AnswerZone } from './AnswerZone';
import { WordBlock } from './WordBlock';
import { FeedbackOverlay } from './FeedbackOverlay';
import { WinModal } from './WinModal';
import { GameOverModal } from './GameOverModal';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';

import type { Question } from '../../types';

// ——— Types ———

interface WordItem {
  id: string;
  word: string;
}

interface JumbleLevelProps {
  questions: Question[];
  lessonName: string;
  onComplete?: (stars: number, score: number) => void;
  onExit?: () => void;
}


// ——— Helper: build word item list from string array ———

function buildItems(words: string[], zone: 'bank' | 'ans'): WordItem[] {
  return words.map((word, i) => ({ id: `${zone}_${word}_${i}`, word }));
}

// ============================================================
// COMPONENT
// ============================================================

export const JumbleLevel: React.FC<JumbleLevelProps> = ({
  questions,
  lessonName,
  onComplete: _onComplete,
  onExit,
}) => {
  const { t, i18n } = useTranslation();
  const { fireWin, fireCorrect } = useConfetti();

  // ——— Core game state ———
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);

  type Phase = 'playing' | 'correct' | 'incorrect' | 'win' | 'gameover';
  const [phase, setPhase] = useState<Phase>('playing');

  // ——— Word lists (using stable ids) ———
  const [bankItems, setBankItems] = useState<WordItem[]>(() => {
    const q = questions[0];
    if (!q) return [];
    const shuffled = [...q.jumbled_word_order].sort(() => Math.random() - 0.5);
    return buildItems(shuffled, 'bank');
  });
  const [answerItems, setAnswerItems] = useState<WordItem[]>([]);

  // ——— Active drag tracking (for DragOverlay) ———
  const [activeItem, setActiveItem] = useState<WordItem | null>(null);

  // ——— Shake animation trigger ———
  const [shaking, setShaking] = useState(false);

  // ——— dnd-kit sensors (pointer + touch with 8px delay) ———
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  );

  // ——— Current question ———
  const currentQ = questions[currentIndex];
  const lang = i18n.language as 'id' | 'jp';
  const explanation = lang === 'jp' ? currentQ?.explanation_jp : currentQ?.explanation_id;

  // ——— DnD handlers ———

  const handleDragStart = ({ active }: DragStartEvent) => {
    const item =
      bankItems.find((i) => i.id === active.id) ||
      answerItems.find((i) => i.id === active.id);
    setActiveItem(item ?? null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeInBank = bankItems.some((i) => i.id === active.id);
    const activeInAnswer = answerItems.some((i) => i.id === active.id);
    const overInAnswer = answerItems.some((i) => i.id === over.id) || over.id === 'answer-zone';
    const overInBank = bankItems.some((i) => i.id === over.id) || over.id === 'word-bank';

    // Bank → Answer
    if (activeInBank && overInAnswer) {
      const item = bankItems.find((i) => i.id === active.id)!;
      setBankItems((prev) => prev.filter((i) => i.id !== active.id));
      setAnswerItems((prev) => {
        if (prev.find((i) => i.id === active.id)) return prev;
        const overIndex = prev.findIndex((i) => i.id === over.id);
        const newItems = [...prev];
        if (overIndex >= 0) {
          newItems.splice(overIndex, 0, item);
        } else {
          newItems.push(item);
        }
        return newItems;
      });
    }

    // Answer → Bank
    if (activeInAnswer && overInBank) {
      const item = answerItems.find((i) => i.id === active.id)!;
      setAnswerItems((prev) => prev.filter((i) => i.id !== active.id));
      setBankItems((prev) => {
        if (prev.find((i) => i.id === active.id)) return prev;
        return [...prev, item];
      });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveItem(null);
    if (!over) return;

    // Reorder within answer zone
    if (answerItems.find((i) => i.id === active.id) && answerItems.find((i) => i.id === over.id)) {
      setAnswerItems((items) => {
        const oldIdx = items.findIndex((i) => i.id === active.id);
        const newIdx = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIdx, newIdx);
      });
    }

    // Reorder within bank
    if (bankItems.find((i) => i.id === active.id) && bankItems.find((i) => i.id === over.id)) {
      setBankItems((items) => {
        const oldIdx = items.findIndex((i) => i.id === active.id);
        const newIdx = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIdx, newIdx);
      });
    }
  };

  // ——— Click-to-move (tap accessibility) ———

  const handleBankClick = (id: string, word: string) => {
    if (phase !== 'playing') return;
    setBankItems((prev) => prev.filter((i) => i.id !== id));
    setAnswerItems((prev) => [...prev, { id, word }]);
  };

  const handleAnswerClick = (id: string, word: string) => {
    if (phase !== 'playing') return;
    setAnswerItems((prev) => prev.filter((i) => i.id !== id));
    setBankItems((prev) => [...prev, { id, word }]);
  };

  // ——— Submit handler ———

  const handleSubmit = () => {
    if (phase !== 'playing' || answerItems.length === 0) return;

    const userAnswer = answerItems.map((i) => i.word);
    const isCorrect = checkAnswer(userAnswer, currentQ.correct_word_order);

    if (isCorrect) {
      const newCombo = combo + 1;
      const multiplier = Math.min(newCombo, 5);
      const points = 100 * Math.max(multiplier, 1);

      setCombo(newCombo);
      setScore((s) => s + points);
      fireCorrect();

      const isLast = currentIndex === questions.length - 1;
      if (isLast) {
        // Slight delay so the correct highlight shows before modal
        setTimeout(() => {
          setPhase('win');
          fireWin();
        }, 600);
      } else {
        setPhase('correct');
      }
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setCombo(0);

      // Trigger shake
      setShaking(true);
      setTimeout(() => setShaking(false), 600);

      if (newLives <= 0) {
        setTimeout(() => setPhase('gameover'), 500);
      } else {
        setPhase('incorrect');
      }
    }
  };

  // ——— Advance to next question ———

  const handleContinue = () => {
    const next = currentIndex + 1;
    if (next >= questions.length) {
      setPhase('win');
      fireWin();
    } else {
      setCurrentIndex(next);
      const q = questions[next];
      if (q) {
        const shuffled = [...q.jumbled_word_order].sort(() => Math.random() - 0.5);
        setBankItems(buildItems(shuffled, 'bank'));
        setAnswerItems([]);
        setPhase('playing');
      }
    }
  };

  // ——— Restart ———

  const handleRestart = () => {
    setCurrentIndex(0);
    setLives(3);
    setCombo(0);
    setScore(0);
    const q = questions[0];
    if (q) {
      const shuffled = [...q.jumbled_word_order].sort(() => Math.random() - 0.5);
      setBankItems(buildItems(shuffled, 'bank'));
      setAnswerItems([]);
      setPhase('playing');
    }
  };

  const handleBackToLessons = () => {
    if (phase === 'win' && _onComplete) {
      _onComplete(starResult.stars, score);
    } else {
      onExit?.();
    }
  };

  // ——— Star result ———
  const starResult = calculateStars(lives);

  // ——— Determine answer zone visual variant ———
  const answerVariant =
    phase === 'correct' || phase === 'win' ? 'correct' :
    phase === 'incorrect' || phase === 'gameover' ? 'incorrect' :
    'answer';

  // ——— Can submit? ———
  const canSubmit =
    phase === 'playing' &&
    answerItems.length > 0 &&
    answerItems.length === currentQ?.correct_word_order.length;

  // ============================================================
  // RENDER
  // ============================================================

  if (!currentQ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white/50 text-lg">{t('ui.loading')}</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-jumble min-h-dvh flex flex-col font-nunito">

        {/* ====================================================
            TOP HEADER
            ==================================================== */}
        <header className="sticky top-0 z-30 glass border-b border-surface-border">
          <div className="max-w-lg mx-auto px-4 py-3">
            {/* Row 1: Exit + Lesson name + Lang switcher */}
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={onExit}
                className="btn-ghost btn btn-sm px-2"
                aria-label="Exit lesson"
                id="exit-btn"
              >
                ✕
              </button>
              <p className="text-white/70 font-bold text-sm flex-1 truncate">{lessonName}</p>
              <LanguageSwitcher />
            </div>

            {/* Row 2: Progress bar + Lives + Combo */}
            <div className="flex items-center gap-3">
              <ProgressBar current={currentIndex} total={questions.length} />
              <HeartBar lives={lives} />
              <ComboDisplay combo={combo} />
            </div>

            {/* Question counter */}
            <p className="text-white/40 text-xs font-semibold mt-2 text-right">
              {t('ui.questionOf', { current: currentIndex + 1, total: questions.length })}
            </p>
          </div>
        </header>

        {/* ====================================================
            MAIN PLAY AREA
            ==================================================== */}
        <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6 gap-6">

          {/* Score badge */}
          <motion.div
            className="self-start flex items-center gap-2 px-3 py-1.5 rounded-full glass-light"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-accent-400 text-lg">⚡</span>
            <span className="text-white font-black text-sm">{score.toLocaleString()}</span>
          </motion.div>

          {/* Instruction */}
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white font-bold text-lg text-center leading-snug"
          >
            {t('ui.arrangeWords')}
          </motion.p>

          {/* ——— ANSWER ZONE ——— */}
          <motion.div
            animate={shaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnswerZone
              items={answerItems}
              variant={answerVariant}
              onWordClick={handleAnswerClick}
              disabled={phase !== 'playing'}
            />
          </motion.div>

          {/* ——— WORD BANK ——— */}
          <div className="glass rounded-xl2 p-3">
            <WordBank
              items={bankItems}
              onWordClick={handleBankClick}
              disabled={phase !== 'playing'}
            />
          </div>

          {/* ——— CHECK BUTTON ——— */}
          <AnimatePresence>
            {phase === 'playing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Button
                  variant={canSubmit ? 'success' : 'ghost'}
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full"
                  id="check-btn"
                >
                  {t('ui.check')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ====================================================
            FEEDBACK OVERLAY (slides up from bottom)
            ==================================================== */}
        <FeedbackOverlay
          phase={phase}
          explanation={explanation}
          onContinue={handleContinue}
        />

        {/* ====================================================
            WIN MODAL
            ==================================================== */}
        <AnimatePresence>
          {phase === 'win' && (
            <WinModal
              stars={starResult.stars}
              score={score}
              onPlayAgain={handleRestart}
              onBackToLessons={handleBackToLessons}
            />
          )}
        </AnimatePresence>

        {/* ====================================================
            GAME OVER MODAL
            ==================================================== */}
        <AnimatePresence>
          {phase === 'gameover' && (
            <GameOverModal
              score={score}
              onPlayAgain={handleRestart}
              onBackToLessons={onExit ?? (() => {})}
            />
          )}
        </AnimatePresence>

        {/* ====================================================
            DRAG OVERLAY — floating word clone during drag
            ==================================================== */}
        <DragOverlay dropAnimation={null}>
          {activeItem ? <WordBlock word={activeItem.word} variant="overlay" /> : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
