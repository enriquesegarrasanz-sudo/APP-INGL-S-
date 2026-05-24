import { useState, useCallback } from 'react';
import type { AIAutoFillResult } from '../types';
import { autoFillExpression, getAIProvider } from '../lib/ai/provider';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerName, setProviderName] = useState<string | null>(null);

  const autoFill = useCallback(async (inputExpression: string, languageHint = 'auto'): Promise<AIAutoFillResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const provider = await getAIProvider();
      setProviderName(provider?.name ?? null);

      if (!provider) {
        setError('No hay proveedor de IA disponible. Configura Ollama o DeepSeek.');
        setLoading(false);
        return null;
      }

      const result = await autoFillExpression(inputExpression, languageHint);
      setLoading(false);
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido al auto-completar';
      setError(msg);
      setLoading(false);
      return null;
    }
  }, []);

  return { autoFill, loading, error, providerName };
}
