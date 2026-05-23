import type { Expression, ExpressionStatus } from '../../types';
import { STATUSES, STATUS_LABELS, STATUS_COLORS } from '../../types';
import AudioButton from '../ui/AudioButton';
import Tag from '../ui/Tag';

interface ExpressionCardProps {
  expr: Expression;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: ExpressionStatus) => void;
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
  expanded,
  onToggle,
  onEdit,
  onDelete,
  onStatusChange,
}: ExpressionCardProps) {
  return (
    <div className="bg-card border border-border-light rounded-xl shadow-sm transition-shadow hover:shadow-md">
      {/* Collapsed header - always visible */}
      <div
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer text-left"
      >
        {/* Status dot */}
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: STATUS_COLORS[expr.status] }}
        />

        {/* English expression */}
        <span className="text-lg font-bold text-text truncate">
          {expr.english}
        </span>

        {/* Spanish source */}
        <span className="text-sm text-text-muted truncate hidden sm:inline">
          {expr.spanish_source}
        </span>

        {/* Audio */}
        <span className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <AudioButton text={expr.english} size="sm" />
        </span>

        {/* Block tag */}
        <span className="hidden md:inline-flex shrink-0">
          <Tag>{expr.block}</Tag>
        </span>

        {/* Status label */}
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface text-text-muted hidden lg:inline">
          {STATUS_LABELS[expr.status]}
        </span>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 text-text-dim shrink-0 transition-transform duration-200 ml-auto ${
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

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border-light px-5 py-5">
          {/* Main info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-5">
            {/* Meaning */}
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Significado
              </p>
              <p className="text-sm text-text leading-relaxed">{expr.meaning}</p>
            </div>

            {/* Register */}
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Registro
              </p>
              <p className="text-sm text-text">{expr.register}</p>
            </div>

            {/* Pronunciation */}
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Pronunciacion
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text font-mono">
                  {expr.pronunciation_es}
                </span>
                <AudioButton text={expr.english} size="sm" />
              </div>
            </div>

            {/* Stress */}
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Acento / Stress
              </p>
              <p className="text-xl font-black text-text">{expr.stress}</p>
            </div>
          </div>

          {/* Pronunciation note */}
          {expr.pronunciation_note && (
            <div className="bg-warning-bg border border-border-light rounded-lg px-4 py-3 mb-5">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Nota de pronunciacion
              </p>
              <p className="text-sm text-text">{expr.pronunciation_note}</p>
            </div>
          )}

          {/* Examples */}
          {expr.examples.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Ejemplos
              </p>
              <ul className="space-y-2">
                {expr.examples.map((ex, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-sm text-text">{ex}</span>
                    <AudioButton text={ex} size="sm" />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Common mistake */}
          {expr.common_mistake && (
            <div className="bg-danger-bg border border-border-light rounded-lg px-4 py-3 mb-5">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Error comun
              </p>
              <p className="text-sm text-text">{expr.common_mistake}</p>
            </div>
          )}

          {/* Better alternatives */}
          {expr.better_alternatives.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Mejores alternativas
              </p>
              <div className="flex flex-wrap gap-2">
                {expr.better_alternatives.map((alt, i) => (
                  <span key={i} className="text-sm font-semibold text-green">
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contexts & Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {expr.contexts.map((ctx) => (
              <Tag key={ctx} color="var(--color-blue)">
                {ctx}
              </Tag>
            ))}
            {expr.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Dificultad
            </span>
            <DifficultyDots level={expr.difficulty} />
          </div>

          {/* Action row */}
          <div className="flex items-center gap-3 pt-4 border-t border-border-light">
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-semibold text-accent bg-surface border border-border-light rounded-lg hover:bg-accent-bg transition-colors cursor-pointer"
            >
              Editar
            </button>

            <select
              value={expr.status}
              onChange={(e) =>
                onStatusChange(e.target.value as ExpressionStatus)
              }
              onClick={(e) => e.stopPropagation()}
              className="h-9 px-3 text-sm rounded-lg border border-border-light bg-input-bg text-text focus:outline-none focus:border-accent cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>

            <button
              onClick={onDelete}
              className="ml-auto px-4 py-2 text-sm font-semibold text-danger bg-danger-bg border border-border-light rounded-lg hover:bg-danger/10 transition-colors cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
