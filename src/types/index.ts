// ============================================================
// JUMBLE — Shared TypeScript Types
// ============================================================

export type Country = 'ID' | 'JP';

export interface User {
  id: string;
  username: string;
  country: Country;
  points: number;
  total_stars: number;
  current_streak: number;
}

export interface Lesson {
  id: string;
  level: number;
  topic_name: string;
  topic_name_id: string;
  topic_name_jp: string;
}

export interface Question {
  id: string;
  lesson_id: string;
  correct_word_order: string[];
  jumbled_word_order: string[];
  explanation_id: string | null;
  explanation_jp: string | null;
  display_order: number;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  stars_earned: number;
  completed_at: string;
}

// ——— Game State ———

export type GamePhase =
  | 'loading'
  | 'playing'
  | 'correct'
  | 'incorrect'
  | 'win'
  | 'gameover';

export interface GameState {
  questions: Question[];
  currentIndex: number;
  lives: number;          // 0–3
  combo: number;          // consecutive correct answers
  score: number;
  phase: GamePhase;
  /** Words the user has placed into the answer zone (ordered) */
  answerWords: string[];
  /** Words still sitting in the word bank */
  bankWords: string[];
}

// ——— Word item for dnd-kit ———

export interface WordItem {
  id: string;       // unique id for dnd-kit (word + index to handle duplicates)
  word: string;
  zone: 'bank' | 'answer';
}
