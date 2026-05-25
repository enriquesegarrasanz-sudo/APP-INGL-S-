import { useMemo } from 'react';
import type { Expression, ReviewSession } from '../../types';
import { THEME_BLOCKS, STATUS_LABELS } from '../../types';
import { getDueExpressions, getReviewableExpressions } from '../../lib/spaced-repetition';
import { loadReviews } from '../../lib/storage';

interface DashboardViewProps {
  expressions: Expression[];
  onStartReview: (blockFilter?: string | null) => void;
  onNavigateToBlock: (blockLabel: string) => void;
  onQuickAdd: () => void;
  onViewChange: (view: string) => void;
}

const STATUS_ORDER = ['mastered', 'active', 'learning', 'new', 'needs_review'] as const;

const STATUS_BAR_COLORS: Record<string, string> = {
  mastered: 'var(--color-status-mastered)',
  active: 'var(--color-status-active)',
  learning: 'var(--color-status-learning)',
  new: 'var(--color-status-new)',
  needs_review: 'var(--color-status-review)',
};

export default function DashboardView({
  expressions,
  onStartReview,
  onNavigateToBlock,
  onQuickAdd,
  onViewChange,
}: DashboardViewProps) {
  const dueExpressions = useMemo(
    () => getDueExpressions(getReviewableExpressions(expressions)),
    [expressions]
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      new: 0,
      learning: 0,
      active: 0,
      mastered: 0,
      needs_review: 0,
    };
    expressions.forEach((e) => {
      counts[e.status] = (counts[e.status] || 0) + 1;
    });
    return counts;
  }, [expressions]);

  const recentExpressions = useMemo(
    () =>
      [...expressions]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5),
    [expressions]
  );

  const reviews = useMemo(() => loadReviews(), []);

  const streak = useMemo(() => {
    if (reviews.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let count = 0;
    let checkDate = new Date(today);

    const reviewDates = new Set(
      reviews
        .filter((r: ReviewSession) => r.completed_at)
        .map((r: ReviewSession) => {
          const d = new Date(r.completed_at!);
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
    );

    const todayKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
    if (!reviewDates.has(todayKey)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    for (let i = 0; i < 365; i++) {
      const key = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
      if (reviewDates.has(key)) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, [reviews]);

  const topBlocks = useMemo(() => {
    return THEME_BLOCKS.map((block) => {
      const blockExprs = expressions.filter((e) => e.blocks.includes(block.label));
      const due = getDueExpressions(getReviewableExpressions(blockExprs)).length;
      const total = blockExprs.length;
      const mastered = blockExprs.filter((e) => e.status === 'mastered').length;
      const active = blockExprs.filter((e) => e.status === 'active').length;
      const progress = total > 0 ? Math.round(((mastered + active) / total) * 100) : 0;
      return { ...block, due, total, mastered, active, progress };
    })
      .filter((b) => b.total > 0)
      .sort((a, b) => b.due - a.due)
      .slice(0, 4);
  }, [expressions]);

  const dueCount = dueExpressions.length;

  const todayFormatted = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm text-text-muted m-0 capitalize">{todayFormatted}</p>
          <h2 className="text-3xl sm:text-4xl font-black m-0 mt-1">
            {dueCount > 0 ? 'Tienes trabajo pendiente' : 'Todo al dia'}
          </h2>
        </div>
        <button
          onClick={onQuickAdd}
          className="min-h-[44px] px-5 py-2.5 text-sm font-bold text-accent bg-surface border border-border-light rounded-xl hover:bg-accent-bg active:bg-accent-bg transition-colors cursor-pointer w-fit"
        >
          + Anadir vocabulario
        </button>
      </div>

      {/* Main action card */}
      <div className="bg-white border border-border-light rounded-2xl shadow-md p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <div className="text-center sm:text-left">
            <div className="text-6xl font-black text-accent leading-none">{dueCount}</div>
            <div className="text-text-muted text-lg mt-1">
              {dueCount === 1 ? 'tarjeta pendiente' : 'tarjetas pendientes'}
            </div>
          </div>
          <div className="flex flex-col gap-3 flex-1 w-full sm:w-auto">
            {dueCount > 0 ? (
              <button
                onClick={() => onStartReview(null)}
                className="w-full sm:w-auto px-10 py-4 bg-accent text-white rounded-xl font-bold text-lg cursor-pointer border-none hover:opacity-90 transition-opacity shadow-btn"
              >
                Empezar repaso
              </button>
            ) : (
              <div className="bg-success-bg border border-border-light rounded-xl px-6 py-4 text-center">
                <p className="text-sm font-bold text-success m-0">
                  No hay tarjetas pendientes ahora mismo
                </p>
                <p className="text-xs text-text-muted mt-1 m-0">
                  Vuelve mas tarde o anade nuevas expresiones
                </p>
              </div>
            )}
          </div>
          {streak > 0 && (
            <div className="text-center shrink-0">
              <div className="text-3xl font-black text-accent-secondary leading-none">{streak}</div>
              <div className="text-xs text-text-muted font-bold mt-1">
                {streak === 1 ? 'dia de racha' : 'dias de racha'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STATUS_ORDER.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onViewChange('library')}
            className="bg-white border border-border-light rounded-xl p-4 text-center cursor-pointer hover:shadow-md active:scale-[0.97] active:shadow-sm transition-all"
          >
            <div
              className="text-2xl font-black"
              style={{ color: STATUS_BAR_COLORS[status] }}
            >
              {statusCounts[status]}
            </div>
            <div className="text-xs text-text-muted font-bold mt-1">
              {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
            </div>
          </button>
        ))}
      </div>

      {/* Blocks with due counts */}
      {topBlocks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black m-0">Temas con tarjetas pendientes</h3>
            <button
              type="button"
              onClick={() => onViewChange('themes')}
              className="text-sm font-bold text-accent cursor-pointer bg-transparent border-none hover:underline"
            >
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topBlocks.map((block) => (
              <div
                key={block.id}
                className="bg-white border border-border-light rounded-xl p-5 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-black m-0">{block.label_es}</h4>
                    <p className="text-xs text-text-muted mt-0.5 m-0">
                      {block.total} expresiones — {block.progress}% dominado
                    </p>
                  </div>
                  {block.due > 0 && (
                    <span className="text-xs font-black text-white bg-accent rounded-full px-2.5 py-1 shrink-0">
                      {block.due} pendiente{block.due !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigateToBlock(block.label)}
                    className="flex-1 min-h-[44px] px-3 py-2.5 text-sm font-bold text-text-muted bg-surface border border-border-light rounded-lg cursor-pointer hover:border-accent hover:text-accent active:bg-accent-bg active:border-accent active:text-accent transition-colors"
                  >
                    Ver biblioteca
                  </button>
                  {block.due > 0 && (
                    <button
                      type="button"
                      onClick={() => onStartReview(block.label)}
                      className="flex-1 min-h-[44px] px-3 py-2.5 text-sm font-bold text-white bg-accent border-none rounded-lg cursor-pointer hover:opacity-90 active:opacity-75 active:scale-[0.97] transition-all shadow-btn"
                    >
                      Repasar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent expressions */}
      {recentExpressions.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black m-0">Ultimas expresiones</h3>
            <button
              type="button"
              onClick={() => onViewChange('library')}
              className="text-sm font-bold text-accent cursor-pointer bg-transparent border-none hover:underline"
            >
              Ver biblioteca
            </button>
          </div>
          <div className="bg-white border border-border-light rounded-xl shadow-sm divide-y divide-border-light">
            {recentExpressions.map((expr) => (
              <div key={expr.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-text truncate">{expr.english}</div>
                  <div className="text-xs text-text-muted truncate">{expr.spanish_source}</div>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                  style={{
                    color: STATUS_BAR_COLORS[expr.status],
                    backgroundColor: `${STATUS_BAR_COLORS[expr.status]}15`,
                  }}
                >
                  {STATUS_LABELS[expr.status]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
