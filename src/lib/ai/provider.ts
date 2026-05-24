import type { AIProvider, AIAutoFillResult } from '../../types';
import { OllamaProvider } from './ollama';
import { DeepSeekProvider } from './deepseek';

const ollama = new OllamaProvider();
const deepseek = new DeepSeekProvider();

type AIPreference = 'auto' | 'ollama' | 'deepseek';

function getPreference(): AIPreference {
  const stored = localStorage.getItem('sparring-ai-provider') as AIPreference | null;
  return stored === 'ollama' || stored === 'deepseek' || stored === 'auto' ? stored : 'auto';
}

export async function getAIProvider(): Promise<AIProvider | null> {
  const preference = getPreference();

  if (preference === 'ollama') {
    if (await ollama.available()) {
      console.log('[AI] Using Ollama provider');
      return ollama;
    }
    console.warn('[AI] Ollama selected but unavailable');
    return null;
  }

  if (preference === 'deepseek') {
    if (await deepseek.available()) {
      console.log('[AI] Using DeepSeek provider');
      return deepseek;
    }
    console.warn('[AI] DeepSeek selected but unavailable');
    return null;
  }

  // Try Ollama first (local, free, no API key needed)
  if (await ollama.available()) {
    console.log('[AI] Using Ollama provider');
    return ollama;
  }

  // Fall back to DeepSeek (cloud, requires API key)
  if (await deepseek.available()) {
    console.log('[AI] Using DeepSeek provider');
    return deepseek;
  }

  console.warn('[AI] No AI provider available');
  return null;
}

export async function autoFillExpression(englishExpr: string): Promise<AIAutoFillResult | null> {
  const provider = await getAIProvider();
  if (!provider) {
    console.warn('[AI] Cannot auto-fill: no provider available');
    return null;
  }

  console.log(`[AI] Auto-filling "${englishExpr}" with ${provider.name}`);
  return provider.autoFill(englishExpr);
}
