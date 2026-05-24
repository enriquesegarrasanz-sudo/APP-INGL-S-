export type ExpressionStatus = 'new' | 'learning' | 'active' | 'mastered' | 'needs_review';

export interface Expression {
  id: string;
  english: string;
  spanish_source: string;
  meaning: string;
  pronunciation_es: string;
  stress: string;
  pronunciation_note: string;
  register: string;
  contexts: string[];
  blocks: string[];
  related_ids: string[];
  examples: string[];
  common_mistake: string;
  better_alternatives: string[];
  status: ExpressionStatus;
  difficulty: number;
  tags: string[];
  last_practiced: string | null;
  notes: string;
  // SM-2 spaced repetition
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string | null;
  created_at: string;
}

export interface ScriptBlock {
  spanish: string;
  english: string;
  pronunciation: string;
  key_expressions: string[];
  mistakes_to_avoid: string[];
}

export interface ParallelScript {
  id: string;
  title: string;
  blocks: ScriptBlock[];
  created_at: string;
}

export interface ReviewSession {
  id: string;
  started_at: string;
  completed_at: string | null;
  cards_reviewed: number;
  correct_count: number;
  results: ReviewResult[];
}

export interface ReviewResult {
  expression_id: string;
  quality: number; // 0-5 (SM-2 scale)
  reviewed_at: string;
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface AIAutoFillResult {
  spanish_source: string;
  meaning: string;
  pronunciation_es: string;
  stress: string;
  pronunciation_note: string;
  register: string;
  contexts: string[];
  examples: string[];
  common_mistake: string;
  better_alternatives: string[];
  tags: string[];
  blocks: string[];
}

export interface AIProvider {
  name: string;
  available: () => Promise<boolean>;
  autoFill: (englishExpression: string) => Promise<AIAutoFillResult | null>;
}

export type TTSSpeed = 'slow' | 'normal' | 'fast' | 'native';

export interface AppData {
  expressions: Expression[];
  scripts: ParallelScript[];
  reviews: ReviewSession[];
}

export const BLOCKS = [
  'Cinema & Storytelling',
  'AI & Technology',
  'Ideas & Creativity',
  'Business & Networking',
  'Structure & Systems',
  'Judgment & Decisions',
  'Inner Life & Growth',
  'Communication',
  'Art & Culture',
  'Daily Life & Social',
] as const;

export interface ThemeBlock {
  id: string;
  label: string;
  label_es: string;
  description: string;
  priority: number;
}

export const THEME_BLOCKS: ThemeBlock[] = [
  { id: 'cinema-storytelling', label: 'Cinema & Storytelling', label_es: 'Cine y Narrativa', description: 'Dirección, guión, producción, narrativa visual', priority: 1 },
  { id: 'ai-technology', label: 'AI & Technology', label_es: 'IA y Tecnología', description: 'Inteligencia artificial, herramientas, desarrollo, workflows', priority: 1 },
  { id: 'ideas-creativity', label: 'Ideas & Creativity', label_es: 'Ideas y Creatividad', description: 'Explicar ideas, brainstorming, creatividad', priority: 1 },
  { id: 'business-networking', label: 'Business & Networking', label_es: 'Negocio y Networking', description: 'Marca personal, servicios, pitching, negociación', priority: 2 },
  { id: 'structure-systems', label: 'Structure & Systems', label_es: 'Estructura y Sistemas', description: 'Productividad, organización, planificación, hábitos', priority: 2 },
  { id: 'judgment-decisions', label: 'Judgment & Decisions', label_es: 'Juicio y Decisiones', description: 'Evaluar, opinar, feedback, pensamiento crítico', priority: 3 },
  { id: 'inner-life-growth', label: 'Inner Life & Growth', label_es: 'Vida Interior y Crecimiento', description: 'Psicología, autoconocimiento, filosofía', priority: 3 },
  { id: 'communication', label: 'Communication', label_es: 'Comunicación', description: 'Emails, mensajes, seguimiento, propuestas', priority: 2 },
  { id: 'art-culture', label: 'Art & Culture', label_es: 'Arte y Cultura', description: 'Pintura, museos, vanguardias, literatura, danza', priority: 4 },
  { id: 'daily-life-social', label: 'Daily Life & Social', label_es: 'Vida Diaria y Social', description: 'Vida en Madrid, planes, conversaciones cotidianas', priority: 4 },
];

export const STATUSES: ExpressionStatus[] = ['new', 'learning', 'active', 'mastered', 'needs_review'];

export const STATUS_LABELS: Record<ExpressionStatus, string> = {
  new: 'Nuevo',
  learning: 'Aprendiendo',
  active: 'Activo',
  mastered: 'Dominado',
  needs_review: 'Repasar',
};

export const STATUS_COLORS: Record<ExpressionStatus, string> = {
  new: 'var(--color-status-new)',
  learning: 'var(--color-status-learning)',
  active: 'var(--color-status-active)',
  mastered: 'var(--color-status-mastered)',
  needs_review: 'var(--color-status-review)',
};

export const TTS_SPEEDS: Record<TTSSpeed, { label: string; rate: number }> = {
  slow: { label: 'Lento', rate: 0.5 },
  normal: { label: 'Normal', rate: 0.78 },
  fast: { label: 'Rápido', rate: 1.0 },
  native: { label: 'Nativo', rate: 1.2 },
};
