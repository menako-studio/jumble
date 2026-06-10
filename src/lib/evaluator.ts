/**
 * evaluator.ts
 * Deterministic answer checker — pure function, no side effects.
 * Compares user's word arrangement against the correct order.
 */

/**
 * Returns true if every word in `userAnswer` matches `correct` at the same index.
 * Case-sensitive to match the stored correct_word_order exactly.
 */
export function checkAnswer(
  userAnswer: string[],
  correct: string[]
): boolean {
  if (userAnswer.length !== correct.length) return false;
  return userAnswer.every((word, i) => word === correct[i]);
}

/**
 * Shuffles an array using Fisher-Yates algorithm.
 * Used at question start to randomize jumbled words further.
 */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
