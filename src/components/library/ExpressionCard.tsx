import type { Expression, ExpressionStatus } from '../../types';
import { STATUSES, STATUS_LABELS, STATUS_COLORS } from '../../types';
import SpeakableText from '../ui/SpeakableText';
import Tag from '../ui/Tag';

interface ExpressionCardProps {
  expr: Expression;
  allExpressions: Expression[];
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: ExpressionStatus) => void;
  onNavigateToExpression: (id: string) => void;
}

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${
            i <= level ? 'bg-accent' : 'bg-border-light'
          }`}
        />
      ))}
    </div>
  );
}

export default function ExpressionCard({
  expr,
  allExpressions,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  onStatusChange,
  onNavigateToExpression,
}: ExpressionCardProps) {
  const relatedExpressions = expr.related_ids
    .map((id) => allExpressions.find((expression) => expression.id === id))
    .filter((expression): expression is Expression => Boolean(expression));

  return (
    <div
      id={expr.id}
      className="bg-card border border-border-light rounded-xl shadow-sm transition-shadow hover:shadow-md scroll-mt-28"
    >
      <div
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 cursor-pointer text-left active:bg-surface/60 transition-colors rounded-xl"
      >
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: STATUS_COLORS[expr.status] }}
        />

        <div className="flex-1 min-w-0">
          <SpeakableText
            text={expr.english}
            pronunciation={expr.pronunciation_es}
            showGuide={false}
            showWords={false}
            className="min-w-0"
            phraseClassName="block max-w-full truncate text-sm sm:text-lg font-bold text-text leading-snug"
          />
          <span className="text-xs sm:text-sm text-text-muted block truncate leading-tight">
            {expr.spanish_source}
          </span>
        </div>

        <span className="hidden md:flex flex-wrap justify-end gap-1 shrink-0 max-w-xs">
          {expr.blocks.map((block) => (
            <Tag key={block}>{block}</Tag>
          ))}
        </span>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface text-text-muted hidden lg:inline shrink-0">
          {STATUS_LABELS[expr.status]}
        </span>

        <svg
          className={`w-5 h-5 text-text-dim shrink-0 transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {expanded && (
        <div className="border-t border-border-light px-5 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-5">
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Significado
              </p>
              <p className="text-sm text-text leading-relaxed">{expr.meaning}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Registro
              </p>
              <p className="text-sm text-text">{expr.register}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Pronunciacion
              </p>
              <SpeakableText
                text={expr.english}
                pronunciation={expr.pronunciation_es}
                stress={expr.stress}
                note={expr.pronunciation_note}
                showWords
                showGuide
                phraseClassName="text-base sm:text-lg font-bold text-text"
              />
            </div>
          </div>

          {expr.pronunciation_note && (
            <div className="bg-warning-bg border border-border-light rounded-lg px-4 py-3 mb-5">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Nota de pronunciacion
              </p>
              <p className="text-sm text-text">{expr.pronunciation_note}</p>
            </div>
          )}

          {expr.examples.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Ejemplos
              </p>
              <ul className="space-y-2">
                {expr.examples.map((example, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <SpeakableText
                      text={example}
                      showWords
                      phraseClassName="text-sm text-text"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {expr.common_mistake && (
            <div className="bg-danger-bg border border-border-light rounded-lg px-4 py-3 mb-5">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Error comun
              </p>
              <p className="text-sm text-text">{expr.common_mistake}</p>
            </div>
          )}

          {expr.better_alternatives.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Mejores alternativas
              </p>
              <div className="flex flex-wrap gap-2">
                {expr.better_alternatives.map((alternative, index) => (
                  <SpeakableText
                    key={index}
                    text={alternative}
                    phraseClassName="text-sm font-semibold text-green"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-5">
            {expr.blocks.map((block) => (
              <Tag key={block}>{block}</Tag>
            ))}
            {expr.contexts.map((context) => (
              <Tag key={context} color="var(--color-blue)">
                {context}
              </Tag>
            ))}
            {expr.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Dificultad
            </span>
            <DifficultyDots level={expr.difficulty} />
          </div>

          {relatedExpressions.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Relacionadas
              </p>
              <div className="flex flex-wrap gap-2">
                {relatedExpressions.map((relatedExpression) => (
                  <button
                    key={relatedExpression.id}
                    type="button"
                    onClick={() => onNavigateToExpression(relatedExpression.id)}
                    className="min-h-[44px] px-4 py-2.5 text-sm font-semibold text-accent bg-accent-bg border border-border-light rounded-full hover:border-accent active:border-accent active:bg-accent/10 transition-colors cursor-pointer"
                  >
                    {relatedExpression.english}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-border-light">
            <button
              onClick={onEdit}
              className="min-h-[44px] px-4 py-2.5 text-sm font-semibold text-accent bg-surface border border-border-light rounded-lg hover:bg-accent-bg active:bg-accent-bg transition-colors cursor-pointer"
            >
              Editar
            </button>

            <select
              value={expr.status}
              onChange={(event) =>
                onStatusChange(event.target.value as ExpressionStatus)
              }
              onClick={(event) => event.stopPropagation()}
              className="h-9 px-3 text-sm rounded-lg border border-border-light bg-input-bg text-text focus:outline-none focus:border-accent cursor-pointer"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>

            <button
              onClick={onDelete}
              className="ml-auto min-h-[44px] px-4 py-2.5 text-sm font-semibold text-danger bg-danger-bg border border-border-light rounded-lg hover:bg-danger/10 active:bg-danger/20 transition-colors cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
