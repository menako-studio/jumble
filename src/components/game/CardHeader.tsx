import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from '../ui/ProgressBar';
import { getHeartsState, getRemainingMsToNextHeart, MAX_HEARTS } from '../../lib/heartsManager';
import type { CEFRLevel } from '../../types';

interface CardHeaderProps {
  title: string;
  cefrLevel?: CEFRLevel;
  currentIndex: number;
  totalQuestions: number;
  heartsCount: number;
  isProUser?: boolean;
  onExit?: () => void;
  onOpenRefillModal?: () => void;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  cefrLevel,
  currentIndex,
  totalQuestions,
  heartsCount,
  isProUser = false,
  onExit,
  onOpenRefillModal,
}) => {
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const state = getHeartsState();
      setRemainingMs(getRemainingMsToNextHeart(state));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [heartsCount]);

  const formatTimer = (ms: number) => {
    if (ms <= 0) return 'Full';
    const totalSecs = Math.floor(ms / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCefrBadgeStyle = (level?: CEFRLevel) => {
    switch (level) {
      case 'A1': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'A2': return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'B1': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'B1_PLUS': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'B2': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default: return 'bg-brand-500/20 text-brand-300 border-brand-500/40';
    }
  };

  const canRefill = !isProUser && heartsCount < MAX_HEARTS;

  return (
    <header className="sticky top-0 z-30 glass border-b border-surface-border">
      <div className="max-w-lg mx-auto px-4 py-3">
        {/* Row 1: Exit + Title & CEFR Badge + Hearts */}
        <div className="flex items-center gap-3 mb-2.5">
          <button
            onClick={onExit}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Exit lesson"
            id="header-exit-btn"
          >
            ✕
          </button>

          <div className="flex-1 min-w-0 flex items-center gap-2">
            {cefrLevel && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-black border uppercase tracking-wider ${getCefrBadgeStyle(cefrLevel)}`}>
                {cefrLevel.replace('_PLUS', '+')}
              </span>
            )}
            <h2 className="text-white font-black text-base truncate">{title}</h2>
          </div>

          {/* Hearts Counter (Clickable to Refill) */}
          <button
            onClick={onOpenRefillModal}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-panel/80 border transition-all cursor-pointer ${
              canRefill
                ? 'border-rose-500/60 hover:border-rose-400 hover:scale-105 shadow-glow'
                : 'border-surface-border'
            }`}
            title={canRefill ? 'Click to refill hearts anytime!' : 'Hearts status'}
            id="header-hearts-btn"
          >
            <motion.span
              animate={heartsCount > 0 ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-lg leading-none"
            >
              {isProUser ? '♾️' : '❤️'}
            </motion.span>
            <span className="text-white font-black text-sm">
              {isProUser ? 'PRO' : `${heartsCount}/${MAX_HEARTS}`}
            </span>

            {canRefill && (
              <div className="flex items-center gap-1 ml-1">
                <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-black animate-pulse">
                  + Refill
                </span>
                <span className="text-[10px] text-white/50 font-mono hidden sm:inline">
                  ⏱ {formatTimer(remainingMs)}
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Row 2: Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar current={currentIndex} total={totalQuestions} />
          </div>
          <span className="text-white/50 text-xs font-bold font-mono">
            {currentIndex + 1}/{totalQuestions}
          </span>
        </div>
      </div>
    </header>
  );
};
