/**
 * useGameState.ts
 * Exported for potential future use. The JumbleLevel component manages
 * its own state inline via useState for simpler coordination with dnd-kit.
 * This file exports the evaluator and calculator utilities as a convenience re-export.
 */

export { checkAnswer, shuffle } from '../lib/evaluator';
export { calculateStars, calculatePoints, BASE_POINTS } from '../lib/starCalculator';
