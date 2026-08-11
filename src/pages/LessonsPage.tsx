import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLessons, useUserProgress } from '../hooks/useSupabase';
import { StarRating } from '../components/ui/StarRating';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';
import { getHeartsState, MAX_HEARTS } from '../lib/heartsManager';
import type { CEFRLevel, GrammarCategory, GrammarModule } from '../types';

const CEFR_TABS: { id: CEFRLevel | 'ALL'; label: string; sub: string }[] = [
  { id: 'ALL', label: 'All', sub: 'Curriculum' },
  { id: 'A1', label: 'A1', sub: 'Elementary' },
  { id: 'A2', label: 'A2', sub: 'Pre-Int' },
  { id: 'B1', label: 'B1', sub: 'Intermediate' },
  { id: 'B1_PLUS', label: 'B1+', sub: 'Upper-Int' },
  { id: 'B2', label: 'B2', sub: 'Advanced' },
];

const CATEGORY_NAMES: Record<GrammarCategory, { en: string; id: string; icon: string }> = {
  tenses: { en: 'Tenses', id: 'Tenses', icon: '⏳' },
  verbs_modals: { en: 'Verbs & Modals', id: 'Kata Kerja & Modal', icon: '⚡' },
  nouns_pronouns: { en: 'Nouns & Pronouns', id: 'Kata Benda & Kata Ganti', icon: '📦' },
  adjectives_adverbs: { en: 'Adjectives & Adverbs', id: 'Kata Sifat & Keterangan', icon: '🎨' },
  clauses_conditionals: { en: 'Clauses & Conditionals', id: 'Klausa & Pengandaian', icon: '🔀' },
  passive_reported: { en: 'Passive & Reported', id: 'Pasif & Reported Speech', icon: '📣' },
};

export const LessonsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lessons, loading } = useLessons();
  const { progress } = useUserProgress('demo-user');
  const lang = (i18n.language as 'en' | 'id') || 'en';

  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<GrammarCategory | 'ALL'>('ALL');
  const [heartsState, setHeartsState] = useState(getHeartsState());

  useEffect(() => {
    setHeartsState(getHeartsState());
  }, []);

  // Calculate stars per lesson from user progress
  const starsMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    progress.forEach((p) => {
      map[p.lesson_id] = Math.max(map[p.lesson_id] || 0, p.stars_earned);
    });
    return map;
  }, [progress]);

  const getTitle = (m: GrammarModule) => {
    if (lang === 'id' && m.title_id) return m.title_id;
    return m.title || m.topic_name || 'Grammar Point';
  };

  const getDesc = (m: GrammarModule) => {
    if (lang === 'id' && m.description_id) return m.description_id;
    return m.description || '';
  };

  const filteredLessons = (lessons as GrammarModule[]).filter((l) => {
    const matchesCefr = selectedCefr === 'ALL' || l.cefrLevel === selectedCefr;
    const matchesCat = selectedCategory === 'ALL' || l.category === selectedCategory;
    return matchesCefr && matchesCat;
  });

  return (
    <div className="bg-jumble min-h-dvh flex flex-col font-nunito">
      {/* Sticky Header */}
      <header className="glass border-b border-surface-border sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors cursor-pointer"
              id="back-home-btn"
            >
              ←
            </button>
            <h1 className="text-lg font-black text-white">{t('ui.lessonSelect', 'Grammar Curriculum')}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Hearts Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-panel/80 border border-surface-border">
              <span className="text-base">{heartsState.isProUser ? '♾️' : '❤️'}</span>
              <span className="text-white font-black text-xs">
                {heartsState.isProUser ? 'PRO' : `${heartsState.heartsCount}/${MAX_HEARTS}`}
              </span>
            </div>
            <LanguageSwitcher />
          </div>
        </div>

        {/* CEFR Level Tabs */}
        <div className="max-w-lg mx-auto px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {CEFR_TABS.map((tab) => {
            const isActive = selectedCefr === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCefr(tab.id)}
                className={`
                  px-3.5 py-1.5 rounded-xl font-black text-xs shrink-0 transition-all flex flex-col items-center cursor-pointer
                  ${isActive
                    ? 'bg-brand-500 text-white shadow-glow scale-105 border border-brand-300'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                  }
                `}
                id={`cefr-tab-${tab.id}`}
              >
                <span>{tab.label}</span>
                <span className="text-[9px] opacity-70 font-semibold">{tab.sub}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 flex flex-col gap-5">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-amber-400 text-amber-950 font-black'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            🌟 All Categories
          </button>
          {Object.entries(CATEGORY_NAMES).map(([catKey, catObj]) => {
            const isActive = selectedCategory === catKey;
            const labelName = lang === 'id' ? catObj.id : catObj.en;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey as GrammarCategory)}
                className={`px-3 py-1 rounded-full text-xs font-black shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 font-black'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <span>{catObj.icon}</span>
                <span>{labelName}</span>
              </button>
            );
          })}
        </div>

        {/* Modules List */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-white/40 font-semibold animate-pulse">{t('ui.loading', 'Loading curriculum...')}</div>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-12 glass rounded-xl3 p-6 border border-surface-border">
            <span className="text-4xl mb-2 block">📚</span>
            <p className="text-white font-black text-lg">No modules found</p>
            <p className="text-white/60 text-xs mt-1">Try switching CEFR levels or category filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            <AnimatePresence mode="popLayout">
              {filteredLessons.map((item, idx) => {
                const stars = starsMap[item.id] ?? 0;
                const catMeta = CATEGORY_NAMES[item.category] || { icon: '📘' };

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => navigate(`/play/${item.id}`)}
                    className="w-full glass rounded-xl3 p-4 flex items-center gap-4 text-left hover:scale-[1.02] cursor-pointer transition-all duration-200 border border-white/10 shadow-lg group"
                    id={`lesson-card-${item.id}`}
                  >
                    {/* Icon / Level Badge */}
                    <div className="w-14 h-14 rounded-xl2 bg-gradient-to-br from-brand-500 to-purple-600 flex flex-col items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-glow">
                      <span className="text-xl leading-none">{catMeta.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider mt-1 opacity-90">
                        {item.cefrLevel ? item.cefrLevel.replace('_PLUS', '+') : 'A1'}
                      </span>
                    </div>

                    {/* Module Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">
                          {item.category?.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-white font-black text-base leading-snug truncate">
                        {getTitle(item)}
                      </h3>
                      <p className="text-white/70 text-xs truncate mt-0.5 font-medium">
                        {getDesc(item)}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <StarRating stars={stars} size="sm" animate={false} />
                        <span className="text-white/40 text-[11px] font-mono font-bold">
                          {item.questions?.length ?? 3} Questions
                        </span>
                      </div>
                    </div>

                    <span className="text-white/40 text-xl group-hover:text-white group-hover:translate-x-1 transition-all">
                      →
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};
