import type { AIProvider, AIAutoFillResult } from '../../types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';

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

export class DeepSeekProvider implements AIProvider {
  name = 'DeepSeek';

  async available(): Promise<boolean> {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    return !!apiKey;
  }

  async autoFill(englishExpression: string): Promise<AIAutoFillResult | null> {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.warn('[DeepSeek] No API key found in VITE_DEEPSEEK_API_KEY');
      return null;
    }

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: DEEPSEEK_MODEL,
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
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        console.error(`[DeepSeek] API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        console.error('[DeepSeek] No content in response');
        return null;
      }

      // Clean potential markdown fences from response
      const cleaned = content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

      const result: AIAutoFillResult = JSON.parse(cleaned);
      return result;
    } catch (error) {
      console.error('[DeepSeek] Error:', error);
      return null;
    }
  }
}
