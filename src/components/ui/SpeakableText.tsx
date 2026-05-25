import { useMemo, useState, useCallback } from 'react';
import { TTS_SPEEDS } from '../../types';
import { speak, speakWord, stopSpeaking } from '../../lib/tts';
import { useAudioSettings } from '../../context/audioSettings';

interface SpeakableTextProps {
  text: string;
  pronunciation?: string;
  stress?: string;
  note?: string;
  className?: string;
  phraseClassName?: string;
  showWords?: boolean;
  showGuide?: boolean;
}

interface WordToken {
  raw: string;
  clean: string;
  index: number;
}

function tokenize(text: string): WordToken[] {
  const tokens: WordToken[] = [];
  let idx = 0;

  const parts = text.split(/(\s+)/);
  for (const part of parts) {
    if (/^\s+$/.test(part)) continue;
    const clean = part.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, '');
    tokens.push({ raw: part, clean, index: idx });
    idx++;
  }

  return tokens;
}

export default function SpeakableText({
  text,
  pronunciation = '',
  stress = '',
  note = '',
  className = '',
  phraseClassName = '',
  showWords = false,
  showGuide = true,
}: SpeakableTextProps) {
  const { speed, showPronunciationGuide } = useAudioSettings();
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const tokens = useMemo(() => tokenize(text), [text]);

  const handlePlayPhrase = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (playing) {
        stopSpeaking();
        setPlaying(false);
        return;
      }
      setPlaying(true);
      setActiveWordIdx(null);
      speak(text, speed)
        .then(() => setPlaying(false))
        .catch(() => setPlaying(false));
    },
    [text, speed, playing]
  );

  const handleClickWord = useCallback(
    (e: React.MouseEvent, token: WordToken) => {
      e.stopPropagation();
      if (token.clean.length === 0) return;
      setActiveWordIdx(token.index);
      setPlaying(true);
      speakWord(token.clean, speed)
        .then(() => {
          setPlaying(false);
          setTimeout(() => setActiveWordIdx(null), 600);
        })
        .catch(() => {
          setPlaying(false);
          setActiveWordIdx(null);
        });
    },
    [speed]
  );

  const showPhonetics = showGuide && showPronunciationGuide && pronunciation;

  return (
    <div className={className}>
      {/* Inline words — clickable like Kensington */}
      {showWords ? (
        <div className="leading-relaxed">
          <span className={`inline ${phraseClassName}`}>
            {tokens.map((token, i) => (
              <span key={`${token.raw}-${i}`}>
                <span
                  onClick={(e) => handleClickWord(e, token)}
                  className={`inline cursor-pointer rounded px-0.5 -mx-0.5 transition-colors duration-150 hover:bg-amber-100 ${
                    activeWordIdx === token.index ? 'bg-amber-200' : ''
                  }`}
                  title="Pronunciar esta palabra"
                >
                  {token.raw}
                </span>
                {i < tokens.length - 1 && ' '}
              </span>
            ))}
          </span>

          <button
            type="button"
            onClick={handlePlayPhrase}
            title={`Escuchar frase completa (${TTS_SPEEDS[speed].label})`}
            className={`inline-flex items-center justify-center ml-2 w-6 h-6 text-[10px] border rounded-full align-middle shrink-0 transition-all cursor-pointer ${
              playing
                ? 'bg-accent text-white border-accent'
                : 'bg-white text-text-muted border-border-light hover:bg-surface hover:border-accent'
            }`}
          >
            {playing ? '■' : '▶'}
          </button>
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePlayPhrase}
            className={`inline text-left bg-transparent border-none p-0 cursor-pointer hover:text-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${phraseClassName}`}
            title={`Escuchar a velocidad ${TTS_SPEEDS[speed].label.toLowerCase()}`}
          >
            {text}
          </button>
          <button
            type="button"
            onClick={handlePlayPhrase}
            title={`Escuchar (${TTS_SPEEDS[speed].label})`}
            className={`inline-flex items-center justify-center w-5 h-5 text-[9px] border rounded-full shrink-0 transition-all cursor-pointer ${
              playing
                ? 'bg-accent text-white border-accent'
                : 'bg-white text-text-muted border-border-light hover:bg-surface hover:border-accent'
            }`}
          >
            {playing ? '■' : '▶'}
          </button>
        </div>
      )}

      {/* Phonetic guide — Spanish approximation (Kensington system) */}
      {showPhonetics && (
        <div className="mt-1.5 pl-3 border-l-2 border-emerald-200">
          <p className="text-sm text-emerald-700 italic leading-relaxed font-sans">
            {pronunciation}
          </p>
        </div>
      )}

      {/* Stress pattern */}
      {showGuide && showPronunciationGuide && stress && (
        <div className="mt-1 pl-3 border-l-2 border-border-light">
          <p className="text-xs text-text-muted font-sans">
            <span className="font-bold uppercase tracking-wider text-[10px]">Acento: </span>
            <span className="font-bold text-text">{stress}</span>
          </p>
        </div>
      )}

      {/* Pronunciation note */}
      {showGuide && showPronunciationGuide && note && (
        <div className="mt-1 pl-3 border-l-2 border-amber-200">
          <p className="text-xs text-text-muted font-sans leading-relaxed">{note}</p>
        </div>
      )}
    </div>
  );
}
