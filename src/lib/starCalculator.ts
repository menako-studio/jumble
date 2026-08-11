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
 * @param mistakesMade   - Total incorrect attempts in the current lesson session
 * @param totalQuestions - Total questions in the lesson
 */
export function calculateStars(
  mistakesMade: number = 0,
  totalQuestions: number = 5
): StarResult {
  if (totalQuestions <= 0) {
    return { stars: 1, isPerfect: false, message: 'good' };
  }

  if (mistakesMade === 0) {
    return { stars: 3, isPerfect: true, message: 'perfect' };
  }
  if (mistakesMade <= 2) {
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
