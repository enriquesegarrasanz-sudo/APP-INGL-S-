export default function SettingsView() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2">Ajustes</h2>
        <p className="text-sm text-text-muted m-0">
          Espacio reservado para configurar proveedores, sync y gestión de datos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <section className="bg-white border border-border-light rounded-xl p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold m-0">IA</h3>
              <p className="text-sm text-text-muted mt-1 mb-0">
                Selector de proveedor y fallback.
              </p>
            </div>
            <button
              type="button"
              aria-label="Toggle IA"
              className="w-12 h-7 rounded-full bg-surface border border-border-light flex items-center px-1"
            >
              <span className="w-5 h-5 rounded-full bg-white border border-border-light block" />
            </button>
          </div>
          <p className="text-sm text-text-muted leading-relaxed m-0">
            Placeholder para Ollama, DeepSeek y preferencias de autocompletado.
          </p>
        </section>

        <section className="bg-white border border-border-light rounded-xl p-5">
          <h3 className="text-lg font-bold mb-2">Google Sync</h3>
          <p className="text-sm text-text-muted leading-relaxed m-0">
            Placeholder para URL de Apps Script, último sync y acciones manuales.
          </p>
        </section>

        <section className="bg-white border border-border-light rounded-xl p-5">
          <h3 className="text-lg font-bold mb-2">Export / Import</h3>
          <p className="text-sm text-text-muted leading-relaxed m-0">
            Placeholder para backup local, restauración y migración de datos.
          </p>
        </section>
      </div>
    </div>
  );
}
