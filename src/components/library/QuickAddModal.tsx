import { useState } from 'react';
import type { Expression } from '../../types';
import { BLOCKS } from '../../types';
import { autoFillExpression } from '../../lib/ai/provider';
import Modal from '../ui/Modal';
import AudioButton from '../ui/AudioButton';

interface QuickAddModalProps {
  onSave: (expr: Expression) => void;
  onClose: () => void;
}

async function freeTranslate(text: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`
    );
    const data = await res.json();
    return data?.responseData?.translatedText || null;
  } catch {
    return null;
  }
}

function createBlankExpression(overrides: Partial<Expression> = {}): Expression {
  return {
    id: crypto.randomUUID(),
    english: '',
    spanish_source: '',
    meaning: '',
    pronunciation_es: '',
    stress: '',
    pronunciation_note: '',
    register: '',
    contexts: [],
    blocks: [BLOCKS[0]],
    related_ids: [],
    examples: [],
    common_mistake: '',
    better_alternatives: [],
    status: 'new',
    difficulty: 1,
    tags: [],
    last_practiced: null,
    notes: '',
    ease_factor: 2.5,
    interval: 0,
    repetitions: 0,
    next_review: null,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

export default function QuickAddModal({ onSave, onClose }: QuickAddModalProps) {
  const [english, setEnglish] = useState('');
  const [loading, setLoading] = useState(false);
  const [filled, setFilled] = useState(false);
  const [error, setError] = useState('');

  // Editable fields after AI fill
  const [spanish, setSpanish] = useState('');
  const [meaning, setMeaning] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [stress, setStress] = useState('');
  const [examples, setExamples] = useState<string[]>([]);
  const [commonMistake, setCommonMistake] = useState('');
  const [pronunciationNote, setPronunciationNote] = useState('');
  const [block, setBlock] = useState<string>(BLOCKS[0]);

  const handleAutoFill = async () => {
    if (!english.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await autoFillExpression(english.trim());
      if (result) {
        setSpanish(result.spanish_source);
        setMeaning(result.meaning);
        setPronunciation(result.pronunciation_es);
        setStress(result.stress);
        setExamples(result.examples);
        setCommonMistake(result.common_mistake);
        setPronunciationNote(result.pronunciation_note);
        if (result.blocks?.[0]) setBlock(result.blocks[0]);
        setFilled(true);
      } else {
        setError('No se pudo conectar con la IA. Asegurate de tener Ollama corriendo o una API key de DeepSeek configurada.');
      }
    } catch {
      setError('Error al conectar con la IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslateOnly = async () => {
    if (!english.trim()) return;
    setLoading(true);
    setError('');
    try {
      const translation = await freeTranslate(english.trim());
      if (translation) {
        setSpanish(translation);
        setFilled(true);
      } else {
        setError('No se pudo obtener la traduccion.');
      }
    } catch {
      setError('Error al traducir.');
    } finally {
      setLoading(false);
    }
  };

  const handleManual = () => {
    if (!english.trim()) return;
    setFilled(true);
  };

  const handleSave = () => {
    if (!english.trim()) return;
    const expr = createBlankExpression({
      english: english.trim(),
      spanish_source: spanish,
      meaning,
      pronunciation_es: pronunciation,
      stress,
      examples: examples.filter((e) => e.trim()),
      common_mistake: commonMistake,
      pronunciation_note: pronunciationNote,
      blocks: [block],
    });
    onSave(expr);
  };

  const inputClasses =
    'w-full px-4 py-3 rounded-lg border border-border-light bg-input-bg text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors';

  return (
    <Modal title="Expresion rapida" onClose={onClose} maxWidth="600px">
      <div className="space-y-5">
        {/* English input */}
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
            Expresion en ingles
          </label>
          <input
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="e.g. to be on the same page"
            className={inputClasses}
            autoFocus
            disabled={loading}
          />
        </div>

        {/* Action buttons */}
        {!filled && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAutoFill}
              disabled={loading || !english.trim()}
              className="flex-1 px-4 py-3 text-sm font-bold text-white bg-accent border-none rounded-xl shadow-btn hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando...
                </span>
              ) : (
                'Auto-fill con IA'
              )}
            </button>
            <button
              onClick={handleTranslateOnly}
              disabled={loading || !english.trim()}
              className="flex-1 px-4 py-3 text-sm font-bold text-accent bg-surface border border-border-light rounded-xl hover:bg-accent-bg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Solo traducir
            </button>
            <button
              onClick={handleManual}
              disabled={loading || !english.trim()}
              className="flex-1 px-4 py-3 text-sm font-bold text-text-muted bg-surface border border-border-light rounded-xl hover:bg-accent-bg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Manual
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-danger-bg border border-border-light rounded-lg px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Editable fields after fill */}
        {filled && (
          <div className="space-y-4 pt-2 border-t border-border-light">
            {/* Spanish */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Traduccion / Fuente en espanol
              </label>
              <input
                type="text"
                value={spanish}
                onChange={(e) => setSpanish(e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Meaning */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Significado
              </label>
              <input
                type="text"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Pronunciation + Audio */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Pronunciacion
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={pronunciation}
                  onChange={(e) => setPronunciation(e.target.value)}
                  className={`${inputClasses} flex-1`}
                />
                {english.trim() && (
                  <AudioButton text={english} size="sm" showSpeedControl />
                )}
              </div>
            </div>

            {/* Stress */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Acento / Stress
              </label>
              <input
                type="text"
                value={stress}
                onChange={(e) => setStress(e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Examples */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Ejemplos (uno por linea)
              </label>
              <textarea
                value={examples.join('\n')}
                onChange={(e) =>
                  setExamples(e.target.value.split('\n'))
                }
                rows={3}
                className={`${inputClasses} resize-y`}
              />
              {examples.filter((e) => e.trim()).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {examples
                    .filter((e) => e.trim())
                    .map((ex, i) => (
                      <AudioButton key={i} text={ex} size="sm" />
                    ))}
                </div>
              )}
            </div>

            {/* Common mistake */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Error comun
              </label>
              <input
                type="text"
                value={commonMistake}
                onChange={(e) => setCommonMistake(e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Pronunciation note */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Nota de pronunciacion
              </label>
              <input
                type="text"
                value={pronunciationNote}
                onChange={(e) => setPronunciationNote(e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Block selector */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Bloque
              </label>
              <select
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-border-light bg-input-bg text-sm text-text focus:outline-none focus:border-accent cursor-pointer"
              >
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Save / Cancel */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-bold text-text-muted bg-surface border border-border-light rounded-xl hover:bg-accent-bg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!english.trim()}
                className="px-5 py-2.5 text-sm font-bold text-white bg-accent border-none rounded-xl shadow-btn hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
