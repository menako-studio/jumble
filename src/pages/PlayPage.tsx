import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuestions, useLessons } from '../hooks/useSupabase';
import { SkeletonGroup, Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/StateMessage';
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
      <div className="bg-jumble min-h-dvh flex flex-col">
        <SkeletonGroup label={t('ui.loading', 'Loading lesson...')} className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-8">
          {/* Header placeholder: close, progress, hearts */}
          <div className="flex items-center gap-4">
            <Skeleton className="w-11 h-11 rounded-full" />
            <Skeleton className="h-3.5 flex-1 rounded-full" />
            <Skeleton className="w-20 h-8 rounded-full" />
          </div>
          {/* Question card placeholder */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-24 w-full rounded-3xl" />
            <div className="flex flex-wrap gap-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-24 rounded-2xl" />
              ))}
            </div>
          </div>
        </SkeletonGroup>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="bg-jumble min-h-dvh flex items-center justify-center px-4">
        <div className="glass rounded-xl3 p-6 max-w-sm w-full">
          <ErrorState
            icon="😅"
            title={t('ui.errorLoading', 'Could not load questions.')}
            onRetry={() => navigate('/lessons')}
            actionLabel={t('ui.backToLessons', 'Back to Lessons')}
            className="py-4"
          />
        </div>
      </div>
    );
  }

  return (
    <JumbleLevel
      key={id}
      lessonId={id}
      questions={questions}
      lessonName={getLessonName(lesson)}
      cefrLevel={lesson?.cefrLevel}
      onExit={() => navigate('/lessons')}
      onComplete={() => navigate('/lessons')}
    />
  );
};
