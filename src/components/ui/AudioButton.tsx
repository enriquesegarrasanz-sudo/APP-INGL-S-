import { useState, useCallback } from 'react';
import type { TTSSpeed } from '../../types';
import { TTS_SPEEDS } from '../../types';
import { speak, stopSpeaking } from '../../lib/tts';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  showSpeedControl?: boolean;
}

const SIZES = {
  sm: { btn: 'w-10 h-10', icon: 16 },
  md: { btn: 'w-14 h-14', icon: 22 },
  lg: { btn: 'w-[72px] h-[72px]', icon: 28 },
};

export default function AudioButton({ text, size = 'md', showSpeedControl = false }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<TTSSpeed>('normal');
  const [showSpeeds, setShowSpeeds] = useState(false);
  const s = SIZES[size];

  const handlePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (playing) {
        stopSpeaking();
        setPlaying(false);
        return;
      }
      setPlaying(true);
      speak(text, speed).finally(() => setPlaying(false));
    },
    [text, speed, playing]
  );

  return (
    <div className="relative flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={handlePlay}
        title={playing ? 'Detener' : `Escuchar (${TTS_SPEEDS[speed].label})`}
        className={`${s.btn} flex items-center justify-center rounded-full border-2 shrink-0 transition-all duration-200 cursor-pointer ${
          playing
            ? 'bg-accent text-white border-accent scale-110 shadow-lg'
            : 'bg-accent-bg text-accent border-border-light hover:border-accent hover:shadow-sm'
        }`}
      >
        <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {playing ? (
            <>
              <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
              <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
            </>
          ) : (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </>
          )}
        </svg>
      </button>

      {showSpeedControl && (
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowSpeeds(!showSpeeds); }}
            className="px-3 py-1.5 text-xs font-bold text-text-muted bg-surface border border-border-light rounded-lg hover:border-accent cursor-pointer"
          >
            {TTS_SPEEDS[speed].rate}x
          </button>
          {showSpeeds && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-lg shadow-md z-10 overflow-hidden min-w-24">
              {(Object.keys(TTS_SPEEDS) as TTSSpeed[]).map((key) => (
                <button
                  key={key}
                  onClick={(e) => { e.stopPropagation(); setSpeed(key); setShowSpeeds(false); }}
                  className={`w-full px-4 py-2 text-left text-sm cursor-pointer hover:bg-surface ${
                    speed === key ? 'font-bold text-accent bg-accent-bg' : 'text-text-muted'
                  }`}
                >
                  {TTS_SPEEDS[key].label} ({TTS_SPEEDS[key].rate}x)
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
