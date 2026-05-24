import type { TTSSpeed } from '../../types';
import { TTS_SPEEDS } from '../../types';
import { useAudioSettings } from '../../context/audioSettings';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const TABS = [
  { key: 'themes', label: 'Temas' },
  { key: 'map', label: 'Mapa' },
  { key: 'library', label: 'Biblioteca' },
  { key: 'flashcards', label: 'Repaso' },
  { key: 'settings', label: 'Ajustes' },
];

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const { speed, setSpeed, showPronunciationGuide, setShowPronunciationGuide } =
    useAudioSettings();

  const audioControls = (id: string) => (
    <div className="flex items-center gap-2">
      <label className="sr-only" htmlFor={id}>
        Velocidad
      </label>
      <select
        id={id}
        value={speed}
        onChange={(event) => setSpeed(event.target.value as TTSSpeed)}
        className="h-9 px-3 text-xs sm:text-sm font-bold rounded-lg border border-border-light bg-input-bg text-text cursor-pointer focus:outline-none focus:border-accent"
      >
        {(Object.keys(TTS_SPEEDS) as TTSSpeed[]).map((key) => (
          <option key={key} value={key}>
            {TTS_SPEEDS[key].label} {TTS_SPEEDS[key].rate}x
          </option>
        ))}
      </select>

      <label className="h-9 px-3 flex items-center gap-2 rounded-lg border border-border-light bg-input-bg text-xs sm:text-sm font-bold text-text cursor-pointer">
        <input
          type="checkbox"
          checked={showPronunciationGuide}
          onChange={(event) => setShowPronunciationGuide(event.target.checked)}
          className="accent-accent"
        />
        Chuleta
      </label>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3 md:py-4">
          <div>
            <h1 className="text-base md:text-lg font-black leading-tight m-0">
              Sparring English
            </h1>
            <p className="text-xs text-text-muted m-0 leading-tight">
              Vocabulario personal
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <nav className="flex gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
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
            {audioControls('tts-speed-desktop')}
          </div>
        </div>

        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
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
          <div className="pb-3">{audioControls('tts-speed-mobile')}</div>
        </div>
      </div>
    </header>
  );
}
