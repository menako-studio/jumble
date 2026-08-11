# Jumble 🧩

**Jumble** is a modern, high-performance, gamified English grammar learning web application built by **Menako Studio**. Inspired by interactive card-based learning mechanisms like Brilliant.org and Duolingo, Jumble helps non-native English speakers master English grammar from **CEFR levels A1 to B2** and targeted **Exam Prep (IELTS, TOEFL, TOEIC)** through interactive word jumbles, multiple choice, and fill-in-the-blank questions.

---

## ✨ Key Features

- **Brilliant & Duolingo Style Serpentine Pathway (`LessonsPage`)**:
  - Vertical serpentine map layout with alternating milestone nodes, SVG connecting lines, and unit headers.
  - **Sequential Lesson Unlocking**: Lessons unlock progressively as preceding challenges are completed with stars.
  - Active nodes feature pulsing glows, floating mascot badges ("START"), and animated feedback.
- **Gamified Step-by-Step Intro View (`intro.png`)**:
  - Pre-challenge concept intro matching `intro.png` with top segmented progress bar, exit `✕` button, heart/star indicators, formula cards, and interactive warm-up slides.
- **Groq LLM AI Grammar Tutor (`AITutorModal`)**:
  - Powered by **Groq API** (`llama-3.3-70b-versatile`).
  - Interactive AI drawer accessible via the bottom-left AI button on intro pages.
  - Features quick prompt chips, custom Groq API key configuration, and context-aware smart fallback explanations.
- **Interactive Question Types**:
  - **Word Jumble**: Drag-and-drop or tap-to-select word tiles powered by `@dnd-kit`.
  - **Multiple Choice**: Sleek 3D visual selection cards.
  - **Fill in the Blank**: Sentence completion tasks with real-time feedback.
- **Complete Test-English Reference Curriculum**:
  - Full syllabus covering all 18 categories from [test-english.com](https://test-english.com/grammar-points/contents/) across CEFR levels A1–B2 (Present Tenses, Past Tenses, Future, Verb Tense Reviews, Modals & Phrasals, Conditionals & Wishes, Passive Voice, Reported Speech, -ing & Infinitive, Articles Nouns & Pronouns, Relative Clauses, There & It, Auxiliary Verbs, Adjectives & Adverbs, Conjunctions & Clauses, Prepositions, Questions, Word Order) plus Pro Exam Suite (IELTS, TOEFL, TOEIC).
- **Playful Duolingo-Inspired UX & Gamification**:
  - Vibrant 3D UI with playful color palettes, glassmorphism cards, and fluid animations.
  - **Anytime Heart Refill**: Tap heart counter anytime to open refill modal or launch Out-of-Hearts Review Mode.
  - **Session-Based Star Scoring**: Star rating computed accurately from session mistakes (0 mistakes = 3 stars, 1-2 mistakes = 2 stars, >2 = 1 star).
  - XP multiplier combo streaks and celebratory confetti visual FX.
- **Zero-Cost Native Text-to-Speech (TTS)**:
  - Integrated audio playback using browser-native Web Speech API.
- **Offline-First & Resilient Data Layer**:
  - Immediate `localStorage` progress persistence with background Supabase cloud sync queue.
- **Bilingual Localization (i18n)**:
  - 2-way instant toggle between English (`EN`) and Indonesian (`ID`).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, React Router DOM v7
- **AI & LLM**: Groq API (`llama-3.3-70b-versatile`)
- **Styling & UI**: Tailwind CSS v3, Framer Motion, Lucide React, Canvas Confetti
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`
- **Internationalization**: `i18next`, `react-i18next`
- **Backend & Database**: Supabase PostgreSQL (with static fallback dataset)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm / pnpm / yarn

### Installation

1. **Clone repository**:
   ```bash
   git clone https://github.com/menako-studio/jumble.git
   cd jumble
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup (Optional for Supabase sync)**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📄 License

Created by **Menako Studio**.
