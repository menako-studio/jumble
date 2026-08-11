import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';
import { getHeartsState, MAX_HEARTS } from '../lib/heartsManager';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [heartsState, setHeartsState] = useState(getHeartsState());

  useEffect(() => {
    setHeartsState(getHeartsState());
  }, []);

  return (
    <div className="bg-jumble min-h-dvh flex flex-col items-center justify-center px-4 relative overflow-hidden font-nunito text-white">
      {/* Background decorative glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-duo-green/15 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-duo-blue/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-duo-purple/10 blur-3xl" />
      </div>

      {/* Top Bar: Hearts & Language Switcher */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-card border-2 border-surface-border shadow-sm">
          <span className="text-xl">{heartsState.isProUser ? '♾️' : '❤️'}</span>
          <span className="text-white font-black text-sm">
            {heartsState.isProUser ? 'UNLIMITED PRO' : `${heartsState.heartsCount} / ${MAX_HEARTS} Hearts`}
          </span>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Hero content */}
      <div className="text-center relative z-10 max-w-xl w-full my-12 flex flex-col items-center">
        {/* Floating Mascot */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[96px] mb-3 leading-none select-none inline-block filter drop-shadow-glow"
        >
          🧩
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl sm:text-7xl font-black mb-3 leading-none tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #58cc02, #1cb0f6, #ce82ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Jumble
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/80 text-base sm:text-xl font-bold mb-8 leading-relaxed max-w-lg"
        >
          Master English Grammar Roles with Brilliant-style Interactive Intros & Duolingo-inspired Practice Cards (CEFR A1–B2 & Exam Prep)
        </motion.p>

        {/* CEFR Level & Exam Prep Badges Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {['A1', 'A2', 'B1', 'B1+', 'B2'].map((lvl) => (
            <span
              key={lvl}
              className="px-3 py-1.5 rounded-xl bg-white/10 border-2 border-white/15 text-white text-xs font-black"
            >
              {lvl}
            </span>
          ))}
          <span className="px-3 py-1.5 rounded-xl bg-amber-400 text-amber-950 border-2 border-amber-300 text-xs font-black flex items-center gap-1">
            <span>👑</span>
            <span>IELTS • TOEFL • TOEIC</span>
          </span>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4"
        >
          <Link
            to="/lessons"
            className="btn-success btn text-xl px-10 py-4 rounded-2xl flex items-center justify-center gap-3 font-black shadow-3d-green hover:scale-105 transition-transform"
            id="start-btn"
          >
            <span>{t('ui.startLearning', 'Start Practice')}</span>
            <span className="text-2xl">🚀</span>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/40 text-xs mt-10 font-bold tracking-wide"
        >
          Menako Studio • Gamified English Grammar & Exam Engine
        </motion.p>
      </div>
    </div>
  );
};
