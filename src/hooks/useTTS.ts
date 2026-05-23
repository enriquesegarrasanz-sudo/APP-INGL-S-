import { useState, useCallback } from 'react';
import type { TTSSpeed } from '../types';
import { speak, stopSpeaking, isTTSSupported } from '../lib/tts';

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const supported = isTTSSupported();

  const handleSpeak = useCallback((text: string, speed?: TTSSpeed) => {
    if (!supported) return;

    setSpeaking(true);
    speak(text, speed)
      .then(() => setSpeaking(false))
      .catch(() => setSpeaking(false));
  }, [supported]);

  const handleStop = useCallback(() => {
    stopSpeaking();
    setSpeaking(false);
  }, []);

  return { speak: handleSpeak, stop: handleStop, speaking, supported };
}
