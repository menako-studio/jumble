/**
 * useGameState.ts — Predictable Reducer State Machine for Jumble Gameplay
 *
 * Manages game state transitions: IDLE → PLAYING → FEEDBACK → OUT_OF_HEARTS / COMPLETED
 */

import { useReducer, useCallback } from 'react';
import type { Question, GameState, GamePhase, WordItem } from '../types';
import { REVIEW_QUESTIONS_POOL } from '../data/grammarModules';

export type GameAction =
  | { type: 'INIT_LESSON'; payload: { questions: Question[]; isReviewMode?: boolean } }
  | { type: 'SELECT_MC'; payload: string }
  | { type: 'SELECT_FIB'; payload: string }
  | { type: 'MOVE_WORD_TO_ANSWER'; payload: { id: string; word: string } }
  | { type: 'MOVE_WORD_TO_BANK'; payload: { id: string; word: string } }
  | { type: 'REORDER_ANSWER'; payload: WordItem[] }
  | { type: 'REORDER_BANK'; payload: WordItem[] }
  | { type: 'SUBMIT_ANSWER'; payload: { isCorrect: boolean; points: number; isOutofHearts: boolean } }
  | { type: 'CONTINUE_NEXT' }
  | { type: 'START_REVIEW_SESSION' }
  | { type: 'REFILL_HEARTS' }
  | { type: 'RESTART_LESSON'; payload: Question[] };

function buildWordItems(words: string[], zone: 'bank' | 'ans'): WordItem[] {
  return words.map((word, i) => ({ id: `${zone}_${word}_${i}`, word }));
}

function initQuestionState(question?: Question) {
  if (!question) return { bankItems: [], answerItems: [] };
  if (question.type === 'jumble' || (!question.type && question.jumbled_word_order)) {
    const words = question.jumbled_word_order || question.correct_word_order || [];
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return {
      bankItems: buildWordItems(shuffled, 'bank'),
      answerItems: [],
    };
  }
  return { bankItems: [], answerItems: [] };
}

const initialState: GameState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  combo: 0,
  phase: 'IDLE',
  lastAnswerCorrect: null,
  isReviewMode: false,
  reviewCorrectCount: 0,
  mcSelected: null,
  fibSelected: null,
  answerItems: [],
  bankItems: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT_LESSON': {
      const qList = action.payload.questions;
      const firstQ = qList[0];
      const wordState = initQuestionState(firstQ);
      return {
        ...initialState,
        questions: qList,
        currentIndex: 0,
        phase: 'PLAYING',
        isReviewMode: !!action.payload.isReviewMode,
        ...wordState,
      };
    }

    case 'SELECT_MC':
      if (state.phase !== 'PLAYING') return state;
      return { ...state, mcSelected: action.payload };

    case 'SELECT_FIB':
      if (state.phase !== 'PLAYING') return state;
      return { ...state, fibSelected: action.payload };

    case 'MOVE_WORD_TO_ANSWER':
      if (state.phase !== 'PLAYING') return state;
      return {
        ...state,
        bankItems: state.bankItems.filter((i) => i.id !== action.payload.id),
        answerItems: [...state.answerItems, action.payload],
      };

    case 'MOVE_WORD_TO_BANK':
      if (state.phase !== 'PLAYING') return state;
      return {
        ...state,
        answerItems: state.answerItems.filter((i) => i.id !== action.payload.id),
        bankItems: [...state.bankItems, action.payload],
      };

    case 'REORDER_ANSWER':
      return { ...state, answerItems: action.payload };

    case 'REORDER_BANK':
      return { ...state, bankItems: action.payload };

    case 'SUBMIT_ANSWER': {
      const { isCorrect, points, isOutofHearts } = action.payload;

      let nextPhase: GamePhase = 'FEEDBACK';
      if (!isCorrect && isOutofHearts && !state.isReviewMode) {
        nextPhase = 'OUT_OF_HEARTS';
      }

      const newCombo = isCorrect ? state.combo + 1 : 0;
      const newScore = isCorrect ? state.score + points : state.score;
      const newReviewCount = isCorrect && state.isReviewMode ? state.reviewCorrectCount + 1 : state.reviewCorrectCount;

      return {
        ...state,
        phase: nextPhase,
        lastAnswerCorrect: isCorrect,
        combo: newCombo,
        score: newScore,
        reviewCorrectCount: newReviewCount,
      };
    }

    case 'CONTINUE_NEXT': {
      const nextIndex = state.currentIndex + 1;

      // Check if review mode goal (5 questions) met
      if (state.isReviewMode && (state.reviewCorrectCount >= 5 || nextIndex >= state.questions.length)) {
        return {
          ...state,
          phase: 'COMPLETED',
        };
      }

      if (nextIndex >= state.questions.length) {
        return {
          ...state,
          phase: 'COMPLETED',
        };
      }

      const nextQ = state.questions[nextIndex];
      const wordState = initQuestionState(nextQ);

      return {
        ...state,
        currentIndex: nextIndex,
        phase: 'PLAYING',
        lastAnswerCorrect: null,
        mcSelected: null,
        fibSelected: null,
        ...wordState,
      };
    }

    case 'START_REVIEW_SESSION': {
      const shuffled = [...REVIEW_QUESTIONS_POOL].sort(() => Math.random() - 0.5).slice(0, 5);
      const firstQ = shuffled[0];
      const wordState = initQuestionState(firstQ);
      return {
        ...state,
        questions: shuffled,
        currentIndex: 0,
        phase: 'PLAYING',
        isReviewMode: true,
        reviewCorrectCount: 0,
        mcSelected: null,
        fibSelected: null,
        ...wordState,
      };
    }

    case 'REFILL_HEARTS':
      return {
        ...state,
        phase: state.phase === 'OUT_OF_HEARTS' ? 'PLAYING' : state.phase,
      };

    case 'RESTART_LESSON': {
      const qList = action.payload;
      const firstQ = qList[0];
      const wordState = initQuestionState(firstQ);
      return {
        ...initialState,
        questions: qList,
        currentIndex: 0,
        phase: 'PLAYING',
        ...wordState,
      };
    }

    default:
      return state;
  }
}

export function useGameState(initialQuestions: Question[]) {
  const [state, dispatch] = useReducer(gameReducer, initialState, (init): GameState => {
    if (initialQuestions.length > 0) {
      const firstQ = initialQuestions[0];
      const wordState = initQuestionState(firstQ);
      return {
        ...init,
        questions: initialQuestions,
        phase: 'PLAYING' as GamePhase,
        ...wordState,
      };
    }
    return init;
  });

  const initLesson = useCallback((questions: Question[], isReviewMode = false) => {
    dispatch({ type: 'INIT_LESSON', payload: { questions, isReviewMode } });
  }, []);

  const selectMC = useCallback((option: string) => {
    dispatch({ type: 'SELECT_MC', payload: option });
  }, []);

  const selectFIB = useCallback((answer: string) => {
    dispatch({ type: 'SELECT_FIB', payload: answer });
  }, []);

  const moveWordToAnswer = useCallback((id: string, word: string) => {
    dispatch({ type: 'MOVE_WORD_TO_ANSWER', payload: { id, word } });
  }, []);

  const moveWordToBank = useCallback((id: string, word: string) => {
    dispatch({ type: 'MOVE_WORD_TO_BANK', payload: { id, word } });
  }, []);

  const reorderAnswer = useCallback((items: WordItem[]) => {
    dispatch({ type: 'REORDER_ANSWER', payload: items });
  }, []);

  const reorderBank = useCallback((items: WordItem[]) => {
    dispatch({ type: 'REORDER_BANK', payload: items });
  }, []);

  const submitAnswer = useCallback((isCorrect: boolean, points: number, isOutofHearts: boolean) => {
    dispatch({ type: 'SUBMIT_ANSWER', payload: { isCorrect, points, isOutofHearts } });
  }, []);

  const continueNext = useCallback(() => {
    dispatch({ type: 'CONTINUE_NEXT' });
  }, []);

  const startReviewSession = useCallback(() => {
    dispatch({ type: 'START_REVIEW_SESSION' });
  }, []);

  const refillHearts = useCallback(() => {
    dispatch({ type: 'REFILL_HEARTS' });
  }, []);

  const restartLesson = useCallback((questions: Question[]) => {
    dispatch({ type: 'RESTART_LESSON', payload: questions });
  }, []);

  return {
    state,
    actions: {
      initLesson,
      selectMC,
      selectFIB,
      moveWordToAnswer,
      moveWordToBank,
      reorderAnswer,
      reorderBank,
      submitAnswer,
      continueNext,
      startReviewSession,
      refillHearts,
      restartLesson,
    },
  };
}
