import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';
import { UserProfileButton } from '../components/profile/UserProfileButton';
import { useAuth } from '../context/AuthContext';
import { useUserProgress } from '../hooks/useSupabase';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { progress } = useUserProgress(user.id);
  const lang = (i18n.language as 'en' | 'id') || 'en';

  const totalStars = progress.reduce((acc, p) => acc + p.stars_earned, 0);
  const completedLessons = progress.filter((p) => p.stars_earned > 0).length;

  return (
    <div className="bg-jumble min-h-dvh flex flex-col font-nunito text-white overflow-x-hidden">
      {/* Dynamic Background Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-duo-green/15 blur-3xl" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-duo-blue/15 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-duo-purple/10 blur-3xl" />
      </div>

      {/* Modern Sticky Navigation Bar */}
      <header className="glass sticky top-0 z-40 border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-3xl group-hover:rotate-12 transition-transform select-none">🧩</span>
            <div>
              <span
                className="text-2xl font-black tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #58cc02, #1cb0f6, #ce82ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Jumble
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Grammar AI
              </span>
            </div>
          </Link>

          {/* Quick Nav Anchor Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-white/75">
            <a href="#features" className="hover:text-white transition-colors">
              {lang === 'id' ? 'Fitur' : 'Features'}
            </a>
            <a href="#curriculum" className="hover:text-white transition-colors">
              {lang === 'id' ? 'Kurikulum' : 'Curriculum'}
            </a>
            <a href="#exam-prep" className="hover:text-white transition-colors">
              {lang === 'id' ? 'Ujian' : 'Exam Prep'}
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* User Profile & Auto-Save Sync Widget */}
            <UserProfileButton totalStars={totalStars} completedLessonsCount={completedLessons} />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Open Lessons Button */}
            <Link
              to="/lessons"
              className="px-4 py-2 rounded-2xl bg-duo-green hover:bg-duo-green-light text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-3d-green transition-all cursor-pointer"
              id="header-lessons-cta"
            >
              <span>{lang === 'id' ? 'Buka Belajar' : 'Lessons'}</span>
              <span>🚀</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-20 text-center flex flex-col items-center">
        {/* Floating Mascot with Playful Bounce */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[90px] md:text-[110px] mb-2 leading-none select-none inline-block filter drop-shadow-glow"
        >
          🧩
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black mb-4 leading-[1.08] tracking-tight max-w-4xl"
        >
          {lang === 'id' ? (
            <>
              Kuasai Struktur{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #58cc02, #1cb0f6, #ce82ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Tata Bahasa Inggris
              </span>{' '}
              Secara Alami
            </>
          ) : (
            <>
              Master English{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #58cc02, #1cb0f6, #ce82ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
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
          className="text-white/80 text-base sm:text-lg md:text-xl font-semibold mb-8 leading-relaxed max-w-2xl"
        >
          {lang === 'id'
            ? 'Belajar tata bahasa Inggris interaktif dengan panduan konsep ala Brilliant, tantangan kartu gamifikasi ala Duolingo, dan AI Grammar Tutor cerdas (Groq Llama 3.3). CEFR A1–B2 & Persiapan IELTS/TOEFL.'
            : 'Interactive step-by-step concept intros, playful card challenges, and an on-demand AI Grammar Tutor powered by Groq Llama 3.3. Tailored for CEFR A1–B2 and Exam Prep.'}
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
            className="btn-success btn text-lg px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black shadow-3d-green hover:scale-105 transition-transform"
            id="hero-start-btn"
          >
            <span>{completedLessons > 0 ? (lang === 'id' ? 'Lanjutkan Belajar' : 'Continue Learning') : t('ui.startLearning', 'Start Learning')}</span>
            <span className="text-xl">🚀</span>
          </Link>
        </motion.div>

        {/* Quick Highlights Strip */}
        <div className="flex flex-wrap justify-center gap-3 text-xs font-bold text-white/70">
          <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
            <span>✨</span>
            <span>18+ Categories & 50+ Lessons</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
            <span>⚡</span>
            <span>Groq Llama 3.3 AI Tutor</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
            <span>☁️</span>
            <span>Zero-Loss Auto-Save & Cloud Sync</span>
          </span>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
            {lang === 'id' ? 'Dirancang untuk Pemahaman Cepat' : 'Built for Frictionless Mastery'}
          </h2>
          <p className="text-white/60 font-semibold text-sm max-w-lg mx-auto">
            {lang === 'id'
              ? 'Kombinasi metode visual, penjelasan interaktif, dan tutor AI cerdas.'
              : 'Combining visual concept intros, serpentine milestone unlocks, and instant AI tutor assistance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-3xl bg-surface-card/70 border-2 border-surface-border flex flex-col gap-3 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-duo-green/20 text-duo-green-light border border-duo-green/30 text-2xl flex items-center justify-center font-black">
              🏁
            </div>
            <h3 className="text-xl font-black text-white">
              {lang === 'id' ? 'Peta Belajar Serpentine' : 'Serpentine Pathway Map'}
            </h3>
            <p className="text-sm text-white/70 font-semibold leading-relaxed">
              {lang === 'id'
                ? 'Peta berliku dengan milestone berurutan. Setiap lesson baru terbuka saat kamu berhasil mengumpulkan bintang di tantangan sebelumnya.'
                : 'Zigzagging pathway with progressive milestone unlocking and star ratings, keeping you focused without overwhelming choices.'}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-3xl bg-surface-card/70 border-2 border-surface-border flex flex-col gap-3 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-duo-blue/20 text-duo-blue-light border border-duo-blue/30 text-2xl flex items-center justify-center font-black">
              💡
            </div>
            <h3 className="text-xl font-black text-white">
              {lang === 'id' ? 'Intro Konsep Interaktif' : 'Brilliant-Style Intros'}
            </h3>
            <p className="text-sm text-white/70 font-semibold leading-relaxed">
              {lang === 'id'
                ? 'Pelajari rumus, pola aturan, dan contoh suara sebelum memulai kuis. Tidak perlu menghafal rumus abstrak tanpa konteks.'
                : 'Step-by-step formula breakdowns, native TTS audio examples, and warm-up checks before jumping into the word tiles.'}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-3xl bg-surface-card/70 border-2 border-surface-border flex flex-col gap-3 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-2xl flex items-center justify-center font-black">
              ⚡
            </div>
            <h3 className="text-xl font-black text-white">
              {lang === 'id' ? 'Groq AI Grammar Tutor' : 'Groq AI Grammar Tutor'}
            </h3>
            <p className="text-sm text-white/70 font-semibold leading-relaxed">
              {lang === 'id'
                ? 'Tanyakan apa saja langsung ke AI Tutor berbasis Llama 3.3. Dapatkan penjelasan alternatif dan contoh tambahan dalam bahasa Indonesia.'
                : 'Stuck on a tricky rule? Ask Groq Llama 3.3 for simple analogies, extra examples, or Indonesian explanations on the fly.'}
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Showcase Section */}
      <section id="curriculum" className="relative z-10 max-w-6xl mx-auto px-4 py-16 w-full border-t border-white/10">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-duo-blue-light px-3 py-1 rounded-full bg-duo-blue/10 border border-duo-blue/20">
            Curriculum Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 mb-2">
            CEFR Levels & Exam Modules
          </h2>
          <p className="text-white/60 font-semibold text-sm max-w-md mx-auto">
            From A1 Elementary fundamentals to Advanced B2 nuance and official exam preparation.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {[
            { level: 'A1', label: 'Elementary', color: 'from-emerald-500 to-teal-500' },
            { level: 'A2', label: 'Pre-Intermediate', color: 'from-teal-500 to-sky-500' },
            { level: 'B1', label: 'Intermediate', color: 'from-sky-500 to-blue-500' },
            { level: 'B1+', label: 'Upper-Intermediate', color: 'from-blue-500 to-indigo-500' },
            { level: 'B2', label: 'Advanced', color: 'from-indigo-500 to-purple-500' },
            { level: 'EXAM', label: 'IELTS • TOEFL • TOEIC', color: 'from-amber-500 to-orange-500', isExam: true },
          ].map((c) => (
            <Link
              key={c.level}
              to="/lessons"
              className="p-4 rounded-2xl bg-surface-card border-2 border-surface-border hover:border-white/40 transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${c.color} text-white font-black text-sm flex items-center justify-center shadow-md mb-2 group-hover:scale-110 transition-transform`}
              >
                {c.isExam ? '👑' : c.level}
              </div>
              <span className="font-black text-sm text-white">{c.level}</span>
              <span className="text-[10px] text-white/50 font-semibold mt-0.5">{c.label}</span>
            </Link>
          ))}
        </div>

        {/* CTA to jump to lessons */}
        <div className="text-center">
          <Link
            to="/lessons"
            className="btn-primary btn text-base px-8 py-3 rounded-2xl inline-flex items-center gap-2"
          >
            <span>{lang === 'id' ? 'Lihat Peta Belajar Lengkap' : 'Explore Full Learning Map'}</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#10191e] py-8 text-center text-xs text-white/50 font-semibold">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>🧩</span>
            <span className="font-bold text-white/70">Jumble by Menako Studio</span>
            <span>•</span>
            <span>English Grammar Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/lessons" className="hover:text-white transition-colors">
              {lang === 'id' ? 'Peta Belajar' : 'Lessons Map'}
            </Link>
            <span className="text-white/20">|</span>
            <span>Auto-Save & Google Auth Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
