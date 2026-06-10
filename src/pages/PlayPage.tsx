/**
 * PlayPage.tsx — Game screen that fetches questions and renders JumbleLevel
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuestions, useLessons } from '../hooks/useSupabase';
import { JumbleLevel } from '../components/game/JumbleLevel';
import type { Lesson } from '../types';

export const PlayPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'id' | 'jp';

  const { questions, loading, error } = useQuestions(id);
  const { lessons } = useLessons();

  const lesson: Lesson | undefined = lessons.find((l) => l.id === id);
  const lessonName = lesson
    ? (lang === 'jp' ? lesson.topic_name_jp : lesson.topic_name_id)
    : '...';

  if (loading) {
    return (
      <div className="bg-jumble min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🧩</div>
          <p className="text-white/50 font-semibold animate-pulse">{t('ui.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="bg-jumble min-h-dvh flex items-center justify-center px-4">
        <div className="glass rounded-xl3 p-8 text-center max-w-sm">
          <p className="text-4xl mb-4">😅</p>
          <p className="text-white font-bold mb-4">{t('ui.errorLoading')}</p>
          <button onClick={() => navigate('/lessons')} className="btn-primary btn btn-sm">
            {t('ui.backToLessons')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <JumbleLevel
      key={id}
      questions={questions}
      lessonName={lessonName}
      onExit={() => navigate('/lessons')}
      onComplete={(stars, score) => {
        // TODO: save to Supabase once auth is connected
        console.log('Lesson complete:', { stars, score });
        navigate('/lessons');
      }}
    />
  );
};
