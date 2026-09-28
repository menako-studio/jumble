# PROJECT STATE & SINGLE SOURCE OF TRUTH

## 1. EXECUTIVE SUMMARY & TECH STACK
### Core Purpose & Scope
**Jumble** is a modern, high-performance, gamified English grammar learning web application built by **Menako Studio**. It replicates interactive card-based learning mechanisms (inspired by Brilliant.org & Duolingo) tailored for non-native English speakers (with localized support for English `EN` default and Indonesian `ID`). Users progress through structured **CEFR levels (A1 to B2)** and **Exam Prep modules (IELTS, TOEFL, TOEIC)** across a **Serpentine Pathway Map (`brilliant.png` & Duolingo style)** with progressive lesson unlocking, step-by-step interactive concept intros (`intro.png`), and an **AI Grammar Tutor powered by Groq LLM API**.

### Tech Stack & Core Libraries
- **Core Framework**: React 19 (`react` ^19.2.6, `react-dom` ^19.2.6) with TypeScript (`typescript` ~6.0.2).
- **Build Tool & Bundler**: Vite 8 (`vite` ^8.0.12, `@vitejs/plugin-react` ^6.0.1).
- **AI & LLM Integration**: Groq API Client (`src/lib/groqClient.ts`) using model `llama-3.3-70b-versatile` with customizable API key storage (`localStorage`) and smart context-aware offline fallbacks.
- **Styling & Design System**: Tailwind CSS v3 (`tailwindcss` ^3.4.19, `autoprefixer`, `postcss`). Light, airy Sana Labs × Duolingo design system in `src/index.css` — crisp white/porcelain surfaces (`surface.*` tokens), high-contrast slate `ink.*` typography, tactile `border-2 border-b-4` 3D elevation on buttons/tiles, and pastel mint/coral (`feedback.*`) bottom-sheet drawers. Custom fonts (`Nunito`, `Outfit` loaded via Google Fonts).
- **Sound Design**: Zero-asset synthesized Web Audio engine (`src/lib/audioEngine.ts` + `src/hooks/useSound.ts`) — ascending chime on correct answers, soft thud on mistakes, tile pop/remove clicks, win flourish. Mute toggle persisted to `localStorage`, exposed in `CardHeader`.
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
├── .claude/
│   └── launch.json             # Claude Code dev launch configuration (npm run dev on port 5173)
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
│   │   ├── useConfetti.ts      # Firework & celebratory confetti triggers (Duolingo brand palette)
│   │   ├── useGameState.ts     # State Machine hook (IDLE, PLAYING, FEEDBACK, OUT_OF_HEARTS, COMPLETED)
│   │   ├── useSound.ts         # React hook wrapper around the synthesized audio engine + mute state
│   │   └── useSupabase.ts      # Offline-first data hook with LocalStorage & background sync queue
│   ├── lib/
│   │   ├── audioEngine.ts      # Zero-asset Web Audio synth (correct chime, mistake thud, tile pop/remove, win flourish)
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
│   ├── context/
│   │   └── AuthContext.tsx         # Google OAuth & persistent guest auth with auto-save & cloud migration
│   ├── components/
│   │   ├── profile/
│   │   │   ├── ProfileModal.tsx        # User profile, statistics, cloud sync status & Google login modal
│   │   │   └── UserProfileButton.tsx   # Header trigger button with avatar & auto-save sync status dot
│   │   └── ui/
│   │       └── HorizontalScroller.tsx  # Smooth horizontal carousel scroller with arrows, wheel & drag support
│   ├── App.css                 # Custom component animations & extra styles
│   ├── App.tsx                 # Root router configuration (`/`, `/lessons`, `/play/:id`) wrapped in AuthProvider
│   ├── i18n.ts                 # i18next setup (EN default, ID secondary)
│   ├── index.css               # Design system tokens, color palettes, playful background gradients, glassmorphism utilities
│   └── main.tsx                # React root mount point
```

---

## 3. CURRENT IMPLEMENTATION STATE & DATA FLOW
### Active Modules & Core Features
1. **Dedicated Landing Page (`HomePage.tsx`)**:
   - Distinct from the learning dashboard, featuring an engaging hero, animated mascot, curriculum syllabus preview, feature pillars, and profile sync widget.
   - Refined copywriting: removed accredited CERF/CEFR certification claims to prevent miscommunication, framing progression as structured skill stages (Beginner to Advanced & Exam Prep).
2. **Structured Curriculum Units & Topic Syllabus Cards (`LessonsPage.tsx`)**:
   - Replaced serpentine Duolingo-style winding snake map with clean, structured Unit/Theme sections and syllabus cards.
   - Each topic clearly communicates its pedagogical flow: `💡 Concept & Rules ➔ 🎯 Practice & Quiz`.
   - Distinct class/theme breakdown with unit completion meters, progress tracking, and pagination.
3. **Word Scramble with Distractor Support & Flexible Submissions (`JumbleLevel.tsx`, `useGameState.ts`)**:
   - Added distractor word tiles to the word bank pool so questions cannot be solved by trivial process of elimination.
   - Removed the rigid constraint requiring all bank tiles to be placed; users can submit their answer once formed.
   - Beginner modules curated with accessible, foundational vocabulary.
4. **Spot-the-Mistake Error Identification Activity (`SpotTheMistakeQuestion.tsx`)**:
   - New interactive question format where learners identify and tap grammatical errors within sentences.
5. **Accurate Star Rating & 0-Star Failure State (`starCalculator.ts`, `WinModal.tsx`)**:
   - Fixed star formula to scale accurately with total questions.
   - Completely failed sessions (salah total / error rate >= 75%) correctly award 0 stars with encouraging retry feedback.
6. **Auto-Save & Google Authentication (`AuthContext.tsx`, `ProfileModal.tsx`)**:
   - Supabase Google OAuth integration with persistent local guest fallback.
   - Real-time auto-save indicator (☁️) ensuring learning progress is never lost.
7. **Gamified Concept Intro (`ConceptIntroWalkthrough.tsx`)**:
   - Segmented top progress bar, interactive formula cards, TTS audio examples, and warm-up questions.
8. **Groq AI Grammar LLM Assistant (`AITutorModal.tsx` & `groqClient.ts`)**:
   - Powered by Groq API (`llama-3.3-70b-versatile`) with context-aware Indonesian/English prompts.
9. **Synthesized Sound Engine**:
   - Zero-asset Web Audio cues (ascending chime on correct, soft thud on mistake, tile pop/remove clicks, win flourish).

---

## 4. VERIFICATION & BUILD CHECKS
- TypeScript compiler checks (`tsc -b`): Clean compilation without errors or warnings.
- Vite Production Build (`npm run build`): Successfully outputs minified client bundle with 0 errors.
- Unit & Logic Automated Verification (`npx tsx`):
  - Verified 0 mistakes returns 3 stars (`perfect`).
  - Verified 1 mistake on short session returns 1 star (`good`).
  - Verified total mistakes (salah total) strictly returns 0 stars (`gameover`).
  - Verified Jumble submission with distractor left behind evaluates correctly.
  - Verified Spot-the-Mistake error selection and correction logic.
- Local Dev Server: Responds with `HTTP/1.1 200 OK` on `/` and `/lessons`.
