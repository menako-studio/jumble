import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLessons, useUserProgress } from '../hooks/useSupabase';
import { useAuth } from '../context/AuthContext';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';
import { UserProfileButton } from '../components/profile/UserProfileButton';
import { HorizontalScroller } from '../components/ui/HorizontalScroller';
import { IconButton } from '../components/ui/IconButton';
import { Button } from '../components/ui/Button';
import { Skeleton, SkeletonGroup } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/StateMessage';
import { FilterPill } from '../components/lessons/FilterPill';
import { UnitHeader } from '../components/lessons/UnitHeader';
import { LessonCard } from '../components/lessons/LessonCard';
import { Pagination } from '../components/lessons/Pagination';
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
  const [heartsState] = useState(getHeartsState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Page is remembered together with the filters it was chosen under, so changing any
  // filter naturally falls back to page 1 without a setState-in-effect.
  const filterKey = `${selectedCefr}|${selectedCategory}|${selectedSubCategory}`;
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const currentPage = pageState.key === filterKey ? pageState.page : 1;
  const setCurrentPage = (page: number) => setPageState({ key: filterKey, page });

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
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
  const overallPct = filteredLessons.length > 0 ? (totalCompleted / filteredLessons.length) * 100 : 0;

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
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 180, behavior: reduce ? 'auto' : 'smooth' });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNodeClick = (item: GrammarModule, isUnlocked: boolean) => {
    if (isUnlocked) {
      navigate(`/play/${item.id}`);
    } else {
      showToast(`🔒 ${t('lessons.lockedToast')}`);
    }
  };

  const resetFilters = () => {
    setSelectedCefr('ALL');
    setSelectedCategory('ALL');
    setSelectedSubCategory('ALL');
  };

  const heartsLabel = heartsState.isProUser
    ? t('lessons.heartsPro')
    : t('lessons.heartsCount', { count: heartsState.heartsCount, max: MAX_HEARTS });

  return (
    <div className="bg-jumble min-h-dvh flex flex-col font-nunito text-ink-900 pb-16 relative">
      <a
        href="#lessons-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-white focus:text-ink-900 focus:font-black focus:shadow-card-lg"
      >
        {t('lessons.skipToContent')}
      </a>

      {/* Toast notification — announced politely to screen readers */}
      <div role="status" aria-live="polite" className="contents">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md px-5 py-3 rounded-2xl bg-amber-500 text-amber-950 font-black text-sm shadow-2xl border-2 border-amber-300 text-center"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky top header */}
      <header className="glass border-b border-surface-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <IconButton
              label={t('lessons.backHome')}
              variant="ghost"
              className="bg-slate-100 border border-surface-border !rounded-2xl"
              onClick={() => navigate('/')}
              id="back-home-btn"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </IconButton>
            <div className="min-w-0">
              <h1 className="text-xl font-black text-ink-900 leading-tight sr-only sm:not-sr-only">
                {t('ui.lessonSelect', 'Grammar Pathway')}
              </h1>
              <p className="text-ink-500 text-xs font-semibold hidden sm:block">{t('lessons.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <UserProfileButton totalStars={totalStars} completedLessonsCount={totalCompleted} />

            <div
              role="img"
              aria-label={heartsLabel}
              className="flex items-center gap-1.5 px-3 min-h-11 rounded-2xl bg-surface-panel border border-surface-border shadow-sm"
            >
              <span className="text-lg" aria-hidden="true">
                {heartsState.isProUser ? '♾️' : '❤️'}
              </span>
              <span className="text-ink-900 font-black text-sm" aria-hidden="true">
                {heartsState.isProUser ? 'PRO' : `${heartsState.heartsCount}/${MAX_HEARTS}`}
              </span>
            </div>

            <LanguageSwitcher />
          </div>
        </div>

        {/* CEFR level filter */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-3" role="group" aria-label={t('lessons.levels')}>
          <HorizontalScroller>
            {CEFR_TABS.map((tab) => (
              <FilterPill
                key={tab.id}
                id={`cefr-tab-${tab.id}`}
                tone="blue"
                active={selectedCefr === tab.id}
                onClick={() => setSelectedCefr(tab.id)}
                className="flex-col gap-0 !py-1"
              >
                <span>{tab.label}</span>
                <span className="text-xs opacity-80 font-semibold">{tab.sub}</span>
              </FilterPill>
            ))}
          </HorizontalScroller>
        </div>
      </header>

      {/* Main content */}
      <main id="lessons-main" className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 py-6 flex flex-col gap-6">
        {/* Course progress banner */}
        <section
          aria-labelledby="course-progress-title"
          className="p-5 rounded-3xl bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 border-2 border-white shadow-card flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div
              className="w-14 h-14 rounded-2xl bg-duo-yellow text-amber-950 text-2xl flex items-center justify-center shadow-lg shrink-0"
              aria-hidden="true"
            >
              🏆
            </div>
            <div>
              <h2 id="course-progress-title" className="text-lg font-black text-ink-900">
                {t('lessons.progressTitle')}
              </h2>
              <p className="text-xs text-ink-500 font-semibold mt-0.5">
                {t('lessons.progressSummary', {
                  done: totalCompleted,
                  total: filteredLessons.length,
                  stars: totalStars,
                })}
              </p>
            </div>
          </div>

          <div
            role="progressbar"
            aria-labelledby="course-progress-title"
            aria-valuemin={0}
            aria-valuemax={filteredLessons.length}
            aria-valuenow={totalCompleted}
            className="w-full md:w-48 h-3 bg-white rounded-full overflow-hidden p-0.5 border border-slate-200"
          >
            <div
              className="h-full bg-duo-green rounded-full transition-[width] duration-500"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </section>

        {/* Category filter */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-ink-500 font-bold px-1">
            <span id="category-filter-label">{t('lessons.categoriesLabel')}</span>
            <span className="hidden sm:inline" aria-hidden="true">
              {t('lessons.scrollHint')}
            </span>
          </div>

          <div role="group" aria-labelledby="category-filter-label">
            <HorizontalScroller>
              <FilterPill
                tone="yellow"
                active={selectedCategory === 'ALL'}
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedSubCategory('ALL');
                }}
              >
                <span aria-hidden="true">🌟</span>
                <span>{t('lessons.allCategories')}</span>
              </FilterPill>
              {GRAMMAR_CATEGORIES_METADATA.map((catObj) => (
                <FilterPill
                  key={catObj.key}
                  tone="yellow"
                  active={selectedCategory === catObj.key}
                  onClick={() => {
                    setSelectedCategory(catObj.key);
                    setSelectedSubCategory('ALL');
                  }}
                >
                  <span aria-hidden="true">{catObj.icon}</span>
                  <span>{lang === 'id' ? catObj.name.id : catObj.name.en}</span>
                </FilterPill>
              ))}
            </HorizontalScroller>
          </div>
        </div>

        {/* Sub-category filter */}
        {activeCategoryMeta && activeCategoryMeta.subCategories.length > 0 && (
          <div className="p-4 rounded-3xl bg-surface-panel border border-surface-border flex flex-col gap-2.5">
            <span id="subcategory-filter-label" className="text-xs text-ink-500 font-black uppercase tracking-wider">
              {t('lessons.subCategoriesLabel')}
            </span>
            <div role="group" aria-labelledby="subcategory-filter-label">
              <HorizontalScroller>
                <FilterPill
                  tone="soft"
                  active={selectedSubCategory === 'ALL'}
                  onClick={() => setSelectedSubCategory('ALL')}
                >
                  {t('lessons.allSubCategories')}
                </FilterPill>
                {activeCategoryMeta.subCategories.map((sub) => (
                  <FilterPill
                    key={sub.key}
                    tone="soft"
                    active={selectedSubCategory === sub.key}
                    onClick={() => setSelectedSubCategory(sub.key)}
                  >
                    {lang === 'id' ? sub.name.id : sub.name.en}
                  </FilterPill>
                ))}
              </HorizontalScroller>
            </div>
          </div>
        )}

        {/* Jump to the page holding the active challenge */}
        {!loading && totalPages > 1 && currentPage !== activeLessonPage && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
            <div className="flex items-center gap-2 text-sm text-emerald-800 font-bold">
              <span aria-hidden="true">🚀</span>
              <span>{t('lessons.jumpBanner', { page: activeLessonPage })}</span>
            </div>
            <Button variant="success" size="sm" onClick={() => handlePageChange(activeLessonPage)}>
              {t('lessons.jumpAction')} <span aria-hidden="true">→</span>
            </Button>
          </div>
        )}

        {/* Units & topic cards */}
        {loading ? (
          <SkeletonGroup label={t('ui.loading', 'Loading curriculum pathway...')} className="flex flex-col gap-4 py-4">
            <Skeleton className="h-24 w-full rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-56 rounded-3xl" />
              ))}
            </div>
          </SkeletonGroup>
        ) : filteredLessons.length === 0 ? (
          <div className="duo-card">
            <EmptyState
              title={t('lessons.emptyTitle')}
              description={t('lessons.emptyDesc')}
              actionLabel={t('lessons.resetFilters')}
              onAction={resetFilters}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-8 w-full py-4">
            {groupedUnits.map((group) => {
              const unitDone = group.items.filter((i) => (starsMap[i.id] || 0) > 0).length;
              const unitTitle = lang === 'id' && group.unitTitleId ? group.unitTitleId : group.unitTitle;

              return (
                <section key={group.unitTitle} className="flex flex-col gap-4">
                  <UnitHeader title={unitTitle} done={unitDone} total={group.items.length} />

                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 m-0">
                    {group.items.map((item) => {
                      const catMeta = GRAMMAR_CATEGORIES_METADATA.find((c) => c.key === item.category);
                      return (
                        <LessonCard
                          key={item.id}
                          lesson={item}
                          title={getTitle(item)}
                          description={lang === 'id' && item.description_id ? item.description_id : item.description}
                          categoryIcon={catMeta?.icon}
                          categoryLabel={catMeta ? (lang === 'id' ? catMeta.name.id : catMeta.name.en) : undefined}
                          stars={starsMap[item.id] ?? 0}
                          isUnlocked={unlockedMap[item.id] ?? false}
                          onOpen={handleNodeClick}
                        />
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLessons.length}
            perPage={ITEMS_PER_PAGE}
            onChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
};
