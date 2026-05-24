import { THEME_BLOCKS } from '../../types';
import {
  COMMUNICATION_PROFILE,
  LITERAL_TRAPS,
  PERSONAL_THEMES,
  PRACTICE_DESIGNS,
  PRIORITY_FUNCTIONS,
  REGISTER_CONTEXTS,
} from '../../data/personalMap';

export default function PersonalMapView() {
  const priorityOneCount = PERSONAL_THEMES.filter((theme) => theme.priority === 1).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <section className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-accent mb-3">
            Mapa personal
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-text leading-tight m-0">
            La estructura que convierte tus conversaciones reales en ingles practicable
          </h2>
          <p className="text-base text-text-muted leading-relaxed mt-4 mb-0 max-w-3xl">
            Esta vista recoge el analisis de tus temas, muletillas, patrones y errores
            literales. La biblioteca guarda las expresiones; este mapa explica por que
            estan organizadas asi y que tipo de practica deberia generar la app.
          </p>
        </div>

        <div className="bg-surface border border-border-light rounded-xl p-5 sm:p-6">
          <h3 className="text-lg font-black m-0 mb-4">Diagnostico de implementacion</h3>
          <div className="space-y-4">
            <Metric label="Bloques tematicos activos" value={String(THEME_BLOCKS.length)} />
            <Metric label="Bloques prioridad diaria" value={String(priorityOneCount)} />
            <Metric label="Funciones linguisticas" value={String(PRIORITY_FUNCTIONS.length)} />
            <Metric label="Trampas literales visibles" value={String(LITERAL_TRAPS.length)} />
          </div>
        </div>
      </section>

      <section className="bg-white border border-border-light rounded-xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-text-muted mb-2">
              Perfil comunicativo
            </p>
            <h3 className="text-2xl font-black m-0">Como hablas y que necesita entrenar la app</h3>
          </div>
          <span className="text-sm font-bold text-accent bg-accent-bg border border-border-light rounded-lg px-3 py-2 w-fit">
            Fuente: mapas ChatGPT y Claude
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {COMMUNICATION_PROFILE.map((item) => (
            <div key={item} className="bg-surface rounded-lg p-4">
              <p className="text-sm text-text leading-relaxed m-0">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-wider text-text-muted mb-2">
            Funciones prioritarias
          </p>
          <h3 className="text-2xl font-black m-0">Lo que mas tienes que poder decir</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PRIORITY_FUNCTIONS.map((item) => (
            <article key={item.id} className="bg-card border border-border-light rounded-xl p-5 shadow-sm">
              <h4 className="text-lg font-black m-0 mb-2">{item.title}</h4>
              <p className="text-sm text-text-muted leading-relaxed m-0 mb-4">{item.goal}</p>

              <PatternList title="Castellano" items={item.spanishPatterns} />
              <PatternList title="Ingles natural" items={item.englishPatterns} strong />

              <div className="flex flex-wrap gap-2 mt-4">
                {item.blocks.map((block) => (
                  <span
                    key={block}
                    className="text-xs font-semibold text-text-muted bg-surface border border-border-light rounded-lg px-2.5 py-1"
                  >
                    {block}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-wider text-text-muted mb-2">
            Temas reales
          </p>
          <h3 className="text-2xl font-black m-0">Bloques que salen de tus conversaciones</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PERSONAL_THEMES.map((theme) => (
            <article key={theme.block} className="bg-white border border-border-light rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h4 className="text-lg font-black m-0">{theme.block}</h4>
                  <p className="text-sm text-text-muted mt-1 mb-0">
                    Frecuencia: {theme.frequency}
                  </p>
                </div>
                <span className="text-xs font-black text-accent bg-accent-bg border border-border-light rounded-lg px-2.5 py-1">
                  P{theme.priority}
                </span>
              </div>

              <p className="text-sm text-text leading-relaxed m-0 mb-4">{theme.focus}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CompactList title="Situaciones" items={theme.situations} />
                <CompactList title="Frases guia" items={theme.expressions} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-5">
        <div className="bg-white border border-border-light rounded-xl p-5 sm:p-6">
          <p className="text-xs font-black uppercase tracking-wider text-text-muted mb-2">
            Trampas literales
          </p>
          <h3 className="text-2xl font-black m-0 mb-5">Errores que hay que corregir pronto</h3>

          <div className="space-y-3">
            {LITERAL_TRAPS.map((trap) => (
              <div key={trap.spanish} className="border border-border-light rounded-lg p-4">
                <div className="text-sm font-black text-text mb-1">{trap.spanish}</div>
                <div className="text-sm text-danger mb-1">No: {trap.literal}</div>
                <div className="text-sm font-bold text-success mb-2">Mejor: {trap.natural}</div>
                <p className="text-xs text-text-muted leading-relaxed m-0">{trap.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-border-light rounded-xl p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-wider text-text-muted mb-2">
              Registros
            </p>
            <h3 className="text-2xl font-black m-0 mb-5">Donde cambia el tono</h3>
            <div className="space-y-3">
              {REGISTER_CONTEXTS.map((item) => (
                <div key={item.register} className="bg-surface rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-black m-0">{item.register}</h4>
                      <p className="text-sm text-text-muted mt-1 mb-0">{item.context}</p>
                    </div>
                    <code className="text-xs sm:text-sm bg-white border border-border-light rounded-lg px-2.5 py-1.5 w-fit max-w-full whitespace-normal">
                      {item.example}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-border-light rounded-xl p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-wider text-text-muted mb-2">
              Practica recomendada
            </p>
            <h3 className="text-2xl font-black m-0 mb-5">Como deberian generarse las lecciones</h3>
            <div className="space-y-3">
              {PRACTICE_DESIGNS.map((item) => (
                <div key={item.title} className="border-l-4 border-accent bg-surface rounded-r-lg p-4">
                  <h4 className="text-sm font-black m-0 mb-1">{item.title}</h4>
                  <p className="text-sm text-text-muted leading-relaxed m-0 mb-2">{item.description}</p>
                  <p className="text-sm font-semibold text-text m-0">{item.example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border-light pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-2xl font-black text-text">{value}</span>
    </div>
  );
}

function PatternList({
  title,
  items,
  strong = false,
}: {
  title: string;
  items: string[];
  strong?: boolean;
}) {
  return (
    <div className="mb-3">
      <div className="text-xs font-black uppercase tracking-wider text-text-dim mb-2">{title}</div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div
            key={item}
            className={`text-sm leading-snug ${strong ? 'font-bold text-text' : 'text-text-muted'}`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompactList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-surface rounded-lg p-3">
      <div className="text-xs font-black uppercase tracking-wider text-text-dim mb-2">{title}</div>
      <ul className="m-0 pl-4 space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm text-text-muted leading-snug">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
