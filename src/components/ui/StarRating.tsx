/**
 * StarRating.tsx — 1-3 star award display with staggered reveal animation
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface StarRatingProps {
  stars: number;     // 0–3
  size?: 'sm' | 'lg';
  animate?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  stars,
  size = 'lg',
  animate = true,
}) => {
  const [revealed, setRevealed] = useState(!animate);

  useEffect(() => {
    if (animate) {
      // Stagger reveal after a short delay
      const t = setTimeout(() => setRevealed(true), 200);
      return () => clearTimeout(t);
    }
  }, [animate]);

  const starSize = size === 'lg' ? 'text-6xl' : 'text-3xl';

  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => {
        const filled = i < stars;
        return (
          <motion.span
            key={i}
            className={`${starSize} leading-none`}
            initial={animate ? { scale: 0, rotate: -30 } : false}
            animate={revealed ? { scale: 1, rotate: 0 } : {}}
            transition={{
              delay: i * 0.15,
              type: 'spring',
              stiffness: 400,
              damping: 15,
            }}
            style={{
              filter: filled
                ? 'drop-shadow(0 0 12px rgba(251,191,36,0.8))'
                : 'grayscale(1) opacity(0.3)',
            }}
          >
            ⭐
          </motion.span>
        );
      })}
    </div>
  );
};
