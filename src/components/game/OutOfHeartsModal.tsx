import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getHeartsState, getRemainingMsToNextHeart } from '../../lib/heartsManager';

interface OutOfHeartsModalProps {
  onStartReview: () => void;
  onRefillHearts: () => void;
  onUpgradePro: () => void;
  onClose: () => void;
  heartsCount?: number;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  onStartReview,
  onRefillHearts,
  onUpgradePro,
  onClose,
  heartsCount = 0,
}) => {
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const state = getHeartsState();
      const ms = getRemainingMsToNextHeart(state);
      setRemainingMs(ms);
      if (ms === 0 && state.heartsCount > 0) {
        onRefillHearts();
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [onRefillHearts]);

  const formatCountdown = (ms: number) => {
    if (ms <= 0) return '00:00:00';
    const totalSecs = Math.floor(ms / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isZeroHearts = heartsCount <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/45 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="w-full max-w-md bg-white rounded-xl3 p-6 border-2 border-duo-red/30 shadow-card-lg relative text-center flex flex-col gap-5"
        id="out-of-hearts-modal"
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-ink-500 hover:text-ink-900 flex items-center justify-center transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Header Icon & Title */}
        <div>
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="text-6xl mb-2"
          >
            {isZeroHearts ? '💔' : '❤️'}
          </motion.div>
          <h3 className="text-ink-900 font-black text-2xl">
            {isZeroHearts ? "You're Out of Hearts!" : `Refill Your Hearts (${heartsCount}/5)`}
          </h3>
          <p className="text-ink-500 text-sm mt-1 font-bold">
            Choose how you want to restore your hearts to keep practicing:
          </p>
        </div>

        {/* 3 Refill Choices */}
        <div className="flex flex-col gap-3 text-left">
          {/* Option 1: Review Practice */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartReview}
            className="p-4 rounded-xl2 bg-emerald-50 border-2 border-b-4 border-emerald-200 hover:border-emerald-300 flex items-center gap-4 transition-all group"
            id="refill-review-btn"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
              📝
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-ink-900 font-black text-base">Practice to Earn +1 Heart</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-duo-green text-white uppercase">
                  FREE
                </span>
              </div>
              <p className="text-emerald-800/70 text-xs font-medium mt-0.5">
                Answer 5 review questions (no heart loss on mistakes!)
              </p>
            </div>
          </motion.button>

          {/* Option 2: Live Countdown Timer */}
          <div className="p-4 rounded-xl2 bg-sky-50 border-2 border-sky-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl font-black">
              ⏳
            </div>
            <div className="flex-1">
              <span className="text-ink-500 text-xs font-bold uppercase tracking-wider block">
                Next Heart Refill In
              </span>
              <span className="text-sky-700 font-mono font-black text-xl tracking-wider">
                {formatCountdown(remainingMs)}
              </span>
            </div>
          </div>

          {/* Option 3: Upgrade to Pro */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgradePro}
            className="p-4 rounded-xl2 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-2 border-b-4 border-exam/40 hover:border-exam flex items-center gap-4 transition-all group"
            id="refill-pro-btn"
          >
            <div className="w-12 h-12 rounded-xl bg-exam/10 text-amber-500 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
              👑
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-ink-900 font-black text-base">Upgrade to Pro</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-duo-yellow text-amber-950 uppercase">
                  UNLIMITED
                </span>
              </div>
              <p className="text-exam-dark/70 text-xs font-medium mt-0.5">
                Get infinite hearts & practice non-stop
              </p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
