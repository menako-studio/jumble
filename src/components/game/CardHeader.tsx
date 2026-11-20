import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../ui/IconButton';
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
  const { t } = useTranslation();
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
    if (ms <= 0) return t('game.timerFull');
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
          <IconButton
            label={t('game.exit')}
            onClick={onExit}
            className="bg-slate-100"
            id="header-exit-btn"
          >
            <X size={18} strokeWidth={2.5} aria-hidden="true" />
          </IconButton>

          <div className="flex-1 min-w-0 flex items-center gap-2">
            {cefrLevel && (
              <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-xs font-black border uppercase tracking-wider ${getCefrBadgeStyle(cefrLevel)}`}>
                {cefrLevel.replace('_PLUS', '+')}
              </span>
            )}
            <h1 className="text-ink-900 font-black text-sm sm:text-base leading-tight line-clamp-2">{title}</h1>
          </div>

          {/* Hearts Counter (Clickable to Refill) */}
          <button
            type="button"
            onClick={onOpenRefillModal}
            className={`flex items-center gap-1.5 px-3 min-h-11 rounded-full bg-surface-panel border transition-[border-color,transform] cursor-pointer ${
              canRefill
                ? 'border-duo-red/50 hover:border-duo-red shadow-glow'
                : 'border-surface-border'
            }`}
            title={canRefill ? t('game.refillTip') : undefined}
            aria-label={`${isProUser ? t('game.heartsPro') : t('game.heartsLabel', { count: heartsCount, max: MAX_HEARTS })}${canRefill ? `. ${t('game.refillTip')}` : ''}`}
            id="header-hearts-btn"
          >
            <motion.span
              animate={heartsCount > 0 ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-lg leading-none"
              aria-hidden="true"
            >
              {isProUser ? '♾️' : '❤️'}
            </motion.span>
            <span className="text-ink-900 font-black text-sm" aria-hidden="true">
              {isProUser ? 'PRO' : `${heartsCount}/${MAX_HEARTS}`}
            </span>

            {canRefill && (
              <div className="flex items-center gap-1 ml-1" aria-hidden="true">
                <span className="text-xs bg-red-700 text-white px-1.5 py-0.5 rounded-full font-black animate-pulse">
                  {t('game.refill')}
                </span>
                <span className="text-xs text-ink-500 font-mono hidden sm:inline">
                  ⏱ {formatTimer(remainingMs)}
                </span>
              </div>
            )}
          </button>

          {/* Mute / Audio Toggle */}
          <IconButton
            label={muted ? t('game.unmute') : t('game.mute')}
            aria-pressed={muted}
            onClick={toggleMute}
            className="bg-slate-100"
            id="header-mute-btn"
          >
            {muted ? <VolumeX size={18} strokeWidth={2.5} aria-hidden="true" /> : <Volume2 size={18} strokeWidth={2.5} aria-hidden="true" />}
          </IconButton>
        </div>

        {/* Row 2: Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar current={currentIndex} total={totalQuestions} />
          </div>
          <span className="text-ink-500 text-xs font-bold font-mono" aria-hidden="true">
            {currentIndex + 1}/{totalQuestions}
          </span>
        </div>
      </div>
    </header>
  );
};
