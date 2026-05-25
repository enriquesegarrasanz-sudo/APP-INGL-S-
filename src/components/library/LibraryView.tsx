import { useMemo, useState } from 'react';
import type { Expression, ExpressionStatus } from '../../types';
import { THEME_BLOCKS } from '../../types';
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
  viewMode: 'all' | 'grouped';
  setViewMode: (mode: 'all' | 'grouped') => void;
  activeBlock: string | null;
  onNavigateToExpression: (id: string) => void;
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
  viewMode,
  setViewMode,
  onNavigateToExpression,
}: LibraryViewProps) {
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(
    () => new Set()
  );

  const groupedExpressions = useMemo(
    () => {
      const visibleBlocks =
        filterBlock === 'all'
          ? THEME_BLOCKS
          : THEME_BLOCKS.filter((block) => block.label === filterBlock);

      return visibleBlocks.map((block) => ({
        block,
        expressions: expressions.filter((expression) =>
          expression.blocks.includes(block.label)
        ),
      })).filter((group) => group.expressions.length > 0);
    },
    [expressions, filterBlock]
  );

  const renderExpressionCard = (expr: Expression) => (
    <ExpressionCard
      key={expr.id}
      expr={expr}
      allExpressions={allExpressions}
      expanded={expandedCard === expr.id}
      onToggle={() => setExpandedCard(expandedCard === expr.id ? null : expr.id)}
      onEdit={() => onEdit(expr)}
      onDelete={() => onDelete(expr.id)}
      onStatusChange={(status) => onStatusChange(expr.id, status)}
      onNavigateToExpression={onNavigateToExpression}
    />
  );

  const toggleBlock = (blockLabel: string) => {
    const nextCollapsed = new Set(collapsedBlocks);
    if (nextCollapsed.has(blockLabel)) {
      nextCollapsed.delete(blockLabel);
    } else {
      nextCollapsed.add(blockLabel);
    }
    setCollapsedBlocks(nextCollapsed);
  };

  return (
    <div className="space-y-6">
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
            + Anadir vocabulario
          </button>
          <button
            onClick={onNew}
            className="px-5 py-2.5 text-sm font-bold text-white bg-accent border-none rounded-xl shadow-btn hover:opacity-90 transition-all cursor-pointer"
          >
            Editor completo
          </button>
        </div>
      </div>

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

      <div className="inline-flex items-center gap-1 rounded-xl bg-surface border border-border-light p-1">
        <button
          type="button"
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
            viewMode === 'all'
              ? 'bg-card text-text shadow-sm'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Vista general
        </button>
        <button
          type="button"
          onClick={() => setViewMode('grouped')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
            viewMode === 'grouped'
              ? 'bg-card text-text shadow-sm'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Por temas
        </button>
      </div>

      {expressions.length > 0 ? (
        viewMode === 'grouped' ? (
          <div className="space-y-4">
            {groupedExpressions.map(({ block, expressions: blockExpressions }) => {
              const collapsed = collapsedBlocks.has(block.label);

              return (
                <section
                  key={block.id}
                  className="bg-surface border border-border-light rounded-2xl p-3 sm:p-4"
                >
                  <button
                    type="button"
                    onClick={() => toggleBlock(block.label)}
                    className="w-full flex items-center justify-between gap-4 text-left px-2 py-1 cursor-pointer"
                  >
                    <div>
                      <h3 className="text-xl font-black text-text m-0">
                        {block.label_es}
                      </h3>
                      <p className="text-xs text-text-muted mt-1 mb-0">
                        {block.label} - {blockExpressions.length} expresiones
                      </p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-text-dim shrink-0 transition-transform ${
                        collapsed ? '' : 'rotate-180'
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
                  </button>

                  {!collapsed && (
                    <div className="space-y-3 mt-4">
                      {blockExpressions.map(renderExpressionCard)}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">{expressions.map(renderExpressionCard)}</div>
        )
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
