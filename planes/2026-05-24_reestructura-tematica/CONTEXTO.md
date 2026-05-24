# Contexto compartido del plan

**Proyecto**: Sparring English OS
**Ruta absoluta del repo**: `C:\Users\i-gamer\Documents\APP INGLÉS`
**Stack**: Vite + React 18 + TypeScript + Tailwind CSS v4
**Deploy**: Vercel
**Storage**: localStorage + Google Apps Script (cloud sync opcional)
**AI**: Ollama (local) + DeepSeek (cloud fallback)

## Estructura relevante

```
src/
  components/
    layout/Header.tsx          — Navegación por tabs (6 tabs actuales)
    library/                   — LibraryView, ExpressionCard, FilterBar, QuickAddModal, ExpressionEditor
    flashcards/FlashcardView   — Repaso SM-2
    pronunciation/             — Vista de pronunciación con TTS
    practice/PracticeView      — [ELIMINAR] Práctica oral
    scripts/ParallelView       — [ELIMINAR] Scripts paralelos
    data/DataView              — Export/import + stats
    ui/                        — Modal, AudioButton, Tag, Toast
  hooks/
    useExpressions.ts          — CRUD expresiones + localStorage
    useReview.ts               — Sesión SM-2
    useScripts.ts              — [ELIMINAR] CRUD scripts
  lib/
    storage.ts                 — localStorage + cloud sync
    ai/provider.ts             — Auto-detección Ollama → DeepSeek
    ai/ollama.ts, deepseek.ts  — Providers con prompts
    spaced-repetition.ts       — Algoritmo SM-2
    tts.ts                     — Web Speech API
    utils.ts                   — Helpers
  types/index.ts               — Tipos + constantes
  data/mockData.ts             — Dataset semilla
  App.tsx                      — Root: estado + routing por tabs
```

## Convenciones del repo

- Componentes: PascalCase en `src/components/`
- Hooks/utils/services: camelCase
- Estado: `useState` en App.tsx, props drilling. Sin Context/Redux.
- UI text: español. Code: inglés.
- Commits: `feat:`, `fix:`, `refactor:` + resumen imperativo
- No emojis en UI
- Tailwind utility classes, design tokens en CSS custom properties

## Estado inicial

- **Rama base**: `main` (commit `02df73a`)
- **6 vistas activas**: library, pronunciation, flashcards, scripts, practice, data
- **~10 expresiones** en mockData.ts con 7 bloques antiguos
- **Navegación**: tabs en Header, estado `view` en App.tsx
- **AI**: auto-detección sin control del usuario (Ollama primero, DeepSeek fallback)

## 📍 Snapshot de archivos clave

| Archivo | LOC | Qué hace | Riesgo |
|---------|-----|----------|--------|
| `src/types/index.ts` | 124 | Tipos Expression, BLOCKS (7), constantes | ✅ Normal |
| `src/App.tsx` | 203 | Root: estado, routing, modales | ✅ Normal |
| `src/components/layout/Header.tsx` | 75 | Nav 6 tabs (desktop + mobile) | ✅ Normal |
| `src/components/library/LibraryView.tsx` | 131 | Vista biblioteca con filtros | ✅ Normal |
| `src/components/library/FilterBar.tsx` | 99 | Filtros: status, block, context | ✅ Normal |
| `src/components/library/ExpressionCard.tsx` | 243 | Tarjeta expandible | ✅ Normal |
| `src/components/library/QuickAddModal.tsx` | 348 | Modal adición rápida + IA | ✅ Normal |
| `src/components/library/ExpressionEditor.tsx` | 334 | Editor completo de expresiones | ✅ Normal |
| `src/components/flashcards/FlashcardView.tsx` | 227 | Repaso SM-2 | ✅ Normal |
| `src/components/data/DataView.tsx` | 208 | Export/import + stats | ✅ Normal |
| `src/data/mockData.ts` | 308 | Dataset semilla (~10 expresiones + 1 script) | ✅ Normal |
| `src/hooks/useExpressions.ts` | 43 | CRUD expresiones | ✅ Normal |
| `src/hooks/useReview.ts` | 127 | Sesión SM-2 | ✅ Normal |
| `src/lib/storage.ts` | 146 | localStorage + Google Apps Script | ✅ Normal |
| `src/lib/ai/provider.ts` | 34 | Auto-detección Ollama→DeepSeek | ✅ Normal |
| `src/lib/ai/ollama.ts` | 104 | Provider Ollama | ✅ Normal |
| `src/lib/ai/deepseek.ts` | 92 | Provider DeepSeek | ✅ Normal |

## Estructura de datos relevante

### Expression (ACTUAL)
```ts
interface Expression {
  id: string;
  english: string;
  spanish_source: string;
  meaning: string;
  pronunciation_es: string;
  stress: string;
  pronunciation_note: string;
  register: string;
  contexts: string[];
  block: string;              // ← CAMBIAR a blocks: string[]
  examples: string[];
  common_mistake: string;
  better_alternatives: string[];
  status: ExpressionStatus;   // 'new' | 'learning' | 'active' | 'mastered' | 'needs_review'
  difficulty: number;         // 1-5
  tags: string[];
  last_practiced: string | null;
  notes: string;
  ease_factor: number;        // SM-2
  interval: number;           // SM-2
  repetitions: number;        // SM-2
  next_review: string | null; // SM-2
  created_at: string;
}
```

### BLOCKS (ACTUAL — 7 bloques)
```ts
const BLOCKS = [
  'Ideas in development',
  'Clarity and structure',
  'Judgment and decisions',
  'Systems and architecture',
  'Learning and practice',
  'Memory and organization',
  'Communication',
] as const;
```

### BLOCKS (NUEVO — 10 bloques temáticos)
```ts
const BLOCKS = [
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
```

## Documentos de referencia (vocabulario del usuario)

Los documentos con el vocabulario de Enrike están en:
- `C:\Users\i-gamer\Downloads\Mapa_personal_ingles_Enrike_para_Claude.md` — ~90+ expresiones en banco de frases (sección 5), errores de traducción (sección 6), tarjetas ejemplo (sección 8)
- `C:\Users\i-gamer\Downloads\enrike-perfil-linguistico-completo.md` — ~200+ expresiones organizadas por temáticas (secciones 2-3), errores de traducción literal (sección 4), registros (sección 5), 10 bloques temáticos (sección 6)

Este documento se referencia desde cada FASE_*.md. Si algo transversal cambia, edítalo aquí — no dupliques contexto en las fases.
