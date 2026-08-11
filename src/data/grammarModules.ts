import type { GrammarCategory, GrammarSubCategory, GrammarModule, Question } from '../types';
import { PRESENT_TENSES_MODULES } from './modules/presentTenses';
import { PAST_TENSES_MODULES } from './modules/pastTenses';
import { FUTURE_TENSES_MODULES } from './modules/futureTenses';
import { MODALS_PHRASALS_MODULES } from './modules/modalsPhrasals';
import { CONDITIONALS_WISHES_MODULES } from './modules/conditionalsWishes';
import { PASSIVE_REPORTED_MODULES } from './modules/passiveReported';
import { ING_INFINITIVE_MODULES } from './modules/ingInfinitive';
import { ARTICLES_NOUNS_MODULES } from './modules/articlesNouns';
import { RELATIVE_AUX_WORD_ORDER_MODULES } from './modules/relativeAuxWordOrder';
import { ADJECTIVES_PREPOSITIONS_MODULES } from './modules/adjectivesPrepositions';
import { EXAM_PREP_MODULES } from './modules/examPrep';

export interface CategoryMeta {
  key: GrammarCategory;
  name: { en: string; id: string };
  icon: string;
  subCategories: { key: GrammarSubCategory; name: { en: string; id: string } }[];
}

export const GRAMMAR_CATEGORIES_METADATA: CategoryMeta[] = [
  {
    key: 'present_tenses',
    name: { en: 'Present Tenses', id: 'Kala Saat Ini' },
    icon: '⏳',
    subCategories: [
      { key: 'present_simple_be', name: { en: "Forms of 'to be'", id: "Bentuk 'to be'" } },
      { key: 'present_simple', name: { en: 'Present Simple', id: 'Present Simple' } },
      { key: 'present_continuous', name: { en: 'Present Continuous', id: 'Present Continuous' } },
      { key: 'present_simple_vs_continuous', name: { en: 'Simple vs Continuous', id: 'Simple vs Continuous' } },
      { key: 'have_got', name: { en: 'Have got', id: 'Have got' } },
      { key: 'present_perfect', name: { en: 'Present Perfect', id: 'Present Perfect' } },
      { key: 'present_perfect_vs_past_simple', name: { en: 'Present Perfect vs Past Simple', id: 'Present Perfect vs Past Simple' } },
      { key: 'present_perfect_continuous', name: { en: 'Present Perfect Continuous', id: 'Present Perfect Continuous' } },
    ],
  },
  {
    key: 'past_tenses',
    name: { en: 'Past Tenses', id: 'Kala Lampau' },
    icon: '📜',
    subCategories: [
      { key: 'was_were', name: { en: 'Was / Were', id: 'Was / Were' } },
      { key: 'past_simple', name: { en: 'Past Simple Verbs', id: 'Kata Kerja Past Simple' } },
      { key: 'past_simple_neg_q', name: { en: 'Past Negatives & Questions', id: 'Negatif & Pertanyaan Lampau' } },
      { key: 'past_continuous', name: { en: 'Past Continuous', id: 'Past Continuous' } },
      { key: 'past_perfect', name: { en: 'Past Perfect', id: 'Past Perfect' } },
      { key: 'narrative_tenses', name: { en: 'Narrative Tenses', id: 'Kala Narasi & Cerita' } },
    ],
  },
  {
    key: 'future_tenses',
    name: { en: 'Future', id: 'Masa Depan' },
    icon: '🚀',
    subCategories: [
      { key: 'will_shall', name: { en: 'Will & Shall', id: 'Will & Shall' } },
      { key: 'be_going_to', name: { en: 'Be going to', id: 'Be going to' } },
      { key: 'future_continuous_perfect', name: { en: 'Future Continuous & Perfect', id: 'Future Continuous & Perfect' } },
      { key: 'future_other_forms', name: { en: 'Other Future Expressions', id: 'Ekspresi Masa Depan Lainnya' } },
      { key: 'future_in_past', name: { en: 'Future in the Past', id: 'Future in the Past' } },
    ],
  },
  {
    key: 'modals_phrasals',
    name: { en: 'Modals, Imperative & Phrasals', id: 'Modal & Frasa Kata Kerja' },
    icon: '⚡',
    subCategories: [
      { key: 'can_could', name: { en: 'Can & Could', id: 'Can & Could' } },
      { key: 'imperative', name: { en: 'The Imperative', id: 'Kalimat Perintah' } },
      { key: 'would_like', name: { en: 'Would like', id: 'Would like' } },
      { key: 'have_to_must', name: { en: 'Have to & Must', id: 'Have to & Must' } },
      { key: 'should', name: { en: 'Should', id: 'Should' } },
      { key: 'might_may', name: { en: 'May & Might', id: 'May & Might' } },
      { key: 'used_to', name: { en: 'Used to', id: 'Used to' } },
      { key: 'verb_go', name: { en: "Verb 'go'", id: "Kata kerja 'go'" } },
      { key: 'verb_get', name: { en: "Verb 'get'", id: "Kata kerja 'get'" } },
      { key: 'do_vs_make', name: { en: 'Do vs Make', id: 'Do vs Make' } },
      { key: 'phrasal_verbs', name: { en: 'Phrasal Verbs', id: 'Phrasal Verbs' } },
      { key: 'modals_deduction', name: { en: 'Modals of Deduction', id: 'Modals Deduksi' } },
      { key: 'would_rather', name: { en: 'Would rather', id: 'Would rather' } },
      { key: 'verbs_of_senses', name: { en: 'Verbs of the Senses', id: 'Kata Kerja Indera' } },
    ],
  },
  {
    key: 'conditionals_wishes',
    name: { en: 'Conditionals & Wishes', id: 'Pengandaian & Harapan' },
    icon: '🔮',
    subCategories: [
      { key: 'first_conditional', name: { en: 'First Conditional', id: 'Pengandaian Tipe 1' } },
      { key: 'second_conditional', name: { en: 'Second Conditional', id: 'Pengandaian Tipe 2' } },
      { key: 'third_conditional', name: { en: 'Third Conditional', id: 'Pengandaian Tipe 3' } },
      { key: 'mixed_conditionals', name: { en: 'Mixed Conditionals', id: 'Pengandaian Campuran' } },
      { key: 'wishes_regrets', name: { en: 'Wishes & Regrets', id: 'Harapan & Penyesalan' } },
    ],
  },
  {
    key: 'passive_voice',
    name: { en: 'Passive Voice', id: 'Kalimat Pasif' },
    icon: '🛡️',
    subCategories: [
      { key: 'passive_forms', name: { en: 'Passive Forms', id: 'Bentuk Pasif' } },
      { key: 'reporting_verbs', name: { en: 'Passive with Reporting Verbs', id: 'Pasif Kata Kerja Pelaporan' } },
      { key: 'have_something_done', name: { en: 'Have something done', id: 'Have something done' } },
    ],
  },
  {
    key: 'reported_speech',
    name: { en: 'Reported Speech', id: 'Kalimat Tidak Langsung' },
    icon: '💬',
    subCategories: [
      { key: 'direct_indirect_speech', name: { en: 'Indirect Speech', id: 'Kalimat Tak Langsung' } },
    ],
  },
  {
    key: 'ing_infinitive',
    name: { en: '-ing and the Infinitive', id: 'Gerund & Infinitif' },
    icon: '🎯',
    subCategories: [
      { key: 'verbs_ing_infinitive', name: { en: 'Verbs + Infinitive / -ing', id: 'Kata Kerja + Infinitif / -ing' } },
      { key: 'gerund_or_infinitive', name: { en: 'Gerund vs Infinitive', id: 'Gerund vs Infinitif' } },
      { key: 'reporting_verbs_pattern', name: { en: 'Reporting Verb Patterns', id: 'Pola Kata Kerja Pelaporan' } },
    ],
  },
  {
    key: 'articles_nouns_determiners',
    name: { en: 'Articles, Nouns & Determiners', id: 'Artikel, Kata Benda & Penentu' },
    icon: '📦',
    subCategories: [
      { key: 'articles_a_an_the', name: { en: 'Articles (a/an/the)', id: 'Artikel (a/an/the)' } },
      { key: 'countable_uncountable', name: { en: 'Countable & Uncountable', id: 'Dapat & Tak Dapat Dihitung' } },
      { key: 'singular_plural', name: { en: 'Singular & Plural', id: 'Tunggal & Jamak' } },
      { key: 'possessive_nouns', name: { en: 'Possessives & Time', id: 'Kepemilikan & Waktu' } },
      { key: 'quantifiers', name: { en: 'Quantifiers', id: 'Quantifier / Penentu Jumlah' } },
      { key: 'pronouns', name: { en: 'Pronouns System', id: 'Sistem Kata Ganti' } },
      { key: 'possessives', name: { en: 'Possessives', id: 'Kepemilikan' } },
    ],
  },
  {
    key: 'relative_clauses',
    name: { en: 'Relative Clauses', id: 'Klausa Relatif' },
    icon: '🔀',
    subCategories: [
      { key: 'defining_relative', name: { en: 'Defining Clauses', id: 'Klausa Defining' } },
      { key: 'non_defining_relative', name: { en: 'Non-defining Clauses', id: 'Klausa Non-defining' } },
      { key: 'relative_adverbs', name: { en: '-ever Relative Adverbs', id: 'Kata Ganti Relatif -ever' } },
    ],
  },
  {
    key: 'there_and_it',
    name: { en: 'There and It', id: 'Penggunaan There & It' },
    icon: '📍',
    subCategories: [
      { key: 'there_is_are', name: { en: 'There is / are / was / were', id: 'There is / are / was / were' } },
      { key: 'preparatory_subjects', name: { en: 'Preparatory Subjects', id: 'Subjek Preparatori / Dummy' } },
    ],
  },
  {
    key: 'auxiliary_verbs',
    name: { en: 'Auxiliary Verbs', id: 'Kata Kerja Bantu' },
    icon: '🛠️',
    subCategories: [
      { key: 'so_neither', name: { en: 'So & Neither', id: 'So & Neither' } },
      { key: 'question_tags', name: { en: 'Question Tags', id: 'Question Tags' } },
      { key: 'auxiliary_uses', name: { en: 'Emphatic & Auxiliary Uses', id: 'Penggunaan Kata Kerja Bantu' } },
      { key: 'ellipsis_substitution', name: { en: 'Ellipsis & Substitution', id: 'Elipsis & Substitusi' } },
    ],
  },
  {
    key: 'adjectives_adverbs',
    name: { en: 'Adjectives & Adverbs', id: 'Kata Sifat & Keterangan' },
    icon: '🎨',
    subCategories: [
      { key: 'descriptive_adjectives', name: { en: 'Descriptive Adjectives', id: 'Kata Sifat Deskriptif' } },
      { key: 'comparative_superlative', name: { en: 'Comparatives & Superlatives', id: 'Perbandingan & Superlatif' } },
      { key: 'adverbs_frequency', name: { en: 'Adverbs of Frequency', id: 'Keterangan Frekuensi' } },
      { key: 'adverbs_manner_place', name: { en: 'Adverbs of Manner & Place', id: 'Keterangan Cara & Tempat' } },
      { key: 'order_of_adjectives', name: { en: 'Order of Adjectives', id: 'Urutan Kata Sifat' } },
      { key: 'so_such', name: { en: 'So & Such', id: 'So & Such' } },
      { key: 'negative_inversion', name: { en: 'Negative Inversion', id: 'Inversi Negatif' } },
    ],
  },
  {
    key: 'conjunctions_clauses',
    name: { en: 'Conjunctions & Clauses', id: 'Kata Hubung & Klausa' },
    icon: '🔗',
    subCategories: [
      { key: 'coordinating_conjunctions', name: { en: 'Basic Conjunctions', id: 'Kata Hubung Dasar' } },
      { key: 'clauses_contrast_purpose', name: { en: 'Contrast & Purpose Clauses', id: 'Klausa Kontras & Tujuan' } },
      { key: 'discourse_markers', name: { en: 'Discourse Markers', id: 'Kata Penghubung Wacana' } },
      { key: 'participle_clauses', name: { en: 'Participle Clauses', id: 'Klausa Partisipel' } },
    ],
  },
  {
    key: 'prepositions',
    name: { en: 'Prepositions', id: 'Kata Depan / Preposisi' },
    icon: '🗺️',
    subCategories: [
      { key: 'prepositions_time_place', name: { en: 'Time & Place Prepositions', id: 'Preposisi Waktu & Tempat' } },
      { key: 'prepositions_movement', name: { en: 'Movement Prepositions', id: 'Preposisi Pergerakan' } },
      { key: 'verb_prep_collocations', name: { en: 'Noun/Verb Collocations', id: 'Kolokasi Preposisi' } },
    ],
  },
  {
    key: 'questions_form',
    name: { en: 'Questions', id: 'Bentuk Pertanyaan' },
    icon: '❓',
    subCategories: [
      { key: 'question_words', name: { en: 'Question Words & Order', id: 'Kata & Urutan Pertanyaan' } },
      { key: 'indirect_questions', name: { en: 'Indirect Questions', id: 'Pertanyaan Tidak Langsung' } },
    ],
  },
  {
    key: 'word_order',
    name: { en: 'Word Order', id: 'Tata Urutan Kata' },
    icon: '🧩',
    subCategories: [
      { key: 'basic_word_order', name: { en: 'Basic Word Order', id: 'Tata Urutan Kata Dasar' } },
      { key: 'adverbs_frequency', name: { en: 'Position of Adverbs', id: 'Posisi Kata Keterangan' } },
      { key: 'cleft_sentences', name: { en: 'Cleft Sentences', id: 'Cleft Sentences' } },
    ],
  },
  {
    key: 'exam_prep',
    name: { en: 'Pro Exam Suite (IELTS/TOEFL/TOEIC)', id: 'Paket Ujian Pro (IELTS/TOEFL/TOEIC)' },
    icon: '👑',
    subCategories: [
      { key: 'ielts_grammar', name: { en: 'IELTS Academic & General', id: 'IELTS Akedemik & Umum' } },
      { key: 'toefl_structure', name: { en: 'TOEFL iBT Written Structure', id: 'TOEFL iBT Struktur Bahasa' } },
      { key: 'toeic_business', name: { en: 'TOEIC Business English', id: 'TOEIC Bahasa Inggris Bisnis' } },
    ],
  },
];

export const GRAMMAR_MODULES: GrammarModule[] = [
  ...PRESENT_TENSES_MODULES,
  ...PAST_TENSES_MODULES,
  ...FUTURE_TENSES_MODULES,
  ...MODALS_PHRASALS_MODULES,
  ...CONDITIONALS_WISHES_MODULES,
  ...PASSIVE_REPORTED_MODULES,
  ...ING_INFINITIVE_MODULES,
  ...ARTICLES_NOUNS_MODULES,
  ...RELATIVE_AUX_WORD_ORDER_MODULES,
  ...ADJECTIVES_PREPOSITIONS_MODULES,
  ...EXAM_PREP_MODULES,
];

export const REVIEW_QUESTIONS_POOL: Question[] = [
  {
    id: 'rev-q1',
    type: 'multiple_choice',
    prompt: 'She _____ to work by train every morning.',
    options: ['goes', 'go', 'going', 'is go'],
    correctAnswer: 'goes',
    explanation: {
      rule: 'Present Simple - Third Person',
      detailedReason: 'Subject "She" takes verb with -s ending ("goes").',
    },
  },
  {
    id: 'rev-q2',
    type: 'fill_in_blank',
    prompt: 'I have _____ to London twice.',
    options: ['been', 'be', 'were', 'was'],
    correctAnswer: 'been',
    explanation: {
      rule: 'Present Perfect - V3',
      detailedReason: 'Present Perfect uses Have + V3 ("been").',
    },
  },
];
