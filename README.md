# Jumble 🧩

**Jumble** is a modern, high-performance, gamified English grammar learning web application built by **Menako Studio**. Inspired by interactive card-based learning mechanisms like Brilliant.org and Duolingo, Jumble helps non-native English speakers master English grammar from **CEFR levels A1 to B2** and targeted **Exam Prep (IELTS, TOEFL, TOEIC)** through interactive word jumbles, multiple choice, and fill-in-the-blank questions.

---

## ✨ Key Features

- **Interactive Question Types & Pre-Lesson Concept Intros**:
  - **Concept Walkthrough**: Interactive Brilliant.org-style pre-challenge intro slides featuring formulas, grammar rule breakdowns, audio pronunciations, and warm-up questions.
  - **Word Jumble**: Drag-and-drop or tap-to-select word tiles powered by `@dnd-kit`.
  - **Multiple Choice**: Sleek 3D visual selection cards.
  - **Fill in the Blank**: Sentence completion tasks with real-time feedback.
- **Comprehensive CEFR Curriculum & Exam Prep**:
  - Modules categorized across CEFR levels (A1, A2, B1, B2) and specialized Exam Prep (IELTS, TOEFL, TOEIC).
  - Detailed grammar sub-categories: Tenses, Nouns & Articles, Verbs & Modals, Adjectives & Adverbs, Pronouns & Determiners, Prepositions & Conjunctions, Sentence & Clauses, and Punctuation.
- **Playful Duolingo-Inspired UX & Gamification**:
  - Vibrant, tactile 3D UI with playful color palettes, glassmorphism cards, and fluid animations.
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

