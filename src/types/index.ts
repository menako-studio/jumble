// ============================================================
// JUMBLE — Shared TypeScript Types
// ============================================================

export type Language = 'en' | 'id';

export type Country = 'EN' | 'ID';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B1_PLUS' | 'B2';

export type GrammarCategory =
  | 'tenses'
  | 'verbs_modals'
  | 'nouns_pronouns'
  | 'adjectives_adverbs'
  | 'clauses_conditionals'
  | 'passive_reported';

export type QuestionType = 'jumble' | 'multiple_choice' | 'fill_in_blank';

export interface User {
  id: string;
  username: string;
  country: Country;
  points: number;
  total_stars: number;
  current_streak: number;
}

export interface QuestionExplanation {
  rule: string;
  rule_id?: string;
  detailedReason: string;
  detailedReason_id?: string;
  commonMistakeNote?: string;
  commonMistakeNote_id?: string;
  exampleContext?: string;
}

export interface Question {
  id: string;
  lesson_id?: string;
  type: QuestionType;
  prompt: string;
  prompt_id?: string;
  options?: string[];
  jumbledOptions?: string[];
  correctAnswer: string | string[]; // string for MC & Fill-in-blank, string[] for Jumble
  correct_word_order?: string[];
  jumbled_word_order?: string[];
  explanation: QuestionExplanation;
  explanation_id?: string | null;
  display_order?: number;
}

export interface GrammarModule {
  id: string;
  cefrLevel: CEFRLevel;
  category: GrammarCategory;
  title: string;
  title_id?: string;
  description: string;
  description_id?: string;
  questions: Question[];
  level?: number;
  topic_name?: string;
  topic_name_id?: string;
}

// Aliases for backwards compatibility
export type GrammarPoint = GrammarModule;
export type Lesson = GrammarModule;

export interface UserProgress {
  id?: string;
  user_id: string;
  lesson_id: string;
  stars_earned: number;
  completed_at?: string;
}

// ——— Hearts System State ———

export interface HeartsState {
  heartsCount: number; // max 5
  lastHeartRestoredAt: number; // Unix timestamp in ms
  isProUser: boolean;
}

// ——— Game Machine State ———

export type GamePhase =
  | 'IDLE'
  | 'PLAYING'
  | 'FEEDBACK'
  | 'OUT_OF_HEARTS'
  | 'COMPLETED';

export interface GameState {
  questions: Question[];
  currentIndex: number;
  score: number;
  combo: number;
  phase: GamePhase;
  lastAnswerCorrect: boolean | null;
  isReviewMode: boolean;
  reviewCorrectCount: number;
  // Component inputs
  mcSelected: string | null;
  fibSelected: string | null;
  answerItems: WordItem[];
  bankItems: WordItem[];
}

// ——— Word item for dnd-kit ———

export interface WordItem {
  id: string; // unique id for dnd-kit (word + index to handle duplicates)
  word: string;
  zone?: 'bank' | 'answer';
}
