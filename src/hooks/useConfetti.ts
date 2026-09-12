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
      colors: ['#58cc02', '#1cb0f6', '#ff9600', '#6366f1', '#ff4b4b'],
      gravity: 0.8,
      scalar: 1.2,
    });
    // Right burst
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.75 },
      colors: ['#58cc02', '#1cb0f6', '#ff9600', '#6366f1', '#ff4b4b'],
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
        colors: ['#ffc800', '#ff9600', '#6366f1'],
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
      colors: ['#58cc02', '#79db28', '#d7ffb8'],
      gravity: 1.2,
      scalar: 0.8,
      ticks: 80,
    });
  };

  return { fireWin, fireCorrect };
}
