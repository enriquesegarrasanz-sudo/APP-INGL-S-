interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const TABS = [
  { key: 'library', label: 'Biblioteca' },
  { key: 'pronunciation', label: 'Pronunciación' },
  { key: 'flashcards', label: 'Repaso' },
  { key: 'scripts', label: 'Scripts' },
  { key: 'practice', label: 'Práctica' },
  { key: 'data', label: 'Datos' },
];

export default function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main row: logo + nav (desktop/tablet ≥768px) */}
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-base md:text-lg leading-none">S</span>
            </div>
            <div>
              <h1 className="text-base md:text-lg font-black leading-tight m-0">
                Sparring English
              </h1>
              <p className="text-xs text-text-muted m-0 leading-tight">
                Vocabulario personal
              </p>
            </div>
          </div>

          {/* Navigation — only visible on md+ */}
          <nav className="hidden md:flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onViewChange(tab.key)}
                className={`px-3 lg:px-4 py-2 text-sm font-bold rounded-lg cursor-pointer border-none transition-colors ${
                  currentView === tab.key
                    ? 'bg-accent text-white'
                    : 'bg-transparent text-text-muted hover:bg-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile nav — scrollable row, only visible on <768px */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onViewChange(tab.key)}
                className={`shrink-0 px-4 py-2 text-sm font-bold rounded-lg cursor-pointer border-none transition-colors ${
                  currentView === tab.key
                    ? 'bg-accent text-white'
                    : 'bg-transparent text-text-muted'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
