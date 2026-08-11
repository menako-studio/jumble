// ============================================================
// JUMBLE — Shared TypeScript Types
// ============================================================

export type Language = 'en' | 'id';

export type Country = 'EN' | 'ID';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B1_PLUS' | 'B2';

export type GrammarCategory =
  | 'tenses'
  | 'nouns_articles'
  | 'verbs_modals'
  | 'adjectives_adverbs'
  | 'pronouns_determiners'
  | 'prepositions_conjunctions'
  | 'sentence_clauses'
  | 'punctuation_capitalization'
  | 'exam_prep';

export type GrammarSubCategory =
  // Tenses
  | 'simple_present'
  | 'present_continuous'
  | 'present_perfect'
  | 'present_perfect_continuous'
  | 'simple_past'
  | 'past_continuous'
  | 'past_perfect'
  | 'simple_future'
  | 'future_continuous'
  | 'future_perfect'
  // Nouns & Articles
  | 'countable_uncountable'
  | 'singular_plural'
  | 'possessive_nouns'
  | 'articles'
  | 'abstract_collective'
  // Verbs & Modals
  | 'transitive_intransitive'
  | 'linking_verbs'
  | 'modal_verbs'
  | 'phrasal_verbs'
  | 'irregular_verbs'
  | 'passive_voice'
  // Adjectives & Adverbs
  | 'descriptive_adjectives'
  | 'comparative_superlative'
  | 'adverbs_frequency'
  | 'adverbs_manner_place'
  | 'order_of_adjectives'
  // Pronouns & Determiners
  | 'personal_pronouns'
  | 'possessive_pronouns'
  | 'reflexive_pronouns'
  | 'relative_pronouns'
  | 'demonstratives_quantifiers'
  // Prepositions & Conjunctions
  | 'prepositions_time_place'
  | 'prepositions_movement'
  | 'coordinating_conjunctions'
  | 'subordinating_conjunctions'
  | 'correlative_conjunctions'
  // Sentence & Clauses
  | 'simple_compound'
  | 'complex_sentences'
  | 'relative_clauses'
  | 'conditionals'
  | 'reported_speech'
  // Punctuation & Capitalization
  | 'commas_periods'
  | 'apostrophes_possessives'
  | 'quotation_marks'
  | 'capitalization_rules'
  | 'colons_semicolons'
  // Exam Prep
  | 'ielts_grammar'
  | 'toefl_structure'
  | 'toeic_business';

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

export interface ConceptIntroSlide {
  title: string;
  title_id?: string;
  formula?: string;
  ruleExplanation: string;
  ruleExplanation_id?: string;
  examples: string[];
  examples_id?: string[];
  warmupQuestion?: {
    prompt: string;
    prompt_id?: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    explanation_id?: string;
  };
}

export interface ConceptIntro {
  slides: ConceptIntroSlide[];
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
  subCategory?: GrammarSubCategory;
  title: string;
  title_id?: string;
  description: string;
  description_id?: string;
  conceptIntro?: ConceptIntro;
  questions: Question[];
  level?: number;
  topic_name?: string;
  topic_name_id?: string;
  isProOnly?: boolean;
  examType?: 'IELTS' | 'TOEFL' | 'TOEIC';
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
  mistakesCount: number;
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
