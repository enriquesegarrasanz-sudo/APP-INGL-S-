import { useState } from 'react';
import type { Expression, ExpressionStatus } from '../../types';
import { BLOCKS, STATUSES, STATUS_LABELS } from '../../types';
import Modal from '../ui/Modal';

interface ExpressionEditorProps {
  expression: Expression | null;
  onSave: (expr: Expression) => void;
  onClose: () => void;
}

const REGISTERS = ['formal', 'informal', 'neutral', 'slang', 'technical', 'academic'];

function createBlankExpression(): Expression {
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
  };
}

export default function ExpressionEditor({
  expression,
  onSave,
  onClose,
}: ExpressionEditorProps) {
  const [form, setForm] = useState<Expression>(
    expression ?? createBlankExpression()
  );

  const update = <K extends keyof Expression>(key: K, value: Expression[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.english.trim()) return;
    onSave(form);
  };

  const inputClasses =
    'w-full px-4 py-3 rounded-lg border border-border-light bg-input-bg text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors';
  const labelClasses =
    'block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5';
  const selectClasses =
    'w-full h-11 px-4 rounded-lg border border-border-light bg-input-bg text-sm text-text focus:outline-none focus:border-accent cursor-pointer';

  const isEditing = !!expression;

  return (
    <Modal
      title={isEditing ? 'Editar expresion' : 'Nueva expresion'}
      onClose={onClose}
      maxWidth="780px"
    >
      <div className="space-y-5">
        {/* Row 1: English + Spanish */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Expresion en ingles *</label>
            <input
              type="text"
              value={form.english}
              onChange={(e) => update('english', e.target.value)}
              placeholder="e.g. to be on the same page"
              className={inputClasses}
              autoFocus
            />
          </div>
          <div>
            <label className={labelClasses}>Fuente en espanol</label>
            <input
              type="text"
              value={form.spanish_source}
              onChange={(e) => update('spanish_source', e.target.value)}
              placeholder="Traduccion o fuente original"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Meaning */}
        <div>
          <label className={labelClasses}>Significado</label>
          <input
            type="text"
            value={form.meaning}
            onChange={(e) => update('meaning', e.target.value)}
            placeholder="Definicion / explicacion del significado"
            className={inputClasses}
          />
        </div>

        {/* Row 2: Pronunciation + Stress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Pronunciacion (espanolizada)</label>
            <input
              type="text"
              value={form.pronunciation_es}
              onChange={(e) => update('pronunciation_es', e.target.value)}
              placeholder="e.g. tu bi on de seim peich"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Acento / Stress</label>
            <input
              type="text"
              value={form.stress}
              onChange={(e) => update('stress', e.target.value)}
              placeholder="e.g. SAME page"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Pronunciation note */}
        <div>
          <label className={labelClasses}>Nota de pronunciacion</label>
          <input
            type="text"
            value={form.pronunciation_note}
            onChange={(e) => update('pronunciation_note', e.target.value)}
            placeholder="Advertencia o truco de pronunciacion"
            className={inputClasses}
          />
        </div>

        {/* Row 3: Register + Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Registro</label>
            <select
              value={form.register}
              onChange={(e) => update('register', e.target.value)}
              className={selectClasses}
            >
              {REGISTERS.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClasses}>Bloque</label>
            <select
              value={form.blocks[0] ?? ''}
              onChange={(e) => update('blocks', [e.target.value])}
              className={selectClasses}
            >
              {BLOCKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contexts */}
        <div>
          <label className={labelClasses}>Contextos (separados por coma)</label>
          <input
            type="text"
            value={form.contexts.join(', ')}
            onChange={(e) =>
              update(
                'contexts',
                e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            placeholder="e.g. meetings, email, presentations"
            className={inputClasses}
          />
        </div>

        {/* Examples */}
        <div>
          <label className={labelClasses}>Ejemplos (uno por linea)</label>
          <textarea
            value={form.examples.join('\n')}
            onChange={(e) =>
              update('examples', e.target.value.split('\n'))
            }
            rows={3}
            placeholder={"Let's make sure we're on the same page.\nWe need to get on the same page before the meeting."}
            className={`${inputClasses} resize-y`}
          />
        </div>

        {/* Common mistake */}
        <div>
          <label className={labelClasses}>Error comun</label>
          <input
            type="text"
            value={form.common_mistake}
            onChange={(e) => update('common_mistake', e.target.value)}
            placeholder="Error tipico de hispanohablantes"
            className={inputClasses}
          />
        </div>

        {/* Better alternatives */}
        <div>
          <label className={labelClasses}>
            Mejores alternativas (una por linea)
          </label>
          <textarea
            value={form.better_alternatives.join('\n')}
            onChange={(e) =>
              update('better_alternatives', e.target.value.split('\n'))
            }
            rows={2}
            placeholder="Alternativas mas naturales o apropiadas"
            className={`${inputClasses} resize-y`}
          />
        </div>

        {/* Tags */}
        <div>
          <label className={labelClasses}>Tags (separados por coma)</label>
          <input
            type="text"
            value={form.tags.join(', ')}
            onChange={(e) =>
              update(
                'tags',
                e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            placeholder="e.g. idiom, phrasal-verb, business"
            className={inputClasses}
          />
        </div>

        {/* Row 4: Status + Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Estado</label>
            <select
              value={form.status}
              onChange={(e) =>
                update('status', e.target.value as ExpressionStatus)
              }
              className={selectClasses}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClasses}>Dificultad (1-5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={form.difficulty}
              onChange={(e) =>
                update(
                  'difficulty',
                  Math.min(5, Math.max(1, parseInt(e.target.value) || 1))
                )
              }
              className={inputClasses}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={labelClasses}>Notas</label>
          <textarea
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            rows={3}
            placeholder="Notas personales, contexto adicional..."
            className={`${inputClasses} resize-y`}
          />
        </div>

        {/* Save / Cancel */}
        <div className="flex items-center justify-end gap-3 pt-5 border-t border-border-light">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-text-muted bg-surface border border-border-light rounded-xl hover:bg-accent-bg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!form.english.trim()}
            className="px-5 py-2.5 text-sm font-bold text-white bg-accent border-none rounded-xl shadow-btn hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Guardar cambios' : 'Crear expresion'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
