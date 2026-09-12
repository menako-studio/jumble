# Jumble 🧩

**Jumble** is a modern, high-performance, gamified English grammar learning web application built by **Menako Studio**. Inspired by interactive card-based learning mechanisms like Brilliant.org, Sana Labs, and Duolingo, Jumble helps non-native English speakers master English grammar from **CEFR levels A1 to B2** and targeted **Exam Prep (IELTS, TOEFL, TOEIC)** through interactive word jumbles, multiple choice, and fill-in-the-blank challenges.

---

## ✨ Key Features

- **Light & Tactile Sana Labs × Duolingo Design System**:
  - Crisp porcelain and white surfaces (`surface.*` tokens) with high-contrast slate ink typography (`ink.*`).
  - Tactile `border-2 border-b-4` 3D elevation on buttons, word tiles, and cards with physical pressing feedback.
  - Pastel bottom-sheet feedback drawers (mint `#d7ffb8` for correct answers and coral `#ffdfe0` for mistakes).
  - Shimmer-sweep animated progress bars and refined light glassmorphism.

- **Zero-Asset Synthesized Web Audio Engine**:
  - Real-time synthesized tactile audio cues using the browser-native **Web Audio API** (no external mp3/wav audio assets to download):
    - **Correct Answer**: Melodic ascending major arpeggio chime (C5, E5, G5, C6).
    - **Mistake**: Soft, encouraging wooden thud (filtered noise burst + gentle sine tone).
    - **Tile Actions**: Light click "pop" on placement; lower click on tile return.
    - **Level Victory**: Triumphant ascending arpeggio flourish.
  - Persistent sound mute toggle in `CardHeader` backed by `localStorage`.

- **Brilliant & Duolingo Style Serpentine Pathway (`LessonsPage`)**:
  - Vertical serpentine map layout with alternating milestone nodes, SVG connecting lines, and unit headers.
  - **Sequential Lesson Unlocking**: Lessons unlock progressively as preceding challenges are completed with stars.
  - Active nodes feature pulsing glows, floating mascot badges ("START"), and animated feedback.
  - **Tactile Pathway Pagination**: 8-item chunked pagination to eliminate infinite-scroll fatigue, paired with a smart jump-to-active-lesson banner.

- **Horizontal Category Carousel (`HorizontalScroller`)**:
  - Smooth left/right tactile arrows (`‹` and `›`), mouse wheel translation, desktop click-and-drag scrolling, and edge gradient masks for all 18 curriculum categories.

- **Persistent Guest Progress & Google Authentication (`AuthContext`)**:
  - Play immediately as a guest with instant `localStorage` saving.
  - One-click Google OAuth sign-in via Supabase with automatic background migration of all guest XP, hearts, and lesson stars.
  - Real-time cloud sync status indicator (☁️) in the user profile header button.

- **Gamified Step-by-Step Concept Intro Walkthrough (`intro.png`)**:
  - Pre-challenge concept walkthrough with top segmented progress bar, exit `✕` button, formula cards, TTS audio examples, and warm-up checks before jumping into puzzles.

- **Groq LLM AI Grammar Tutor (`AITutorModal`)**:
  - Powered by **Groq API** (`llama-3.3-70b-versatile`).
  - Interactive AI drawer accessible during intro walkthroughs.
  - Features quick prompt chips, custom Groq API key configuration, and context-aware smart fallback explanations in both English and Indonesian.

- **Interactive Question Types**:
  - **Word Jumble**: Drag-and-drop or tap-to-select word tiles powered by `@dnd-kit`.
  - **Multiple Choice**: Sleek tactile selection cards.
  - **Fill in the Blank**: Sentence completion tasks with real-time feedback.

- **Complete Test-English Reference Curriculum**:
  - Full syllabus covering all 18 categories from [test-english.com](https://test-english.com/grammar-points/contents/) across CEFR levels A1–B2 (Present Tenses, Past Tenses, Future, Verb Tense Reviews, Modals & Phrasals, Conditionals & Wishes, Passive Voice, Reported Speech, -ing & Infinitive, Articles Nouns & Pronouns, Relative Clauses, There & It, Auxiliary Verbs, Adjectives & Adverbs, Conjunctions & Clauses, Prepositions, Questions, Word Order) plus Pro Exam Suite (IELTS, TOEFL, TOEIC).

- **Hearts & Session Gamification**:
  - 5-heart system with 4-hour automatic regeneration, PRO mode support, and an Out-of-Hearts Review Mode to practice mistake-free without penalties.
  - Accurate session-based star scoring (0 mistakes = 3 stars, 1-2 mistakes = 2 stars, >2 = 1 star).
  - XP multiplier combo streaks and celebratory confetti visual FX.

- **Zero-Cost Native Text-to-Speech (TTS)**:
  - Integrated audio sentence playback using browser-native Web Speech API.

- **Bilingual Localization (i18n)**:
  - Instant 2-way toggle between English (`EN`) and Indonesian (`ID`).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, React Router DOM v7
- **Styling & Design System**: Tailwind CSS v3, Framer Motion, Lucide React, Canvas Confetti
- **Audio Engine**: Web Audio API (zero-asset synthesized sound design)
- **AI & LLM**: Groq API (`llama-3.3-70b-versatile`)
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`
- **Internationalization**: `i18next`, `react-i18next`
- **Auth & Database**: Supabase (PostgreSQL, Google OAuth, RLS) with offline-first localStorage fallback
- **Speech**: Browser-native Web Speech API (`window.speechSynthesis`)

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

3. **Environment Setup (Optional for Supabase sync & Groq AI)**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_groq_api_key
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
