import React, { useEffect } from 'react';
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
import { useGameState } from '../../hooks/useGameState';
import { calculateStars } from '../../lib/starCalculator';
import { checkAnswer } from '../../lib/evaluator';
import {
  getHeartsState,
  deductHeart,
  refillAllHearts,
  setProUserStatus,
} from '../../lib/heartsManager';
import { saveProgress, addUserPoints } from '../../hooks/useSupabase';

import { CardHeader } from './CardHeader';
import { Button } from '../ui/Button';
import { WordBank } from './WordBank';
import { AnswerZone } from './AnswerZone';
import { WordBlock } from './WordBlock';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { FillInBlankQuestion } from './FillInBlankQuestion';
import { FeedbackOverlay } from './FeedbackOverlay';
import { OutOfHeartsModal } from './OutOfHeartsModal';
import { WinModal } from './WinModal';
import { GameOverModal } from './GameOverModal';
import { AudioButton } from '../ui/AudioButton';
import { ConceptIntroWalkthrough } from './ConceptIntroWalkthrough';
import { GRAMMAR_MODULES } from '../../data/grammarModules';

import type { Question, CEFRLevel, HeartsState, WordItem, ConceptIntro } from '../../types';

interface JumbleLevelProps {
  questions: Question[];
  lessonName: string;
  cefrLevel?: CEFRLevel;
  conceptIntro?: ConceptIntro;
  onComplete?: (stars: number, score: number) => void;
  onExit?: () => void;
}

export const JumbleLevel: React.FC<JumbleLevelProps> = ({
  questions: initialQuestions,
  lessonName,
  cefrLevel,
  conceptIntro: propConceptIntro,
  onComplete: _onComplete,
  onExit,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'id';
  const { fireWin, fireCorrect } = useConfetti();

  const { state, actions } = useGameState(initialQuestions);
  const [heartsState, setHeartsState] = React.useState<HeartsState>(() => getHeartsState());
  const [activeItem, setActiveItem] = React.useState<WordItem | null>(null);
  const [shaking, setShaking] = React.useState(false);
  const [showRefillModal, setShowRefillModal] = React.useState(false);

  // Find concept intro from props or module pool
  const activeModule = GRAMMAR_MODULES.find(m => m.id === initialQuestions[0]?.lesson_id);
  const conceptIntro = propConceptIntro || activeModule?.conceptIntro;
  const [showIntro, setShowIntro] = React.useState<boolean>(() => !!conceptIntro);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  );

  const currentQ = state.questions[state.currentIndex];

  // Refresh hearts state on load & mode change
  useEffect(() => {
    const fresh = getHeartsState();
    setHeartsState(fresh);
  }, [state.isReviewMode]);

  // Handle DnD events
  const handleDragStart = ({ active }: DragStartEvent) => {
    const item = state.bankItems.find((i) => i.id === active.id) || state.answerItems.find((i) => i.id === active.id);
    setActiveItem(item ?? null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const activeInBank = state.bankItems.some((i) => i.id === active.id);
    const activeInAnswer = state.answerItems.some((i) => i.id === active.id);
    const overInAnswer = state.answerItems.some((i) => i.id === over.id) || over.id === 'answer-zone';
    const overInBank = state.bankItems.some((i) => i.id === over.id) || over.id === 'word-bank';

    if (activeInBank && overInAnswer) {
      const item = state.bankItems.find((i) => i.id === active.id)!;
      actions.reorderBank(state.bankItems.filter((i) => i.id !== active.id));
      const overIndex = state.answerItems.findIndex((i) => i.id === over.id);
      const newAns = [...state.answerItems];
      if (overIndex >= 0) newAns.splice(overIndex, 0, item);
      else newAns.push(item);
      actions.reorderAnswer(newAns);
    }

    if (activeInAnswer && overInBank) {
      const item = state.answerItems.find((i) => i.id === active.id)!;
      actions.reorderAnswer(state.answerItems.filter((i) => i.id !== active.id));
      if (!state.bankItems.some((i) => i.id === active.id)) {
        actions.reorderBank([...state.bankItems, item]);
      }
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveItem(null);
    if (!over) return;
    if (state.answerItems.find((i) => i.id === active.id) && state.answerItems.find((i) => i.id === over.id)) {
      const oldIdx = state.answerItems.findIndex((i) => i.id === active.id);
      const newIdx = state.answerItems.findIndex((i) => i.id === over.id);
      actions.reorderAnswer(arrayMove(state.answerItems, oldIdx, newIdx));
    }
    if (state.bankItems.find((i) => i.id === active.id) && state.bankItems.find((i) => i.id === over.id)) {
      const oldIdx = state.bankItems.findIndex((i) => i.id === active.id);
      const newIdx = state.bankItems.findIndex((i) => i.id === over.id);
      actions.reorderBank(arrayMove(state.bankItems, oldIdx, newIdx));
    }
  };

  // Submit Handler
  const handleSubmit = () => {
    if (state.phase !== 'PLAYING' || !currentQ) return;

    let isCorrect = false;

    if (currentQ.type === 'multiple_choice') {
      if (!state.mcSelected) return;
      isCorrect = state.mcSelected.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();
    } else if (currentQ.type === 'fill_in_blank') {
      if (!state.fibSelected) return;
      isCorrect = state.fibSelected.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();
    } else {
      const userWords = state.answerItems.map((i) => i.word);
      const expected = currentQ.correct_word_order || (Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer : []);
      isCorrect = checkAnswer(userWords, expected);
    }

    if (isCorrect) {
      const points = 100 * Math.min(state.combo + 1, 5);
      fireCorrect();
      actions.submitAnswer(true, points, false);
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);

      let isOut = false;
      if (!state.isReviewMode && !heartsState.isProUser) {
        const updated = deductHeart();
        setHeartsState(updated);
        isOut = updated.heartsCount <= 0;
      }
      actions.submitAnswer(false, 0, isOut);
    }
  };

  // Continue to next question or win screen
  const handleContinue = () => {
    actions.continueNext();
  };

  // Save progress when completed
  useEffect(() => {
    if (state.phase === 'COMPLETED') {
      const starResult = calculateStars(state.mistakesCount, state.questions.length);
      fireWin();
      saveProgress('demo-user', currentQ?.lesson_id || 'lesson-1', starResult.stars);
      addUserPoints('demo-user', state.score, starResult.stars);
    }
  }, [state.phase, state.mistakesCount, state.questions.length, state.score, currentQ?.lesson_id, fireWin]);

  // Out of hearts modal triggers
  const handleStartReviewMode = () => {
    setShowRefillModal(false);
    actions.startReviewSession();
  };

  const handleRefillAll = () => {
    const fresh = refillAllHearts();
    setHeartsState(fresh);
    setShowRefillModal(false);
    actions.refillHearts();
  };

  const handleUpgradeToPro = () => {
    const fresh = setProUserStatus(true);
    setHeartsState(fresh);
    setShowRefillModal(false);
    actions.refillHearts();
  };

  const getRevealedCorrectAnswerText = (): string => {
    if (!currentQ) return '';
    if (Array.isArray(currentQ.correctAnswer)) {
      return currentQ.correctAnswer.join(' ');
    }
    if (currentQ.correct_word_order) {
      return currentQ.correct_word_order.join(' ');
    }
    return String(currentQ.correctAnswer);
  };

  const canSubmit = (): boolean => {
    if (state.phase !== 'PLAYING' || !currentQ) return false;
    if (currentQ.type === 'multiple_choice') return !!state.mcSelected;
    if (currentQ.type === 'fill_in_blank') return !!state.fibSelected;
    const expectedLength = (currentQ.correct_word_order || currentQ.correctAnswer)?.length ?? 0;
    return state.answerItems.length > 0 && state.answerItems.length === expectedLength;
  };

  if (!currentQ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-jumble">
        <p className="text-white/60 font-black animate-pulse">{t('ui.loading', 'Loading questions...')}</p>
      </div>
    );
  }

  const isJumble = !currentQ.type || currentQ.type === 'jumble';
  const starResult = calculateStars(state.mistakesCount, state.questions.length);
  const promptText = lang === 'id' && currentQ.prompt_id ? currentQ.prompt_id : currentQ.prompt;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Brilliant.org Interactive Concept Walkthrough */}
      {showIntro && conceptIntro && (
        <ConceptIntroWalkthrough
          conceptIntro={conceptIntro}
          lessonTitle={lessonName}
          cefrLevel={cefrLevel}
          onStartChallenge={() => setShowIntro(false)}
          onSkip={() => setShowIntro(false)}
        />
      )}

      <div className="bg-jumble min-h-dvh flex flex-col font-nunito relative">
        {/* Card Header */}
        <CardHeader
          title={state.isReviewMode ? '❤️ Review Practice (+1 Heart)' : lessonName}
          cefrLevel={cefrLevel}
          currentIndex={state.currentIndex}
          totalQuestions={state.questions.length}
          heartsCount={heartsState.heartsCount}
          isProUser={heartsState.isProUser}
          onExit={onExit}
          onOpenRefillModal={() => setShowRefillModal(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6 gap-6 justify-between">
          {/* Top XP Bar & Review Progress */}
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-light"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-accent-400 text-lg">⚡</span>
              <span className="text-white font-black text-sm">{state.score.toLocaleString()} XP</span>
            </motion.div>

            {state.isReviewMode && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                Review Goal: {state.reviewCorrectCount}/5 Correct
              </span>
            )}
          </div>

          {/* Question Card */}
          <div className="w-full flex-1 flex flex-col justify-center">
            {currentQ.type === 'multiple_choice' ? (
              <MultipleChoiceQuestion
                prompt={promptText}
                options={currentQ.options || []}
                selectedOption={state.mcSelected}
                onSelect={actions.selectMC}
                disabled={state.phase !== 'PLAYING'}
              />
            ) : currentQ.type === 'fill_in_blank' ? (
              <FillInBlankQuestion
                prompt={promptText}
                options={currentQ.options || []}
                selectedAnswer={state.fibSelected}
                onSelect={actions.selectFIB}
                disabled={state.phase !== 'PLAYING'}
              />
            ) : (
              // Jumble Question
              <div className="flex flex-col gap-6 w-full">
                <motion.div
                  key={state.currentIndex}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3 text-center"
                >
                  <p className="text-white font-black text-lg leading-snug">
                    {promptText || t('ui.arrangeWords', 'Arrange the words in correct order:')}
                  </p>
                  <AudioButton text={getRevealedCorrectAnswerText()} size="sm" variant="glass" />
                </motion.div>

                <motion.div
                  animate={shaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AnswerZone
                    items={state.answerItems}
                    variant={state.lastAnswerCorrect === true ? 'correct' : state.lastAnswerCorrect === false ? 'incorrect' : 'answer'}
                    onWordClick={(id, word) => actions.moveWordToBank(id, word)}
                    disabled={state.phase !== 'PLAYING'}
                  />
                </motion.div>

                <div className="glass rounded-xl2 p-3">
                  <WordBank
                    items={state.bankItems}
                    onWordClick={(id, word) => actions.moveWordToAnswer(id, word)}
                    disabled={state.phase !== 'PLAYING'}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <AnimatePresence>
            {state.phase === 'PLAYING' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full"
              >
                <Button
                  variant={canSubmit() ? 'success' : 'ghost'}
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!canSubmit()}
                  className="w-full py-4 text-lg font-black"
                  id="check-btn"
                >
                  {t('ui.check', 'Check Answer')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Immediate Feedback Drawer */}
        <FeedbackOverlay
          phase={state.phase}
          isCorrect={state.lastAnswerCorrect}
          explanation={currentQ.explanation}
          correctAnswerText={getRevealedCorrectAnswerText()}
          onContinue={handleContinue}
        />

        {/* Out-of-Hearts / Voluntary Refill Modal */}
        <AnimatePresence>
          {(state.phase === 'OUT_OF_HEARTS' || showRefillModal) && (
            <OutOfHeartsModal
              heartsCount={heartsState.heartsCount}
              onStartReview={handleStartReviewMode}
              onRefillHearts={handleRefillAll}
              onUpgradePro={handleUpgradeToPro}
              onClose={() => {
                setShowRefillModal(false);
                actions.refillHearts();
              }}
            />
          )}
        </AnimatePresence>

        {/* Win Modal */}
        <AnimatePresence>
          {state.phase === 'COMPLETED' && (
            <WinModal
              stars={starResult.stars}
              score={state.score}
              onPlayAgain={() => actions.restartLesson(initialQuestions)}
              onBackToLessons={onExit ?? (() => {})}
            />
          )}
        </AnimatePresence>

        {/* Game Over Modal */}
        <AnimatePresence>
          {heartsState.heartsCount <= 0 && state.phase === 'FEEDBACK' && !state.isReviewMode && (
            <GameOverModal
              score={state.score}
              onPlayAgain={() => actions.restartLesson(initialQuestions)}
              onBackToLessons={onExit ?? (() => {})}
            />
          )}
        </AnimatePresence>

        {/* DnD Drag Overlay */}
        {isJumble && (
          <DragOverlay dropAnimation={null}>
            {activeItem ? <WordBlock word={activeItem.word} variant="overlay" /> : null}
          </DragOverlay>
        )}
      </div>
    </DndContext>
  );
};
