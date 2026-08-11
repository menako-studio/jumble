import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuestions, useLessons } from '../hooks/useSupabase';
import { JumbleLevel } from '../components/game/JumbleLevel';
import type { GrammarModule } from '../types';

export const PlayPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as 'en' | 'id') || 'en';

  const { questions, loading, error } = useQuestions(id);
  const { lessons } = useLessons();

  const lesson = (lessons as GrammarModule[]).find((l) => l.id === id);

  const getLessonName = (m?: GrammarModule) => {
    if (!m) return 'Grammar Practice';
    if (lang === 'id' && m.title_id) return m.title_id;
    return m.title || m.topic_name || 'Grammar Practice';
  };

  if (loading) {
    return (
      <div className="bg-jumble min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🧩</div>
          <p className="text-white/50 font-semibold animate-pulse">{t('ui.loading', 'Loading lesson...')}</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="bg-jumble min-h-dvh flex items-center justify-center px-4">
        <div className="glass rounded-xl3 p-8 text-center max-w-sm">
          <p className="text-4xl mb-4">😅</p>
          <p className="text-white font-bold mb-4">{t('ui.errorLoading', 'Could not load questions.')}</p>
          <button onClick={() => navigate('/lessons')} className="btn-primary btn btn-sm font-black cursor-pointer">
            {t('ui.backToLessons', 'Back to Lessons')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <JumbleLevel
      key={id}
      questions={questions}
      lessonName={getLessonName(lesson)}
      cefrLevel={lesson?.cefrLevel}
      onExit={() => navigate('/lessons')}
      onComplete={(_stars, _score) => {
        navigate('/lessons');
      }}
    />
  );
};
