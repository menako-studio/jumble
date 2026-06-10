/**
 * HomePage.tsx — Landing / dashboard screen
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-jumble min-h-dvh flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-accent-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-pink-500/5 blur-3xl" />
      </div>

      {/* Language switcher top-right */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      {/* Hero content */}
      <div className="text-center relative z-10 max-w-md">
        {/* Floating mascot logo */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' } as object}
          className="text-[96px] mb-4 leading-none select-none"
        >
          🧩
        </motion.div>

        {/* Logo wordmark */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black mb-2 leading-none"
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
          transition={{ delay: 0.2 }}
          className="text-white/60 text-lg font-semibold mb-10 leading-relaxed"
        >
          {t('ui.heroSubtitle')}
        </motion.p>

        {/* Floating word blocks — decorative */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {['She', 'likes', '🍎', 'apples', '!'].map((w, i) => (
            <motion.span
              key={w}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 300 }}
              className="word-block word-block--bank text-base cursor-default"
              style={{ boxShadow: '0 4px 0 rgba(0,0,0,0.4)' }}
            >
              {w}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
        >
          <Link
            to="/lessons"
            className="btn-primary btn text-2xl px-12 py-5 rounded-2xl inline-flex"
            id="start-btn"
            style={{
              background: 'linear-gradient(135deg, #6c4ff6, #8673fb)',
              boxShadow: '0 6px 0 #3f1ea8, 0 0 40px rgba(108,79,246,0.4)',
            }}
          >
            {t('ui.startLearning')} 🚀
          </Link>
        </motion.div>

        {/* Sub-link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/30 text-sm mt-6 font-medium"
        >
          Menako Studio • {new Date().getFullYear()}
        </motion.p>
      </div>
    </div>
  );
};
