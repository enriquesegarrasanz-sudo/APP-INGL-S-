import type { Expression } from '../../types';
import { THEME_BLOCKS } from '../../types';

interface ThemesViewProps {
  expressions: Expression[];
}

export default function ThemesView({ expressions }: ThemesViewProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2">Bloques temáticos</h2>
        <p className="text-sm text-text-muted m-0">
          Vista inicial para recorrer tu vocabulario por áreas de uso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {THEME_BLOCKS.map((block) => {
          const count = expressions.filter((expression) =>
            expression.blocks.includes(block.label)
          ).length;

          return (
            <div
              key={block.id}
              className="bg-white border border-border-light rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold m-0">{block.label_es}</h3>
                  <p className="text-xs text-text-muted mt-1 mb-0">{block.label}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black">{count}</div>
                  <div className="text-xs text-text-muted font-semibold">
                    expresiones
                  </div>
                </div>
              </div>

              <p className="text-sm text-text-muted leading-relaxed m-0">
                {block.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
