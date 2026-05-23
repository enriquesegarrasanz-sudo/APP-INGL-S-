import type { Expression, ExpressionStatus } from '../../types';
import FilterBar from './FilterBar';
import ExpressionCard from './ExpressionCard';

interface LibraryViewProps {
  expressions: Expression[];
  allExpressions: Expression[];
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  filterBlock: string;
  setFilterBlock: (v: string) => void;
  filterContext: string;
  setFilterContext: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  allContexts: string[];
  expandedCard: string | null;
  setExpandedCard: (id: string | null) => void;
  onEdit: (expr: Expression) => void;
  onNew: () => void;
  onQuickAdd: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ExpressionStatus) => void;
}

export default function LibraryView({
  expressions,
  allExpressions,
  filterStatus,
  setFilterStatus,
  filterBlock,
  setFilterBlock,
  filterContext,
  setFilterContext,
  search,
  setSearch,
  allContexts,
  expandedCard,
  setExpandedCard,
  onEdit,
  onNew,
  onQuickAdd,
  onDelete,
  onStatusChange,
}: LibraryViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-text m-0">
            Biblioteca de expresiones
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {expressions.length} de {allExpressions.length} expresiones
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onQuickAdd}
            className="px-5 py-2.5 text-sm font-bold text-accent bg-surface border border-border-light rounded-xl hover:bg-accent-bg transition-colors cursor-pointer"
          >
            + Expresion rapida
          </button>
          <button
            onClick={onNew}
            className="px-5 py-2.5 text-sm font-bold text-white bg-accent border-none rounded-xl shadow-btn hover:opacity-90 transition-opacity cursor-pointer"
          >
            Editor completo
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterBlock={filterBlock}
        setFilterBlock={setFilterBlock}
        filterContext={filterContext}
        setFilterContext={setFilterContext}
        allContexts={allContexts}
      />

      {/* Expression list */}
      {expressions.length > 0 ? (
        <div className="space-y-3">
          {expressions.map((expr) => (
            <ExpressionCard
              key={expr.id}
              expr={expr}
              expanded={expandedCard === expr.id}
              onToggle={() =>
                setExpandedCard(expandedCard === expr.id ? null : expr.id)
              }
              onEdit={() => onEdit(expr)}
              onDelete={() => onDelete(expr.id)}
              onStatusChange={(status) => onStatusChange(expr.id, status)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg
            className="w-16 h-16 text-text-dim mb-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <line x1="12" y1="8" x2="12" y2="14" />
            <line x1="9" y1="11" x2="15" y2="11" />
          </svg>
          <p className="text-lg font-bold text-text-muted mb-1">
            No se encontraron expresiones
          </p>
          <p className="text-sm text-text-dim">
            Ajusta los filtros o agrega una nueva expresion
          </p>
        </div>
      )}
    </div>
  );
}
