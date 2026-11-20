import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';
import { UserProfileButton } from '../components/profile/UserProfileButton';
import { IconButton } from '../components/ui/IconButton';
import { useAuth } from '../context/AuthContext';
import { useUserProgress } from '../hooks/useSupabase';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { progress } = useUserProgress(user.id);
  const lang = (i18n.language as 'en' | 'id') || 'en';
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '#features', label: lang === 'id' ? 'Fitur' : 'Features' },
    { href: '#curriculum', label: lang === 'id' ? 'Kurikulum' : 'Curriculum' },
    { href: '#exam-prep', label: lang === 'id' ? 'Ujian' : 'Exam Prep' },
  ];

  const totalStars = progress.reduce((acc, p) => acc + p.stars_earned, 0);
  const completedLessons = progress.filter((p) => p.stars_earned > 0).length;

  return (
    <div className="bg-jumble min-h-dvh flex flex-col font-nunito text-ink-900 overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-white focus:text-ink-900 focus:font-black focus:shadow-card-lg"
      >
        {lang === 'id' ? 'Lewati ke konten utama' : 'Skip to main content'}
      </a>

      {/* Dynamic Background Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-duo-green/10 blur-3xl" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-duo-blue/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-duo-purple/8 blur-3xl" />
      </div>

      {/* Modern Sticky Navigation Bar */}
      <header className="glass sticky top-0 z-40 border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2.5 group min-h-11" aria-label="Jumble — Home">
            <span className="text-3xl group-hover:rotate-12 transition-transform select-none motion-reduce:transform-none" aria-hidden="true">🧩</span>
            <div>
              <span className="text-2xl font-black tracking-tight text-gradient-brand">Jumble</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Grammar AI
              </span>
            </div>
          </Link>

          {/* Quick Nav Anchor Links (Desktop) */}
          <nav aria-label={lang === 'id' ? 'Navigasi utama' : 'Main navigation'} className="hidden md:flex items-center gap-6 text-sm font-bold text-ink-500">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="inline-flex items-center min-h-11 hover:text-ink-900 transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* User Profile & Auto-Save Sync Widget */}
            <UserProfileButton totalStars={totalStars} completedLessonsCount={completedLessons} />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Open Lessons Button */}
            <div className="hidden sm:block">
              <Link to="/lessons" className="btn-success btn btn-sm normal-case" id="header-lessons-cta">
                <span>{lang === 'id' ? 'Buka Belajar' : 'Lessons'}</span>
                <span aria-hidden="true">🚀</span>
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <IconButton
              label={menuOpen ? (lang === 'id' ? 'Tutup menu' : 'Close menu') : (lang === 'id' ? 'Buka menu' : 'Open menu')}
              className="md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </IconButton>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-nav"
            aria-label={lang === 'id' ? 'Navigasi utama' : 'Main navigation'}
            className="md:hidden border-t border-surface-border bg-white px-4 py-2 flex flex-col"
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center min-h-12 font-bold text-ink-700 hover:text-ink-900 border-b last:border-b-0 border-slate-100"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1">

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-20 text-center flex flex-col items-center">
        {/* Floating Mascot with Playful Bounce */}
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -14, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[90px] md:text-[110px] mb-2 leading-none select-none inline-block filter drop-shadow-glow"
          aria-hidden="true"
        >
          🧩
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black mb-4 leading-[1.08] tracking-tight max-w-4xl text-ink-900"
        >
          {lang === 'id' ? (
            <>
              Kuasai Struktur{' '}
              <span className="text-gradient-brand">
                Tata Bahasa Inggris
              </span>{' '}
              Secara Alami
            </>
          ) : (
            <>
              Master English{' '}
              <span className="text-gradient-brand">
                Grammar Roles
              </span>{' '}
              with Playful Precision
            </>
          )}
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-ink-500 text-base sm:text-lg md:text-xl font-semibold mb-8 leading-relaxed max-w-2xl"
        >
          {lang === 'id'
            ? 'Belajar tata bahasa Inggris interaktif dengan panduan konsep terstruktur, tantangan latihan variatif, dan AI Grammar Tutor cerdas (Groq Llama 3.3). Dari tingkat Dasar hingga Mahir & Persiapan Ujian.'
            : 'Interactive step-by-step concept intros, adaptive practice challenges, and an on-demand AI Grammar Tutor powered by Groq Llama 3.3. From Beginner to Advanced & Exam Prep.'}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4 mb-10 max-w-md"
        >
          <Link
            to="/lessons"
            className="btn-success btn text-lg px-8 py-4 w-full sm:w-auto"
            id="hero-start-btn"
          >
            <span>{completedLessons > 0 ? (lang === 'id' ? 'Lanjutkan Belajar' : 'Continue Learning') : t('ui.startLearning', 'Start Learning')}</span>
            <span className="text-xl" aria-hidden="true">🚀</span>
          </Link>
        </motion.div>

        {/* Quick Highlights Strip */}
        <ul className="flex flex-wrap justify-center gap-3 text-xs font-bold text-ink-500 list-none p-0 m-0">
          <li className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm flex items-center gap-1.5">
            <span aria-hidden="true">✨</span>
            <span>18+ Categories & 50+ Lessons</span>
          </li>
          <li className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm flex items-center gap-1.5">
            <span aria-hidden="true">⚡</span>
            <span>Groq Llama 3.3 AI Tutor</span>
          </li>
          <li className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm flex items-center gap-1.5">
            <span aria-hidden="true">☁️</span>
            <span>Zero-Loss Auto-Save & Cloud Sync</span>
          </li>
        </ul>
      </section>

      {/* Feature Pillars Section */}
      <section id="features" aria-labelledby="features-title" className="relative z-10 max-w-6xl mx-auto px-4 py-16 w-full scroll-mt-20">
        <div className="text-center mb-12">
          <h2 id="features-title" className="text-3xl sm:text-4xl font-black text-ink-900 mb-2">
            {lang === 'id' ? 'Dirancang untuk Pemahaman Cepat' : 'Built for Frictionless Mastery'}
          </h2>
          <p className="text-ink-500 font-semibold text-sm max-w-lg mx-auto">
            {lang === 'id'
              ? 'Kombinasi metode visual, penjelasan interaktif, dan tutor AI cerdas.'
              : 'Combining visual concept intros, structured syllabus topics, and instant AI tutor assistance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-3xl bg-white border-2 border-surface-border flex flex-col gap-3 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-duo-green-dark border border-emerald-200 text-2xl flex items-center justify-center font-black" aria-hidden="true">
              🏁
            </div>
            <h3 className="text-xl font-black text-ink-900">
              {lang === 'id' ? 'Kurikulum Topik Terstruktur' : 'Structured Topic Units'}
            </h3>
            <p className="text-sm text-ink-500 font-semibold leading-relaxed">
              {lang === 'id'
                ? 'Pembagian materi per tema dan unit yang jelas. Setiap topik memandu kamu dari teori konsep hingga latihan soal interaktif.'
                : 'Clear units organized by theme with step-by-step progression from concept breakdown to interactive challenges.'}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-3xl bg-white border-2 border-surface-border flex flex-col gap-3 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-duo-blue-dark border border-sky-200 text-2xl flex items-center justify-center font-black" aria-hidden="true">
              💡
            </div>
            <h3 className="text-xl font-black text-ink-900">
              {lang === 'id' ? 'Intro Konsep Interaktif' : 'Concept Rule Breakdowns'}
            </h3>
            <p className="text-sm text-ink-500 font-semibold leading-relaxed">
              {lang === 'id'
                ? 'Pelajari rumus, pola aturan, dan contoh suara sebelum memulai kuis. Tidak perlu menghafal rumus abstrak tanpa konteks.'
                : 'Step-by-step formula breakdowns, native TTS audio examples, and warm-up checks before jumping into the exercises.'}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-3xl bg-white border-2 border-surface-border flex flex-col gap-3 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-exam/10 text-exam-dark border border-exam/20 text-2xl flex items-center justify-center font-black" aria-hidden="true">
              ⚡
            </div>
            <h3 className="text-xl font-black text-ink-900">
              Groq AI Grammar Tutor
            </h3>
            <p className="text-sm text-ink-500 font-semibold leading-relaxed">
              {lang === 'id'
                ? 'Tanyakan apa saja langsung ke AI Tutor berbasis Llama 3.3. Dapatkan penjelasan alternatif dan contoh tambahan dalam bahasa Indonesia.'
                : 'Stuck on a tricky rule? Ask Groq Llama 3.3 for simple analogies, extra examples, or Indonesian explanations on the fly.'}
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Showcase Section */}
      <section id="curriculum" aria-labelledby="curriculum-title" className="relative z-10 max-w-6xl mx-auto px-4 py-16 w-full border-t border-surface-border scroll-mt-20">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-duo-blue-dark px-3 py-1 rounded-full bg-sky-50 border border-sky-200">
            {lang === 'id' ? 'Tingkat Kemampuan' : 'Learning Levels'}
          </span>
          <h2 id="curriculum-title" className="text-3xl sm:text-4xl font-black text-ink-900 mt-3 mb-2">
            {lang === 'id' ? 'Tingkat Kemampuan & Topik Grammar' : 'Skill Levels & Grammar Topics'}
          </h2>
          <p className="text-ink-500 font-semibold text-sm max-w-md mx-auto">
            {lang === 'id'
              ? 'Dari dasar pemula hingga tingkat mahir dan latihan soal ujian.'
              : 'From beginner fundamentals to advanced nuance and exam preparation.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {[
            { level: 'A1', label: lang === 'id' ? 'Pemula' : 'Beginner', color: 'from-emerald-500 to-teal-500' },
            { level: 'A2', label: lang === 'id' ? 'Pra-Menengah' : 'Pre-Intermediate', color: 'from-teal-500 to-sky-500' },
            { level: 'B1', label: lang === 'id' ? 'Menengah' : 'Intermediate', color: 'from-sky-500 to-blue-500' },
            { level: 'B1+', label: lang === 'id' ? 'Menengah Atas' : 'Upper-Intermediate', color: 'from-blue-500 to-indigo-500' },
            { level: 'B2', label: lang === 'id' ? 'Mahir' : 'Advanced', color: 'from-indigo-500 to-purple-500' },
            { level: 'EXAM', label: 'IELTS • TOEFL • TOEIC', color: 'from-amber-500 to-orange-500', isExam: true },
          ].map((c) => (
            <Link
              key={c.level}
              to="/lessons"
              id={c.isExam ? 'exam-prep' : undefined}
              className="p-4 rounded-2xl bg-white border-2 border-surface-border hover:border-slate-300 hover:shadow-card transition-[border-color,box-shadow] flex flex-col items-center text-center group cursor-pointer scroll-mt-24"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${c.color} text-white font-black text-sm flex items-center justify-center shadow-md mb-2 group-hover:scale-110 transition-transform motion-reduce:transform-none`}
                aria-hidden="true"
              >
                {c.isExam ? '👑' : c.level}
              </div>
              <span className="font-black text-sm text-ink-900">{c.level}</span>
              <span className="text-xs text-ink-500 font-semibold mt-0.5">{c.label}</span>
            </Link>
          ))}
        </div>

        {/* CTA to jump to lessons */}
        <div className="text-center">
          <Link
            to="/lessons"
            className="btn-primary btn text-base px-8 py-3 rounded-2xl inline-flex items-center gap-2"
          >
            <span>{lang === 'id' ? 'Buka Silabus Belajar Lengkap' : 'Explore Full Syllabus'}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-border bg-surface-canvas py-8 text-center text-xs text-ink-500 font-semibold">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">🧩</span>
            <span className="font-bold text-ink-700">Jumble by Menako Studio</span>
            <span>•</span>
            <span>English Grammar Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/lessons" className="inline-flex items-center min-h-11 hover:text-ink-900 transition-colors">
              {lang === 'id' ? 'Peta Belajar' : 'Lessons Map'}
            </Link>
            <span className="text-slate-300" aria-hidden="true">|</span>
            <span>Auto-Save & Google Auth Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
