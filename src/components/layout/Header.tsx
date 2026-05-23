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
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-lg leading-none">S</span>
          </div>
          <div>
            <h1 className="text-lg font-black leading-tight m-0">
              Sparring English
            </h1>
            <p className="text-xs text-text-muted m-0 leading-tight">
              Vocabulario personal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex gap-1 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onViewChange(tab.key)}
              className={`px-4 py-2 text-sm font-bold rounded-lg cursor-pointer border-none transition-colors ${
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
    </header>
  );
}
