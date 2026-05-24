import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { TTS_SPEEDS } from '../../types';
import { speak } from '../../lib/tts';
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

type ActiveGuide = {
  kind: 'phrase' | 'word';
  text: string;
  pronunciation: string;
};

interface Token {
  raw: string;
  speakText: string;
  wordIndex: number | null;
}

function getTokens(text: string): Token[] {
  let wordIndex = 0;

  return text.split(/(\s+)/).map((raw) => {
    const speakText = raw.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, '');
    if (!/[A-Za-z0-9]/.test(speakText)) {
      return { raw, speakText: '', wordIndex: null };
    }

    const token = { raw, speakText, wordIndex };
    wordIndex += 1;
    return token;
  });
}

function getPronunciationForWord(pronunciation: string | undefined, wordIndex: number): string {
  if (!pronunciation) return '';

  const parts = pronunciation
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts[wordIndex] ?? pronunciation;
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
  const [activeGuide, setActiveGuide] = useState<ActiveGuide | null>(null);
  const tokens = useMemo(() => getTokens(text), [text]);

  const guideVisible = showGuide && showPronunciationGuide && activeGuide !== null;

  const handleSpeak = (
    event: MouseEvent<HTMLButtonElement>,
    spokenText: string,
    nextGuide: ActiveGuide
  ) => {
    event.stopPropagation();
    setActiveGuide(nextGuide);
    speak(spokenText, speed).catch(() => undefined);
  };

  return (
    <div className={className}>
      <button
        type="button"
        data-speakable-kind="phrase"
        onClick={(event) =>
          handleSpeak(event, text, {
            kind: 'phrase',
            text,
            pronunciation,
          })
        }
        title={`Escuchar a velocidad ${TTS_SPEEDS[speed].label.toLowerCase()}`}
        className={`inline text-left bg-transparent border-none p-0 cursor-pointer hover:text-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${phraseClassName}`}
      >
        {text}
      </button>

      {showWords && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {tokens.map((token, index) => {
            if (token.wordIndex === null) {
              return (
                <span key={`${token.raw}-${index}`} className="text-text-muted">
                  {token.raw}
                </span>
              );
            }

            return (
              <button
                key={`${token.raw}-${index}`}
                type="button"
                data-speakable-kind="word"
                onClick={(event) =>
                  handleSpeak(event, token.speakText, {
                    kind: 'word',
                    text: token.speakText,
                    pronunciation: getPronunciationForWord(
                      pronunciation,
                      token.wordIndex ?? 0
                    ),
                  })
                }
                className="px-2.5 py-1 text-xs sm:text-sm font-semibold text-text bg-surface border border-border-light rounded-lg hover:border-accent hover:bg-accent-bg cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {token.raw}
              </button>
            );
          })}
        </div>
      )}

      {guideVisible && activeGuide && (
        <div className="mt-3 border-l-2 border-accent pl-3 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-text-muted">
              {activeGuide.kind === 'phrase' ? 'Frase' : 'Palabra'}
            </span>
            <span className="text-sm font-bold text-text">{activeGuide.text}</span>
          </div>

          {activeGuide.pronunciation && (
            <code className="inline-block mt-1 text-sm font-mono text-text bg-surface px-2 py-1 rounded-md">
              {activeGuide.pronunciation}
            </code>
          )}

          {activeGuide.kind === 'phrase' && stress && (
            <p className="mt-1 mb-0 text-xs font-bold text-text-muted">
              Acento: <span className="text-text">{stress}</span>
            </p>
          )}

          {activeGuide.kind === 'phrase' && note && (
            <p className="mt-1 mb-0 text-sm text-text-muted leading-relaxed">
              {note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
