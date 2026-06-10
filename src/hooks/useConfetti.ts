/**
 * useConfetti.ts — canvas-confetti wrapper hook
 * Fires themed confetti bursts for win states.
 */

import confetti from 'canvas-confetti';

export function useConfetti() {
  /** Big celebration burst for level completion */
  const fireWin = () => {
    // Left burst
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.75 },
      colors: ['#6c4ff6', '#f59e0b', '#22c55e', '#ec4899', '#38bdf8'],
      gravity: 0.8,
      scalar: 1.2,
    });
    // Right burst
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.75 },
      colors: ['#6c4ff6', '#f59e0b', '#22c55e', '#ec4899', '#38bdf8'],
      gravity: 0.8,
      scalar: 1.2,
    });
    // Center shower after 300ms
    setTimeout(() => {
      confetti({
        particleCount: 60,
        startVelocity: 30,
        spread: 360,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#fbbf24', '#f59e0b', '#6c4ff6'],
        ticks: 200,
        scalar: 0.9,
      });
    }, 300);
  };

  /** Small correct-answer "pop" confetti */
  const fireCorrect = () => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#22c55e', '#4ade80', '#bbf7d0'],
      gravity: 1.2,
      scalar: 0.8,
      ticks: 80,
    });
  };

  return { fireWin, fireCorrect };
}
