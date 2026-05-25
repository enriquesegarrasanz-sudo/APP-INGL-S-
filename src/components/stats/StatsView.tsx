import { useMemo } from 'react';
import type { Expression, ReviewSession } from '../../types';
import { THEME_BLOCKS, STATUS_LABELS } from '../../types';
import { getDueExpressions, getReviewableExpressions } from '../../lib/spaced-repetition';
import { loadReviews } from '../../lib/storage';

interface StatsViewProps {
  expressions: Expression[];
}

const STATUS_COLORS: Record<string, string> = {
  new: 'var(--color-status-new)',
  learning: 'var(--color-status-learning)',
  active: 'var(--color-status-active)',
  mastered: 'var(--color-status-mastered)',
  needs_review: 'var(--color-status-review)',
};

export default function StatsView({ expressions }: StatsViewProps) {
  const reviews = useMemo(() => loadReviews(), []);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    expressions.forEach((e) => {
      counts[e.status] = (counts[e.status] || 0) + 1;
    });
    return counts;
  }, [expressions]);

  const dueCount = useMemo(
    () => getDueExpressions(getReviewableExpressions(expressions)).length,
    [expressions]
  );

  const totalReviewed = useMemo(
    () => reviews.reduce((sum: number, r: ReviewSession) => sum + r.cards_reviewed, 0),
    [reviews]
  );

  const avgAccuracy = useMemo(() => {
    const completed = reviews.filter((r: ReviewSession) => r.completed_at && r.cards_reviewed > 0);
    if (completed.length === 0) return 0;
    const totalCorrect = completed.reduce((sum: number, r: ReviewSession) => sum + r.correct_count, 0);
    const totalCards = completed.reduce((sum: number, r: ReviewSession) => sum + r.cards_reviewed, 0);
    return totalCards > 0 ? Math.round((totalCorrect / totalCards) * 100) : 0;
  }, [reviews]);

  const blockStats = useMemo(() => {
    return THEME_BLOCKS.map((block) => {
      const blockExprs = expressions.filter((e) => e.blocks.includes(block.label));
      const total = blockExprs.length;
      if (total === 0) return null;
      const mastered = blockExprs.filter((e) => e.status === 'mastered').length;
      const active = blockExprs.filter((e) => e.status === 'active').length;
      const learning = blockExprs.filter((e) => e.status === 'learning').length;
      const due = getDueExpressions(getReviewableExpressions(blockExprs)).length;
      const progress = Math.round(((mastered + active) / total) * 100);
      return { ...block, total, mastered, active, learning, due, progress };
    }).filter(Boolean) as NonNullable<ReturnType<typeof Array.prototype.map>[number]>[];
  }, [expressions]);

  const recentSessions = useMemo(
    () =>
      [...reviews]
        .filter((r: ReviewSession) => r.completed_at)
        .sort((a: ReviewSession, b: ReviewSession) =>
          new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime()
        )
        .slice(0, 10),
    [reviews]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2">Estadisticas</h2>
        <p className="text-sm text-text-muted m-0">
          Tu progreso de aprendizaje en detalle.
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Total expresiones" value={expressions.length} />
        <MetricCard label="Pendientes hoy" value={dueCount} color="var(--color-accent)" />
        <MetricCard label="Tarjetas repasadas" value={totalReviewed} color="var(--color-success)" />
        <MetricCard label="Precision media" value={`${avgAccuracy}%`} color={avgAccuracy >= 70 ? 'var(--color-success)' : 'var(--color-warning)'} />
      </div>

      {/* Status distribution */}
      <section className="bg-white border border-border-light rounded-xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-5">Distribucion por estado</h3>

        {/* Visual bar */}
        <div className="h-6 rounded-full overflow-hidden flex mb-4">
          {(['mastered', 'active', 'learning', 'new', 'needs_review'] as const).map((status) => {
            const count = statusCounts[status] || 0;
            const pct = expressions.length > 0 ? (count / expressions.length) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={status}
                className="h-full transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: STATUS_COLORS[status],
                }}
                title={`${STATUS_LABELS[status]}: ${count}`}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(['mastered', 'active', 'learning', 'new', 'needs_review'] as const).map((status) => (
            <div key={status} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: STATUS_COLORS[status] }}
              />
              <span className="text-sm text-text-muted">
                <span className="font-bold text-text">{statusCounts[status] || 0}</span>{' '}
                {STATUS_LABELS[status]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Block progress */}
      <section className="bg-white border border-border-light rounded-xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-5">Progreso por tema</h3>
        <div className="space-y-4">
          {(blockStats as { id: string; label_es: string; label: string; total: number; mastered: number; active: number; learning: number; due: number; progress: number }[]).map((block) => (
            <div key={block.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-sm font-bold text-text">{block.label_es}</span>
                  <span className="text-xs text-text-dim ml-2">{block.total} expr.</span>
                </div>
                <div className="flex items-center gap-3">
                  {block.due > 0 && (
                    <span className="text-xs font-bold text-accent">
                      {block.due} pendiente{block.due !== 1 ? 's' : ''}
                    </span>
                  )}
                  <span className="text-sm font-black text-text">{block.progress}%</span>
                </div>
              </div>
              <div className="h-2.5 bg-surface rounded-full overflow-hidden flex">
                {block.mastered > 0 && (
                  <div
                    className="h-full"
                    style={{
                      width: `${(block.mastered / block.total) * 100}%`,
                      backgroundColor: STATUS_COLORS.mastered,
                    }}
                  />
                )}
                {block.active > 0 && (
                  <div
                    className="h-full"
                    style={{
                      width: `${(block.active / block.total) * 100}%`,
                      backgroundColor: STATUS_COLORS.active,
                    }}
                  />
                )}
                {block.learning > 0 && (
                  <div
                    className="h-full"
                    style={{
                      width: `${(block.learning / block.total) * 100}%`,
                      backgroundColor: STATUS_COLORS.learning,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <section className="bg-white border border-border-light rounded-xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-5">Ultimas sesiones de repaso</h3>
          <div className="divide-y divide-border-light">
            {(recentSessions as ReviewSession[]).map((session) => {
              const pct = session.cards_reviewed > 0
                ? Math.round((session.correct_count / session.cards_reviewed) * 100)
                : 0;
              const date = new Date(session.completed_at!);
              return (
                <div key={session.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-text">
                      {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      {' '}
                      <span className="text-text-muted font-normal">
                        {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-text-muted">
                      {session.cards_reviewed} tarjetas
                    </span>
                    <span
                      className="text-sm font-bold px-2.5 py-1 rounded-full"
                      style={{
                        color: pct >= 70 ? 'var(--color-success)' : 'var(--color-warning)',
                        backgroundColor: pct >= 70 ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="bg-white border border-border-light rounded-xl p-4 sm:p-5 text-center shadow-sm">
      <div className="text-2xl sm:text-3xl font-black" style={color ? { color } : undefined}>
        {value}
      </div>
      <div className="text-xs text-text-muted mt-1 font-bold">{label}</div>
    </div>
  );
}
