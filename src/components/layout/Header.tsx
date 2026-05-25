import type { TTSSpeed } from '../../types';
import { TTS_SPEEDS } from '../../types';
import { useAudioSettings } from '../../context/audioSettings';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const TABS = [
  { key: 'dashboard', label: 'Hoy' },
  { key: 'themes', label: 'Temas' },
  { key: 'library', label: 'Biblioteca' },
  { key: 'flashcards', label: 'Repaso' },
  { key: 'stats', label: 'Progreso' },
];

const SECONDARY_TABS = [
  { key: 'map', label: 'Mapa' },
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
        className="h-9 px-3 text-xs sm:text-sm font-bold rounded-lg border border-white/30 bg-white/20 text-white cursor-pointer focus:outline-none focus:border-white/60 backdrop-blur-sm"
      >
        {(Object.keys(TTS_SPEEDS) as TTSSpeed[]).map((key) => (
          <option key={key} value={key} className="text-text bg-card">
            {TTS_SPEEDS[key].label} {TTS_SPEEDS[key].rate}x
          </option>
        ))}
      </select>

      <label className="h-9 px-3 flex items-center gap-2 rounded-lg border border-white/30 bg-white/20 text-xs sm:text-sm font-bold text-white cursor-pointer backdrop-blur-sm">
        <input
          type="checkbox"
          checked={showPronunciationGuide}
          onChange={(event) => setShowPronunciationGuide(event.target.checked)}
          className="accent-white"
        />
        Chuleta
      </label>
    </div>
  );

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'linear-gradient(135deg, #7C5CFC 0%, #A78BFA 50%, #F0ABFC 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3 md:py-4">
          <div>
            <h1 className="text-base md:text-lg font-black leading-tight m-0 text-white">
              Sparring English
            </h1>
            <p className="text-xs text-white/70 m-0 leading-tight">
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
                  className={`px-3 lg:px-4 py-2 text-sm font-bold rounded-lg cursor-pointer border-none transition-all ${
                    currentView === tab.key
                      ? 'bg-white text-accent shadow-sm'
                      : 'bg-transparent text-white/80 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <span className="w-px h-5 bg-white/20 mx-1" />
              {SECONDARY_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onViewChange(tab.key)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer border-none transition-all ${
                    currentView === tab.key
                      ? 'bg-white text-accent shadow-sm'
                      : 'bg-transparent text-white/60 hover:bg-white/15 hover:text-white'
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
            {[...TABS, ...SECONDARY_TABS].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => onViewChange(tab.key)}
                className={`shrink-0 px-4 py-2 text-sm font-bold rounded-lg cursor-pointer border-none transition-all ${
                  currentView === tab.key
                    ? 'bg-white text-accent shadow-sm'
                    : 'bg-transparent text-white/80'
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
