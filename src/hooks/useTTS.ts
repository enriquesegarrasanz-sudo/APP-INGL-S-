import { useState, useCallback, useRef } from 'react';
import type { TTSSpeed } from '../types';
import { speak, speakWord, stopSpeaking, isTTSSupported } from '../lib/tts';

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const supported = isTTSSupported();
  const activeRef = useRef<string | null>(null);

  const handleSpeak = useCallback((text: string, speed?: TTSSpeed) => {
    if (!supported) return;

    setSpeaking(true);
    setActiveWord(null);
    activeRef.current = null;
    speak(text, speed)
      .then(() => setSpeaking(false))
      .catch(() => setSpeaking(false));
  }, [supported]);

  const handleSpeakWord = useCallback((word: string, speed?: TTSSpeed) => {
    if (!supported) return;

    setSpeaking(true);
    setActiveWord(word);
    activeRef.current = word;
    speakWord(word, speed)
      .then(() => {
        setSpeaking(false);
        if (activeRef.current === word) setActiveWord(null);
      })
      .catch(() => {
        setSpeaking(false);
        if (activeRef.current === word) setActiveWord(null);
      });
  }, [supported]);

  const handleStop = useCallback(() => {
    stopSpeaking();
    setSpeaking(false);
    setActiveWord(null);
    activeRef.current = null;
  }, []);

  return {
    speak: handleSpeak,
    speakWord: handleSpeakWord,
    stop: handleStop,
    speaking,
    activeWord,
    supported,
  };
}
