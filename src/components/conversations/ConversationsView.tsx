import { useState } from 'react';
import type {
  ConversationScenario,
  ConversationPhase,
  ConversationExchange,
  ConversationTool,
  ConversationToolCategory,
} from '../../types/conversation';
import { TOOL_CATEGORY_LABELS } from '../../types/conversation';
import { CONVERSATION_SCENARIOS, CONVERSATION_TOOLS } from '../../data/conversationData';
import { useTTS } from '../../hooks/useTTS';

const REGISTER_LABELS: Record<string, string> = {
  casual: 'Casual',
  professional: 'Profesional',
  creative: 'Creativo',
  deep: 'Profundo',
};

const REGISTER_COLORS: Record<string, { bg: string; text: string }> = {
  casual: { bg: '#F0EBFF', text: '#7C5CFC' },
  professional: { bg: '#EEFBF3', text: '#2DA06A' },
  creative: { bg: '#FFF0EB', text: '#E8724F' },
  deep: { bg: '#EEF3FF', text: '#5B8DEF' },
};

type ViewTab = 'scenarios' | 'tools';

function SpeakButton({ text }: { text: string }) {
  const { speak, stop, speaking } = useTTS();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (speaking) {
          stop();
        } else {
          speak(text);
        }
      }}
      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors cursor-pointer border-none"
      title="Escuchar pronunciacion"
    >
      {speaking ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}

function ExchangeCard({ exchange }: { exchange: ConversationExchange }) {
  const [expanded, setExpanded] = useState(false);
  const regColor = REGISTER_COLORS[exchange.register] || REGISTER_COLORS.casual;

  return (
    <div className="space-y-3">
      {/* Question bubble — left aligned */}
      <div className="flex gap-3 items-start max-w-[85%]">
        <div className="shrink-0 w-8 h-8 rounded-full bg-surface flex items-center justify-center text-xs font-bold text-text-muted mt-0.5">
          Q
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-surface rounded-2xl rounded-tl-md px-4 py-3">
            <div className="flex items-start gap-2">
              <p className="text-sm font-semibold text-text m-0 flex-1">{exchange.question.en}</p>
              <SpeakButton text={exchange.question.en} />
            </div>
            <p className="text-xs text-text-muted mt-1 mb-0">{exchange.question.es}</p>
          </div>
        </div>
      </div>

      {/* Answer bubbles — right aligned */}
      {exchange.answers.slice(0, expanded ? undefined : 1).map((answer, i) => (
        <div key={i} className="flex gap-3 items-start max-w-[85%] ml-auto">
          <div className="flex-1 min-w-0">
            <div className="bg-accent/8 border border-accent/15 rounded-2xl rounded-tr-md px-4 py-3">
              <div className="flex items-start gap-2">
                <p className="text-sm font-semibold text-text m-0 flex-1">{answer.en}</p>
                <SpeakButton text={answer.en} />
              </div>
              <p className="text-xs text-text-muted mt-1 mb-0">{answer.es}</p>
              {answer.context_es && (
                <p className="text-[11px] text-accent-soft mt-1.5 mb-0 italic">{answer.context_es}</p>
              )}
            </div>
          </div>
          <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-xs font-bold text-accent mt-0.5">
            A
          </div>
        </div>
      ))}

      {exchange.answers.length > 1 && (
        <div className="flex justify-end pr-11">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold text-accent hover:text-accent-soft cursor-pointer border-none bg-transparent px-0"
          >
            {expanded
              ? 'Menos respuestas'
              : `+${exchange.answers.length - 1} respuesta${exchange.answers.length > 2 ? 's' : ''} mas`}
          </button>
        </div>
      )}

      {/* Tip */}
      {exchange.tip_es && (
        <div className="ml-11 mr-11 bg-warning-bg border border-warning/20 rounded-xl px-4 py-2.5">
          <p className="text-xs text-text m-0 leading-relaxed">
            <span className="font-bold text-warning">Tip:</span> {exchange.tip_es}
          </p>
        </div>
      )}

      {/* Register tag */}
      <div className="flex justify-center">
        <span
          className="text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5"
          style={{ backgroundColor: regColor.bg, color: regColor.text }}
        >
          {REGISTER_LABELS[exchange.register]}
        </span>
      </div>
    </div>
  );
}

function PhaseSection({ phase }: { phase: ConversationPhase }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-card border border-border-light rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-transparent border-none cursor-pointer text-left"
      >
        <div>
          <h4 className="text-base font-bold text-text m-0">{phase.name_es}</h4>
          <p className="text-xs text-text-muted mt-0.5 mb-0">{phase.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-dim font-semibold">
            {phase.exchanges.length} intercambios
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-2">
          <p className="text-xs text-text-muted mb-4 mt-0">{phase.description_es}</p>
          <div className="space-y-6">
            {phase.exchanges.map((exchange) => (
              <ExchangeCard key={exchange.id} exchange={exchange} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ScenarioDetail({ scenario }: { scenario: ConversationScenario }) {
  return (
    <div className="space-y-4">
      <div
        className="bg-card border border-border-light rounded-xl p-5"
        style={{ borderLeftWidth: '4px', borderLeftColor: scenario.color }}
      >
        <h3 className="text-xl font-black m-0">{scenario.title_es}</h3>
        <p className="text-xs text-text-muted mt-0.5 mb-0">{scenario.title}</p>
        <p className="text-sm text-text mt-3 mb-0 leading-relaxed">{scenario.context_es}</p>
      </div>

      {scenario.phases.map((phase) => (
        <PhaseSection key={phase.id} phase={phase} />
      ))}
    </div>
  );
}

function ToolsSection() {
  const categories = Object.keys(TOOL_CATEGORY_LABELS) as ConversationToolCategory[];

  const toolsByCategory = categories.reduce(
    (acc, cat) => {
      acc[cat] = CONVERSATION_TOOLS.filter((t) => t.category === cat);
      return acc;
    },
    {} as Record<ConversationToolCategory, ConversationTool[]>
  );

  const CATEGORY_COLORS: Record<ConversationToolCategory, string> = {
    interest: '#7C5CFC',
    agreement: '#34B87A',
    disagreement: '#F06060',
    transition: '#F5A623',
    time: '#5B8DEF',
    reaction: '#FF8A6B',
    opinion: '#F0ABFC',
  };

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border-light rounded-xl p-5">
        <h3 className="text-xl font-black m-0">Herramientas conversacionales</h3>
        <p className="text-sm text-text-muted mt-2 mb-0 leading-relaxed">
          Frases comodin que funcionan en cualquier conversacion. Son el pegamento que mantiene el
          dialogo vivo: mostrar interes, reaccionar, cambiar de tema, ganar tiempo.
        </p>
      </div>

      {categories.map((category) => {
        const tools = toolsByCategory[category];
        const color = CATEGORY_COLORS[category];
        if (tools.length === 0) return null;

        return (
          <div
            key={category}
            className="bg-card border border-border-light rounded-xl overflow-hidden"
            style={{ borderLeftWidth: '4px', borderLeftColor: color }}
          >
            <div className="px-5 py-4">
              <h4 className="text-base font-bold text-text m-0">
                {TOOL_CATEGORY_LABELS[category]}
              </h4>
            </div>
            <div className="px-5 pb-4 space-y-2">
              {tools.map((tool, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-surface rounded-xl px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text m-0">{tool.en}</p>
                      <SpeakButton text={tool.en} />
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 mb-0">{tool.es}</p>
                    {tool.note_es && (
                      <p className="text-[11px] text-accent-soft mt-1 mb-0 italic">
                        {tool.note_es}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ConversationsView() {
  const [activeTab, setActiveTab] = useState<ViewTab>('scenarios');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const scenario = CONVERSATION_SCENARIOS.find((s) => s.id === selectedScenario);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-black mb-2">Conversaciones</h2>
        <p className="text-sm text-text-muted m-0 max-w-2xl">
          Patrones reales de pregunta y respuesta para conocer gente en ingles. Escenarios
          completos con todas las fases: desde romper el hielo hasta despedirse.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab('scenarios');
            setSelectedScenario(null);
          }}
          className={`px-4 py-2 text-sm font-bold rounded-lg cursor-pointer border-none transition-all ${
            activeTab === 'scenarios'
              ? 'bg-accent text-white shadow-btn'
              : 'bg-surface text-text-muted hover:bg-surface-hover'
          }`}
        >
          Escenarios
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('tools');
            setSelectedScenario(null);
          }}
          className={`px-4 py-2 text-sm font-bold rounded-lg cursor-pointer border-none transition-all ${
            activeTab === 'tools'
              ? 'bg-accent text-white shadow-btn'
              : 'bg-surface text-text-muted hover:bg-surface-hover'
          }`}
        >
          Herramientas
        </button>
      </div>

      {activeTab === 'tools' && <ToolsSection />}

      {activeTab === 'scenarios' && !scenario && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {CONVERSATION_SCENARIOS.map((s) => {
            const totalExchanges = s.phases.reduce((sum, p) => sum + p.exchanges.length, 0);

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedScenario(s.id)}
                className="text-left bg-card border border-border-light rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
                style={{ borderLeftWidth: '4px', borderLeftColor: s.color }}
              >
                <h3 className="text-lg font-bold m-0">{s.title_es}</h3>
                <p className="text-xs text-text-muted mt-0.5 mb-0">{s.title}</p>
                <p className="text-sm text-text-muted mt-3 mb-0 leading-relaxed flex-1">
                  {s.description_es}
                </p>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border-light">
                  <span className="text-xs font-semibold text-text-dim">
                    {s.phases.length} fases
                  </span>
                  <span className="text-xs font-semibold text-text-dim">
                    {totalExchanges} intercambios
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {activeTab === 'scenarios' && scenario && (
        <div>
          <button
            type="button"
            onClick={() => setSelectedScenario(null)}
            className="flex items-center gap-2 text-sm font-bold text-accent hover:text-accent-soft cursor-pointer border-none bg-transparent px-0 mb-4"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Todos los escenarios
          </button>
          <ScenarioDetail scenario={scenario} />
        </div>
      )}
    </div>
  );
}
