/**
 * HeartBar.tsx — Lives indicator with animated heart icons
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeartBarProps {
  lives: number;
  maxLives?: number;
}

export const HeartBar: React.FC<HeartBarProps> = ({ lives, maxLives = 3 }) => {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Lives: ${lives}`}>
      <AnimatePresence>
        {Array.from({ length: maxLives }, (_, i) => {
          const filled = i < lives;
          return (
            <motion.span
              key={i}
              initial={false}
              animate={
                filled
                  ? { scale: 1, filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.7))' }
                  : { scale: 0.85, filter: 'none' }
              }
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="text-2xl leading-none"
              role="img"
              aria-hidden="true"
            >
              {filled ? '❤️' : '🖤'}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
