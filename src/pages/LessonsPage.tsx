import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLessons, useUserProgress } from '../hooks/useSupabase';
import { StarRating } from '../components/ui/StarRating';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';
import { getHeartsState, MAX_HEARTS } from '../lib/heartsManager';
import { GRAMMAR_CATEGORIES_METADATA } from '../data/grammarModules';
import type { CEFRLevel, GrammarCategory, GrammarSubCategory, GrammarModule } from '../types';

const CEFR_TABS: { id: CEFRLevel | 'ALL'; label: string; sub: string }[] = [
  { id: 'ALL', label: 'All', sub: 'Curriculum' },
  { id: 'A1', label: 'A1', sub: 'Elementary' },
  { id: 'A2', label: 'A2', sub: 'Pre-Int' },
  { id: 'B1', label: 'B1', sub: 'Intermediate' },
  { id: 'B1_PLUS', label: 'B1+', sub: 'Upper-Int' },
  { id: 'B2', label: 'B2', sub: 'Advanced' },
];

export const LessonsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lessons, loading } = useLessons();
  const { progress } = useUserProgress('demo-user');
  const lang = (i18n.language as 'en' | 'id') || 'en';

  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<GrammarCategory | 'ALL'>('ALL');
  const [selectedSubCategory, setSelectedSubCategory] = useState<GrammarSubCategory | 'ALL'>('ALL');
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

  const activeCategoryMeta = GRAMMAR_CATEGORIES_METADATA.find((c) => c.key === selectedCategory);

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
    const matchesSubCat = selectedSubCategory === 'ALL' || l.subCategory === selectedSubCategory;
    return matchesCefr && matchesCat && matchesSubCat;
  });

  return (
    <div className="bg-jumble min-h-dvh flex flex-col font-nunito text-white pb-12">
      {/* Sticky Header */}
      <header className="glass border-b border-surface-border sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-all cursor-pointer border border-white/10"
              id="back-home-btn"
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-black text-white leading-tight">
                {t('ui.lessonSelect', 'Grammar Curriculum')}
              </h1>
              <p className="text-white/50 text-xs font-semibold hidden sm:block">
                Master English Grammar Roles & Exam Prep
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Hearts Counter */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-surface-panel border border-surface-border shadow-sm">
              <span className="text-lg">{heartsState.isProUser ? '♾️' : '❤️'}</span>
              <span className="text-white font-black text-sm">
                {heartsState.isProUser ? 'PRO' : `${heartsState.heartsCount}/${MAX_HEARTS}`}
              </span>
            </div>
            <LanguageSwitcher />
          </div>
        </div>

        {/* CEFR Level Tabs */}
        <div className="max-w-7xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {CEFR_TABS.map((tab) => {
            const isActive = selectedCefr === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCefr(tab.id)}
                className={`
                  px-4 py-1.5 rounded-2xl font-black text-xs shrink-0 transition-all flex flex-col items-center cursor-pointer border-2
                  ${
                    isActive
                      ? 'bg-duo-blue text-white border-duo-blue-light shadow-3d-blue scale-105'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border-transparent'
                  }
                `}
                id={`cefr-tab-${tab.id}`}
              >
                <span>{tab.label}</span>
                <span className="text-[9px] opacity-75 font-semibold">{tab.sub}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Main Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedSubCategory('ALL');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer border-2 ${
              selectedCategory === 'ALL'
                ? 'bg-duo-yellow text-amber-950 border-duo-yellow-light shadow-3d-yellow font-black'
                : 'bg-white/5 text-white/80 hover:bg-white/10 border-white/10'
            }`}
          >
            🌟 All Categories
          </button>
          {GRAMMAR_CATEGORIES_METADATA.map((catObj) => {
            const isActive = selectedCategory === catObj.key;
            const labelName = lang === 'id' ? catObj.name.id : catObj.name.en;
            return (
              <button
                key={catObj.key}
                onClick={() => {
                  setSelectedCategory(catObj.key);
                  setSelectedSubCategory('ALL');
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-black shrink-0 transition-all flex items-center gap-2 cursor-pointer border-2 ${
                  isActive
                    ? 'bg-duo-yellow text-amber-950 border-duo-yellow-light shadow-3d-yellow font-black'
                    : 'bg-white/5 text-white/80 hover:bg-white/10 border-white/10'
                }`}
              >
                <span>{catObj.icon}</span>
                <span>{labelName}</span>
              </button>
            );
          })}
        </div>

        {/* Connected Sub-Category Pills */}
        {activeCategoryMeta && activeCategoryMeta.subCategories.length > 0 && (
          <div className="p-4 rounded-3xl bg-surface-card/60 border border-surface-border flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50 font-black uppercase tracking-wider">
                {lang === 'id' ? 'Sub-Kategori Terkoneksi' : 'Connected Sub-Categories'}:
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedSubCategory('ALL')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSubCategory === 'ALL'
                    ? 'bg-duo-blue text-white font-black'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                All Sub-Categories
              </button>
              {activeCategoryMeta.subCategories.map((sub) => {
                const isSubActive = selectedSubCategory === sub.key;
                const subName = lang === 'id' ? sub.name.id : sub.name.en;
                return (
                  <button
                    key={sub.key}
                    onClick={() => setSelectedSubCategory(sub.key)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      isSubActive
                        ? 'bg-duo-blue text-white font-black shadow-sm'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {subName}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Paid / Pro Exam Prep Banner Section */}
        {selectedCategory === 'exam_prep' || selectedCategory === 'ALL' ? (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600/40 via-purple-600/40 to-sky-600/40 border-2 border-brand-400/50 shadow-glow relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 text-3xl font-black flex items-center justify-center shrink-0 shadow-lg">
                👑
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">Pro Exam Suite (IELTS, TOEFL, TOEIC)</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 uppercase tracking-wider">
                    PRO ROADMAP
                  </span>
                </div>
                <p className="text-white/80 text-xs md:text-sm mt-0.5 font-medium max-w-xl">
                  Advanced test-level grammar jumbles, written expression, and sentence restatement for IELTS Band 7.5+, TOEFL iBT, and TOEIC Part 5 & 6.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Modules List Grid (Responsive Mobile, Tablet, Desktop) */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-white/40 font-semibold animate-pulse">{t('ui.loading', 'Loading curriculum...')}</div>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-12 duo-card">
            <span className="text-4xl mb-2 block">📚</span>
            <p className="text-white font-black text-lg">No modules found</p>
            <p className="text-white/60 text-xs mt-1">Try switching CEFR levels or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredLessons.map((item, idx) => {
                const stars = starsMap[item.id] ?? 0;
                const catMeta = GRAMMAR_CATEGORIES_METADATA.find((c) => c.key === item.category) || { icon: '📘' };

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => navigate(`/play/${item.id}`)}
                    className="duo-card text-left hover:scale-[1.02] cursor-pointer flex flex-col justify-between gap-4 group relative"
                    id={`lesson-card-${item.id}`}
                  >
                    {/* Top Row: Icon + Level/Pro Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-duo-blue to-purple-600 flex flex-col items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-md">
                        <span className="text-xl leading-none">{catMeta.icon}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.isProOnly && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <span>👑</span>
                            <span>{item.examType || 'PRO'}</span>
                          </span>
                        )}
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/10 text-white/90 border border-white/15 uppercase tracking-wider">
                          {item.cefrLevel ? item.cefrLevel.replace('_PLUS', '+') : 'A1'}
                        </span>
                      </div>
                    </div>

                    {/* Module Info */}
                    <div>
                      <span className="text-white/40 text-[10px] font-black uppercase tracking-widest block mb-0.5">
                        {item.category?.replace('_', ' ')} {item.subCategory ? `• ${item.subCategory.replace(/_/g, ' ')}` : ''}
                      </span>
                      <h3 className="text-white font-black text-lg leading-snug group-hover:text-duo-blue-light transition-colors">
                        {getTitle(item)}
                      </h3>
                      <p className="text-white/70 text-xs mt-1 font-medium line-clamp-2">
                        {getDesc(item)}
                      </p>
                    </div>

                    {/* Footer Row: Stars & Action */}
                    <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                      <StarRating stars={stars} size="sm" animate={false} />
                      <span className="text-duo-blue-light font-black text-xs group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>Start</span>
                        <span>→</span>
                      </span>
                    </div>
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
