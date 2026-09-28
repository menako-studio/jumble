import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLessons, useUserProgress } from '../hooks/useSupabase';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/ui/StarRating';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';
import { UserProfileButton } from '../components/profile/UserProfileButton';
import { HorizontalScroller } from '../components/ui/HorizontalScroller';
import { Button } from '../components/ui/Button';
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

const ITEMS_PER_PAGE = 8;

export const LessonsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lessons, loading } = useLessons();
  const { progress } = useUserProgress(user.id);
  const lang = (i18n.language as 'en' | 'id') || 'en';

  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<GrammarCategory | 'ALL'>('ALL');
  const [selectedSubCategory, setSelectedSubCategory] = useState<GrammarSubCategory | 'ALL'>('ALL');
  const [heartsState, setHeartsState] = useState(getHeartsState());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setHeartsState(getHeartsState());
  }, []);

  // Reset pagination when filter criteria change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCefr, selectedCategory, selectedSubCategory]);

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

  // Determine unlock state for each lesson sequentially across full filtered set
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

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredLessons.length / ITEMS_PER_PAGE));
  const paginatedLessons = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLessons.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLessons, currentPage]);

  // Group paginated lessons by unit/theme for clean structured syllabus display
  const groupedUnits = React.useMemo(() => {
    const map = new Map<string, { unitTitle: string; unitTitleId?: string; items: GrammarModule[] }>();

    paginatedLessons.forEach((item) => {
      const key = item.unitGroup || 'General Grammar Topics';
      if (!map.has(key)) {
        map.set(key, {
          unitTitle: item.unitGroup || 'General Grammar Topics',
          unitTitleId: item.unitGroup_id,
          items: [],
        });
      }
      map.get(key)!.items.push(item);
    });

    return Array.from(map.values());
  }, [paginatedLessons]);

  // Determine which page contains the active current incomplete unlocked lesson
  const activeLessonIndex = filteredLessons.findIndex((l) => unlockedMap[l.id] && !(starsMap[l.id] > 0));
  const activeLessonPage = activeLessonIndex >= 0 ? Math.floor(activeLessonIndex / ITEMS_PER_PAGE) + 1 : 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

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
    <div className="bg-jumble min-h-dvh flex flex-col font-nunito text-ink-900 pb-16 relative">
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
      <header className="glass border-b border-surface-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-ink-700 font-bold flex items-center justify-center transition-all cursor-pointer border border-surface-border"
              id="back-home-btn"
              title="Back to Landing Page"
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-black text-ink-900 leading-tight">
                {t('ui.lessonSelect', 'Grammar Pathway')}
              </h1>
              <p className="text-ink-500 text-xs font-semibold hidden sm:block">
                Structured Units & Interactive Practice
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile & Auto-Save Sync Widget */}
            <UserProfileButton totalStars={totalStars} completedLessonsCount={totalCompleted} />

            {/* Hearts Counter */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-surface-panel border border-surface-border shadow-sm">
              <span className="text-lg">{heartsState.isProUser ? '♾️' : '❤️'}</span>
              <span className="text-ink-900 font-black text-sm">
                {heartsState.isProUser ? 'PRO' : `${heartsState.heartsCount}/${MAX_HEARTS}`}
              </span>
            </div>

            <LanguageSwitcher />
          </div>
        </div>

        {/* CEFR Level Tabs with Horizontal Scroller */}
        <div className="max-w-7xl mx-auto px-4 pb-3">
          <HorizontalScroller>
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
                        ? 'bg-duo-blue text-white border-duo-blue-shadow shadow-3d-blue scale-105'
                        : 'bg-slate-50 text-ink-500 hover:bg-slate-100 border-transparent'
                    }
                  `}
                  id={`cefr-tab-${tab.id}`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[9px] opacity-75 font-semibold">{tab.sub}</span>
                </button>
              );
            })}
          </HorizontalScroller>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Course Progress Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 border-2 border-white shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-duo-yellow text-amber-950 font-black text-2xl flex items-center justify-center shadow-lg">
              🏆
            </div>
            <div>
              <h2 className="text-lg font-black text-ink-900">Course Pathway Progress</h2>
              <p className="text-xs text-ink-500 font-semibold mt-0.5">
                {totalCompleted} of {filteredLessons.length} Lessons Unlocked • ⭐ {totalStars} Total Stars
              </p>
            </div>
          </div>

          <div className="w-full md:w-48 h-3 bg-white rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-duo-green rounded-full transition-all duration-500"
              style={{
                width: `${
                  filteredLessons.length > 0 ? (totalCompleted / filteredLessons.length) * 100 : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Main Category Pills with Enhanced Horizontal Scroller */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-ink-500 font-bold px-1">
            <span>{lang === 'id' ? 'Kategori Tata Bahasa' : 'Grammar Categories'}</span>
            <span className="text-[11px] text-ink-400 hidden sm:inline">
              {lang === 'id' ? 'Geser atau klik tombol panah ‹ ›' : 'Scroll or use arrows ‹ ›'}
            </span>
          </div>

          <HorizontalScroller>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedSubCategory('ALL');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer border-2 ${
                selectedCategory === 'ALL'
                  ? 'bg-duo-yellow text-amber-950 border-duo-yellow-shadow shadow-3d-yellow font-black'
                  : 'bg-slate-50 text-ink-700 hover:bg-slate-100 border-transparent'
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
                      ? 'bg-duo-yellow text-amber-950 border-duo-yellow-shadow shadow-3d-yellow font-black'
                      : 'bg-slate-50 text-ink-700 hover:bg-slate-100 border-transparent'
                  }`}
                >
                  <span>{catObj.icon}</span>
                  <span>{labelName}</span>
                </button>
              );
            })}
          </HorizontalScroller>
        </div>

        {/* Connected Sub-Category Pills */}
        {activeCategoryMeta && activeCategoryMeta.subCategories.length > 0 && (
          <div className="p-4 rounded-3xl bg-surface-panel border border-surface-border flex flex-col gap-2.5">
            <span className="text-xs text-ink-500 font-black uppercase tracking-wider">
              {lang === 'id' ? 'Sub-Kategori Terkoneksi' : 'Connected Sub-Categories'}:
            </span>
            <HorizontalScroller>
              <button
                onClick={() => setSelectedSubCategory('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedSubCategory === 'ALL'
                    ? 'bg-duo-blue text-white font-black'
                    : 'bg-white text-ink-500 hover:bg-slate-100 border border-slate-200'
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      isSubActive
                        ? 'bg-duo-blue text-white font-black shadow-sm'
                        : 'bg-white text-ink-500 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {subName}
                  </button>
                );
              })}
            </HorizontalScroller>
          </div>
        )}

        {/* Jump to Active Challenge Banner when on another page */}
        {totalPages > 1 && currentPage !== activeLessonPage && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
              <span>🚀</span>
              <span>
                {lang === 'id'
                  ? `Lesson aktif kamu ada di Halaman ${activeLessonPage}`
                  : `Your current unlocked challenge is on Page ${activeLessonPage}`}
              </span>
            </div>
            <button
              onClick={() => handlePageChange(activeLessonPage)}
              className="px-3 py-1.5 rounded-xl bg-duo-green hover:bg-duo-green-dark text-white font-black text-xs transition-all cursor-pointer shadow-md"
            >
              {lang === 'id' ? 'Lompat ke Sana →' : 'Jump There →'}
            </button>
          </div>
        )}

        {/* STRUCTURED TOPIC UNITS & SYLLABUS CARDS */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-ink-400 font-semibold animate-pulse">
              {t('ui.loading', 'Loading curriculum pathway...')}
            </div>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-12 duo-card">
            <span className="text-4xl mb-2 block">📚</span>
            <p className="text-ink-900 font-black text-lg">No modules found</p>
            <p className="text-ink-500 text-xs mt-1">Try switching level or category filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 w-full py-4">
            {groupedUnits.map((group) => {
              const unitTotal = group.items.length;
              const unitDone = group.items.filter((i) => (starsMap[i.id] || 0) > 0).length;
              const unitPct = Math.round((unitDone / unitTotal) * 100);

              return (
                <section key={group.unitTitle} className="flex flex-col gap-4">
                  {/* Theme / Unit Header */}
                  <div className="p-5 rounded-3xl bg-white border-2 border-surface-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-duo-blue-dark flex items-center justify-center text-2xl font-black shrink-0 shadow-sm">
                        📘
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-duo-blue-dark bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                          {lang === 'id' ? 'TEMA & KELAS' : 'CURRICULUM THEME'}
                        </span>
                        <h3 className="text-lg font-black text-ink-900 mt-1">
                          {lang === 'id' && group.unitTitleId ? group.unitTitleId : group.unitTitle}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="text-xs font-black text-ink-500">
                        {unitDone}/{unitTotal} {lang === 'id' ? 'Selesai' : 'Completed'} ({unitPct}%)
                      </span>
                      <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div
                          className="h-full bg-duo-green rounded-full transition-all duration-300"
                          style={{ width: `${unitPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Structured Topic Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.items.map((item) => {
                      const stars = starsMap[item.id] ?? 0;
                      const isUnlocked = unlockedMap[item.id] ?? false;
                      const isCompleted = stars > 0;
                      const isFirstIncompleteUnlocked = isUnlocked && !isCompleted;
                      const catMeta = GRAMMAR_CATEGORIES_METADATA.find((c) => c.key === item.category);

                      return (
                        <div
                          key={item.id}
                          className={`
                            p-5 rounded-3xl bg-white border-2 flex flex-col justify-between gap-4 transition-all duration-200 relative
                            ${
                              isFirstIncompleteUnlocked
                                ? 'border-duo-green shadow-card-lg ring-2 ring-emerald-400/20'
                                : isCompleted
                                ? 'border-surface-border hover:border-slate-300 shadow-card'
                                : isUnlocked
                                ? 'border-surface-border hover:border-sky-300 shadow-card'
                                : 'border-slate-100 bg-slate-50/60 opacity-80'
                            }
                          `}
                          id={`lesson-card-${item.id}`}
                        >
                          {/* Active Indicator Pin */}
                          {isFirstIncompleteUnlocked && (
                            <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-duo-green text-white font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1 border-2 border-white">
                              <span>Active</span>
                              <span>🚀</span>
                            </span>
                          )}

                          {/* Card Top: Badges & Stars */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] font-black px-2.5 py-1 rounded-xl bg-slate-100 text-ink-700 border border-slate-200">
                                {item.sequenceOrder ? `#${item.sequenceOrder}` : 'Topic'}
                              </span>
                              <span className="text-[11px] font-black px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {item.cefrLevel ? item.cefrLevel.replace('_PLUS', '+') : 'A1'}
                              </span>
                              {catMeta && (
                                <span className="text-[11px] font-bold px-2 py-1 rounded-xl bg-slate-50 text-ink-500 border border-slate-200 hidden sm:inline-block">
                                  {catMeta.icon} {lang === 'id' ? catMeta.name.id : catMeta.name.en}
                                </span>
                              )}
                            </div>

                            <div>
                              <StarRating stars={stars} size="sm" animate={false} />
                            </div>
                          </div>

                          {/* Card Body: Title, Description, Learning Flow */}
                          <div className="flex flex-col gap-2">
                            <h4 className="font-black text-base md:text-lg text-ink-900 leading-snug">
                              {getTitle(item)}
                            </h4>
                            <p className="text-xs text-ink-500 font-semibold line-clamp-2 leading-relaxed">
                              {lang === 'id' && item.description_id ? item.description_id : item.description}
                            </p>

                            {/* Clear Structured Learning Flow: Explain Topic -> Test Topic */}
                            <div className="mt-1 p-2.5 rounded-2xl bg-surface-panel border border-surface-border flex items-center justify-between text-[11px] font-extrabold text-ink-600">
                              <div className="flex items-center gap-1">
                                <span>💡</span>
                                <span>{lang === 'id' ? '1. Penjelasan Konsep' : '1. Concept & Rules'}</span>
                              </div>
                              <span className="text-slate-300">➔</span>
                              <div className="flex items-center gap-1">
                                <span>🎯</span>
                                <span>{lang === 'id' ? '2. Latihan & Kuis' : '2. Practice & Quiz'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Card Action Button */}
                          <div>
                            {isCompleted ? (
                              <button
                                onClick={() => handleNodeClick(item, true)}
                                className="w-full py-2.5 px-4 rounded-xl2 bg-slate-100 hover:bg-slate-200 text-ink-700 font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
                              >
                                <span>✓ {lang === 'id' ? 'Pelajari Ulang' : 'Review Topic'}</span>
                                <span>🔁</span>
                              </button>
                            ) : isFirstIncompleteUnlocked ? (
                              <button
                                onClick={() => handleNodeClick(item, true)}
                                className="w-full py-2.5 px-4 rounded-xl2 bg-duo-green hover:bg-duo-green-dark text-white font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-3d-green hover:scale-[1.01] cursor-pointer"
                              >
                                <span>{lang === 'id' ? 'Mulai Pelajari Topik' : 'Start Topic'}</span>
                                <span>🚀</span>
                              </button>
                            ) : isUnlocked ? (
                              <button
                                onClick={() => handleNodeClick(item, true)}
                                className="w-full py-2.5 px-4 rounded-xl2 bg-duo-blue hover:bg-duo-blue-dark text-white font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-3d-blue"
                              >
                                <span>{lang === 'id' ? 'Buka Topik' : 'Open Topic'}</span>
                                <span>→</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleNodeClick(item, false)}
                                className="w-full py-2.5 px-4 rounded-xl2 bg-slate-100 text-ink-400 font-bold text-xs md:text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-75 border border-slate-200"
                              >
                                <span>🔒 {lang === 'id' ? 'Terkunci' : 'Locked'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Tactile Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-3 p-4 rounded-3xl bg-surface-panel border border-surface-border">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {/* Prev Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`text-xs ${currentPage === 1 ? 'opacity-40 pointer-events-none' : ''}`}
                id="pagination-prev-btn"
              >
                ← {lang === 'id' ? 'Sebelumnya' : 'Prev'}
              </Button>

              {/* Page Number Pills */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === currentPage;
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-duo-blue text-white border-duo-blue-shadow shadow-3d-blue scale-105'
                        : 'bg-white hover:bg-slate-50 text-ink-500 border-slate-200'
                    }`}
                    id={`page-btn-${p}`}
                  >
                    {p}
                  </button>
                );
              })}

              {/* Next Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`text-xs ${currentPage === totalPages ? 'opacity-40 pointer-events-none' : ''}`}
                id="pagination-next-btn"
              >
                {lang === 'id' ? 'Berikutnya' : 'Next'} →
              </Button>
            </div>

            {/* Pagination Range Subtitle */}
            <span className="text-[11px] text-ink-400 font-bold">
              {lang === 'id'
                ? `Menampilkan ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredLessons.length
                  )} dari ${filteredLessons.length} lessons (Halaman ${currentPage} dari ${totalPages})`
                : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredLessons.length
                  )} of ${filteredLessons.length} lessons (Page ${currentPage} of ${totalPages})`}
            </span>
          </div>
        )}
      </main>
    </div>
  );
};
