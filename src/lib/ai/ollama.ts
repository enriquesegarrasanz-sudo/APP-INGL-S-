import type { AIProvider, AIAutoFillResult } from '../../types';

const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'deepseek-r1:8b';

interface OllamaModel {
  name?: string;
  model?: string;
}

interface OllamaTagsResponse {
  models?: OllamaModel[];
}

function buildPrompt(englishExpr: string): string {
  return `You are an English-Spanish language expert helping a native Spanish speaker learn natural English expressions.

Given this English expression: "${englishExpr}"

Return ONLY a JSON object (no markdown, no backticks, no preamble) with these fields:
{
  "spanish_source": "how a Spanish speaker would naturally say this in colloquial Spanish",
  "meaning": "clear explanation of the meaning in English (1 sentence)",
  "pronunciation_es": "phonetic approximation using Spanish sounds (e.g. 'tu meik it CON-kriit')",
  "stress": "the key syllable(s) to emphasize (e.g. 'CON-kriit')",
  "pronunciation_note": "a helpful pronunciation tip for Spanish speakers (written in Spanish)",
  "register": "one of: casual, neutral, professional, casual / neutral, neutral / professional",
  "contexts": ["3-4 relevant usage contexts"],
  "examples": ["two natural example sentences using this expression"],
  "common_mistake": "a typical error a Spanish speaker would make",
  "better_alternatives": ["2-3 natural alternative ways to express the same idea"],
  "tags": ["3-4 relevant single-word tags"],
  "blocks": ["1-3 relevant blocks from: Cinema & Storytelling, AI & Technology, Ideas & Creativity, Business & Networking, Structure & Systems, Judgment & Decisions, Inner Life & Growth, Communication, Art & Culture, Daily Life & Social"]
}`;
}

export class OllamaProvider implements AIProvider {
  name = 'Ollama';

  private get baseUrl(): string {
    return import.meta.env.VITE_OLLAMA_URL || DEFAULT_OLLAMA_URL;
  }

  private get model(): string {
    return import.meta.env.VITE_OLLAMA_MODEL || DEFAULT_MODEL;
  }

  private async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });

      if (!response.ok) return [];

      const data = await response.json() as OllamaTagsResponse;
      return (data.models ?? [])
        .map((model) => model.name ?? model.model)
        .filter((model): model is string => Boolean(model));
    } catch {
      return [];
    }
  }

  private async getModelForRequest(): Promise<string | null> {
    const models = await this.getAvailableModels();
    if (models.length === 0) return null;

    if (models.includes(this.model)) return this.model;

    const textModel = models.find((model) => !model.toLowerCase().includes('vl'));
    return textModel ?? models[0];
  }

  async available(): Promise<boolean> {
    return (await this.getAvailableModels()).length > 0;
  }

  async autoFill(englishExpression: string): Promise<AIAutoFillResult | null> {
    const model = await this.getModelForRequest();
    if (!model) {
      console.warn('[Ollama] No local models available');
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a precise JSON generator. Return only valid JSON, no markdown formatting.',
            },
            {
              role: 'user',
              content: buildPrompt(englishExpression),
            },
          ],
          stream: false,
          options: {
            temperature: 0.3,
          },
        }),
      });

      if (!response.ok) {
        console.error(`[Ollama] API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      const content = data.message?.content;

      if (!content) {
        console.error('[Ollama] No content in response');
        return null;
      }

      // Clean potential markdown fences and thinking tags from response
      const cleaned = content
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

      const result: AIAutoFillResult = JSON.parse(cleaned);
      return result;
    } catch (error) {
      console.error('[Ollama] Error:', error);
      return null;
    }
  }
}
