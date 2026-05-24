import { useState } from 'react';
import type { Expression, ReviewSession } from '../../types';
import { THEME_BLOCKS } from '../../types';
import type { ReviewQuality } from '../../types';
import { QUALITY_LABELS } from '../../lib/spaced-repetition';
import AudioButton from '../ui/AudioButton';

interface FlashcardViewProps {
  getDueCountForBlock: (blockFilter: string | null) => number;
  currentSession: ReviewSession | null;
  currentCard: Expression | null;
  cardIndex: number;
  totalCards: number;
  isFlipped: boolean;
  startSession: (batchSize?: number, blockFilter?: string | null) => void;
  flipCard: () => void;
  rateCard: (quality: ReviewQuality) => void;
  endSession: () => void;
}

export default function FlashcardView({
  getDueCountForBlock,
  currentSession,
  currentCard,
  cardIndex,
  totalCards,
  isFlipped,
  startSession,
  flipCard,
  rateCard,
  endSession,
}: FlashcardViewProps) {
  const [batchSize, setBatchSize] = useState(10);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const batchOptions = [5, 10, 15, 20];
  const selectedDueCount = getDueCountForBlock(selectedBlock);

  // State D: Session complete
  if (currentSession && currentSession.completed_at) {
    const reviewed = currentSession.cards_reviewed;
    const correct = currentSession.correct_count;
    const pct = reviewed > 0 ? Math.round((correct / reviewed) * 100) : 0;

    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="text-5xl mb-6">
          {pct >= 80 ? '✨' : pct >= 50 ? '💪' : '📚'}
        </div>
        <h2 className="text-3xl font-black mb-2">Repaso completado</h2>
        <p className="text-text-muted text-lg mb-10">
          Buen trabajo. Sigue as&iacute;.
        </p>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10">
          <div className="bg-surface rounded-xl p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-black">{reviewed}</div>
            <div className="text-sm text-text-muted mt-1">Tarjetas</div>
          </div>
          <div className="bg-success-bg rounded-xl p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-black text-success">{correct}</div>
            <div className="text-sm text-text-muted mt-1">Correctas</div>
          </div>
          <div className="rounded-xl p-4 sm:p-6" style={{ background: pct >= 70 ? 'var(--color-success-bg)' : 'var(--color-warning-bg)' }}>
            <div className="text-2xl sm:text-3xl font-black">{pct}%</div>
            <div className="text-sm text-text-muted mt-1">Acierto</div>
          </div>
        </div>

        <button
          onClick={endSession}
          className="px-8 py-3 bg-accent text-white rounded-xl font-bold text-lg cursor-pointer border-none hover:opacity-90 transition-opacity"
        >
          Volver
        </button>
      </div>
    );
  }

  // State B & C: Session active
  if (currentSession && currentCard) {
    const progress = totalCards > 0 ? ((cardIndex + 1) / totalCards) * 100 : 0;

    return (
      <div className="max-w-2xl mx-auto py-8">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-text-muted">
            {cardIndex + 1} / {totalCards}
          </span>
          <button
            onClick={endSession}
            className="text-sm text-text-muted hover:text-danger cursor-pointer bg-transparent border-none"
          >
            Terminar
          </button>
        </div>
        <div className="w-full h-2 bg-surface rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Card */}
        <div className="bg-white border border-border-light rounded-2xl shadow-sm min-h-[280px] sm:min-h-[340px] flex flex-col items-center justify-center p-5 sm:p-10 text-center">
          {!isFlipped ? (
            /* State B: Not flipped - Spanish side */
            <>
              <p className="text-sm text-text-muted mb-4 tracking-wide uppercase">
                Intenta decirlo en ingl&eacute;s...
              </p>
              <h2 className="text-3xl font-black mb-8 leading-snug">
                {currentCard.spanish_source}
              </h2>
              <button
                onClick={flipCard}
                className="px-10 py-4 bg-accent text-white rounded-xl font-bold text-lg cursor-pointer border-none hover:opacity-90 transition-opacity"
              >
                Mostrar respuesta
              </button>
            </>
          ) : (
            /* State C: Flipped - both sides */
            <>
              <p className="text-text-muted text-lg mb-2">
                {currentCard.spanish_source}
              </p>
              <h2 className="text-3xl font-black mb-4 leading-snug">
                {currentCard.english}
              </h2>

              {/* Pronunciation details */}
              <div className="flex flex-col items-center gap-2 mb-6">
                <code className="text-lg px-4 py-1.5 bg-surface rounded-lg font-mono">
                  {currentCard.pronunciation_es}
                </code>
                <span className="text-2xl font-black tracking-wide">
                  {currentCard.stress}
                </span>
                <div className="mt-1">
                  <AudioButton text={currentCard.english} size="md" showSpeedControl />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Rating buttons - only when flipped */}
        {isFlipped && (
          <div className="grid grid-cols-2 gap-2 mt-6 sm:grid-cols-3 lg:grid-cols-6">
            {([0, 1, 2, 3, 4, 5] as ReviewQuality[]).map((q) => {
              const info = QUALITY_LABELS[q];
              return (
                <button
                  key={q}
                  onClick={() => rateCard(q)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-border-light cursor-pointer bg-white hover:shadow-md transition-all text-center"
                  style={{
                    borderColor: info.color,
                    color: info.color,
                  }}
                >
                  <span className="text-lg font-black">{info.label}</span>
                  <span className="text-[11px] leading-tight opacity-70">
                    {info.description}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // State A: No session active - Dashboard
  return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <h2 className="text-3xl font-black mb-2">Repaso espaciado</h2>
      <p className="text-text-muted text-lg mb-10">
        Sistema SM-2 &mdash; el mismo algoritmo que Anki
      </p>

      <div className="bg-white border border-border-light rounded-2xl p-6 sm:p-10 mb-6 sm:mb-8 shadow-sm">
        <div className="text-6xl font-black mb-2">{selectedDueCount}</div>
        <div className="text-text-muted text-lg">
          {selectedDueCount === 1 ? 'tarjeta pendiente' : 'tarjetas pendientes'}
        </div>
      </div>

      <div className="mb-6 text-left">
        <label htmlFor="review-block" className="block text-sm font-bold text-text-muted mb-2">
          Tema
        </label>
        <select
          id="review-block"
          value={selectedBlock ?? 'all'}
          onChange={(event) => setSelectedBlock(event.target.value === 'all' ? null : event.target.value)}
          className="w-full px-4 py-3 bg-white border border-border-light rounded-xl text-sm font-semibold text-text cursor-pointer focus:outline-none focus:border-accent"
        >
          <option value="all">Todos</option>
          {THEME_BLOCKS.map((block) => (
            <option key={block.id} value={block.label}>
              {block.label_es}
            </option>
          ))}
        </select>
      </div>

      {selectedDueCount > 0 && (
        <>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-sm text-text-muted">Lote de</span>
            <div className="flex gap-1">
              {batchOptions.map((n) => (
                <button
                  key={n}
                  onClick={() => setBatchSize(n)}
                  className={`px-3 py-1.5 text-sm font-bold rounded-lg border cursor-pointer transition-colors ${
                    batchSize === n
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-text-muted border-border-light hover:border-accent'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <span className="text-sm text-text-muted">tarjetas</span>
          </div>

          <button
            onClick={() => startSession(batchSize, selectedBlock)}
            className="px-12 py-4 bg-accent text-white rounded-xl font-bold text-xl cursor-pointer border-none hover:opacity-90 transition-opacity"
          >
            Empezar repaso
          </button>
        </>
      )}

      {selectedDueCount === 0 && (
        <p className="text-text-muted">
          No hay tarjetas pendientes. Vuelve m&aacute;s tarde o a&ntilde;ade
          nuevas expresiones.
        </p>
      )}
    </div>
  );
}
