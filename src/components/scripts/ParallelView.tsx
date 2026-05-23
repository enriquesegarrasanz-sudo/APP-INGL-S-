import type { ParallelScript, Expression } from '../../types';
import { generatePrompt } from '../../lib/utils';
import Tag from '../ui/Tag';

interface ParallelViewProps {
  scripts: ParallelScript[];
  expressions: Expression[];
  onEdit: (s: ParallelScript) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  copyText: (text: string, label?: string) => void;
}

export default function ParallelView({
  scripts,
  expressions,
  onEdit,
  onNew,
  onDelete,
  copyText,
}: ParallelViewProps) {
  const handleCopyPrompt = (script: ParallelScript) => {
    const scriptExpressions = script.blocks.flatMap((block) =>
      block.key_expressions.map((ke) => {
        const found = expressions.find(
          (e) => e.english.toLowerCase() === ke.toLowerCase()
        );
        return found || { english: ke, spanish_source: ke };
      })
    );

    if (scriptExpressions.length === 0) {
      copyText(
        `Practice script: "${script.title}"`,
        'Prompt copiado'
      );
      return;
    }

    const prompt = generatePrompt(scriptExpressions);
    copyText(prompt, 'Prompt copiado');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h2 className="text-3xl font-black m-0">Scripts Paralelos</h2>
        <button
          onClick={onNew}
          className="px-5 py-2.5 bg-accent text-white rounded-xl font-bold cursor-pointer border-none hover:opacity-90 transition-opacity text-sm"
        >
          + Nuevo Script
        </button>
      </div>

      {scripts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted text-lg mb-4">
            No hay scripts todav&iacute;a.
          </p>
          <button
            onClick={onNew}
            className="px-6 py-3 bg-accent text-white rounded-xl font-bold cursor-pointer border-none hover:opacity-90 transition-opacity"
          >
            Crear primer script
          </button>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {scripts.map((script) => (
          <div
            key={script.id}
            className="bg-white border border-border-light rounded-2xl overflow-hidden"
          >
            {/* Script header */}
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <h3 className="text-xl font-bold m-0">{script.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(script)}
                  className="px-4 py-2 text-sm font-bold text-text-muted bg-surface border border-border-light rounded-lg cursor-pointer hover:border-accent transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleCopyPrompt(script)}
                  className="px-4 py-2 text-sm font-bold text-accent bg-accent-bg border border-border-light rounded-lg cursor-pointer hover:border-accent transition-colors"
                >
                  Copiar prompt
                </button>
                <button
                  onClick={() => onDelete(script.id)}
                  className="px-4 py-2 text-sm font-bold text-danger bg-danger-bg border border-border-light rounded-lg cursor-pointer hover:border-danger transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {/* Blocks */}
            <div className="divide-y divide-border-light">
              {script.blocks.map((block, idx) => (
                <div key={idx} className="p-6">
                  {/* Spanish / English side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                        Espa&ntilde;ol
                      </div>
                      <p className="text-base leading-relaxed m-0">
                        {block.spanish}
                      </p>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                        English
                      </div>
                      <p className="text-base leading-relaxed m-0 font-semibold">
                        {block.english}
                      </p>
                    </div>
                  </div>

                  {/* Pronunciation */}
                  {block.pronunciation && (
                    <div className="mb-3">
                      <code className="text-sm px-3 py-1 bg-surface rounded-lg font-mono">
                        {block.pronunciation}
                      </code>
                    </div>
                  )}

                  {/* Key expressions */}
                  {block.key_expressions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {block.key_expressions.map((ke, i) => (
                        <Tag key={i}>{ke}</Tag>
                      ))}
                    </div>
                  )}

                  {/* Mistakes */}
                  {block.mistakes_to_avoid.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {block.mistakes_to_avoid.map((mistake, i) => (
                        <span
                          key={i}
                          className="text-sm px-3 py-1 rounded-lg bg-danger-bg text-danger font-semibold"
                        >
                          {mistake}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
