export function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+$/, '')
    .replace(/^-+/, '');
}

export function generatePrompt(
  expressions: { english: string; spanish_source: string }[],
  context?: string
): string {
  const vocab = expressions.map((e) => `- ${e.english} (${e.spanish_source})`).join('\n');
  return `Let's practice speaking in English.

Context:
${context || 'General conversation about creative projects, technology, AI and strategy.'}

Active vocabulary:
${vocab}

My goal: I want to sound natural, not translated from Spanish.

Training mode:
1. Ask me questions in English.
2. Push me to use the active vocabulary.
3. Don't give me the perfect sentence before I try.
4. Only correct the most important mistakes.
5. Point out when something is correct but unnatural.
6. Give me a natural version.
7. Make me repeat it.
8. At the end, give me a mini-log to bring back to Claude.

About me: I'm Enrike. I think in systems, complex projects, creativity, cinema, technology, AI and strategy. I want to learn to express my real ideas in English, not practice generic textbook sentences.`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadFile(content: string, filename: string, type = 'application/json'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function formatDate(isoDate: string | null): string {
  if (!isoDate) return 'Nunca';
  const d = new Date(isoDate);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function daysUntil(isoDate: string | null): number | null {
  if (!isoDate) return null;
  const diff = new Date(isoDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
