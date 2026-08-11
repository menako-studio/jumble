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
    <div className="bg-jumble min-h-dvh flex flex-col items-center justify-center px-4 relative overflow-hidden font-nunito">
      {/* Background decorative glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-accent-400/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-pink-500/5 blur-3xl" />
      </div>

      {/* Top Bar: Hearts & Language Switcher */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 max-w-lg mx-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-surface-border shadow-md">
          <span className="text-lg">{heartsState.isProUser ? '♾️' : '❤️'}</span>
          <span className="text-white font-black text-sm">
            {heartsState.isProUser ? 'UNLIMITED PRO' : `${heartsState.heartsCount} / ${MAX_HEARTS} Hearts`}
          </span>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Hero content */}
      <div className="text-center relative z-10 max-w-md w-full my-12">
        {/* Floating Mascot */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[90px] mb-2 leading-none select-none inline-block filter drop-shadow-glow"
        >
          🧩
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-black mb-2 leading-none tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #a99ffe, #f59e0b, #ec4899)',
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
          className="text-white/70 text-base sm:text-lg font-bold mb-8 leading-relaxed"
        >
          Master English Grammar with Brilliant.org-style Interactive Cards & CEFR Progression (A1–B2)
        </motion.p>

        {/* CEFR Level Badges Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-2 mb-8"
        >
          {['A1', 'A2', 'B1', 'B1+', 'B2'].map((lvl) => (
            <span
              key={lvl}
              className="px-2.5 py-1 rounded-lg glass border border-white/10 text-white/90 text-xs font-black"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            >
              {lvl}
            </span>
          ))}
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
          className="flex flex-col gap-3"
        >
          <Link
            to="/lessons"
            className="btn-primary btn text-xl px-10 py-4.5 rounded-2xl flex items-center justify-center gap-3 font-black shadow-glow hover:scale-105 transition-transform"
            id="start-btn"
            style={{
              background: 'linear-gradient(135deg, #6c4ff6, #8673fb)',
              boxShadow: '0 6px 0 #3f1ea8, 0 0 40px rgba(108,79,246,0.4)',
            }}
          >
            <span>{t('ui.startLearning', 'Start Practice')}</span>
            <span className="text-2xl">🚀</span>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/30 text-xs mt-8 font-medium tracking-wide"
        >
          Menako Studio • Gamified English Grammar Engine
        </motion.p>
      </div>
    </div>
  );
};
