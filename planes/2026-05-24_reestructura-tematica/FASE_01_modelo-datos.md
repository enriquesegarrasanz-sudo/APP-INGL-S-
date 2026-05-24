# FASE 01: Modelo de datos + tipos + constantes

> Pegar entero como primer mensaje en un chat nuevo. La skill `ejecutor-plan`
> se activará automáticamente. Carga también `./CONTEXTO.md` si no está en contexto.

**Plan-slug**: `reestructura-tematica`
**Ruta del repo**: `C:\Users\i-gamer\Documents\APP INGLÉS`

## Objetivo de esta fase

Actualizar el modelo de datos de Expression: cambiar `block: string` a `blocks: string[]` (multi-bloque), añadir `related_ids: string[]` (conexiones tipo Obsidian), reemplazar los 7 BLOCKS antiguos por los 10 nuevos, actualizar los prompts de IA, y añadir migración automática de datos antiguos en storage.

## 📍 Estado actual del código

- **Archivos afectados**:
  - `src/types/index.ts` (124 LOC) — tipos + constantes BLOCKS
  - `src/hooks/useExpressions.ts` (43 LOC) — CRUD, debe adaptarse a `blocks`
  - `src/lib/storage.ts` (146 LOC) — persistencia, necesita migración
  - `src/lib/ai/ollama.ts` (104 LOC) — prompt con BLOCKS viejos hardcodeados
  - `src/lib/ai/deepseek.ts` (92 LOC) — prompt con BLOCKS viejos hardcodeados
  - `src/lib/ai/provider.ts` (34 LOC) — sin cambios funcionales, pero el tipo `AIAutoFillResult` cambia
- **Estructura de datos relevante**: ver CONTEXTO.md — `Expression.block: string` → `blocks: string[]`, BLOCKS 7 → 10
- **Puntos de integración**:
  - `storage.ts:63` — `loadExpressions()` usa INITIAL_EXPRESSIONS como fallback
  - `deepseek.ts:24` — bloques hardcodeados en el prompt
  - `ollama.ts:24` — bloques hardcodeados en el prompt
- **⚠️ Archivos monolíticos**: ninguno

## ✅ Criterios de aceptación

- [ ] `Expression.block` ya no existe; `Expression.blocks: string[]` está definido
- [ ] `Expression.related_ids: string[]` está definido
- [ ] `BLOCKS` contiene exactamente los 10 bloques nuevos: Cinema & Storytelling, AI & Technology, Ideas & Creativity, Business & Networking, Structure & Systems, Judgment & Decisions, Inner Life & Growth, Communication, Art & Culture, Daily Life & Social
- [ ] `AIAutoFillResult.block` cambiado a `blocks: string[]`
- [ ] `storage.ts` contiene función `migrateExpression()` que convierte `block: string` → `blocks: string[]` y mapea bloques viejos a nuevos
- [ ] `loadExpressions()` aplica migración automáticamente al cargar datos antiguos
- [ ] Los prompts de `ollama.ts` y `deepseek.ts` listan los 10 bloques nuevos y piden `blocks` (array) en vez de `block` (string)
- [ ] `npm run build` pasa sin errores ni warnings nuevos
- [ ] No hay regresión: `AppData`, `ReviewSession`, `ReviewResult` no se han modificado

## Precondiciones

- [ ] Estado del repo: rama `feat/reestructura-tematica` creada desde `main`
- [ ] Fases previas completadas: ninguna

## 🛠️ Herramienta recomendada

**Ejecutar con**: Claude Code
- **Justificación**: cambios quirúrgicos en 6 archivos con lógica de migración. No requiere paralelización.

## 🤖 Modelo y esfuerzo

**Claude Code** — Sonnet 4.6 · Esfuerzo: Medio
**Codex (OpenAI)** — gpt-5.4 · `reasoning.effort`: medium
- **Equivalencia funcional**: Sonnet 4.6 ≈ gpt-5.4 para esta fase.
- **Justificación**: cambios de tipos, constantes y migración — no hay complejidad algorítmica.

## 📝 Prompt ejecutable

**Archivos a leer antes de empezar**:
- `src/types/index.ts` — para ver los tipos actuales y constantes
- `src/lib/storage.ts` — para entender cómo se cargan/guardan las expresiones
- `src/lib/ai/deepseek.ts` — para ver el prompt con bloques hardcodeados
- `src/lib/ai/ollama.ts` — para ver el prompt con bloques hardcodeados
- `src/hooks/useExpressions.ts` — para adaptar el CRUD al nuevo tipo

**Schema de datos objetivo**:
```ts
interface Expression {
  // ... todos los campos actuales EXCEPTO block ...
  blocks: string[];         // ANTES: block: string — ahora array multi-bloque
  related_ids: string[];    // NUEVO — IDs de expresiones relacionadas (conexiones Obsidian)
  // ... SM-2 fields sin cambio ...
}

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

// Nuevo tipo para metadata de bloque temático
interface ThemeBlock {
  id: string;        // slug: 'cinema-storytelling'
  label: string;     // 'Cinema & Storytelling'
  label_es: string;  // 'Cine y Narrativa'
  description: string; // descripción corta en español
  priority: number;  // 1-4 (del perfil lingüístico)
}

const THEME_BLOCKS: ThemeBlock[] = [
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
```

1. En `src/types/index.ts`:
   - Reemplaza `block: string` por `blocks: string[]` en `Expression`
   - Añade `related_ids: string[]` a `Expression`
   - Reemplaza el array `BLOCKS` con los 10 nuevos
   - Añade la interfaz `ThemeBlock` y la constante `THEME_BLOCKS` con los 10 bloques + metadata (label_es, description, priority)
   - Cambia `AIAutoFillResult.block` a `blocks: string[]`
   - Elimina `ParallelScript`, `ScriptBlock` (se eliminan en F03)
   - Elimina `ParallelScript` de `AppData` (cambia `scripts` a opcional o elimínalo)

2. En `src/lib/storage.ts`:
   - Añade función `migrateExpression(expr: any): Expression` que:
     - Si `expr.block` existe (string), conviértelo a `expr.blocks = [mapOldBlock(expr.block)]` y borra `expr.block`
     - Si `expr.blocks` no existe, asigna `['Communication']` como default
     - Si `expr.related_ids` no existe, asigna `[]`
     - Mapeo de bloques viejos → nuevos: `Ideas in development` → `Ideas & Creativity`, `Clarity and structure` → `Structure & Systems`, `Judgment and decisions` → `Judgment & Decisions`, `Systems and architecture` → `AI & Technology`, `Learning and practice` → `Ideas & Creativity`, `Memory and organization` → `Structure & Systems`, `Communication` → `Communication`
   - Modifica `loadExpressions()` para aplicar `migrateExpression()` a cada expresión cargada
   - Elimina las funciones de scripts (`loadScripts`, `saveScripts`) — se limpiarán en F03
   - NO eliminar todavía los imports de ParallelScript si dan error de tipo — F03 lo hará

3. En `src/lib/ai/ollama.ts` y `src/lib/ai/deepseek.ts`:
   - Actualiza el prompt: reemplaza la lista de 7 bloques por los 10 nuevos
   - Cambia `"block": "one of: ..."` por `"blocks": ["1-3 relevant blocks from: Cinema & Storytelling, AI & Technology, ...]`
   - El resultado ahora devuelve `blocks: string[]` en vez de `block: string`

4. En `src/hooks/useExpressions.ts`:
   - Actualiza `NewExpression` Omit para excluir los campos correctos
   - En `addExpression`, asegúrate de que `related_ids: []` se añade al crear

5. NO tocar: `App.tsx`, `Header.tsx`, componentes de vistas, `useReview.ts`, `spaced-repetition.ts`.

## 🧩 Skills y subagentes

- **Skills existentes que aplican**: ninguna
- **Skills a crear**: ninguna
- **Subagentes**: ninguno

## 🔗 Dependencias y paralelización

- Depende de: —
- Paraleliza con: Fase 02 (dataset semilla — archivos disjuntos)
- **Seguridad de paralelización**: ✅ Archivos disjuntos — F01 toca `types/`, `storage.ts`, `ai/`, `hooks/`; F02 toca solo `data/mockData.ts`
- **Si Codex**: esta fase puede lanzarse como worktree paralelo: Sí
- Tareas internas paralelizables: ninguna

## 🛡️ Verificación de esta fase

**Técnica**:
- [ ] `npm run build` pasa sin errores
- [ ] Criterios de aceptación ✅ repasados uno a uno

**Funcional**:
- [ ] Camino principal: la app carga sin errores con datos viejos en localStorage (migración automática)
- [ ] Edge case: si localStorage está vacío, carga INITIAL_EXPRESSIONS (que aún tienen formato viejo en F01 — la migración los convierte)

**Integridad**:
- [ ] Regresión a vigilar: `FlashcardView.tsx` usa `expr.block` para mostrar — compilará con error hasta que F04 lo adapte. **Es esperado** que el build falle si se ejecuta antes de F03/F04, pero F01 aislada debe compilar con los tipos actualizados.
- [ ] Los archivos de componentes que usan `expr.block` tendrán errores de TypeScript — es correcto, se resuelven en F03/F04. Pero el build en aislamiento de F01 puede fallar. **Solución**: en esta fase, tras cambiar el tipo, actualiza todas las referencias directas a `expr.block` en los componentes para usar `expr.blocks[0]` o `expr.blocks.join(', ')` como placeholder temporal. Archivos afectados: `ExpressionCard.tsx:63`, `FilterBar.tsx` (dropdown de bloques), `QuickAddModal.tsx`, `ExpressionEditor.tsx`.

## 🌿 Git en esta fase

- **Antes**: crear rama `feat/reestructura-tematica` desde `main`
- **Commit sugerido**: `feat: update data model to multi-block themes with migration`
- **Señal de finalización**:
  ```bash
  git -C "C:\Users\i-gamer\Documents\APP INGLÉS" tag reestructura-tematica-fase-01-done
  ```
- **Si falla verificación**: `git reset --hard HEAD~1` + borrar tag: `git -C "C:\Users\i-gamer\Documents\APP INGLÉS" tag -d reestructura-tematica-fase-01-done`

## ⚠️ Riesgos de esta fase

- **Componentes que usan `expr.block`**: tras el cambio de tipo, todos los componentes que leen `expr.block` fallarán en TypeScript. Hay que parchear temporalmente con `expr.blocks[0]`. Archivos: ExpressionCard, FilterBar, QuickAddModal, ExpressionEditor.
- **Migración imperfecta**: si el mapeo old→new pierde contexto, el usuario podría encontrar expresiones en bloques incorrectos. El mapeo propuesto es conservador.
- **Rollback**: `git reset --hard HEAD~1` (un commit, todo local)
