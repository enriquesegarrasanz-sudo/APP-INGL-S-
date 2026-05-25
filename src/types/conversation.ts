export interface ConversationAnswer {
  en: string;
  es: string;
  context_es?: string;
}

export interface ConversationExchange {
  id: string;
  question: {
    en: string;
    es: string;
  };
  answers: ConversationAnswer[];
  tip_es?: string;
  register: 'casual' | 'professional' | 'creative' | 'deep';
}

export interface ConversationPhase {
  id: string;
  name: string;
  name_es: string;
  description_es: string;
  exchanges: ConversationExchange[];
}

export interface ConversationScenario {
  id: string;
  title: string;
  title_es: string;
  description_es: string;
  context_es: string;
  color: string;
  phases: ConversationPhase[];
}

export type ConversationToolCategory =
  | 'interest'
  | 'agreement'
  | 'disagreement'
  | 'transition'
  | 'time'
  | 'reaction'
  | 'opinion';

export interface ConversationTool {
  en: string;
  es: string;
  category: ConversationToolCategory;
  note_es?: string;
}

export const TOOL_CATEGORY_LABELS: Record<ConversationToolCategory, string> = {
  interest: 'Mostrar interes',
  agreement: 'Mostrar acuerdo',
  disagreement: 'Discrepar con educacion',
  transition: 'Cambiar de tema',
  time: 'Ganar tiempo',
  reaction: 'Reaccionar',
  opinion: 'Dar tu opinion',
};
