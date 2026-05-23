import { useState } from 'react';
import type { Expression, ExpressionStatus, TTSSpeed } from '../../types';
import { STATUSES, STATUS_LABELS, TTS_SPEEDS } from '../../types';
import { speak } from '../../lib/tts';
import AudioButton from '../ui/AudioButton';

interface PronunciationViewProps {
  expressions: Expression[];
}

export default function PronunciationView({ expressions }: PronunciationViewProps) {
  const [statusFilter, setStatusFilter] = useState<ExpressionStatus | 'all'>('all');

  const filtered = statusFilter === 'all'
    ? expressions
    : expressions.filter((e) => e.status === statusFilter);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h2 className="text-3xl font-black m-0">Modo Pronunciaci&oacute;n</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ExpressionStatus | 'all')}
          className="px-4 py-2 border border-border-light rounded-xl bg-white text-sm font-semibold cursor-pointer"
        >
          <option value="all">Todos los estados</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && (
        <p className="text-text-muted text-center py-12">
          No hay expresiones con este filtro.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {filtered.map((expr) => (
          <PronunciationCard key={expr.id} expression={expr} />
        ))}
      </div>
    </div>
  );
}

function PronunciationCard({ expression }: { expression: Expression }) {
  const [activeSpeed, setActiveSpeed] = useState<TTSSpeed>('normal');

  const handleSpeedPlay = (speed: TTSSpeed) => {
    setActiveSpeed(speed);
    speak(expression.english, speed);
  };

  return (
    <div className="bg-white border border-border-light rounded-2xl p-6 flex gap-5 items-start">
      {/* Audio button */}
      <div className="shrink-0 pt-1">
        <AudioButton text={expression.english} size="lg" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold mb-1 leading-snug">
          {expression.english}
        </h3>
        <p className="text-text-muted text-sm mb-3">
          {expression.spanish_source}
        </p>

        {/* Pronunciation */}
        <code className="text-xl px-4 py-2 bg-surface rounded-lg font-mono inline-block mb-2">
          {expression.pronunciation_es}
        </code>

        {/* Stress */}
        <div className="text-2xl font-black tracking-wide mb-3">
          {expression.stress}
        </div>

        {/* Pronunciation note */}
        {expression.pronunciation_note && (
          <div className="bg-warning-bg border border-border-light rounded-xl px-4 py-3 text-sm mb-4">
            <span className="font-bold mr-1">Nota:</span>
            {expression.pronunciation_note}
          </div>
        )}

        {/* Speed controls */}
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(TTS_SPEEDS) as TTSSpeed[]).map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedPlay(speed)}
              className={`px-4 py-2 text-sm font-bold rounded-lg border cursor-pointer transition-colors ${
                activeSpeed === speed
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-text-muted border-border-light hover:border-accent'
              }`}
            >
              {TTS_SPEEDS[speed].label} {TTS_SPEEDS[speed].rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
