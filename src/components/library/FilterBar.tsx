import { STATUSES, THEME_BLOCKS, STATUS_LABELS } from '../../types';

interface FilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  filterBlock: string;
  setFilterBlock: (v: string) => void;
  filterContext: string;
  setFilterContext: (v: string) => void;
  allContexts: string[];
}

export default function FilterBar({
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
  filterBlock,
  setFilterBlock,
  filterContext,
  setFilterContext,
  allContexts,
}: FilterBarProps) {
  const selectClasses =
    'h-11 px-4 rounded-lg border border-border-light bg-input-bg text-sm text-text focus:outline-none focus:border-accent transition-colors cursor-pointer';

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 bg-surface rounded-xl px-4 sm:px-5 py-4">
      <div className="relative w-full sm:flex-1 sm:min-w-48">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-lg border border-border-light bg-input-bg text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <select
        value={filterStatus}
        onChange={(event) => setFilterStatus(event.target.value)}
        className={selectClasses}
      >
        <option value="all">Todos los estados</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <select
        value={filterBlock}
        onChange={(event) => setFilterBlock(event.target.value)}
        className={selectClasses}
      >
        <option value="all">Todos los bloques</option>
        {THEME_BLOCKS.map((block) => (
          <option key={block.id} value={block.label}>
            {block.label_es}
          </option>
        ))}
      </select>

      <select
        value={filterContext}
        onChange={(event) => setFilterContext(event.target.value)}
        className={selectClasses}
      >
        <option value="all">Todos los contextos</option>
        {allContexts.map((context) => (
          <option key={context} value={context}>
            {context}
          </option>
        ))}
      </select>
    </div>
  );
}
