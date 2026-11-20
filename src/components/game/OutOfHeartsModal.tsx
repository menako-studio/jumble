import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getHeartsState, getRemainingMsToNextHeart } from '../../lib/heartsManager';
import { Modal } from '../ui/Modal';

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
  const { t } = useTranslation();
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
  const title = isZeroHearts ? t('modals.outTitle') : t('modals.refillTitle', { count: heartsCount });

  return (
    <Modal
      isOpen
      onClose={onClose}
      label={title}
      className="max-w-md rounded-xl3 p-6 border-duo-red/30 text-center"
    >
      <div id="out-of-hearts-modal" className="flex flex-col gap-5">
        <div>
          <motion.div
            aria-hidden="true"
            animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="text-6xl mb-2"
          >
            {isZeroHearts ? '💔' : '❤️'}
          </motion.div>
          <h2 className="text-ink-900 font-black text-2xl">{title}</h2>
          <p className="text-ink-500 text-sm mt-1 font-bold">{t('modals.chooseHow')}</p>
        </div>

        <div className="flex flex-col gap-3 text-left">
          {/* Option 1: Review Practice */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartReview}
            className="p-4 rounded-xl2 bg-emerald-50 border-2 border-b-4 border-emerald-200 hover:border-emerald-300 flex items-center gap-4 text-left transition-colors group cursor-pointer"
            id="refill-review-btn"
          >
            <div aria-hidden="true" className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl shrink-0">
              📝
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-ink-900 font-black text-base">{t('modals.practiceTitle')}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-green-700 text-white uppercase">
                  {t('modals.free')}
                </span>
              </div>
              <p className="text-emerald-900 text-xs font-medium mt-0.5">{t('modals.practiceDesc')}</p>
            </div>
          </motion.button>

          {/* Option 2: Live countdown */}
          <div className="p-4 rounded-xl2 bg-sky-50 border-2 border-sky-200 flex items-center gap-4">
            <div aria-hidden="true" className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl shrink-0">
              ⏳
            </div>
            <div className="flex-1">
              <span className="text-ink-500 text-xs font-bold uppercase tracking-wider block">
                {t('modals.nextHeartIn')}
              </span>
              <span role="timer" className="text-sky-800 font-mono font-black text-xl tracking-wider">
                {formatCountdown(remainingMs)}
              </span>
            </div>
          </div>

          {/* Option 3: Upgrade to Pro */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgradePro}
            className="p-4 rounded-xl2 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-2 border-b-4 border-exam/40 hover:border-exam flex items-center gap-4 text-left transition-colors group cursor-pointer"
            id="refill-pro-btn"
          >
            <div aria-hidden="true" className="w-12 h-12 rounded-xl bg-exam/10 text-amber-500 flex items-center justify-center text-2xl shrink-0">
              👑
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-ink-900 font-black text-base">{t('modals.upgradeTitle')}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-duo-yellow text-amber-950 uppercase">
                  {t('modals.unlimited')}
                </span>
              </div>
              <p className="text-indigo-900 text-xs font-medium mt-0.5">{t('modals.upgradeDesc')}</p>
            </div>
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};
