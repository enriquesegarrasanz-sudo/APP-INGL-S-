import { useCallback, useEffect, useState } from 'react';
import { OllamaProvider } from '../lib/ai/ollama';
import { DeepSeekProvider } from '../lib/ai/deepseek';

export type AIPreference = 'auto' | 'ollama' | 'deepseek';
export type AIServiceStatus = 'available' | 'unavailable' | 'checking';

const STORAGE_KEY = 'sparring-ai-provider';
const PREFERENCES: AIPreference[] = ['auto', 'ollama', 'deepseek'];

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
    const timer = window.setTimeout(() => {
      void checkServices(false);
    }, 0);

    return () => window.clearTimeout(timer);
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
  };
}
