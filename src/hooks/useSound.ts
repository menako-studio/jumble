/**
 * useSound.ts — React hook wrapper around the synthesized Web Audio engine.
 * Exposes gameplay sound triggers plus persisted mute state for the UI toggle.
 */

import { useCallback, useState } from 'react';
import {
  isAudioMuted,
  toggleAudioMuted,
  playCorrect,
  playMistake,
  playTilePop,
  playTileRemove,
  playWin,
} from '../lib/audioEngine';

export function useSound() {
  const [muted, setMuted] = useState<boolean>(() => isAudioMuted());

  const toggleMute = useCallback(() => {
    setMuted(toggleAudioMuted());
  }, []);

  return {
    muted,
    toggleMute,
    playCorrect,
    playMistake,
    playTilePop,
    playTileRemove,
    playWin,
  };
}
