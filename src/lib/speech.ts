/**
 * speech.ts — Zero-Cost Native Web Speech API TTS Utility
 */

export interface SpeechOptions {
  lang?: string; // Default: 'en-US'
  rate?: number; // Speed (0.5 to 2.0, default 0.9)
  pitch?: number; // Pitch (0 to 2, default 1)
}

/**
 * Check if the browser supports SpeechSynthesis
 */
export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Speak the provided text using native browser Web Speech API
 */
export function speak(text: string, options: SpeechOptions = {}): Promise<void> {
  return new Promise((resolve) => {
    if (!isSpeechSupported() || !text.trim()) {
      resolve();
      return;
    }

    const { lang = 'en-US', rate = 0.9, pitch = 1.0 } = options;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Try to pick a natural sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.lang.startsWith('en') || v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')) && v.name.includes('Natural')
    ) || voices.find(
      (v) => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stop any current speech playback
 */
export function stopSpeech(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}
