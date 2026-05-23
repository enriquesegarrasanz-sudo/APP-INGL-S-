import type { AIProvider, AIAutoFillResult } from '../../types';
import { OllamaProvider } from './ollama';
import { DeepSeekProvider } from './deepseek';

const ollama = new OllamaProvider();
const deepseek = new DeepSeekProvider();

export async function getAIProvider(): Promise<AIProvider | null> {
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
