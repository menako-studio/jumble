/**
 * audioEngine.ts — Zero-asset tactile sound design via the Web Audio API
 *
 * Synthesizes every gameplay cue on the fly (no mp3/wav assets to ship):
 *   - playCorrect()     → bright ascending major arpeggio chime
 *   - playMistake()     → soft, encouraging wooden thud (never punishing)
 *   - playTilePop()     → light "pop" click when a word tile is placed
 *   - playTileRemove()  → softer, lower click when a tile is sent back
 *   - playWin()         → a slightly longer triumphant flourish for level clears
 *
 * The AudioContext is created lazily on first use (required by browser
 * autoplay policies — it must happen inside a user gesture) and the mute
 * preference is persisted to localStorage so it survives reloads.
 */

const MUTE_STORAGE_KEY = 'jumble_audio_muted';

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return null;

  if (!ctx) {
    ctx = new AudioContextCtor();
  }
  // Browsers suspend contexts created/resumed outside a user gesture window;
  // resuming here is a harmless no-op once already running.
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function isAudioMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAudioMuted(muted: boolean): void {
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
  } catch {
    // ignore storage failures (private browsing, quota, etc.)
  }
}

export function toggleAudioMuted(): boolean {
  const next = !isAudioMuted();
  setAudioMuted(next);
  return next;
}

/** Plays a single synthesized tone with an ADSR-ish envelope. */
function tone(
  audio: AudioContext,
  {
    freq,
    startTime,
    duration,
    type = 'sine',
    peakGain = 0.22,
    attack = 0.008,
    release = 0.12,
    detune = 0,
  }: {
    freq: number;
    startTime: number;
    duration: number;
    type?: OscillatorType;
    peakGain?: number;
    attack?: number;
    release?: number;
    detune?: number;
  }
) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  if (detune) osc.detune.setValueAtTime(detune, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + attack + duration + release);

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start(startTime);
  osc.stop(startTime + attack + duration + release + 0.02);
}

/** Short filtered noise burst — used for the tactile "thud" and click sounds. */
function noiseBurst(
  audio: AudioContext,
  {
    startTime,
    duration,
    peakGain = 0.18,
    filterFreq = 900,
    filterType = 'lowpass',
  }: {
    startTime: number;
    duration: number;
    peakGain?: number;
    filterFreq?: number;
    filterType?: BiquadFilterType;
  }
) {
  const bufferSize = Math.max(1, Math.floor(audio.sampleRate * duration));
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = audio.createBufferSource();
  source.buffer = buffer;

  const filter = audio.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.setValueAtTime(filterFreq, startTime);

  const gain = audio.createGain();
  gain.gain.setValueAtTime(peakGain, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);

  source.start(startTime);
  source.stop(startTime + duration + 0.02);
}

function withAudio(fn: (audio: AudioContext) => void) {
  if (isAudioMuted()) return;
  const audio = getContext();
  if (!audio) return;
  try {
    fn(audio);
  } catch {
    // Synthesis should never crash gameplay.
  }
}

/** High-pitched melodic ascending chime on correct answer. */
export function playCorrect(): void {
  withAudio((audio) => {
    const now = audio.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 — major arpeggio
    notes.forEach((freq, i) => {
      tone(audio, {
        freq,
        startTime: now + i * 0.075,
        duration: 0.14,
        type: 'triangle',
        peakGain: 0.2,
        attack: 0.005,
        release: 0.16,
      });
    });
  });
}

/** Gentle, soft wooden thud on mistake — encouraging, not punishing. */
export function playMistake(): void {
  withAudio((audio) => {
    const now = audio.currentTime;
    tone(audio, {
      freq: 180,
      startTime: now,
      duration: 0.1,
      type: 'sine',
      peakGain: 0.16,
      attack: 0.004,
      release: 0.18,
    });
    noiseBurst(audio, {
      startTime: now,
      duration: 0.09,
      peakGain: 0.1,
      filterFreq: 500,
    });
  });
}

/** Subtle "pop" click when a tile is placed into the answer zone. */
export function playTilePop(): void {
  withAudio((audio) => {
    const now = audio.currentTime;
    tone(audio, {
      freq: 720,
      startTime: now,
      duration: 0.045,
      type: 'sine',
      peakGain: 0.14,
      attack: 0.002,
      release: 0.05,
    });
  });
}

/** Slightly lower/softer click when a tile is removed back to the bank. */
export function playTileRemove(): void {
  withAudio((audio) => {
    const now = audio.currentTime;
    tone(audio, {
      freq: 480,
      startTime: now,
      duration: 0.04,
      type: 'sine',
      peakGain: 0.12,
      attack: 0.002,
      release: 0.05,
    });
  });
}

/** Triumphant flourish for level completion / win screens. */
export function playWin(): void {
  withAudio((audio) => {
    const now = audio.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5..E6
    notes.forEach((freq, i) => {
      tone(audio, {
        freq,
        startTime: now + i * 0.09,
        duration: 0.18,
        type: 'triangle',
        peakGain: 0.22,
        attack: 0.006,
        release: 0.22,
      });
    });
  });
}
