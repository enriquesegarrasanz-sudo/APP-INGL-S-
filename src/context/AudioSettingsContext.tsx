import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { TTSSpeed } from '../types';
import {
  AudioSettingsContext,
  GUIDE_KEY,
  SPEED_KEY,
  SPEEDS,
} from './audioSettings';

function readStoredSpeed(): TTSSpeed {
  if (typeof window === 'undefined') return 'normal';

  const stored = window.localStorage.getItem(SPEED_KEY);
  return SPEEDS.includes(stored as TTSSpeed) ? (stored as TTSSpeed) : 'normal';
}

function readStoredGuidePreference(): boolean {
  if (typeof window === 'undefined') return true;

  return window.localStorage.getItem(GUIDE_KEY) !== 'false';
}

export function AudioSettingsProvider({ children }: { children: ReactNode }) {
  const [speed, setSpeed] = useState<TTSSpeed>(readStoredSpeed);
  const [showPronunciationGuide, setShowPronunciationGuide] = useState<boolean>(
    readStoredGuidePreference
  );

  useEffect(() => {
    window.localStorage.setItem(SPEED_KEY, speed);
  }, [speed]);

  useEffect(() => {
    window.localStorage.setItem(GUIDE_KEY, String(showPronunciationGuide));
  }, [showPronunciationGuide]);

  const value = useMemo(
    () => ({
      speed,
      setSpeed,
      showPronunciationGuide,
      setShowPronunciationGuide,
    }),
    [speed, showPronunciationGuide]
  );

  return (
    <AudioSettingsContext.Provider value={value}>
      {children}
    </AudioSettingsContext.Provider>
  );
}
