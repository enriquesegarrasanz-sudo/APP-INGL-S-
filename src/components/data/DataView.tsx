import { useState, useRef } from 'react';
import type { Expression, ParallelScript } from '../../types';
import { STATUS_LABELS } from '../../types';
import { downloadFile, formatDate } from '../../lib/utils';
import {
  exportAllData,
  isCloudConfigured,
  getLastSyncTime,
  syncFromCloud,
} from '../../lib/storage';

interface DataViewProps {
  expressions: Expression[];
  scripts: ParallelScript[];
  onImport: (data: { expressions?: Expression[]; scripts?: ParallelScript[] }) => void;
  copyText: (text: string, label?: string) => void;
}

export default function DataView({
  expressions,
  scripts,
  onImport,
  copyText,
}: DataViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [syncing, setSyncing] = useState(false);

  const activeCount = expressions.filter((e) => e.status === 'active').length;
  const learningCount = expressions.filter((e) => e.status === 'learning').length;
  const blockCount = scripts.reduce((sum, s) => sum + s.blocks.length, 0);
  const cloudConfigured = isCloudConfigured();
  const lastSync = getLastSyncTime();

  const handleExportJson = () => {
    const data = exportAllData();
    downloadFile(
      JSON.stringify(data, null, 2),
      `sparring-english-${new Date().toISOString().slice(0, 10)}.json`,
      'application/json'
    );
  };

  const handleExportMarkdown = () => {
    const active = expressions.filter((e) => e.status === 'active');
    const lines = active.map(
      (e) =>
        `### ${e.english}\n- **Fuente:** ${e.spanish_source}\n- **Significado:** ${e.meaning}\n- **Pronunciación:** \`${e.pronunciation_es}\` (**${e.stress}**)\n- **Registro:** ${e.register}\n- **Contextos:** ${e.contexts.join(', ')}\n- **Ejemplos:** ${e.examples.join('; ')}\n- **Error común:** ${e.common_mistake}\n`
    );
    const md = `# Sparring English — Expresiones activas\n\n${lines.join('\n---\n\n')}`;
    downloadFile(md, `sparring-active-${new Date().toISOString().slice(0, 10)}.md`, 'text/markdown');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        onImport(data);
      } catch {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCloudSync = async () => {
    setSyncing(true);
    try {
      const result = await syncFromCloud();
      if (result) {
        onImport(result);
        copyText('Sincronizado desde la nube', 'Sincronizado');
      } else {
        copyText('No se pudo sincronizar', 'Error');
      }
    } catch {
      copyText('Error de sincronización', 'Error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-black mb-8">Gesti&oacute;n de datos</h2>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <StatCard label="Total" value={expressions.length} />
        <StatCard label={STATUS_LABELS.active} value={activeCount} color="var(--color-status-active)" />
        <StatCard label={STATUS_LABELS.learning} value={learningCount} color="var(--color-status-learning)" />
        <StatCard label="Scripts" value={scripts.length} />
        <StatCard label="Bloques" value={blockCount} />
      </div>

      {/* Action buttons */}
      <div className="bg-white border border-border-light rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold mb-4">Exportar / Importar</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportJson}
            className="px-5 py-2.5 text-sm font-bold text-accent bg-accent-bg border border-border-light rounded-xl cursor-pointer hover:border-accent transition-colors"
          >
            Exportar JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 text-sm font-bold text-text-muted bg-surface border border-border-light rounded-xl cursor-pointer hover:border-accent transition-colors"
          >
            Importar JSON
          </button>
          <button
            onClick={handleExportMarkdown}
            className="px-5 py-2.5 text-sm font-bold text-text-muted bg-surface border border-border-light rounded-xl cursor-pointer hover:border-accent transition-colors"
          >
            Exportar Markdown
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      {/* Cloud sync */}
      <div className="bg-white border border-border-light rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold mb-4">Sincronizaci&oacute;n en la nube</h3>
        {cloudConfigured ? (
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" />
                <span className="text-sm font-semibold text-success">Configurado</span>
              </div>
              <span className="text-sm text-text-muted">
                &Uacute;ltima sincronizaci&oacute;n: {formatDate(lastSync)}
              </span>
            </div>
            <button
              onClick={handleCloudSync}
              disabled={syncing}
              className="px-5 py-2.5 text-sm font-bold text-accent bg-accent-bg border border-border-light rounded-xl cursor-pointer hover:border-accent transition-colors disabled:opacity-50"
            >
              {syncing ? 'Sincronizando...' : 'Sincronizar ahora'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-text-dim inline-block" />
            <span className="text-sm text-text-muted">
              No configurado. Define <code className="text-xs bg-surface px-2 py-0.5 rounded">VITE_GOOGLE_SCRIPT_URL</code> para activar.
            </span>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-surface rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">C&oacute;mo funciona</h3>
        <div className="flex flex-col gap-3 text-sm text-text-muted leading-relaxed">
          <p className="m-0">
            <strong>Biblioteca</strong> &mdash; Tu vocabulario personal. A&ntilde;ade expresiones, clasif&iacute;calas por estado y bloque tem&aacute;tico.
          </p>
          <p className="m-0">
            <strong>Pronunciaci&oacute;n</strong> &mdash; Escucha cada expresi&oacute;n a distintas velocidades con gu&iacute;a de pronunciaci&oacute;n en espa&ntilde;ol.
          </p>
          <p className="m-0">
            <strong>Repaso</strong> &mdash; Sistema de repetici&oacute;n espaciada SM-2 (como Anki) para memorizar a largo plazo.
          </p>
          <p className="m-0">
            <strong>Scripts</strong> &mdash; Scripts paralelos espa&ntilde;ol/ingl&eacute;s para practicar di&aacute;logos completos.
          </p>
          <p className="m-0">
            <strong>Pr&aacute;ctica</strong> &mdash; Genera prompts para practicar con un AI usando tu vocabulario activo.
          </p>
          <p className="m-0">
            <strong>Datos</strong> &mdash; Exporta, importa y sincroniza tu progreso.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-white border border-border-light rounded-xl p-4 text-center">
      <div className="text-2xl font-black" style={color ? { color } : undefined}>
        {value}
      </div>
      <div className="text-xs text-text-muted mt-1 font-semibold">{label}</div>
    </div>
  );
}
