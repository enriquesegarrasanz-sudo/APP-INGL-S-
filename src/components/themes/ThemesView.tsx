import type { Expression } from '../../types';
import { THEME_BLOCKS } from '../../types';

interface ThemesViewProps {
  expressions: Expression[];
  onNavigateToBlock: (blockLabel: string) => void;
}

export default function ThemesView({
  expressions,
  onNavigateToBlock,
}: ThemesViewProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2">Temas</h2>
        <p className="text-sm text-text-muted m-0">
          Recorre tu vocabulario por areas de uso y conecta expresiones cercanas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {THEME_BLOCKS.map((block) => {
          const blockExpressions = expressions.filter((expression) =>
            expression.blocks.includes(block.label)
          );
          const total = blockExpressions.length;
          const ready = blockExpressions.filter((expression) =>
            ['active', 'mastered'].includes(expression.status)
          ).length;
          const progress = total > 0 ? Math.round((ready / total) * 100) : 0;
          const priorityClass =
            block.priority === 1
              ? 'border-accent/40 hover:border-accent'
              : 'border-border-light hover:border-accent/30';

          return (
            <button
              key={block.id}
              type="button"
              onClick={() => onNavigateToBlock(block.label)}
              className={`text-left bg-card border ${priorityClass} rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold m-0">{block.label_es}</h3>
                  <p className="text-xs text-text-muted mt-1 mb-0">
                    {block.label}
                  </p>
                </div>
                {block.priority === 1 && (
                  <span className="text-[11px] font-black uppercase tracking-wider text-accent bg-accent-bg border border-accent/20 rounded-full px-2 py-1 shrink-0">
                    Prioridad
                  </span>
                )}
              </div>

              <p className="text-sm text-text-muted leading-relaxed min-h-10 m-0 mb-5">
                {block.description}
              </p>

              <div className="flex items-end justify-between gap-4 mb-3">
                <div>
                  <div className="text-2xl font-black">{total}</div>
                  <div className="text-xs text-text-muted font-semibold">
                    expresiones
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black">{progress}%</div>
                  <div className="text-xs text-text-muted font-semibold">
                    activo o dominado
                  </div>
                </div>
              </div>

              <div className="h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
