import type { TTSSpeed } from '../types';
import { TTS_SPEEDS } from '../types';

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

const PREFERRED_US_VOICES = [
  'Microsoft Mark',
  'Microsoft David',
  'Google US English',
  'Samantha',
  'Alex',
  'Daniel',
  'Aaron',
  'Nicky',
  'Tom',
];

function scoreVoice(voice: SpeechSynthesisVoice): number {
  if (!voice.lang.startsWith('en')) return -1;
  if (voice.lang !== 'en-US') return 0;

  const name = voice.name.toLowerCase();

  for (let i = 0; i < PREFERRED_US_VOICES.length; i++) {
    if (name.includes(PREFERRED_US_VOICES[i].toLowerCase())) {
      return 100 - i;
    }
  }

  if (name.includes('natural') || name.includes('neural')) return 50;
  if (name.includes('online') || name.includes('enhanced')) return 40;
  if (!voice.localService) return 30;

  return 10;
}

function selectBestVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  voicesLoaded = true;
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;

  for (const voice of voices) {
    const score = scoreVoice(voice);
    if (score > bestScore) {
      bestScore = score;
      best = voice;
    }
  }

  return best;
}

function getEnglishVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice && voicesLoaded) return cachedVoice;
  cachedVoice = selectBestVoice();
  return cachedVoice;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    voicesLoaded = false;
    getEnglishVoice();
  };
}

export function speak(text: string, speed: TTSSpeed = 'normal'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = TTS_SPEEDS[speed].rate;

    const voice = getEnglishVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
}

export function speakWord(word: string, speed: TTSSpeed = 'normal'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = Math.min(TTS_SPEEDS[speed].rate, 0.85);

    const voice = getEnglishVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getAvailableVoiceName(): string | null {
  const voice = getEnglishVoice();
  return voice ? voice.name : null;
}
