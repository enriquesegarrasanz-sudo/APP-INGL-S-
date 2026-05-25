import { useRef, useState } from 'react';
import type { AppData, Expression } from '../../types';
import { STATUS_LABELS } from '../../types';
import { useAIPreference, type AIServiceStatus, type AIPreference } from '../../hooks/useAIPreference';
import { downloadFile, formatDate } from '../../lib/utils';
import {
  exportAllData,
  getCloudSyncStatus,
  getLastSyncTime,
  isCloudConfigured,
  syncFromCloud,
} from '../../lib/storage';

interface SettingsViewProps {
  expressions: Expression[];
  onImport: (data: Partial<AppData>) => void;
  copyText: (text: string, label?: string) => void;
}

const AI_OPTIONS: { value: AIPreference; title: string; description: string }[] = [
  {
    value: 'auto',
    title: 'Automatico',
    description: 'Prueba Ollama y usa DeepSeek si no esta disponible.',
  },
  {
    value: 'ollama',
    title: 'Local (Ollama)',
    description: 'Usa Ollama en este ordenador.',
  },
  {
    value: 'deepseek',
    title: 'DeepSeek (Cloud)',
    description: 'Usa la API de DeepSeek configurada.',
  },
];

export default function SettingsView({
  expressions,
  onImport,
  copyText,
}: SettingsViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [syncing, setSyncing] = useState(false);
  const { preference, setPreference, ollamaStatus, deepseekStatus, refreshServices } = useAIPreference();

  const activeCount = expressions.filter((expression) => expression.status === 'active').length;
  const masteredCount = expressions.filter((expression) => expression.status === 'mastered').length;
  const cloudConfigured = isCloudConfigured();
  const cloudSyncStatus = getCloudSyncStatus();
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
    const active = expressions.filter((expression) => expression.status === 'active');
    const lines = active.map(
      (expression) =>
        `### ${expression.english}\n- **Fuente:** ${expression.spanish_source}\n- **Significado:** ${expression.meaning}\n- **Pronunciacion:** \`${expression.pronunciation_es}\` (**${expression.stress}**)\n- **Registro:** ${expression.register}\n- **Contextos:** ${expression.contexts.join(', ')}\n- **Ejemplos:** ${expression.examples.join('; ')}\n- **Error comun:** ${expression.common_mistake}\n`
    );
    const markdown = `# Sparring English — Expresiones activas\n\n${lines.join('\n---\n\n')}`;
    downloadFile(markdown, `sparring-active-${new Date().toISOString().slice(0, 10)}.md`, 'text/markdown');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      try {
        const data = JSON.parse(readerEvent.target?.result as string) as Partial<AppData>;
        onImport(data);
        copyText('Datos importados', 'Importado');
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
      copyText('Error de sincronizacion', 'Error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2">Ajustes</h2>
        <p className="text-sm text-text-muted m-0">
          Configuracion de IA, sincronizacion y copias de seguridad.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <section className="bg-white border border-border-light rounded-xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold m-0">Inteligencia Artificial</h3>
              <div className="flex flex-wrap gap-4">
                <ServiceStatus label="Ollama" status={ollamaStatus} availableText="Conectado" unavailableText="Sin conexion local" />
                <ServiceStatus label="DeepSeek" status={deepseekStatus} availableText="API conectada" unavailableText="API key no cargada" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => void refreshServices()}
              className="px-4 py-2 text-sm font-bold text-text-muted bg-surface border border-border-light rounded-xl cursor-pointer hover:border-accent hover:text-accent transition-colors"
            >
              Recomprobar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {AI_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPreference(option.value)}
                className={`text-left p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  preference === option.value
                    ? 'border-accent bg-accent-bg shadow-sm'
                    : 'border-border-light bg-white hover:border-accent-soft'
                }`}
              >
                <span className="block text-sm font-black mb-1">{option.title}</span>
                <span className="block text-sm text-text-muted leading-relaxed">{option.description}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white border border-border-light rounded-xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Sincronizacion</h3>
          {cloudConfigured ? (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" />
                  <span className="text-sm font-semibold text-success">Google Apps Script configurado</span>
                </div>
                <span className="text-sm text-text-muted">
                  Ultima sincronizacion: {formatDate(lastSync)}
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
          ) : cloudSyncStatus === 'configured-disabled' ? (
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-text-dim inline-block mt-1.5" />
              <span className="text-sm text-text-muted leading-relaxed">
                Copia local activa. Google Sheets esta configurado, pero la sincronizacion queda desactivada hasta cerrar la implementacion.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-text-dim inline-block" />
              <span className="text-sm text-text-muted">
                Google Sheets pendiente. Define <code className="text-xs bg-surface px-2 py-0.5 rounded">VITE_GOOGLE_SCRIPT_URL</code> cuando la sincronizacion este lista.
              </span>
            </div>
          )}
        </section>

        <section className="bg-white border border-border-light rounded-xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Datos</h3>
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
        </section>

        <section className="bg-white border border-border-light rounded-xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-3">Resumen rapido</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-4 text-center border border-border-light" style={{ backgroundColor: 'var(--color-surface)' }}>
              <div className="text-2xl font-black">{expressions.length}</div>
              <div className="text-xs text-text-muted mt-1 font-semibold">Total</div>
            </div>
            <div className="rounded-xl p-4 text-center border border-border-light" style={{ backgroundColor: 'var(--color-success-bg)' }}>
              <div className="text-2xl font-black" style={{ color: 'var(--color-status-active)' }}>{activeCount}</div>
              <div className="text-xs text-text-muted mt-1 font-semibold">{STATUS_LABELS.active}</div>
            </div>
            <div className="rounded-xl p-4 text-center border border-border-light" style={{ backgroundColor: 'var(--color-blue-bg)' }}>
              <div className="text-2xl font-black" style={{ color: 'var(--color-status-mastered)' }}>{masteredCount}</div>
              <div className="text-xs text-text-muted mt-1 font-semibold">{STATUS_LABELS.mastered}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ServiceStatus({
  label,
  status,
  availableText,
  unavailableText,
}: {
  label: string;
  status: AIServiceStatus;
  availableText: string;
  unavailableText: string;
}) {
  const isChecking = status === 'checking';
  const isAvailable = status === 'available';
  const colorClass = isChecking ? 'bg-text-dim' : isAvailable ? 'bg-success' : 'bg-danger';
  const textClass = isAvailable ? 'text-success' : 'text-text-muted';
  const text = isChecking ? 'Comprobando...' : isAvailable ? availableText : unavailableText;

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full inline-block ${colorClass}`} />
      <span className={`text-sm font-semibold ${textClass}`}>{label}: {text}</span>
    </div>
  );
}

