# PROJECT STATE & SINGLE SOURCE OF TRUTH

## 1. EXECUTIVE SUMMARY & TECH STACK
### Core Purpose & Scope
**Jumble** is a modern, high-performance, gamified English grammar learning web application built by **Menako Studio**. It replicates interactive card-based learning mechanisms (inspired by Brilliant.org & Duolingo) tailored for non-native English speakers (with localized support for English `EN` default and Indonesian `ID`). Users progress through structured **CEFR levels (A1 to B2)** across various grammar modules featuring Word Jumbles (drag-and-drop & tap placement), Multiple Choice, and Fill-in-the-Blank question types.

### Tech Stack & Core Libraries
- **Core Framework**: React 19 (`react` ^19.2.6, `react-dom` ^19.2.6) with TypeScript (`typescript` ~6.0.2).
- **Build Tool & Bundler**: Vite 8 (`vite` ^8.0.12, `@vitejs/plugin-react` ^6.0.1).
- **Styling & Design System**: Tailwind CSS v3 (`tailwindcss` ^3.4.19, `autoprefixer`, `postcss`), custom glassmorphism utilities in `src/index.css`, custom fonts (`Nunito`, `Outfit` loaded via Google Fonts).
- **State Machine & Data Layer**: Reducer State Machine (`useGameState`), Resilient Hybrid Data Hook (`useSupabase` with `localStorage` offline fallback and background sync queue).
- **Zero-Cost Native TTS**: Web Speech API (`window.speechSynthesis`) encapsulated in `src/lib/speech.ts` with `AudioButton.tsx`.
- **Backend & Database**: Supabase PostgreSQL (`@supabase/supabase-js` ^2.108.1) with client fallback to static demo data (`GRAMMAR_MODULES`).
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
│   │   │   ├── AnswerZone.tsx              # Drop/tap zone for selected word tiles in Jumble
│   │   │   ├── CardHeader.tsx              # Top bar (progress bar, heart counter, level badge, exit button)
│   │   │   ├── FeedbackOverlay.tsx         # Bottom drawer overlay for correct/incorrect answers & explanations + TTS CTA
│   │   │   ├── FillInBlankQuestion.tsx     # Fill-in-the-blank question view
│   │   │   ├── GameOverModal.tsx           # Game over state modal
      │   │   ├── JumbleLevel.tsx             # Main gameplay orchestrator using state machine & dnd-kit context
│   │   │   ├── MultipleChoiceQuestion.tsx  # Multiple choice question view
│   │   │   ├── OutOfHeartsModal.tsx        # Zero hearts dialog (Review mode / Refill / Pro upgrade options)
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
│   │   └── grammarModules.ts   # Static dataset for CEFR A1-B2 curriculum & out-of-hearts review pool
│   ├── hooks/
│   │   ├── useConfetti.ts      # Firework & celebratory confetti triggers
│   │   ├── useGameState.ts     # State Machine hook (IDLE, PLAYING, FEEDBACK, OUT_OF_HEARTS, COMPLETED)
│   │   └── useSupabase.ts      # Offline-first data hook with LocalStorage & background sync queue
│   ├── lib/
│   │   ├── evaluator.ts        # String normalization & word array matching logic
│   │   ├── heartsManager.ts    # Hearts state management (5 hearts max, 4h auto-refill, localStorage persistence, PRO mode)
│   │   ├── speech.ts           # Zero-cost native Web Speech API TTS wrapper
│   │   ├── starCalculator.ts   # Star calculation based on remaining hearts & XP scoring
│   │   └── supabase.ts        # Supabase API client initialization
│   ├── locales/
│   │   ├── en/translation.json # Primary English translation dictionary
│   │   └── id/translation.json # Indonesian translation dictionary
│   ├── pages/
│   │   ├── HomePage.tsx        # Hero splash page with start action & level pills
│   │   ├── LessonsPage.tsx     # Curriculum overview filtered by CEFR level & Grammar Category
│   │   └── PlayPage.tsx        # Route wrapper extracting `:id` parameter to launch `JumbleLevel`
│   ├── types/
│   │   └── index.ts            # Centralized TypeScript domain interfaces
│   ├── App.css                 # Custom component animations & extra styles
│   ├── App.tsx                 # Root router configuration (`/`, `/lessons`, `/play/:id`)
│   ├── i18n.ts                 # i18next setup (EN default, ID secondary)
│   ├── index.css               # Design system tokens, color palettes, background gradients, glassmorphism utilities
│   └── main.tsx                # React root mount point
├── index.html                  # HTML entry point loading Google Fonts (Nunito, Outfit)
├── tailwind.config.js          # Tailwind theme extension (colors, gradients, border radius, animations)
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json # TypeScript project settings
└── vite.config.ts              # Vite configuration with React plugin & path aliases
```

### Architectural Patterns
- **Feature-first / Component-based Structure**: Logic is clean and isolated between presentational UI components (`src/components/ui`), gameplay components (`src/components/game`), domain logic (`src/lib`), and pages (`src/pages`).
- **State Machine Pattern**: `useGameState` manages game phases (`IDLE`, `PLAYING`, `FEEDBACK`, `OUT_OF_HEARTS`, `COMPLETED`) via a clean `useReducer` to prevent fragmented state bugs.
- **Offline-First & Resilient UX**: Local progress is stored immediately in `localStorage` (`jumble_completed_lessons`) and synchronized to Supabase in the background via `syncPendingProgress()` when online.
- **Zero-Cost Native TTS**: Native Web Speech API integration (`window.speechSynthesis`) provides sentence and vocabulary pronunciation with zero third-party API costs or latency.
- **Client-Side State Persistence**: The Hearts system uses `localStorage` (`jumble_hearts_count`, `jumble_last_heart_restored`, `jumble_is_pro_user`) with automated time-decay passive recovery (1 heart per 4 hours).

---

## 3. CURRENT IMPLEMENTATION STATE & DATA FLOW
### Active Modules & Core Features
1. **Curriculum Engine (CEFR A1–B2)**:
   - Structured grammar topics categorized into `tenses`, `verbs_modals`, `nouns_pronouns`, `adjectives_adverbs`, `clauses_conditionals`, and `passive_reported`.
   - Built-in modules: Present Simple, Verb "To Be" & Can, Past Simple & Continuous, Comparatives & Superlatives, Present Perfect, Modals of Obligation, Conditionals Type 1 & 2, Passive Voice & Indirect Speech.
2. **Interactive Gameplay Types**:
   - **Jumble**: Drag-and-drop or tap-to-select word tiles into slot arrays.
   - **Multiple Choice**: Choice selection card interface.
   - **Fill-in-the-Blank**: Sentence completion options.
3. **Hearts & Gamification System**:
   - Max 5 hearts capacity; 1 heart lost on incorrect answer.
   - Passive refill: +1 Heart every 4 hours.
   - Out-of-Hearts Review Mode: Infinite free practice mode (5 questions from pool to earn +1 heart).
   - Instant full refill or Unlimited PRO toggle.
   - XP system with multiplier combo streaks (`score += 100 * min(combo, 5)`).
4. **Localization (i18n)**:
   - 2-way toggle (`EN` default, `ID` secondary). Japanese `JP` has been completely deprecated.

### Primary Data Flow
```
HomePage -> LessonsPage (Filters by CEFR/Category via useLessons hook)
                │
                ▼
      Navigate to /play/:id
                │
                ▼
PlayPage (Fetches module questions via useQuestions hook)
                │
                ▼
         JumbleLevel component (State machine initialized in useGameState)
                │
 ┌──────────────┼──────────────┐
 │ (Check Ans)  │ (Incorrect)  │ (Win Phase)
 ▼              ▼              ▼
Combo +1    Deduct Heart   Calculate Stars (calculateStars)
XP Score    Trigger Drawer  Save Progress (saveProgress API & LocalStorage)
Confetti    Check Hearts   Show Win Modal
```

---

## 4. VERIFICATION & BUILD CHECKS
- TypeScript compiler checks (`tsc`): Zero errors, strict typing without `any`.
- ESLint checks: Clean lint compliance.
- Runtime dev server: Clean asset resolution and state machine transitions.
