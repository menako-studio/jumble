/**
 * useSupabase.ts — Resilient Offline-First Data Layer with Background Sync
 *
 * Supports offline storage via LocalStorage (`jumble_completed_lessons`) and
 * background synchronization to Supabase when configured or online.
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GRAMMAR_MODULES } from '../data/grammarModules';
import type { Lesson, Question, UserProgress } from '../types';

export const IS_DEMO = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

const LOCAL_PROGRESS_KEY = 'jumble_completed_lessons';

export interface LocalLessonRecord {
  lesson_id: string;
  stars_earned: number;
  synced: boolean;
  completed_at: string;
}

/**
 * Helper to fetch local progress stored in LocalStorage
 */
export function getLocalProgress(): Record<string, LocalLessonRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save progress locally in LocalStorage
 */
export function saveLocalProgress(lessonId: string, starsEarned: number, synced = false): Record<string, LocalLessonRecord> {
  const current = getLocalProgress();
  const existingStars = current[lessonId]?.stars_earned || 0;
  const bestStars = Math.max(existingStars, starsEarned);

  current[lessonId] = {
    lesson_id: lessonId,
    stars_earned: bestStars,
    synced,
    completed_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(current));
  }
  return current;
}

/**
 * Flush pending offline progress to Supabase when online
 */
export async function syncPendingProgress(userId: string): Promise<void> {
  if (IS_DEMO || !userId) return;

  const current = getLocalProgress();
  const unsyncedList = Object.values(current).filter((item) => !item.synced);

  if (unsyncedList.length === 0) return;

  for (const item of unsyncedList) {
    try {
      const { error } = await supabase.from('user_progress').upsert(
        {
          user_id: userId,
          lesson_id: item.lesson_id,
          stars_earned: item.stars_earned,
        },
        { onConflict: 'user_id,lesson_id' }
      );

      if (!error) {
        saveLocalProgress(item.lesson_id, item.stars_earned, true);
      }
    } catch {
      // Ignore network failures gracefully; will retry on next sync pass
    }
  }
}

// ——— Lessons hook ———

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (IS_DEMO) {
      setTimeout(() => {
        setLessons(GRAMMAR_MODULES);
        setLoading(false);
      }, 150);
      return;
    }

    supabase
      .from('lessons')
      .select('*')
      .order('level', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setLessons(GRAMMAR_MODULES);
        } else {
          setLessons((data as Lesson[]) || GRAMMAR_MODULES);
        }
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

  const [prevLessonId, setPrevLessonId] = useState<string | undefined>(lessonId);
  if (lessonId !== prevLessonId) {
    setPrevLessonId(lessonId);
    setLoading(true);
  }

  useEffect(() => {
    if (!lessonId) return;

    if (IS_DEMO) {
      setTimeout(() => {
        const foundModule = GRAMMAR_MODULES.find((m) => m.id === lessonId);
        setQuestions(foundModule ? foundModule.questions : GRAMMAR_MODULES[0].questions);
        setLoading(false);
      }, 150);
      return;
    }

    supabase
      .from('questions')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('display_order', { ascending: true })
      .then(({ data, error: resError }) => {
        if (resError || !data || data.length === 0) {
          if (resError) setError(resError.message);
          const foundModule = GRAMMAR_MODULES.find((m) => m.id === lessonId);
          setQuestions(foundModule ? foundModule.questions : GRAMMAR_MODULES[0].questions);
        } else {
          setQuestions(data as Question[]);
        }
        setLoading(false);
      });
  }, [lessonId]);

  return { questions, loading, error };
}

// ——— User progress hook ———

export function useUserProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Read local progress first for immediate render
    const localData = getLocalProgress();
    const localList: UserProgress[] = Object.values(localData).map((d) => ({
      user_id: userId || 'demo-user',
      lesson_id: d.lesson_id,
      stars_earned: d.stars_earned,
      completed_at: d.completed_at,
    }));
    setProgress(localList);

    if (!userId || IS_DEMO) return;

    setLoading(true);
    // Background sync then fetch remote
    syncPendingProgress(userId).finally(() => {
      supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .then(({ data }) => {
          if (data && data.length > 0) {
            setProgress(data as UserProgress[]);
          }
          setLoading(false);
        });
    });
  }, [userId]);

  return { progress, loading };
}

// ——— Save progress ———

export async function saveProgress(userId: string | undefined, lessonId: string, starsEarned: number) {
  // Always save locally first (optimistic offline strategy)
  saveLocalProgress(lessonId, starsEarned, false);

  if (IS_DEMO || !userId) return;

  try {
    const { error } = await supabase.from('user_progress').upsert(
      { user_id: userId, lesson_id: lessonId, stars_earned: starsEarned },
      { onConflict: 'user_id,lesson_id' }
    );
    if (!error) {
      saveLocalProgress(lessonId, starsEarned, true);
    }
  } catch {
    // Silently caught, queued for background sync
  }
}

// ——— Update user points ———

export async function addUserPoints(userId: string, points: number, stars: number) {
  if (IS_DEMO || !userId) return;
  try {
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
  } catch {
    // Graceful fallback
  }
}
