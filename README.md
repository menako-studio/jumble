# Jumble 🧩

**Jumble** is a modern, high-performance, gamified English grammar learning web application built by **Menako Studio**. Inspired by interactive card-based learning mechanisms like Brilliant.org and Duolingo, Jumble helps non-native English speakers master English grammar from **CEFR levels A1 to B2** through interactive word jumbles, multiple choice, and fill-in-the-blank questions.

---

## ✨ Key Features

- **Interactive Question Types**:
  - **Word Jumble**: Drag-and-drop or tap-to-select word tiles powered by `@dnd-kit`.
  - **Multiple Choice**: Sleek visual selection cards.
  - **Fill in the Blank**: Sentence completion tasks with real-time feedback.
- **Structured CEFR Curriculum**:
  - Modules categorized across CEFR levels A1, A2, B1, and B2.
  - Covered categories: Tenses, Verbs & Modals, Nouns & Pronouns, Adjectives & Adverbs, Clauses & Conditionals, and Passive/Reported Speech.
- **Gamification & Hearts Engine**:
  - Heart counter (max 5) with automated passive recovery (1 heart / 4 hours).
  - Out-of-Hearts Review Mode: Infinite practice pool to recover hearts.
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

