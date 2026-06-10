/**
 * starCalculator.ts
 * Calculates 1–3 stars awarded at the end of a lesson based on lives remaining.
 * Also computes whether a "perfect" bonus applies.
 */

export interface StarResult {
  stars: number;        // 0–3
  isPerfect: boolean;   // no mistakes at all
  message: 'perfect' | 'great' | 'good' | 'gameover';
}

/**
 * @param livesRemaining - How many hearts the player has left (0–3)
 * @param maxLives       - Maximum lives (default 3)
 */
export function calculateStars(
  livesRemaining: number,
  maxLives: number = 3
): StarResult {
  if (livesRemaining <= 0) {
    return { stars: 0, isPerfect: false, message: 'gameover' };
  }
  if (livesRemaining === maxLives) {
    return { stars: 3, isPerfect: true, message: 'perfect' };
  }
  if (livesRemaining >= maxLives - 1) {
    return { stars: 2, isPerfect: false, message: 'great' };
  }
  return { stars: 1, isPerfect: false, message: 'good' };
}

/**
 * Scoring formula with combo multiplier (capped at 5x).
 */
export const BASE_POINTS = 100;

export function calculatePoints(combo: number): number {
  const multiplier = Math.min(combo, 5);
  return BASE_POINTS * Math.max(multiplier, 1);
}
