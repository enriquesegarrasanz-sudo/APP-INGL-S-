import { useState } from 'react';
import type { ParallelScript, ScriptBlock } from '../../types';
import { generateId } from '../../lib/utils';
import Modal from '../ui/Modal';

interface ScriptEditorProps {
  script: ParallelScript | null;
  onSave: (s: ParallelScript) => void;
  onClose: () => void;
}

function emptyBlock(): ScriptBlock {
  return {
    spanish: '',
    english: '',
    pronunciation: '',
    key_expressions: [],
    mistakes_to_avoid: [],
  };
}

export default function ScriptEditor({ script, onSave, onClose }: ScriptEditorProps) {
  const [title, setTitle] = useState(script?.title || '');
  const [blocks, setBlocks] = useState<ScriptBlock[]>(
    script?.blocks?.length ? script.blocks : [emptyBlock()]
  );

  const updateBlock = (index: number, field: keyof ScriptBlock, value: string | string[]) => {
    setBlocks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  };

  const addBlock = () => {
    setBlocks((prev) => [...prev, emptyBlock()]);
  };

  const removeBlock = (index: number) => {
    if (blocks.length <= 1) return;
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const saved: ParallelScript = {
      id: script?.id || generateId(title + '-' + Date.now()),
      title: title.trim(),
      blocks,
      created_at: script?.created_at || new Date().toISOString(),
    };
    onSave(saved);
  };

  return (
    <Modal
      title={script ? 'Editar script' : 'Nuevo script'}
      onClose={onClose}
      maxWidth="800px"
    >
      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-text-muted mb-2">
          T&iacute;tulo
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nombre del script..."
          className="w-full px-4 py-3 border border-border-light rounded-xl text-base bg-input-bg focus:outline-none focus:border-accent"
        />
      </div>

      {/* Blocks */}
      <div className="flex flex-col gap-6 mb-6">
        {blocks.map((block, idx) => (
          <div
            key={idx}
            className="border border-border-light rounded-xl p-5 bg-surface/30"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-text-muted">
                Bloque {idx + 1}
              </span>
              {blocks.length > 1 && (
                <button
                  onClick={() => removeBlock(idx)}
                  className="text-sm text-danger cursor-pointer bg-transparent border-none hover:underline"
                >
                  Eliminar bloque
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1">
                  Espa&ntilde;ol
                </label>
                <textarea
                  value={block.spanish}
                  onChange={(e) => updateBlock(idx, 'spanish', e.target.value)}
                  placeholder="Texto en espa&ntilde;ol..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border-light rounded-lg text-sm bg-white resize-y focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1">
                  English
                </label>
                <textarea
                  value={block.english}
                  onChange={(e) => updateBlock(idx, 'english', e.target.value)}
                  placeholder="English text..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border-light rounded-lg text-sm bg-white resize-y focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-text-muted mb-1">
                Pronunciaci&oacute;n
              </label>
              <textarea
                value={block.pronunciation}
                onChange={(e) => updateBlock(idx, 'pronunciation', e.target.value)}
                placeholder="Gu&iacute;a de pronunciaci&oacute;n..."
                rows={2}
                className="w-full px-3 py-2 border border-border-light rounded-lg text-sm bg-white resize-y focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1">
                  Expresiones clave (separadas por coma)
                </label>
                <input
                  type="text"
                  value={block.key_expressions.join(', ')}
                  onChange={(e) =>
                    updateBlock(
                      idx,
                      'key_expressions',
                      e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="expression one, expression two..."
                  className="w-full px-3 py-2 border border-border-light rounded-lg text-sm bg-white focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1">
                  Errores a evitar (separados por coma)
                </label>
                <input
                  type="text"
                  value={block.mistakes_to_avoid.join(', ')}
                  onChange={(e) =>
                    updateBlock(
                      idx,
                      'mistakes_to_avoid',
                      e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="mistake one, mistake two..."
                  className="w-full px-3 py-2 border border-border-light rounded-lg text-sm bg-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addBlock}
        className="w-full py-3 border-2 border-dashed border-border-light rounded-xl text-sm font-bold text-text-muted cursor-pointer bg-transparent hover:border-accent hover:text-accent transition-colors mb-8"
      >
        + A&ntilde;adir bloque
      </button>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-6 py-3 text-sm font-bold text-text-muted bg-surface border border-border-light rounded-xl cursor-pointer hover:border-accent transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="px-8 py-3 text-sm font-bold text-white bg-accent border-none rounded-xl cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Guardar
        </button>
      </div>
    </Modal>
  );
}
