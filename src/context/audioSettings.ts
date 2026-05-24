import { createContext, useContext } from 'react';
import type { TTSSpeed } from '../types';

export interface AudioSettingsContextValue {
  speed: TTSSpeed;
  setSpeed: (speed: TTSSpeed) => void;
  showPronunciationGuide: boolean;
  setShowPronunciationGuide: (show: boolean) => void;
}

export const SPEED_KEY = 'sparring-english-tts-speed';
export const GUIDE_KEY = 'sparring-english-pronunciation-guide';
export const SPEEDS: TTSSpeed[] = ['slow', 'normal', 'fast', 'native'];

export const AudioSettingsContext = createContext<AudioSettingsContextValue | null>(null);

export function useAudioSettings() {
  const context = useContext(AudioSettingsContext);
  if (!context) {
    throw new Error('useAudioSettings must be used inside AudioSettingsProvider');
  }
  return context;
}
