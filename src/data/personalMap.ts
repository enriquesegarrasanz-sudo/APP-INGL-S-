export interface PriorityFunction {
  id: string;
  title: string;
  goal: string;
  spanishPatterns: string[];
  englishPatterns: string[];
  blocks: string[];
}

export interface PersonalTheme {
  block: string;
  priority: number;
  frequency: string;
  focus: string;
  situations: string[];
  expressions: string[];
}

export interface LiteralTrap {
  spanish: string;
  literal: string;
  natural: string;
  reason: string;
}

export interface RegisterContext {
  register: string;
  context: string;
  example: string;
}

export interface PracticeDesign {
  title: string;
  description: string;
  example: string;
}

export const COMMUNICATION_PROFILE = [
  'Formula peticiones largas con una intencion clara y suele explicar el motivo antes de pedir el entregable.',
  'Piensa por sistemas: necesita vocabulario para ordenar, decidir, revisar, documentar y ejecutar.',
  'Usa muchos conectores de razonamiento: por lo tanto, de esa manera, por un lado, despues, al final.',
  'Busca precision sin sonar traducido: quiere ingles natural para prompts, reuniones, pitches y conversaciones reales.',
  'Trabaja entre cine, creatividad, inteligencia artificial, producto, documentacion y estrategia profesional.',
];

export const PRIORITY_FUNCTIONS: PriorityFunction[] = [
  {
    id: 'intention-focus',
    title: 'Expresar intencion y foco',
    goal: 'Decir con claridad que quiere construir, aprender o aterrizar.',
    spanishPatterns: ['Lo que quiero es...', 'Mi objetivo es...', 'Estoy intentando...'],
    englishPatterns: ['What I want is...', 'My goal is...', "I'm trying to..."],
    blocks: ['Ideas & Creativity', 'Structure & Systems', 'Communication'],
  },
  {
    id: 'request-execution',
    title: 'Pedir ejecucion',
    goal: 'Dar instrucciones a IA, colaboradores o equipo sin sonar literal.',
    spanishPatterns: ['Necesito que...', 'Convierte esto en...', 'Dame una version...'],
    englishPatterns: ['I need you to...', 'Turn this into...', 'Give me a version that...'],
    blocks: ['AI & Technology', 'Communication', 'Structure & Systems'],
  },
  {
    id: 'deep-analysis',
    title: 'Pedir analisis profundo',
    goal: 'Solicitar investigacion, diagnostico o revision con profundidad accionable.',
    spanishPatterns: ['Indaga', 'Analizalo en profundidad', 'Detecta riesgos'],
    englishPatterns: ['Dig into it', 'Analyze this in depth', 'Identify the risks'],
    blocks: ['Judgment & Decisions', 'AI & Technology', 'Communication'],
  },
  {
    id: 'reasoning-order',
    title: 'Ordenar razonamiento',
    goal: 'Conectar ideas como lo hace en castellano, pero con estructuras naturales en ingles.',
    spanishPatterns: ['Por un lado...', 'De esa manera...', 'Justamente por eso...'],
    englishPatterns: ['First...', 'That way...', "That's exactly why..."],
    blocks: ['Structure & Systems', 'Judgment & Decisions', 'Communication'],
  },
  {
    id: 'decision-making',
    title: 'Tomar decisiones',
    goal: 'Pedir recomendaciones, priorizar opciones y hablar de trade-offs.',
    spanishPatterns: ['Que opcion tiene mas sentido?', 'Ordenalo por impacto y esfuerzo', 'Dame una recomendacion clara'],
    englishPatterns: ['Which option makes the most sense?', 'Rank this by impact and effort', 'Give me a clear recommendation'],
    blocks: ['Judgment & Decisions', 'Business & Networking', 'Structure & Systems'],
  },
  {
    id: 'creative-feedback',
    title: 'Dar feedback creativo',
    goal: 'Evaluar escenas, ideas, tratamientos visuales y propuestas sin perder matiz.',
    spanishPatterns: ['La escena no termina de funcionar', 'Falta una idea mas fuerte', 'Esto no esta aterrizado'],
    englishPatterns: ["The scene isn't quite working", 'It needs a stronger idea', "This isn't grounded enough"],
    blocks: ['Cinema & Storytelling', 'Ideas & Creativity', 'Judgment & Decisions'],
  },
];

export const PERSONAL_THEMES: PersonalTheme[] = [
  {
    block: 'Cinema & Storytelling',
    priority: 1,
    frequency: 'Diaria',
    focus: 'Direccion, guion, produccion, narrativa visual y feedback sobre escenas.',
    situations: ['Reuniones de cine', 'Notas de guion', 'Festivales', 'Pitch creativo'],
    expressions: ['The scene is not quite working', 'It needs more subtext', 'I am looking for funding'],
  },
  {
    block: 'AI & Technology',
    priority: 1,
    frequency: 'Diaria',
    focus: 'IA generativa, vibe coding, workflows, modelos, agentes y evaluacion de herramientas.',
    situations: ['Sesiones con Claude Code', 'Prompts', 'Automatizaciones', 'Revision tecnica'],
    expressions: ['AI is a tool, not a replacement', 'Break this down into tasks', 'The workflow in ComfyUI'],
  },
  {
    block: 'Ideas & Creativity',
    priority: 1,
    frequency: 'Diaria',
    focus: 'Aterrizar ideas, defender intuiciones y convertir conceptos en estructuras utiles.',
    situations: ['Brainstorming', 'Direccion creativa', 'Concept development', 'Tratamientos visuales'],
    expressions: ['To flesh out an idea', 'There is something there', 'The core concept'],
  },
  {
    block: 'Business & Networking',
    priority: 2,
    frequency: 'Varias veces por semana',
    focus: 'Marca personal, portfolio, servicios, precios, clientes y contactos de industria.',
    situations: ['Networking', 'Propuestas', 'Pricing', 'Marca personal'],
    expressions: ['I need to position myself better', 'I offer showreel production services', 'I want to stand out'],
  },
  {
    block: 'Structure & Systems',
    priority: 2,
    frequency: 'Regular',
    focus: 'Productividad, rutinas, sistemas de trabajo, foco y organizacion por bloques.',
    situations: ['Planificacion semanal', 'Revision de tareas', 'Sistemas Notion-like', 'Deep work'],
    expressions: ['I have too many things going on', 'I work better this way', 'One thing at a time'],
  },
  {
    block: 'Communication',
    priority: 2,
    frequency: 'Regular',
    focus: 'Emails, mensajes, follow-ups, reuniones, propuestas y feedback profesional.',
    situations: ['Emails', 'Reuniones', 'Seguimientos', 'Mensajes a colaboradores'],
    expressions: ['Just following up on...', 'Could we meet to discuss this?', 'I am open to feedback'],
  },
];

export const LITERAL_TRAPS: LiteralTrap[] = [
  {
    spanish: 'Tiene coherencia',
    literal: 'It has coherence',
    natural: 'It makes sense',
    reason: 'En conversacion se usa "makes sense"; "coherence" suena rigido.',
  },
  {
    spanish: 'Aterrizar una idea',
    literal: 'To land an idea',
    natural: 'To flesh out an idea / to make an idea concrete',
    reason: 'La metafora natural en ingles es concretar, desarrollar o grounding.',
  },
  {
    spanish: 'Me hace ilusion',
    literal: 'It gives me illusion',
    natural: "I'm excited about it / I'm looking forward to it",
    reason: 'Illusion no expresa entusiasmo en ingles natural.',
  },
  {
    spanish: 'Tengo muchas cosas abiertas',
    literal: 'I have many things opened',
    natural: 'I have too many things going on',
    reason: 'Se habla de frentes o cosas en marcha, no de cosas abiertas.',
  },
  {
    spanish: 'Compartirlo a Claude',
    literal: 'Share it to Claude',
    natural: 'Share it with Claude',
    reason: 'La preposicion correcta para compartir con alguien es "with".',
  },
  {
    spanish: 'Cambiar el chip',
    literal: 'Change the chip',
    natural: 'Shift your mindset / switch gears',
    reason: 'La imagen literal no funciona; se cambia de mentalidad o de marcha.',
  },
];

export const REGISTER_CONTEXTS: RegisterContext[] = [
  {
    register: 'Profesional-formal',
    context: 'Reunion con productor, festival o cliente',
    example: "I'd like to pitch you a project.",
  },
  {
    register: 'Profesional-cercano',
    context: 'Networking o colaboracion creativa',
    example: "I'd love to share what I'm working on.",
  },
  {
    register: 'Tecnico-directo',
    context: 'Sesion de trabajo con IA o desarrollo',
    example: 'Turn this into an implementation-ready specification.',
  },
  {
    register: 'Casual-entusiasta',
    context: 'Explicar una idea a un amigo',
    example: "I'm really excited about this.",
  },
  {
    register: 'Intimo-reflexivo',
    context: 'Psicologia, autoconocimiento y vida personal',
    example: "I think there's a pattern here.",
  },
];

export const PRACTICE_DESIGNS: PracticeDesign[] = [
  {
    title: 'De intencion a frase',
    description: 'Partir de una frase real en castellano y convertirla en una version natural en ingles.',
    example: 'Lo que quiero es aterrizar la idea -> What I want is to make the idea concrete.',
  },
  {
    title: 'Patron reutilizable',
    description: 'Reducir una frase a una estructura que pueda repetir con otros temas.',
    example: 'What I want is to + verb...',
  },
  {
    title: 'Natural contra literal',
    description: 'Mostrar el error probable y la version correcta para evitar traducciones rigidas.',
    example: 'It has coherence -> It makes sense.',
  },
  {
    title: 'Registro',
    description: 'Practicar una misma idea en version directa, profesional y formal.',
    example: 'Give me a clear recommendation / I would appreciate a clear recommendation.',
  },
  {
    title: 'Produccion activa',
    description: 'Reconstruir, decir en voz alta y usar la frase en una mini-conversacion contextual.',
    example: 'Use "I got sidetracked" in a meeting recap.',
  },
];
