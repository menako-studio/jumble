import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getHeartsState, getRemainingMsToNextHeart } from '../../lib/heartsManager';

interface OutOfHeartsModalProps {
  onStartReview: () => void;
  onRefillHearts: () => void;
  onUpgradePro: () => void;
  onClose: () => void;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  onStartReview,
  onRefillHearts,
  onUpgradePro,
  onClose,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="w-full max-w-md bg-jumble-card rounded-xl3 p-6 border-2 border-rose-500/40 shadow-glow relative text-center flex flex-col gap-5"
        id="out-of-hearts-modal"
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors"
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
            💔
          </motion.div>
          <h3 className="text-white font-black text-2xl">You're Out of Hearts!</h3>
          <p className="text-white/70 text-sm mt-1 font-bold">
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
            className="p-4 rounded-xl2 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border-2 border-emerald-500/50 hover:border-emerald-400 flex items-center gap-4 transition-all group"
            id="refill-review-btn"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
              📝
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-base">Practice to Earn +1 Heart</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-emerald-950 uppercase">
                  FREE
                </span>
              </div>
              <p className="text-emerald-200/80 text-xs font-medium mt-0.5">
                Answer 5 review questions (no heart loss on mistakes!)
              </p>
            </div>
          </motion.button>

          {/* Option 2: Live Countdown Timer */}
          <div className="p-4 rounded-xl2 glass border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center text-2xl font-black">
              ⏳
            </div>
            <div className="flex-1">
              <span className="text-white/60 text-xs font-bold uppercase tracking-wider block">
                Next Heart Refill In
              </span>
              <span className="text-sky-300 font-mono font-black text-xl tracking-wider">
                {formatCountdown(remainingMs)}
              </span>
            </div>
          </div>

          {/* Option 3: Upgrade to Pro */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgradePro}
            className="p-4 rounded-xl2 bg-gradient-to-r from-brand-600/40 via-purple-600/40 to-pink-600/40 border-2 border-brand-400 hover:border-brand-300 flex items-center gap-4 transition-all group shadow-glow"
            id="refill-pro-btn"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-500/30 text-amber-300 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
              👑
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-base">Upgrade to Pro</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 uppercase">
                  UNLIMITED
                </span>
              </div>
              <p className="text-purple-200/80 text-xs font-medium mt-0.5">
                Get infinite hearts & practice non-stop
              </p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
