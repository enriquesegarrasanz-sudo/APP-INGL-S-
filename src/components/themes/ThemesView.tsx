import type { Expression } from '../../types';
import { THEME_BLOCKS } from '../../types';

interface ThemesViewProps {
  expressions: Expression[];
  onNavigateToBlock: (blockLabel: string) => void;
}

const BLOCK_COLORS = [
  { border: '#7C5CFC', bg: '#F0EBFF', text: '#7C5CFC' },
  { border: '#FF8A6B', bg: '#FFF0EB', text: '#E8724F' },
  { border: '#5B8DEF', bg: '#EEF3FF', text: '#5B8DEF' },
  { border: '#34B87A', bg: '#EEFBF3', text: '#2DA06A' },
  { border: '#F0ABFC', bg: '#FAF0FF', text: '#C77FDB' },
  { border: '#F5A623', bg: '#FFF8EB', text: '#D9901A' },
  { border: '#6DD3D6', bg: '#ECFCFC', text: '#4AADAF' },
  { border: '#FF7EB3', bg: '#FFF0F5', text: '#E0659A' },
  { border: '#A78BFA', bg: '#F5F0FF', text: '#8B6FE0' },
  { border: '#7ECFA0', bg: '#F0FBF5', text: '#5CB082' },
];

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
        {THEME_BLOCKS.map((block, index) => {
          const blockExpressions = expressions.filter((expression) =>
            expression.blocks.includes(block.label)
          );
          const total = blockExpressions.length;
          const ready = blockExpressions.filter((expression) =>
            ['active', 'mastered'].includes(expression.status)
          ).length;
          const progress = total > 0 ? Math.round((ready / total) * 100) : 0;
          const color = BLOCK_COLORS[index % BLOCK_COLORS.length];

          return (
            <button
              key={block.id}
              type="button"
              onClick={() => onNavigateToBlock(block.label)}
              className="text-left bg-card border border-border-light rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
              style={{ borderLeftWidth: '4px', borderLeftColor: color.border }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold m-0">{block.label_es}</h3>
                  <p className="text-xs text-text-muted mt-1 mb-0">
                    {block.label}
                  </p>
                </div>
                {block.priority === 1 && (
                  <span
                    className="text-[11px] font-black uppercase tracking-wider rounded-full px-2.5 py-1 shrink-0"
                    style={{
                      color: color.text,
                      backgroundColor: color.bg,
                      border: `1px solid ${color.border}40`,
                    }}
                  >
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
                  <div className="text-lg font-black" style={{ color: color.text }}>
                    {progress}%
                  </div>
                  <div className="text-xs text-text-muted font-semibold">
                    activo o dominado
                  </div>
                </div>
              </div>

              <div className="h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${color.border}, ${color.border}CC)`,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
