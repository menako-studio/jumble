/**
 * LessonsPage.tsx — Lesson selection grid
 * Shows all lessons with star progress and lock state.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLessons } from '../hooks/useSupabase';
import { StarRating } from '../components/ui/StarRating';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';
import type { Lesson } from '../types';

// Demo progress — replace with real Supabase data once auth is set up
const DEMO_PROGRESS: Record<string, number> = {
  'a1b2c3d4-0001-0001-0001-000000000001': 3, // lesson 1 complete
};

// Level theme colours
const LEVEL_THEMES = [
  { from: 'from-brand-500', to: 'to-purple-400', icon: '🌱', shadow: 'shadow-glow' },
  { from: 'from-sky-500', to: 'to-cyan-400', icon: '🌊', shadow: '' },
  { from: 'from-orange-500', to: 'to-amber-400', icon: '🔥', shadow: '' },
  { from: 'from-emerald-500', to: 'to-green-400', icon: '🌟', shadow: '' },
  { from: 'from-pink-500', to: 'to-rose-400', icon: '💎', shadow: '' },
];

export const LessonsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lessons, loading } = useLessons();
  const lang = i18n.language as 'id' | 'jp';

  const getLessonName = (lesson: Lesson) =>
    lang === 'jp' ? lesson.topic_name_jp : lesson.topic_name_id;

  return (
    <div className="bg-jumble min-h-dvh flex flex-col font-nunito">
      {/* Header */}
      <header className="glass border-b border-surface-border sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="btn-ghost btn btn-sm px-2 text-xl"
            id="back-home-btn"
          >
            ←
          </button>
          <h1 className="text-xl font-black text-white flex-1">{t('ui.lessonSelect')}</h1>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-white/40 font-semibold animate-pulse">{t('ui.loading')}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {lessons.map((lesson, idx) => {
              const theme = LEVEL_THEMES[idx % LEVEL_THEMES.length];
              const stars = DEMO_PROGRESS[lesson.id] ?? 0;
              const isLocked = idx > 0 && (DEMO_PROGRESS[lessons[idx - 1]?.id] ?? 0) === 0;

              return (
                <motion.button
                  key={lesson.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => !isLocked && navigate(`/play/${lesson.id}`)}
                  className={`
                    w-full glass rounded-xl3 p-5 flex items-center gap-4 text-left
                    transition-all duration-200 group
                    ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] cursor-pointer'}
                  `}
                  style={isLocked ? {} : {
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  }}
                  id={`lesson-${lesson.id}`}
                >
                  {/* Level icon */}
                  <div
                    className={`
                      flex-shrink-0 w-14 h-14 rounded-xl2 flex items-center justify-center
                      bg-gradient-to-br ${theme.from} ${theme.to} text-2xl
                      group-hover:scale-110 transition-transform duration-200
                    `}
                    style={{ boxShadow: '0 3px 12px rgba(0,0,0,0.3)' }}
                  >
                    {isLocked ? '🔒' : theme.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-0.5">
                      {t('ui.level')} {lesson.level}
                    </p>
                    <p className="text-white font-black text-lg leading-tight truncate">
                      {getLessonName(lesson)}
                    </p>
                    {/* Stars earned */}
                    <div className="mt-2">
                      <StarRating stars={stars} size="sm" animate={false} />
                    </div>
                  </div>

                  {/* Arrow */}
                  {!isLocked && (
                    <span className="text-white/30 text-2xl group-hover:text-white/60 transition-colors">
                      →
                    </span>
                  )}
                </motion.button>
              );
            })}

            {/* Placeholder — more coming soon */}
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl3 border-2 border-dashed border-surface-border opacity-40">
              <div className="w-14 h-14 rounded-xl2 bg-surface-panel flex items-center justify-center text-2xl">
                🚧
              </div>
              <div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Coming Soon</p>
                <p className="text-white/50 font-bold text-base">More lessons on the way!</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
