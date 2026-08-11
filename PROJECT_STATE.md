# PROJECT STATE & SINGLE SOURCE OF TRUTH

## 1. EXECUTIVE SUMMARY & TECH STACK
### Core Purpose & Scope
**Jumble** is a modern, high-performance, gamified English grammar learning web application built by **Menako Studio**. It replicates interactive card-based learning mechanisms (inspired by Brilliant.org & Duolingo) tailored for non-native English speakers (with localized support for English `EN` default and Indonesian `ID`). Users progress through structured **CEFR levels (A1 to B2)** and **Exam Prep modules (IELTS, TOEFL, TOEIC)** across a **Serpentine Pathway Map (`brilliant.png` & Duolingo style)** with progressive lesson unlocking, step-by-step interactive concept intros (`intro.png`), and an **AI Grammar Tutor powered by Groq LLM API**.

### Tech Stack & Core Libraries
- **Core Framework**: React 19 (`react` ^19.2.6, `react-dom` ^19.2.6) with TypeScript (`typescript` ~6.0.2).
- **Build Tool & Bundler**: Vite 8 (`vite` ^8.0.12, `@vitejs/plugin-react` ^6.0.1).
- **AI & LLM Integration**: Groq API Client (`src/lib/groqClient.ts`) using model `llama-3.3-70b-versatile` with customizable API key storage (`localStorage`) and smart context-aware offline fallbacks.
- **Styling & Design System**: Tailwind CSS v3 (`tailwindcss` ^3.4.19, `autoprefixer`, `postcss`), custom playful Duolingo-inspired & glassmorphism utilities in `src/index.css`, custom fonts (`Nunito`, `Outfit` loaded via Google Fonts).
- **State Machine & Data Layer**: Reducer State Machine (`useGameState`), Resilient Hybrid Data Hook (`useSupabase` with `localStorage` offline fallback and background sync queue).
- **Zero-Cost Native TTS**: Web Speech API (`window.speechSynthesis`) encapsulated in `src/lib/speech.ts` with `AudioButton.tsx`.
- **Backend & Database**: Supabase PostgreSQL (`@supabase/supabase-js` ^2.108.1) with client fallback to static dataset (`GRAMMAR_MODULES`).
- **Drag and Drop Engine**: `@dnd-kit/core` (^6.3.1), `@dnd-kit/sortable` (^10.0.0), `@dnd-kit/utilities` (^3.2.2).
- **Animations & Visual FX**: Framer Motion (`framer-motion` ^12.40.0), Canvas Confetti (`canvas-confetti` ^1.9.4).
- **Internationalization (i18n)**: `i18next` (^26.3.1), `react-i18next` (^17.0.8) supporting `en` (default primary) and `id` (secondary).
- **Routing**: React Router DOM v7 (`react-router-dom` ^7.17.0).
- **Icons & Helpers**: Lucide React (`lucide-react` ^1.17.0), `clsx` (^2.1.1), `tailwind-merge` (^3.6.0).

---

## 2. PROJECT STRUCTURE & ARCHITECTURE
### Directory Tree & Component Responsibilities
```
jumble/
├── public/                     # Static assets & public icons
├── supabase/
│   └── schema.sql              # PostgreSQL tables (users, lessons, questions, user_progress), RLS & seed data
├── src/
│   ├── assets/                 # SVGs and images (hero.png, vite.svg, etc.)
│   ├── components/
│   │   ├── game/               # Core game flow components
│   │   │   ├── AITutorModal.tsx             # AI Grammar Tutor drawer (Groq Llama-3.3-70b integration, quick prompt chips, key settings)
│   │   │   ├── AnswerZone.tsx              # Drop/tap zone for selected word tiles in Jumble
│   │   │   ├── CardHeader.tsx              # Top bar (progress bar, heart counter, level badge, exit button, clickable heart refill)
│   │   │   ├── ConceptIntroWalkthrough.tsx # Interactive Brilliant.org-style pre-lesson grammar concept walkthrough (intro.png layout)
│   │   │   ├── FeedbackOverlay.tsx         # Bottom drawer overlay for correct/incorrect answers & explanations + TTS CTA
│   │   │   ├── FillInBlankQuestion.tsx     # Fill-in-the-blank question view
│   │   │   ├── GameOverModal.tsx           # Game over state modal
│   │   │   ├── JumbleLevel.tsx             # Main gameplay orchestrator using state machine, concept intro & dnd-kit context
│   │   │   ├── MultipleChoiceQuestion.tsx  # Multiple choice question view
│   │   │   ├── OutOfHeartsModal.tsx        # Zero/refill hearts dialog (Review mode / Refill / Pro upgrade options)
│   │   │   ├── WinModal.tsx                # Level completion modal with star ratings and points
│   │   │   ├── WordBank.tsx                # Available word options pool for Jumble questions
│   │   │   └── WordBlock.tsx               # Draggable & clickable word tile component
│   │   ├── layout/
│   │   │   └── LanguageSwitcher.tsx        # Language switcher 2-way toggle (EN ↔ ID)
│   │   └── ui/
│   │       ├── AudioButton.tsx             # Native Web Speech API TTS audio playback CTA button
│   │       ├── Button.tsx                  # Reusable 3D tactile button component
│   │       ├── ComboDisplay.tsx            # Combo streak indicator
│   │       ├── HeartBar.tsx                # Hearts display component
│   │       ├── ProgressBar.tsx            # Smooth animated level completion bar
│   │       └── StarRating.tsx              # Animated 1-3 star result component
│   ├── data/
│   │   ├── grammarModules.ts   # Central re-exporter of categories metadata & combined grammar modules
│   │   └── modules/            # Modularized Test-English curriculum datasets by domain:
│   │       ├── presentTenses.ts
│   │       ├── pastTenses.ts
│   │       ├── futureTenses.ts
│   │       ├── modalsPhrasals.ts
│   │       ├── conditionalsWishes.ts
│   │       ├── passiveReported.ts
│   │       ├── ingInfinitive.ts
│   │       ├── articlesNouns.ts
│   │       ├── relativeAuxWordOrder.ts
│   │       ├── adjectivesPrepositions.ts
│   │       └── examPrep.ts
│   ├── hooks/
│   │   ├── useConfetti.ts      # Firework & celebratory confetti triggers
│   │   ├── useGameState.ts     # State Machine hook (IDLE, PLAYING, FEEDBACK, OUT_OF_HEARTS, COMPLETED)
│   │   └── useSupabase.ts      # Offline-first data hook with LocalStorage & background sync queue
│   ├── lib/
│   │   ├── evaluator.ts        # String normalization & word array matching logic
│   │   ├── groqClient.ts       # Groq API LLM Client (Llama-3.3-70b-versatile, key storage, smart fallback explanations)
│   │   ├── heartsManager.ts    # Hearts state management (5 hearts max, 4h auto-refill, localStorage persistence, PRO mode)
│   │   ├── speech.ts           # Zero-cost native Web Speech API TTS wrapper
│   │   ├── starCalculator.ts   # Star calculation based on session mistakesCount
│   │   └── supabase.ts        # Supabase API client initialization
│   ├── locales/
│   │   ├── en/translation.json # Primary English translation dictionary
│   │   └── id/translation.json # Indonesian translation dictionary
│   ├── pages/
│   │   ├── HomePage.tsx        # Hero splash page with start action, category selector & exam prep badges
│   │   ├── LessonsPage.tsx     # Serpentine pathway map (brilliant.png style) with unit headers, progressive node unlocking & stats
│   │   └── PlayPage.tsx        # Route wrapper extracting `:id` parameter to launch `JumbleLevel`
│   ├── types/
│   │   └── index.ts            # Centralized TypeScript domain interfaces (GrammarCategory, GrammarSubCategory, ConceptIntro)
│   ├── App.css                 # Custom component animations & extra styles
│   ├── App.tsx                 # Root router configuration (`/`, `/lessons`, `/play/:id`)
│   ├── i18n.ts                 # i18next setup (EN default, ID secondary)
│   ├── index.css               # Design system tokens, color palettes, playful background gradients, glassmorphism utilities
│   └── main.tsx                # React root mount point
```

---

## 3. CURRENT IMPLEMENTATION STATE & DATA FLOW
### Active Modules & Core Features
1. **Serpentine Pathway Map (`LessonsPage.tsx`)**:
   - Replaces traditional grid cards with a serpentine zigzag pathway map (`brilliant.png` & Duolingo layout).
   - Alternating offset milestone nodes connected by dashed SVG path lines.
   - Unit Banners ("Unit 1: Present Tenses", "Unit 2: Past Tenses", etc.).
   - Sequential Unlocking: Lesson 1 unlocked by default; subsequent lessons unlock upon earning stars in preceding lessons.
   - Node states: Active (pulsing green glow + floating START mascot), Completed (gold stars rating + checkmark), Locked (🔒 icon + lock requirement toast).
2. **Gamified Concept Intro (`ConceptIntroWalkthrough.tsx`)**:
   - Matches `intro.png`: Segmented top progress bar, exit `✕` button, energy/heart & star counters.
   - Interactive formula cards, rule breakdowns, TTS audio examples, and warm-up questions.
   - Bottom Action Bar: Groq AI Assistant button on bottom-left, Continue CTA button on bottom-right.
3. **Groq AI Grammar LLM Assistant (`AITutorModal.tsx` & `groqClient.ts`)**:
   - Powered by Groq API (`llama-3.3-70b-versatile`).
   - Custom Groq API Key configuration modal (`localStorage` persistence).
   - Quick prompt chips ("💡 Simple Explanation", "📝 3 More Examples", "❓ When to Use?", "🇮🇩 In Indonesian").
   - Contextual smart fallback answers when offline or API key is absent.
4. **Complete Test-English Reference Curriculum**:
   - Full 18 Test-English categories plus Exam Prep suite (Present Tenses, Past Tenses, Future, Verb Tense Reviews, Modals & Phrasals, Conditionals & Wishes, Passive Voice, Reported Speech, -ing and Infinitive, Articles Nouns & Pronouns, Relative Clauses, There & It, Auxiliary Verbs, Adjectives & Adverbs, Conjunctions & Clauses, Prepositions, Questions, Word Order, IELTS/TOEFL/TOEIC).

---

## 4. VERIFICATION & BUILD CHECKS
- TypeScript compiler checks (`tsc -b` / `npx tsc --noEmit`): Clean compilation without errors or warnings.
- Vite Production Build (`npm run build`): Successfully outputs minified client bundle.
