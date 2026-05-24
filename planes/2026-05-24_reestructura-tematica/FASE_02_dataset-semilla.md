# FASE 02: Dataset semilla (~150+ expresiones)

> Pegar entero como primer mensaje en un chat nuevo. La skill `ejecutor-plan`
> se activará automáticamente. Carga también `./CONTEXTO.md` si no está en contexto.

**Plan-slug**: `reestructura-tematica`
**Ruta del repo**: `C:\Users\i-gamer\Documents\APP INGLÉS`

## Objetivo de esta fase

Crear un dataset semilla de ~150+ expresiones reales de Enrike en `mockData.ts`, organizadas por los 10 bloques temáticos nuevos, extraídas de los dos documentos de vocabulario (`Mapa_personal_ingles_Enrike_para_Claude.md` y `enrike-perfil-linguistico-completo.md`). Cada expresión debe tener todos los campos del tipo Expression, incluyendo pronunciación fonética española, stress, errores comunes y conexiones.

## 📍 Estado actual del código

- **Archivos afectados**: `src/data/mockData.ts` (308 LOC) — actualmente ~10 expresiones + 1 script
- **Estructura de datos relevante**: ver CONTEXTO.md. El nuevo tipo `Expression` tiene `blocks: string[]` y `related_ids: string[]` (definido en F01)
- **Punto de integración**: `storage.ts:63` — `loadExpressions()` usa `INITIAL_EXPRESSIONS` como fallback cuando localStorage está vacío
- **⚠️ Archivos monolíticos**: `mockData.ts` llegará a ~2000+ LOC con ~150 expresiones. Es aceptable para datos seed — no es código lógico.

## ✅ Criterios de aceptación

- [ ] `INITIAL_EXPRESSIONS` contiene al menos 150 expresiones
- [ ] Cada uno de los 10 bloques temáticos tiene al menos 10 expresiones
- [ ] Todas las expresiones usan `blocks: string[]` (no `block: string`)
- [ ] Todas las expresiones tienen `related_ids: string[]` (puede estar vacío, pero al menos 30% tienen al menos 1 relación)
- [ ] Cada expresión tiene todos los campos completos: english, spanish_source, meaning, pronunciation_es, stress, pronunciation_note, register, contexts, blocks, examples (≥2), common_mistake, better_alternatives, tags
- [ ] Las trampas de traducción literal (secciones de errores de ambos documentos) están marcadas como `common_mistake`
- [ ] Las muletillas y marcadores discursivos del perfil lingüístico están incluidos (¿sabes?, a ver, digamos, etc.)
- [ ] `INITIAL_SCRIPTS` se elimina del archivo (los scripts paralelos se eliminan)
- [ ] `npm run build` pasa sin errores (asumiendo que F01 se ha completado antes — si se ejecuta en paralelo, el build puede fallar por tipos incompatibles, pero el archivo en sí debe ser TypeScript válido según el schema nuevo)

## Precondiciones

- [ ] Estado del repo: rama `feat/reestructura-tematica`
- [ ] Fases previas completadas: ninguna (paraleliza con F01) — pero usa el schema NUEVO de Expression (con `blocks` y `related_ids`)
- [ ] Los documentos de vocabulario deben estar accesibles:
  - `C:\Users\i-gamer\Downloads\Mapa_personal_ingles_Enrike_para_Claude.md`
  - `C:\Users\i-gamer\Downloads\enrike-perfil-linguistico-completo.md`

## 🛠️ Herramienta recomendada

**Ejecutar con**: Claude Code
- **Justificación**: generación masiva de datos estructurados a partir de documentos de referencia. Requiere lectura de dos archivos largos y generación de ~150 objetos JSON coherentes.

## 🤖 Modelo y esfuerzo

**Claude Code** — Sonnet 4.6 · Esfuerzo: Alto
**Codex (OpenAI)** — gpt-5.4 · `reasoning.effort`: high
- **Equivalencia funcional**: Sonnet 4.6 ≈ gpt-5.4 para esta fase.
- **Justificación**: generación masiva de datos — esfuerzo alto por volumen, no por complejidad.

## 📝 Prompt ejecutable

**Archivos a leer antes de empezar**:
- `C:\Users\i-gamer\Downloads\Mapa_personal_ingles_Enrike_para_Claude.md` — banco de expresiones (sección 5), errores de traducción (sección 6), tarjetas ejemplo (sección 8), taxonomía (sección 9)
- `C:\Users\i-gamer\Downloads\enrike-perfil-linguistico-completo.md` — expresiones por temática (secciones 2-3), errores de traducción literal (sección 4), registros (sección 5), bloques temáticos (sección 6), prioridades (sección 7)
- `src/types/index.ts` — para verificar el schema de Expression (post-F01) o usar el schema nuevo descrito abajo si F01 no se ha ejecutado aún

**Schema de datos objetivo por expresión**:
```ts
{
  id: string,                   // slug del english: 'to-make-it-concrete'
  english: string,              // expresión en inglés natural
  spanish_source: string,       // cómo Enrike lo diría en castellano
  meaning: string,              // significado claro en inglés (1 frase)
  pronunciation_es: string,     // fonética en sonidos españoles: 'tu meik it CON-kriit'
  stress: string,               // sílaba(s) clave: 'CON-kriit'
  pronunciation_note: string,   // nota de pronunciación en español
  register: string,             // casual, neutral, professional, etc.
  contexts: string[],           // 3-4 contextos de uso
  blocks: string[],             // 1-3 bloques temáticos de los 10 nuevos
  examples: string[],           // 2+ frases de ejemplo
  common_mistake: string,       // error de traducción literal típico
  better_alternatives: string[],// 2-3 alternativas naturales
  related_ids: string[],        // IDs de expresiones relacionadas en el dataset
  status: 'new',                // todas empiezan como 'new'
  difficulty: number,           // 1-5
  tags: string[],               // 3-4 tags
  last_practiced: null,
  notes: '',
  ease_factor: 2.5,
  interval: 0,
  repetitions: 0,
  next_review: null,
  created_at: '2026-05-24T00:00:00.000Z',
}
```

Reescribe `src/data/mockData.ts` completamente:

1. **Elimina** `INITIAL_SCRIPTS` y su tipo import (`ParallelScript`). Solo exporta `INITIAL_EXPRESSIONS`.

2. **Genera ~150+ expresiones** extraídas de los dos documentos, organizadas así:
   - **Cinema & Storytelling** (~15): directing, screenplay, production, framing, casting, showreel, funding, festivals, subtexto, arco del personaje, etc. Frases del perfil sección 3.1.
   - **AI & Technology** (~15): prompts, workflows, vibe coding, Claude Code, LoRA, models, deployment, pipelines, tools. Frases de sección 3.2.
   - **Ideas & Creativity** (~15): aterrizar idea, brainstorming, rough idea, creative direction, pitch, visual treatment, narrative tone, conceptos. Del mapa sección 5 (Intención y foco) + perfil sección 2.3.
   - **Business & Networking** (~15): marca personal, pricing, positioning, portfolio, proposals, networking, follow-up. Perfil sección 3.3 + 3.6.
   - **Structure & Systems** (~15): rutinas, bloques, workflows, organización por capas, deep work, task management. Perfil sección 3.5 + mapa (Calidad y preferencias).
   - **Judgment & Decisions** (~15): trade-offs, pros/cons, recommendation, reframe, feedback, opiniones, evaluar. Mapa sección 5 (Lógica y argumentación, Decisión y estrategia).
   - **Inner Life & Growth** (~15): autoconocimiento, patrones, shadow, growth, vulnerability, meditation, relationships. Perfil sección 3.4.
   - **Communication** (~15): emails, follow-up, proposals, meetings, feedback, formal/informal. Perfil sección 3.6 + mapa (Peticiones y dirección).
   - **Art & Culture** (~10): museos, vanguardias, pintura, filosofía, lecturas, danza. Perfil sección 3.7.
   - **Daily Life & Social** (~10): vida en Madrid, planes, relaciones, familia, rutina diaria. Perfil sección 3.8.

3. **Muletillas y marcadores discursivos** (del perfil sección 2.1): incluir todas como expresiones en sus bloques relevantes — "¿sabes?" → "You know?", "A ver" → "So, look...", "Digamos" → "Let's say", etc. Asignarlas a `Communication` + otro bloque contextual.

4. **Estructuras sintácticas** (perfil sección 2.2): "Lo que quiero es...", "Más que X, es Y", "A la hora de...", "¿Qué pasa? Que...", etc. Asignarlas a los bloques relevantes.

5. **Expresiones propias de Enrike** (perfil sección 2.3): "Aterrizar una idea", "Cambiar el chip", "Ponerse las pilas", "Darle una vuelta", etc. Con sus trampas de traducción literal marcadas como `common_mistake`.

6. **Errores de traducción literal** (perfil sección 4 + mapa sección 6): todas deben aparecer como `common_mistake` en la expresión correspondiente.

7. **Conexiones** (`related_ids`): conecta expresiones que se usan en contextos similares. Ejemplo: "to make it concrete" se conecta con "to flesh out an idea" y "to get more granular". Al menos el 30% de expresiones deben tener ≥1 conexión.

8. **Pronunciación fonética española**: cada expresión debe tener `pronunciation_es` (cómo sonaría con fonética española) y `stress` (sílabas clave en mayúsculas). Ejemplo: `pronunciation_es: 'ai wud a-PRIISH-ieit it if iu cud...'`, `stress: 'PRIISH'`.

## 🧩 Skills y subagentes

- **Skills existentes que aplican**: ninguna
- **Skills a crear**: ninguna
- **Subagentes**: ninguno — la generación es un solo archivo grande, no se beneficia de paralelización

## 🔗 Dependencias y paralelización

- Depende de: — (usa el schema nuevo de F01 pero no necesita que F01 esté commiteada — usa el schema descrito en el prompt)
- Paraleliza con: Fase 01 (archivos disjuntos)
- **Seguridad de paralelización**: ✅ Archivos disjuntos — F02 solo toca `data/mockData.ts`
- **Si Codex**: esta fase puede lanzarse como worktree paralelo: Sí

## 🛡️ Verificación de esta fase

**Técnica**:
- [ ] `npm run build` pasa sin errores (asumiendo F01 completada)
- [ ] El archivo exporta `INITIAL_EXPRESSIONS` con ≥150 elementos
- [ ] No exporta `INITIAL_SCRIPTS`
- [ ] Criterios de aceptación ✅ repasados uno a uno

**Funcional**:
- [ ] Camino principal: cada bloque temático tiene ≥10 expresiones verificables manualmente
- [ ] Edge case: expresiones con múltiples bloques (ej: "to pitch a project" está en Cinema + Business)

**Integridad**:
- [ ] Regresión a vigilar: `storage.ts:63` — `loadExpressions()` usa `INITIAL_EXPRESSIONS` como fallback. Si el nombre del export cambia, la app no cargará datos iniciales. Verificar que el nombre se mantiene exacto.
- [ ] No incluir expresiones duplicadas (misma frase en inglés)

## 🌿 Git en esta fase

- **Antes**: rama `feat/reestructura-tematica`
- **Commit sugerido**: `feat: add 150+ seed expressions from Enrike's vocabulary`
- **Señal de finalización**:
  ```bash
  git -C "C:\Users\i-gamer\Documents\APP INGLÉS" tag reestructura-tematica-fase-02-done
  ```
- **Si falla verificación**: `git reset --hard HEAD~1` + borrar tag

## ⚠️ Riesgos de esta fase

- **Archivo muy largo**: ~2000+ LOC en mockData.ts. Es aceptable como datos seed, pero el editor puede ser lento al abrirlo. No hay riesgo funcional.
- **Pronunciación fonética imperfecta**: la fonética en español es una aproximación. El usuario corregirá según necesite.
- **Conexiones incompletas**: los `related_ids` pueden referenciar IDs que no existen si se escriben mal. Verificar que todos los IDs referenciados en `related_ids` existen como `id` de otra expresión del dataset.
- **Rollback**: `git reset --hard HEAD~1`
