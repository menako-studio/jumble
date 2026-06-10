/**
 * useSupabase.ts — Supabase data-fetching hooks
 *
 * Falls back to DEMO_DATA when Supabase is not configured (no env vars).
 * This lets the app run standalone without a backend.
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Lesson, Question, UserProgress } from '../types';

// ——— Check if Supabase is configured ———
const IS_DEMO = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// ——— Demo data (used when no Supabase project is connected) ———

const DEMO_LESSONS: Lesson[] = [
  {
    id: 'a1b2c3d4-0001-0001-0001-000000000001',
    level: 1,
    topic_name: 'Simple Present Tense',
    topic_name_id: 'Kalimat Sederhana',
    topic_name_jp: 'シンプルな現在形',
  },
  {
    id: 'a1b2c3d4-0002-0002-0002-000000000002',
    level: 2,
    topic_name: 'Animals & Verbs',
    topic_name_id: 'Hewan dan Kata Kerja',
    topic_name_jp: '動物と動詞',
  },
];

const DEMO_QUESTIONS: Record<string, Question[]> = {
  'a1b2c3d4-0001-0001-0001-000000000001': [
    {
      id: 'q1', lesson_id: 'a1b2c3d4-0001-0001-0001-000000000001',
      correct_word_order: ['She', 'likes', 'apples'],
      jumbled_word_order: ['apples', 'She', 'likes'],
      explanation_id: 'Gunakan "likes" karena subjeknya "She" (orang ketiga tunggal).',
      explanation_jp: '「She」は三人称単数なので「likes」を使います。',
      display_order: 1,
    },
    {
      id: 'q2', lesson_id: 'a1b2c3d4-0001-0001-0001-000000000001',
      correct_word_order: ['The', 'cat', 'is', 'sleeping'],
      jumbled_word_order: ['sleeping', 'cat', 'The', 'is'],
      explanation_id: 'Gunakan "is" untuk present continuous dengan subjek tunggal.',
      explanation_jp: '単数の主語には「is」を使い、現在進行形を作ります。',
      display_order: 2,
    },
    {
      id: 'q3', lesson_id: 'a1b2c3d4-0001-0001-0001-000000000001',
      correct_word_order: ['I', 'eat', 'rice', 'every', 'day'],
      jumbled_word_order: ['every', 'rice', 'I', 'day', 'eat'],
      explanation_id: 'Pola kalimat: Subjek + Kata Kerja + Objek + Keterangan Waktu.',
      explanation_jp: '文のパターン：主語＋動詞＋目的語＋時の副詞。',
      display_order: 3,
    },
    {
      id: 'q4', lesson_id: 'a1b2c3d4-0001-0001-0001-000000000001',
      correct_word_order: ['They', 'play', 'football', 'together'],
      jumbled_word_order: ['football', 'play', 'together', 'They'],
      explanation_id: '"They" adalah subjek jamak, jadi kata kerja tidak ditambah "s".',
      explanation_jp: '「They」は複数形なので、動詞に「s」は付きません。',
      display_order: 4,
    },
    {
      id: 'q5', lesson_id: 'a1b2c3d4-0001-0001-0001-000000000001',
      correct_word_order: ['We', 'love', 'learning', 'English'],
      jumbled_word_order: ['English', 'We', 'love', 'learning'],
      explanation_id: '"Love" diikuti gerund "learning". Bukan "to learn".',
      explanation_jp: '「love」の後には動名詞「learning」を使います。',
      display_order: 5,
    },
  ],
  'a1b2c3d4-0002-0002-0002-000000000002': [
    {
      id: 'q6', lesson_id: 'a1b2c3d4-0002-0002-0002-000000000002',
      correct_word_order: ['The', 'dog', 'runs', 'fast'],
      jumbled_word_order: ['fast', 'dog', 'The', 'runs'],
      explanation_id: 'Pola: Subjek + Kata Kerja + Keterangan cara.',
      explanation_jp: 'パターン：主語＋動詞＋様態の副詞。',
      display_order: 1,
    },
    {
      id: 'q7', lesson_id: 'a1b2c3d4-0002-0002-0002-000000000002',
      correct_word_order: ['A', 'bird', 'can', 'fly', 'high'],
      jumbled_word_order: ['fly', 'A', 'high', 'bird', 'can'],
      explanation_id: '"Can" adalah kata kerja modal yang berarti kemampuan.',
      explanation_jp: '「can」は能力を表す助動詞です。',
      display_order: 2,
    },
    {
      id: 'q8', lesson_id: 'a1b2c3d4-0002-0002-0002-000000000002',
      correct_word_order: ['The', 'fish', 'swims', 'in', 'water'],
      jumbled_word_order: ['water', 'fish', 'The', 'in', 'swims'],
      explanation_id: '"In" adalah preposisi tempat yang digunakan dengan air.',
      explanation_jp: '「in」は場所を表す前置詞で、水の中に使います。',
      display_order: 3,
    },
    {
      id: 'q9', lesson_id: 'a1b2c3d4-0002-0002-0002-000000000002',
      correct_word_order: ['Cats', 'drink', 'milk', 'every', 'morning'],
      jumbled_word_order: ['morning', 'milk', 'Cats', 'every', 'drink'],
      explanation_id: 'Cats adalah subjek jamak, kata kerja tidak ditambah "s".',
      explanation_jp: '「Cats」は複数形なので動詞はそのままです。',
      display_order: 4,
    },
    {
      id: 'q10', lesson_id: 'a1b2c3d4-0002-0002-0002-000000000002',
      correct_word_order: ['The', 'elephant', 'has', 'a', 'big', 'trunk'],
      jumbled_word_order: ['trunk', 'big', 'has', 'a', 'The', 'elephant'],
      explanation_id: '"Has" digunakan untuk subjek tunggal orang ketiga.',
      explanation_jp: '「has」は三人称単数の主語に使います。',
      display_order: 5,
    },
  ],
};

// ——— Lessons hook ———

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (IS_DEMO) {
      // Simulate async fetch with a small delay for UX
      setTimeout(() => { setLessons(DEMO_LESSONS); setLoading(false); }, 300);
      return;
    }
    supabase
      .from('lessons')
      .select('*')
      .order('level', { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setLessons(data as Lesson[]);
        setLoading(false);
      });
  }, []);

  return { lessons, loading, error };
}

// ——— Questions hook ———

export function useQuestions(lessonId: string | undefined) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync loading state during render when lessonId changes
  const [prevLessonId, setPrevLessonId] = useState<string | undefined>(lessonId);
  if (lessonId !== prevLessonId) {
    setPrevLessonId(lessonId);
    setLoading(true);
  }

  useEffect(() => {
    if (!lessonId) return;

    if (IS_DEMO) {
      setTimeout(() => {
        setQuestions(DEMO_QUESTIONS[lessonId] ?? []);
        setLoading(false);
      }, 300);
      return;
    }

    supabase
      .from('questions')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setQuestions(data as Question[]);
        setLoading(false);
      });
  }, [lessonId]);

  return { questions, loading, error };
}

// ——— User progress hook ———

export function useUserProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(() => {
    return !!userId && !IS_DEMO;
  });

  // Sync loading state during render when userId changes
  const [prevUserId, setPrevUserId] = useState<string | undefined>(userId);
  if (userId !== prevUserId) {
    setPrevUserId(userId);
    setLoading(!!userId && !IS_DEMO);
  }

  useEffect(() => {
    if (!userId || IS_DEMO) return;
    supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .then(({ data }) => {
        setProgress((data as UserProgress[]) || []);
        setLoading(false);
      });
  }, [userId]);

  return { progress, loading };
}

// ——— Save progress ———

export async function saveProgress(userId: string, lessonId: string, starsEarned: number) {
  if (IS_DEMO) return;
  return supabase
    .from('user_progress')
    .upsert({ user_id: userId, lesson_id: lessonId, stars_earned: starsEarned },
             { onConflict: 'user_id,lesson_id' });
}

// ——— Update user points ———

export async function addUserPoints(userId: string, points: number, stars: number) {
  if (IS_DEMO) return;
  const { data } = await supabase
    .from('users')
    .select('points, total_stars')
    .eq('id', userId)
    .single();
  if (!data) return;
  return supabase
    .from('users')
    .update({
      points: (data.points || 0) + points,
      total_stars: (data.total_stars || 0) + stars,
    })
    .eq('id', userId);
}
