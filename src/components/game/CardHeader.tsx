import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { getHeartsState, getRemainingMsToNextHeart, MAX_HEARTS } from '../../lib/heartsManager';
import { useSound } from '../../hooks/useSound';
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
  const { muted, toggleMute } = useSound();

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
      case 'A1': return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'A2': return 'bg-sky-50 text-sky-700 border-sky-300';
      case 'B1': return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'B1_PLUS': return 'bg-orange-50 text-orange-700 border-orange-300';
      case 'B2': return 'bg-purple-50 text-purple-700 border-purple-300';
      default: return 'bg-exam/10 text-exam-dark border-exam/30';
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
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-ink-500 hover:text-ink-900 font-bold flex items-center justify-center transition-colors cursor-pointer"
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
            <h2 className="text-ink-900 font-black text-base truncate">{title}</h2>
          </div>

          {/* Hearts Counter (Clickable to Refill) */}
          <button
            onClick={onOpenRefillModal}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-panel border transition-all cursor-pointer ${
              canRefill
                ? 'border-duo-red/50 hover:border-duo-red hover:scale-105 shadow-glow'
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
            <span className="text-ink-900 font-black text-sm">
              {isProUser ? 'PRO' : `${heartsCount}/${MAX_HEARTS}`}
            </span>

            {canRefill && (
              <div className="flex items-center gap-1 ml-1">
                <span className="text-[10px] bg-duo-red text-white px-1.5 py-0.5 rounded-full font-black animate-pulse">
                  + Refill
                </span>
                <span className="text-[10px] text-ink-400 font-mono hidden sm:inline">
                  ⏱ {formatTimer(remainingMs)}
                </span>
              </div>
            )}
          </button>

          {/* Mute / Audio Toggle */}
          <button
            onClick={toggleMute}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-ink-500 hover:text-ink-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
            title={muted ? 'Unmute' : 'Mute'}
            id="header-mute-btn"
          >
            {muted ? <VolumeX size={16} strokeWidth={2.5} /> : <Volume2 size={16} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Row 2: Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar current={currentIndex} total={totalQuestions} />
          </div>
          <span className="text-ink-400 text-xs font-bold font-mono">
            {currentIndex + 1}/{totalQuestions}
          </span>
        </div>
      </div>
    </header>
  );
};
