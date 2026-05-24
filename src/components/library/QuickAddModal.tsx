import { useMemo, useState } from 'react';
import type { Expression } from '../../types';
import { BLOCKS } from '../../types';
import { autoFillExpression } from '../../lib/ai/provider';
import Modal from '../ui/Modal';
import AudioButton from '../ui/AudioButton';

type CaptureMode = 'auto' | 'spanish' | 'english';
type DetectedLanguage = 'spanish' | 'english' | 'mixed' | 'unknown';

interface QuickAddModalProps {
  existingExpressions: Expression[];
  onSave: (expr: Expression) => void;
  onClose: () => void;
}

const MODE_LABELS: Record<CaptureMode, string> = {
  auto: 'Detectar automaticamente',
  spanish: 'Castellano -> ingles',
  english: 'Ingles -> castellano',
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function detectLanguage(text: string, mode: CaptureMode): DetectedLanguage {
  if (mode === 'spanish') return 'spanish';
  if (mode === 'english') return 'english';

  const normalized = normalizeText(text);
  if (!normalized) return 'unknown';

  const spanishSignals = [
    'el',
    'la',
    'los',
    'las',
    'un',
    'una',
    'de',
    'en',
    'con',
    'sin',
    'no',
    'se',
    'me',
    'te',
    'lo',
    'que',
    'como',
    'para',
    'pero',
    'porque',
    'quiero',
    'necesito',
    'tengo',
    'hacer',
    'esto',
    'esta',
    'este',
    'soy',
    'estoy',
    'escena',
    'termina',
    'funcionar',
    'sentido',
  ];
  const englishSignals = [
    'i',
    'you',
    'we',
    'it',
    'is',
    'be',
    'on',
    'in',
    'the',
    'to',
    'with',
    'that',
    'this',
    'make',
    'need',
    'want',
    'have',
    'get',
    'take',
    'work',
    'feel',
    'about',
  ];
  const spanishScore = spanishSignals.filter((signal) => normalized.split(' ').includes(signal)).length;
  const englishScore = englishSignals.filter((signal) => normalized.split(' ').includes(signal)).length;

  if (/[ñ¿¡]/i.test(text) || spanishScore > englishScore) return 'spanish';
  if (englishScore > spanishScore) return 'english';
  return 'unknown';
}

async function freeTranslate(text: string, sourceLanguage: DetectedLanguage): Promise<string | null> {
  const langpair = sourceLanguage === 'spanish' ? 'es|en' : 'en|es';

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`
    );
    const data = await res.json();
    return data?.responseData?.translatedText || null;
  } catch {
    return null;
  }
}

function sanitizeList(values: unknown, fallback: string[] = []): string[] {
  return Array.isArray(values)
    ? values.map((value) => String(value).trim()).filter(Boolean)
    : fallback;
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
    register: 'neutral',
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

export default function QuickAddModal({
  existingExpressions,
  onSave,
  onClose,
}: QuickAddModalProps) {
  const [sourceText, setSourceText] = useState('');
  const [mode, setMode] = useState<CaptureMode>('auto');
  const [detectedLanguage, setDetectedLanguage] = useState<DetectedLanguage>('unknown');
  const [loading, setLoading] = useState(false);
  const [filled, setFilled] = useState(false);
  const [error, setError] = useState('');

  const [english, setEnglish] = useState('');
  const [spanish, setSpanish] = useState('');
  const [meaning, setMeaning] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [stress, setStress] = useState('');
  const [pronunciationNote, setPronunciationNote] = useState('');
  const [register, setRegister] = useState('neutral');
  const [contexts, setContexts] = useState<string[]>([]);
  const [examples, setExamples] = useState<string[]>([]);
  const [commonMistake, setCommonMistake] = useState('');
  const [betterAlternatives, setBetterAlternatives] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<string[]>([BLOCKS[0]]);

  const duplicateMatches = useMemo(() => {
    const source = normalizeText(sourceText);
    const englishText = normalizeText(english);
    const spanishText = normalizeText(spanish);
    const candidates = new Set([source, englishText, spanishText].filter((value) => value.length > 2));

    return existingExpressions
      .filter((expression) => {
        const existingEnglish = normalizeText(expression.english);
        const existingSpanish = normalizeText(expression.spanish_source);
        return [...candidates].some(
          (candidate) =>
            candidate === existingEnglish ||
            candidate === existingSpanish ||
            existingEnglish.includes(candidate) ||
            existingSpanish.includes(candidate)
        );
      })
      .slice(0, 3);
  }, [existingExpressions, sourceText, english, spanish]);

  const currentLanguage = detectLanguage(sourceText, mode);

  const applyAIResult = (result: Awaited<ReturnType<typeof autoFillExpression>>) => {
    if (!result) return;

    const validBlocks = sanitizeList(result.blocks).filter((block) =>
      BLOCKS.includes(block as (typeof BLOCKS)[number])
    );

    setEnglish(result.english || sourceText);
    setSpanish(result.spanish_source || sourceText);
    setMeaning(result.meaning || '');
    setPronunciation(result.pronunciation_es || '');
    setStress(result.stress || '');
    setPronunciationNote(result.pronunciation_note || '');
    setRegister(result.register || 'neutral');
    setContexts(sanitizeList(result.contexts));
    setExamples(sanitizeList(result.examples));
    setCommonMistake(result.common_mistake || '');
    setBetterAlternatives(sanitizeList(result.better_alternatives));
    setTags(sanitizeList(result.tags));
    setBlocks(validBlocks.length > 0 ? validBlocks : [BLOCKS[0]]);
    setDetectedLanguage(result.detected_language ?? currentLanguage);
    setFilled(true);
  };

  const handleAutoFill = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    setError('');
    setDetectedLanguage(currentLanguage);

    try {
      const result = await autoFillExpression(sourceText.trim(), mode);
      if (result) {
        applyAIResult(result);
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
    if (!sourceText.trim()) return;
    setLoading(true);
    setError('');

    const language = currentLanguage === 'unknown' ? 'spanish' : currentLanguage;
    setDetectedLanguage(language);

    try {
      const translation = await freeTranslate(sourceText.trim(), language);
      if (translation) {
        if (language === 'spanish') {
          setSpanish(sourceText.trim());
          setEnglish(translation);
        } else {
          setEnglish(sourceText.trim());
          setSpanish(translation);
        }
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
    if (!sourceText.trim()) return;

    const language = currentLanguage === 'unknown' ? 'spanish' : currentLanguage;
    setDetectedLanguage(language);
    if (language === 'spanish') {
      setSpanish(sourceText.trim());
      setEnglish('');
    } else {
      setEnglish(sourceText.trim());
      setSpanish('');
    }
    setFilled(true);
  };

  const handleSave = () => {
    if (!english.trim()) return;
    const expr = createBlankExpression({
      english: english.trim(),
      spanish_source: spanish.trim(),
      meaning: meaning.trim(),
      pronunciation_es: pronunciation.trim(),
      stress: stress.trim(),
      pronunciation_note: pronunciationNote.trim(),
      register: register.trim() || 'neutral',
      contexts: contexts.filter((context) => context.trim()),
      examples: examples.filter((example) => example.trim()),
      common_mistake: commonMistake.trim(),
      better_alternatives: betterAlternatives.filter((alternative) => alternative.trim()),
      blocks,
      tags: tags.filter((tag) => tag.trim()),
    });
    onSave(expr);
  };

  const toggleBlock = (block: string, checked: boolean) => {
    const nextBlocks = checked
      ? [...blocks, block]
      : blocks.filter((currentBlock) => currentBlock !== block);
    setBlocks(nextBlocks.length > 0 ? nextBlocks : [block]);
  };

  const inputClasses =
    'w-full px-4 py-3 rounded-lg border border-border-light bg-input-bg text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors';
  const labelClasses = 'block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5';

  return (
    <Modal title="Anadir vocabulario" onClose={onClose} maxWidth="760px">
      <div className="space-y-5">
        <div>
          <label className={labelClasses}>Texto o expresion</label>
          <textarea
            value={sourceText}
            onChange={(event) => {
              setSourceText(event.target.value);
              setDetectedLanguage(detectLanguage(event.target.value, mode));
            }}
            placeholder="Ej: esto no termina de funcionar / to be on the same page"
            className={`${inputClasses} resize-y`}
            rows={3}
            autoFocus
            disabled={loading}
          />
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <select
              value={mode}
              onChange={(event) => {
                const nextMode = event.target.value as CaptureMode;
                setMode(nextMode);
                setDetectedLanguage(detectLanguage(sourceText, nextMode));
              }}
              className="h-10 px-3 rounded-lg border border-border-light bg-input-bg text-sm text-text focus:outline-none focus:border-accent cursor-pointer"
            >
              {Object.entries(MODE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <span className="text-xs font-semibold text-text-muted">
              Idioma detectado: {detectedLanguage === 'unknown' ? 'pendiente' : detectedLanguage}
            </span>
          </div>
        </div>

        {!filled && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAutoFill}
              disabled={loading || !sourceText.trim()}
              className="flex-1 px-4 py-3 text-sm font-bold text-white bg-accent border-none rounded-xl shadow-btn hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando...
                </span>
              ) : (
                'Analizar con IA'
              )}
            </button>
            <button
              onClick={handleTranslateOnly}
              disabled={loading || !sourceText.trim()}
              className="flex-1 px-4 py-3 text-sm font-bold text-accent bg-surface border border-border-light rounded-xl hover:bg-accent-bg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Solo traducir
            </button>
            <button
              onClick={handleManual}
              disabled={loading || !sourceText.trim()}
              className="flex-1 px-4 py-3 text-sm font-bold text-text-muted bg-surface border border-border-light rounded-xl hover:bg-accent-bg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Manual
            </button>
          </div>
        )}

        {error && (
          <div className="bg-danger-bg border border-border-light rounded-lg px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {duplicateMatches.length > 0 && (
          <div className="bg-surface border border-border-light rounded-xl px-4 py-3">
            <p className="text-sm font-bold text-text m-0 mb-2">Puede que ya exista una ficha parecida</p>
            <div className="space-y-1">
              {duplicateMatches.map((expression) => (
                <p key={expression.id} className="text-sm text-text-muted m-0">
                  {expression.english} - {expression.spanish_source}
                </p>
              ))}
            </div>
          </div>
        )}

        {filled && (
          <div className="space-y-4 pt-2 border-t border-border-light">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Ingles natural *</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={english}
                    onChange={(event) => setEnglish(event.target.value)}
                    className={`${inputClasses} flex-1`}
                  />
                  {english.trim() && <AudioButton text={english} size="sm" showSpeedControl />}
                </div>
              </div>
              <div>
                <label className={labelClasses}>Fuente en espanol</label>
                <input
                  type="text"
                  value={spanish}
                  onChange={(event) => setSpanish(event.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Significado</label>
              <input
                type="text"
                value={meaning}
                onChange={(event) => setMeaning(event.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>Pronunciacion</label>
                <input
                  type="text"
                  value={pronunciation}
                  onChange={(event) => setPronunciation(event.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Acento / Stress</label>
                <input
                  type="text"
                  value={stress}
                  onChange={(event) => setStress(event.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Registro</label>
                <input
                  type="text"
                  value={register}
                  onChange={(event) => setRegister(event.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Nota de pronunciacion</label>
              <input
                type="text"
                value={pronunciationNote}
                onChange={(event) => setPronunciationNote(event.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Bloques</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto rounded-lg border border-border-light bg-input-bg p-3">
                {BLOCKS.map((block) => (
                  <label key={block} className="flex items-center gap-2 text-sm font-semibold text-text cursor-pointer">
                    <input
                      type="checkbox"
                      checked={blocks.includes(block)}
                      onChange={(event) => toggleBlock(block, event.target.checked)}
                      className="w-4 h-4 accent-accent"
                    />
                    <span>{block}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClasses}>Contextos (separados por coma)</label>
              <input
                type="text"
                value={contexts.join(', ')}
                onChange={(event) =>
                  setContexts(event.target.value.split(',').map((value) => value.trim()).filter(Boolean))
                }
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Ejemplos (uno por linea)</label>
              <textarea
                value={examples.join('\n')}
                onChange={(event) => setExamples(event.target.value.split('\n'))}
                rows={3}
                className={`${inputClasses} resize-y`}
              />
            </div>

            <div>
              <label className={labelClasses}>Error comun</label>
              <input
                type="text"
                value={commonMistake}
                onChange={(event) => setCommonMistake(event.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Alternativas mejores (una por linea)</label>
              <textarea
                value={betterAlternatives.join('\n')}
                onChange={(event) => setBetterAlternatives(event.target.value.split('\n'))}
                rows={2}
                className={`${inputClasses} resize-y`}
              />
            </div>

            <div>
              <label className={labelClasses}>Tags (separados por coma)</label>
              <input
                type="text"
                value={tags.join(', ')}
                onChange={(event) =>
                  setTags(event.target.value.split(',').map((value) => value.trim()).filter(Boolean))
                }
                className={inputClasses}
              />
            </div>

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
