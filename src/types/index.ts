// ============================================================
// JUMBLE — Shared TypeScript Types
// ============================================================

export type Language = 'en' | 'id';

export type Country = 'EN' | 'ID';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B1_PLUS' | 'B2';

export type GrammarCategory =
  | 'present_tenses'
  | 'past_tenses'
  | 'future_tenses'
  | 'tense_reviews'
  | 'modals_phrasals'
  | 'conditionals_wishes'
  | 'passive_voice'
  | 'reported_speech'
  | 'ing_infinitive'
  | 'articles_nouns_determiners'
  | 'relative_clauses'
  | 'there_and_it'
  | 'auxiliary_verbs'
  | 'adjectives_adverbs'
  | 'conjunctions_clauses'
  | 'prepositions'
  | 'questions_form'
  | 'word_order'
  | 'exam_prep'
  // Legacy category aliases for backward compatibility
  | 'tenses'
  | 'nouns_articles'
  | 'verbs_modals'
  | 'pronouns_determiners'
  | 'prepositions_conjunctions'
  | 'sentence_clauses'
  | 'punctuation_capitalization';

export type GrammarSubCategory =
  // Present Tenses
  | 'present_simple_be'
  | 'present_simple'
  | 'present_continuous'
  | 'present_simple_vs_continuous'
  | 'have_got'
  | 'present_perfect'
  | 'present_perfect_vs_past_simple'
  | 'present_perfect_continuous'
  // Past Tenses
  | 'was_were'
  | 'past_simple'
  | 'past_simple_neg_q'
  | 'past_continuous'
  | 'past_perfect'
  | 'narrative_tenses'
  // Future
  | 'will_shall'
  | 'be_going_to'
  | 'future_continuous_perfect'
  | 'future_other_forms'
  | 'future_in_past'
  // Verb Tense Reviews
  | 'tense_reviews_a2'
  | 'tense_reviews_b1'
  | 'tense_reviews_b2'
  // Modals & Phrasal Verbs
  | 'can_could'
  | 'imperative'
  | 'would_like'
  | 'have_to_must'
  | 'should'
  | 'might_may'
  | 'used_to'
  | 'verb_go'
  | 'verb_get'
  | 'do_vs_make'
  | 'phrasal_verbs'
  | 'modals_deduction'
  | 'would_rather'
  | 'verbs_of_senses'
  // Conditionals & Wishes
  | 'first_conditional'
  | 'second_conditional'
  | 'third_conditional'
  | 'mixed_conditionals'
  | 'wishes_regrets'
  // Passive
  | 'passive_forms'
  | 'reporting_verbs'
  | 'have_something_done'
  // Reported Speech
  | 'direct_indirect_speech'
  // -ing & Infinitive
  | 'verbs_ing_infinitive'
  | 'gerund_or_infinitive'
  | 'reporting_verbs_pattern'
  // Articles, Nouns, Pronouns & Determiners
  | 'articles_a_an_the'
  | 'countable_uncountable'
  | 'singular_plural'
  | 'possessive_nouns'
  | 'quantifiers'
  | 'pronouns'
  | 'possessives'
  // Relative Clauses
  | 'defining_relative'
  | 'non_defining_relative'
  | 'relative_adverbs'
  // There and It
  | 'there_is_are'
  | 'preparatory_subjects'
  // Auxiliary Verbs
  | 'so_neither'
  | 'question_tags'
  | 'auxiliary_uses'
  | 'ellipsis_substitution'
  // Adjectives & Adverbs
  | 'descriptive_adjectives'
  | 'comparative_superlative'
  | 'adverbs_frequency'
  | 'adverbs_manner_place'
  | 'order_of_adjectives'
  | 'so_such'
  | 'negative_inversion'
  // Conjunctions & Clauses
  | 'coordinating_conjunctions'
  | 'clauses_contrast_purpose'
  | 'discourse_markers'
  | 'participle_clauses'
  // Prepositions
  | 'prepositions_time_place'
  | 'prepositions_movement'
  | 'verb_prep_collocations'
  // Questions
  | 'question_words'
  | 'indirect_questions'
  // Word Order
  | 'basic_word_order'
  | 'cleft_sentences'
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
  sequenceOrder?: number;
  unitGroup?: string;
  unitGroup_id?: string;
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
