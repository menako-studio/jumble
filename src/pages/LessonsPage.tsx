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

// Offset patterns for the serpentine pathway curve (in percentage or px shift)
const NODE_OFFSETS = [0, -60, -90, -60, 0, 60, 90, 60];

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Sort and filter lessons according to sequence order
  const filteredLessons = React.useMemo(() => {
    const list = (lessons as GrammarModule[]).filter((l) => {
      const matchesCefr = selectedCefr === 'ALL' || l.cefrLevel === selectedCefr;
      const matchesCat = selectedCategory === 'ALL' || l.category === selectedCategory;
      const matchesSubCat = selectedSubCategory === 'ALL' || l.subCategory === selectedSubCategory;
      return matchesCefr && matchesCat && matchesSubCat;
    });

    return list.sort((a, b) => (a.sequenceOrder || 99) - (b.sequenceOrder || 99));
  }, [lessons, selectedCefr, selectedCategory, selectedSubCategory]);

  // Determine unlock state for each lesson sequentially
  const unlockedMap = React.useMemo(() => {
    const map: Record<string, boolean> = {};
    let canUnlockNext = true;

    filteredLessons.forEach((item, idx) => {
      if (idx === 0 || canUnlockNext || (starsMap[item.id] && starsMap[item.id] > 0)) {
        map[item.id] = true;
      } else {
        map[item.id] = false;
      }

      // Next node unlocks if current node has at least 1 star or is completed
      if (!starsMap[item.id] || starsMap[item.id] === 0) {
        canUnlockNext = false;
      }
    });

    return map;
  }, [filteredLessons, starsMap]);

  // Calculate overall completion statistics
  const totalCompleted = filteredLessons.filter((l) => (starsMap[l.id] || 0) > 0).length;
  const totalStars = Object.values(starsMap).reduce((sum, s) => sum + s, 0);

  const handleNodeClick = (item: GrammarModule, isUnlocked: boolean) => {
    if (isUnlocked) {
      navigate(`/play/${item.id}`);
    } else {
      showToast(
        lang === 'id'
          ? '🔒 Selesaikan lesson sebelumnya untuk membuka tantangan ini!'
          : '🔒 Complete the previous lesson to unlock this challenge!'
      );
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="bg-jumble min-h-dvh flex flex-col font-nunito text-white pb-16 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-amber-500 text-amber-950 font-black text-xs md:text-sm shadow-2xl border-2 border-amber-300 flex items-center gap-2"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Top Header */}
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
                {t('ui.lessonSelect', 'Grammar Pathway')}
              </h1>
              <p className="text-white/50 text-xs font-semibold hidden sm:block">
                Brilliant & Duolingo Style Unlocking Map
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Course Progress Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-duo-blue/30 via-purple-600/30 to-emerald-600/30 border border-white/15 shadow-glow flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-duo-yellow text-amber-950 font-black text-2xl flex items-center justify-center shadow-lg">
              🏆
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Course Pathway Progress</h2>
              <p className="text-xs text-white/70 font-semibold mt-0.5">
                {totalCompleted} of {filteredLessons.length} Lessons Unlocked • ⭐ {totalStars} Total Stars
              </p>
            </div>
          </div>

          <div className="w-full md:w-48 h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500 shadow-glow"
              style={{
                width: `${
                  filteredLessons.length > 0 ? (totalCompleted / filteredLessons.length) * 100 : 0
                }%`,
              }}
            />
          </div>
        </div>

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
            <span className="text-xs text-white/50 font-black uppercase tracking-wider">
              {lang === 'id' ? 'Sub-Kategori Terkoneksi' : 'Connected Sub-Categories'}:
            </span>
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

        {/* SERPENTINE PATHWAY MAP (Matching brilliant.png & Duolingo) */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-white/40 font-semibold animate-pulse">
              {t('ui.loading', 'Loading curriculum pathway...')}
            </div>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-12 duo-card">
            <span className="text-4xl mb-2 block">📚</span>
            <p className="text-white font-black text-lg">No modules found</p>
            <p className="text-white/60 text-xs mt-1">Try switching CEFR levels or category filters.</p>
          </div>
        ) : (
          <div className="relative py-8 flex flex-col items-center justify-center">
            {/* SVG Connecting Curved Path Line behind nodes */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              {filteredLessons.map((_, idx) => {
                if (idx === filteredLessons.length - 1) return null;
                const offsetCurrent = NODE_OFFSETS[idx % NODE_OFFSETS.length];
                const offsetNext = NODE_OFFSETS[(idx + 1) % NODE_OFFSETS.length];

                // Approximate center positions relative to container
                const y1 = idx * 160 + 50;
                const y2 = (idx + 1) * 160 + 50;
                const x1 = `calc(50% + ${offsetCurrent}px)`;
                const x2 = `calc(50% + ${offsetNext}px)`;

                return (
                  <line
                    key={idx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="6 8"
                  />
                );
              })}
            </svg>

            {/* Render Nodes along the Pathway */}
            {filteredLessons.map((item, idx) => {
              const stars = starsMap[item.id] ?? 0;
              const isUnlocked = unlockedMap[item.id] ?? false;
              const isCompleted = stars > 0;
              const offsetPx = NODE_OFFSETS[idx % NODE_OFFSETS.length];
              const isFirstIncompleteUnlocked = isUnlocked && !isCompleted;

              // Check if Unit Group Header should render
              const showUnitHeader =
                idx === 0 || item.unitGroup !== filteredLessons[idx - 1]?.unitGroup;

              const catMeta = GRAMMAR_CATEGORIES_METADATA.find((c) => c.key === item.category) || {
                icon: '📘',
              };

              return (
                <React.Fragment key={item.id}>
                  {/* Section / Unit Header Banner */}
                  {showUnitHeader && item.unitGroup && (
                    <div className="w-full max-w-md my-6 z-10">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-duo-blue/80 via-purple-600/80 to-emerald-600/80 border-2 border-white/20 shadow-xl flex items-center justify-between gap-3 text-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🏁</span>
                          <h3 className="text-white font-black text-sm md:text-base">
                            {lang === 'id' && item.unitGroup_id ? item.unitGroup_id : item.unitGroup}
                          </h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white uppercase tracking-wider">
                          UNIT
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Individual Node Container */}
                  <div
                    className="relative my-6 z-10 flex flex-col items-center"
                    style={{
                      transform: `translateX(${offsetPx}px)`,
                    }}
                  >
                    {/* Active Mascot Floating Badge */}
                    {isFirstIncompleteUnlocked && (
                      <motion.div
                        initial={{ y: -10 }}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                        className="absolute -top-12 z-20 px-3.5 py-1.5 rounded-2xl bg-emerald-400 text-emerald-950 font-black text-xs uppercase tracking-wider shadow-glow flex items-center gap-1 border border-white/40"
                      >
                        <span>START</span>
                        <span>🚀</span>
                      </motion.div>
                    )}

                    {/* Milestone Circle Button */}
                    <button
                      onClick={() => handleNodeClick(item, isUnlocked)}
                      className={`
                        w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-2xl border-4
                        ${
                          isFirstIncompleteUnlocked
                            ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-white text-white shadow-glow scale-110 animate-pulse-glow'
                            : isCompleted
                            ? 'bg-gradient-to-tr from-duo-blue to-purple-600 border-duo-blue-light text-white shadow-3d-blue'
                            : isUnlocked
                            ? 'bg-gradient-to-tr from-sky-600 to-blue-500 border-white/40 text-white'
                            : 'bg-surface-card border-white/10 text-white/40 opacity-70 grayscale'
                        }
                      `}
                      id={`path-node-${item.id}`}
                    >
                      <span className="text-2xl md:text-3xl leading-none">
                        {!isUnlocked ? '🔒' : isCompleted ? '✨' : catMeta.icon}
                      </span>
                      {item.isProOnly && (
                        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center justify-center shadow-md">
                          👑
                        </span>
                      )}
                    </button>

                    {/* Node Title & Star Rating Label */}
                    <div className="mt-2 text-center max-w-[180px]">
                      <h4
                        className={`text-xs md:text-sm font-black leading-tight ${
                          isUnlocked ? 'text-white' : 'text-white/40'
                        }`}
                      >
                        {getTitle(item)}
                      </h4>

                      {/* Stars Earned */}
                      <div className="mt-1 flex justify-center">
                        <StarRating stars={stars} size="sm" animate={false} />
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
