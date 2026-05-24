import { useState, useMemo } from 'react';
import type { Expression } from '../../types';
import { generatePrompt } from '../../lib/utils';

interface PracticeViewProps {
  expressions: Expression[];
  allContexts: string[];
  copyText: (text: string, label?: string) => void;
}

export default function PracticeView({
  expressions,
  allContexts,
  copyText,
}: PracticeViewProps) {
  const [selected, setSelected] = useState<Set<string>>(() => {
    const active = new Set<string>();
    expressions.forEach((e) => {
      if (e.status === 'active') active.add(e.id);
    });
    return active;
  });

  const [context, setContext] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const selectedExpressions = useMemo(
    () => expressions.filter((e) => selected.has(e.id)),
    [expressions, selected]
  );

  const toggleExpression = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(expressions.map((e) => e.id)));
  };

  const selectNone = () => {
    setSelected(new Set());
  };

  const handleGenerate = () => {
    const ctx = context === '__custom__' ? customContext : context || undefined;
    const prompt = generatePrompt(selectedExpressions, ctx);
    setGeneratedPrompt(prompt);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-black mb-8">Pr&aacute;ctica oral</h2>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        {/* Left: Expression list — order-2 on mobile so controls appear first */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-text-muted">
              Expresiones ({expressions.length})
            </span>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-xs font-bold text-accent cursor-pointer bg-transparent border-none hover:underline"
              >
                Todas
              </button>
              <span className="text-text-dim">|</span>
              <button
                onClick={selectNone}
                className="text-xs font-bold text-accent cursor-pointer bg-transparent border-none hover:underline"
              >
                Ninguna
              </button>
            </div>
          </div>

          <div className="bg-white border border-border-light rounded-2xl overflow-hidden max-h-[480px] overflow-y-auto">
            {expressions.map((expr) => (
              <label
                key={expr.id}
                className="flex items-center gap-3 px-5 py-3 border-b border-border-light last:border-b-0 cursor-pointer hover:bg-surface transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.has(expr.id)}
                  onChange={() => toggleExpression(expr.id)}
                  className="w-4 h-4 accent-accent shrink-0"
                />
                <div className="min-w-0">
                  <span className="font-semibold text-sm block truncate">
                    {expr.english}
                  </span>
                  <span className="text-xs text-text-muted block truncate">
                    {expr.spanish_source}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Right: Controls — order-1 on mobile so it appears first */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="bg-white border border-border-light rounded-2xl p-6 lg:sticky lg:top-28">
            <div className="text-4xl font-black text-center mb-1">
              {selected.size}
            </div>
            <div className="text-sm text-text-muted text-center mb-6">
              expresiones seleccionadas
            </div>

            {/* Context selector */}
            <label className="block text-sm font-bold text-text-muted mb-2">
              Contexto
            </label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm bg-input-bg mb-4 cursor-pointer focus:outline-none focus:border-accent"
            >
              <option value="">General (por defecto)</option>
              {allContexts.map((ctx) => (
                <option key={ctx} value={ctx}>
                  {ctx}
                </option>
              ))}
              <option value="__custom__">Personalizado...</option>
            </select>

            {context === '__custom__' && (
              <textarea
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="Describe el contexto de pr&aacute;ctica..."
                rows={3}
                className="w-full px-4 py-3 border border-border-light rounded-xl text-sm bg-input-bg resize-y mb-4 focus:outline-none focus:border-accent"
              />
            )}

            <button
              onClick={handleGenerate}
              disabled={selected.size === 0}
              className="w-full py-3 bg-accent text-white rounded-xl font-bold cursor-pointer border-none hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Generar prompt
            </button>
          </div>
        </div>
      </div>

      {/* Generated prompt */}
      {generatedPrompt && (
        <div className="bg-white border border-border-light rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-text-muted">
              Prompt generado
            </span>
            <button
              onClick={() => copyText(generatedPrompt, 'Prompt copiado')}
              className="px-4 py-2 text-sm font-bold text-accent bg-accent-bg border border-border-light rounded-lg cursor-pointer hover:border-accent transition-colors"
            >
              Copiar
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-surface rounded-xl p-5 overflow-x-auto m-0 font-mono">
            {generatedPrompt}
          </pre>
        </div>
      )}
    </div>
  );
}
