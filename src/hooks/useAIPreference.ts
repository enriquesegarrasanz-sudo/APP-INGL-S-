import { useCallback, useEffect, useState } from 'react';
import { OllamaProvider } from '../lib/ai/ollama';
import { DeepSeekProvider } from '../lib/ai/deepseek';

export type AIPreference = 'auto' | 'ollama' | 'deepseek';
export type AIServiceStatus = 'available' | 'unavailable' | 'checking';

const STORAGE_KEY = 'sparring-ai-provider';
const PREFERENCES: AIPreference[] = ['auto', 'ollama', 'deepseek'];
const STATUS_REFRESH_MS = 15000;

function readPreference(): AIPreference {
  const stored = localStorage.getItem(STORAGE_KEY) as AIPreference | null;
  return stored && PREFERENCES.includes(stored) ? stored : 'auto';
}

export function useAIPreference() {
  const [preference, setPreferenceState] = useState<AIPreference>(() => readPreference());
  const [ollamaStatus, setOllamaStatus] = useState<AIServiceStatus>('checking');
  const [deepseekStatus, setDeepseekStatus] = useState<AIServiceStatus>('checking');

  const checkServices = useCallback(async (markChecking = true) => {
    if (markChecking) {
      setOllamaStatus('checking');
      setDeepseekStatus('checking');
    }
    const [ollamaAvailable, deepseekAvailable] = await Promise.all([
      new OllamaProvider().available(),
      new DeepSeekProvider().available(),
    ]);

    setOllamaStatus(ollamaAvailable ? 'available' : 'unavailable');
    setDeepseekStatus(deepseekAvailable ? 'available' : 'unavailable');
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      void checkServices(false);
    }, 0);

    const refreshTimer = window.setInterval(() => {
      void checkServices(false);
    }, STATUS_REFRESH_MS);

    const refreshOnFocus = () => {
      void checkServices(false);
    };

    const refreshOnVisibility = () => {
      if (document.visibilityState === 'visible') {
        void checkServices(false);
      }
    };

    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnVisibility);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshOnVisibility);
    };
  }, [checkServices]);

  const setPreference = useCallback((nextPreference: AIPreference) => {
    localStorage.setItem(STORAGE_KEY, nextPreference);
    setPreferenceState(nextPreference);
    void checkServices();
  }, [checkServices]);

  return {
    preference,
    setPreference,
    ollamaStatus,
    deepseekStatus,
    refreshServices: checkServices,
  };
}
