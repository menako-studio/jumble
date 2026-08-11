-- ============================================================
-- JUMBLE — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ——— USERS TABLE (extends auth.users) ———
CREATE TABLE IF NOT EXISTS public.users (
  id             UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username       TEXT         UNIQUE NOT NULL,
  country        TEXT         CHECK (country IN ('EN', 'ID')) DEFAULT 'EN',
  points         INTEGER      DEFAULT 0,
  total_stars    INTEGER      DEFAULT 0,
  current_streak INTEGER      DEFAULT 0,
  updated_at     TIMESTAMPTZ  DEFAULT NOW()
);

-- ——— LESSONS TABLE ———
CREATE TABLE IF NOT EXISTS public.lessons (
  id             UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  level          INTEGER      NOT NULL,
  topic_name     TEXT         NOT NULL,
  topic_name_id  TEXT         NOT NULL,
  created_at     TIMESTAMPTZ  DEFAULT NOW()
);

-- ——— QUESTIONS TABLE ———
CREATE TABLE IF NOT EXISTS public.questions (
  id                   UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id            UUID         REFERENCES public.lessons(id) ON DELETE CASCADE,
  correct_word_order   TEXT[]       NOT NULL,
  jumbled_word_order   TEXT[]       NOT NULL,
  explanation_id       TEXT,
  display_order        INTEGER      DEFAULT 0,
  created_at           TIMESTAMPTZ  DEFAULT NOW()
);

-- ——— USER PROGRESS TABLE ———
CREATE TABLE IF NOT EXISTS public.user_progress (
  id           UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID         REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id    UUID         REFERENCES public.lessons(id) ON DELETE CASCADE,
  stars_earned INTEGER      CHECK (stars_earned BETWEEN 0 AND 3) DEFAULT 0,
  completed_at TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress  ENABLE ROW LEVEL SECURITY;

-- Users: own profile only
CREATE POLICY "users_select_own"  ON public.users FOR SELECT  USING (auth.uid() = id);
CREATE POLICY "users_update_own"  ON public.users FOR UPDATE  USING (auth.uid() = id);
CREATE POLICY "users_insert_own"  ON public.users FOR INSERT  WITH CHECK (auth.uid() = id);

-- Lessons: public read for authenticated users
CREATE POLICY "lessons_select_all"   ON public.lessons   FOR SELECT TO authenticated USING (true);

-- Questions: public read for authenticated users
CREATE POLICY "questions_select_all" ON public.questions FOR SELECT TO authenticated USING (true);

-- User progress: own records only
CREATE POLICY "progress_all_own" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- SEED DATA — 2 Lessons, 5 Questions each
-- ============================================================

INSERT INTO public.lessons (id, level, topic_name, topic_name_id)
VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 1, 'Simple Present Tense', 'Kalimat Sederhana'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 2, 'Animals & Verbs',       'Hewan dan Kata Kerja')
ON CONFLICT DO NOTHING;

-- Lesson 1 questions
INSERT INTO public.questions (lesson_id, correct_word_order, jumbled_word_order, explanation_id, display_order)
VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001',
   ARRAY['She','likes','apples'],
   ARRAY['apples','She','likes'],
   'Gunakan "likes" karena subjeknya "She" (orang ketiga tunggal).', 1),

  ('a1b2c3d4-0001-0001-0001-000000000001',
   ARRAY['The','cat','is','sleeping'],
   ARRAY['sleeping','cat','The','is'],
   'Gunakan "is" untuk present continuous dengan subjek tunggal.', 2),

  ('a1b2c3d4-0001-0001-0001-000000000001',
   ARRAY['I','eat','rice','every','day'],
   ARRAY['every','rice','I','day','eat'],
   'Pola kalimat: Subjek + Kata Kerja + Objek + Keterangan Waktu.', 3),

  ('a1b2c3d4-0001-0001-0001-000000000001',
   ARRAY['They','play','football','together'],
   ARRAY['football','play','together','They'],
   '"They" adalah subjek jamak, jadi kata kerja tidak ditambah "s".', 4),

  ('a1b2c3d4-0001-0001-0001-000000000001',
   ARRAY['We','love','learning','English'],
   ARRAY['English','We','love','learning'],
   '"Love" diikuti gerund "learning". Bukan "to learn".', 5);

-- Lesson 2 questions
INSERT INTO public.questions (lesson_id, correct_word_order, jumbled_word_order, explanation_id, display_order)
VALUES
  ('a1b2c3d4-0002-0002-0002-000000000002',
   ARRAY['The','dog','runs','fast'],
   ARRAY['fast','dog','The','runs'],
   'Pola: Subjek + Kata Kerja + Keterangan cara.', 1),

  ('a1b2c3d4-0002-0002-0002-000000000002',
   ARRAY['A','bird','can','fly','high'],
   ARRAY['fly','A','high','bird','can'],
   '"Can" adalah kata kerja modal yang berarti kemampuan.', 2),

  ('a1b2c3d4-0002-0002-0002-000000000002',
   ARRAY['The','fish','swims','in','water'],
   ARRAY['water','fish','The','in','swims'],
   '"In" adalah preposisi tempat yang digunakan dengan air.', 3),

  ('a1b2c3d4-0002-0002-0002-000000000002',
   ARRAY['Cats','drink','milk','every','morning'],
   ARRAY['morning','milk','Cats','every','drink'],
   'Cats adalah subjek jamak, kata kerja tidak ditambah "s".', 4),

  ('a1b2c3d4-0002-0002-0002-000000000002',
   ARRAY['The','elephant','has','a','big','trunk'],
   ARRAY['trunk','big','has','a','The','elephant'],
   '"Has" digunakan untuk subjek tunggal orang ketiga.', 5)
ON CONFLICT DO NOTHING;
