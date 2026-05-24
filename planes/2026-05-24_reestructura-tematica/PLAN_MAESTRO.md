# Plan Maestro: Reestructuración temática de Sparring English OS

**Fecha**: 2026-05-24
**Proyecto**: Sparring English OS
**Plan-slug**: `reestructura-tematica`

## 🎯 Objetivo general

Reestructurar la app desde una biblioteca plana con 7 bloques genéricos a un sistema organizado por 10 bloques temáticos reales (cine, IA, creatividad, etc.), con vista principal de temas, conexiones tipo Obsidian entre expresiones, toggle manual de IA local/cloud, vista de ajustes, y ~150+ expresiones semilla del vocabulario real de Enrike. Eliminar Práctica oral y Scripts paralelos.

## 🤖 Modelo y esfuerzo globales

**Claude Code / API**
- **Modelo**: Sonnet 4.6
- **Esfuerzo**: Alto
- **Justificación**: Reestructuración multi-archivo sin complejidad algorítmica profunda. Sonnet maneja bien la creación de componentes y datos.

**Codex (OpenAI)**
- **Modelo**: gpt-5.4
- **Esfuerzo (`reasoning.effort`)**: high
- **Justificación**: Implementación estándar de componentes React + generación de dataset. No requiere gpt-5.5.

**Equivalencias funcionales para este plan**:

| Rol | Claude | Codex |
|---|---|---|
| Planificación | Opus 4.7 | gpt-5.5 |
| Implementación | Sonnet 4.6 | gpt-5.4 |
| Dataset masivo | Sonnet 4.6 | gpt-5.4 |
| Verificación | Sonnet 4.6 | gpt-5.4 |

## 🗺️ Fases

| # | Fase | Herramienta | Claude | Codex equiv. | Depende de | Paraleliza con | Documento |
|---|------|-------------|--------|-------------|------------|-----------------|-----------|
| 01 | Modelo de datos + tipos + constantes | Claude Code | Sonnet 4.6 | gpt-5.4 | — | 02 | ./FASE_01_modelo-datos.md |
| 02 | Dataset semilla (~150+ expresiones) | Claude Code | Sonnet 4.6 | gpt-5.4 | — | 01 | ./FASE_02_dataset-semilla.md |
| 03 | Navegación + vistas nuevas + limpieza | Claude Code | Sonnet 4.6 | gpt-5.4 | 01 | — | ./FASE_03_navegacion-limpieza.md |
| 04 | Vista de temas + biblioteca reestructurada | Claude Code | Sonnet 4.6 | gpt-5.4 | 01, 03 | — | ./FASE_04_temas-biblioteca.md |
| 05 | Ajustes + toggle IA + repaso por tema | Claude Code | Sonnet 4.6 | gpt-5.4 | 03, 04 | — | ./FASE_05_ajustes-repaso.md |
| 06 | Verificación de implementación y QA | Claude Code | Sonnet 4.6 | gpt-5.4 | todas | — | ./FASE_06_verificacion-implementacion.md |

## 🔀 Análisis de paralelización

**Grupos paralelos**:

| Grupo | Fases | Archivos exclusivos | Riesgo | Herramienta |
|-------|-------|---------------------|--------|-------------|
| A (paralelo) | F01, F02 | F01: `types/index.ts`, `storage.ts`, `ai/*.ts`, `useExpressions.ts` · F02: `data/mockData.ts` | ✅ Ninguno — archivos disjuntos | Codex worktrees / Claude chats separados |
| B (secuencial) | F03 | `App.tsx`, `Header.tsx`, eliminar archivos | ⚠️ Requiere F01 (tipos nuevos) | Claude Code |
| C (secuencial) | F04 | Crear `ThemesView.tsx`, modificar `LibraryView.tsx`, `ExpressionCard.tsx`, `FilterBar.tsx` | ⚠️ Requiere F01 + F03 | Claude Code |
| D (secuencial) | F05 | Crear `SettingsView.tsx`, modificar `FlashcardView.tsx`, `useReview.ts`, `DataView.tsx` | ⚠️ Requiere F03 + F04 | Claude Code |
| Final | F06 | Verificación global | 🔒 Depende de todas | Claude Code |

**Diagrama de ejecución**:
```
F01 ─┐
     ├─→ F03 ─→ F04 ─→ F05 ─→ F06 (verificación)
F02 ─┘
```

**Recomendación**:
- **Codex**: lanzar F01 y F02 como tareas paralelas en worktrees separados. F03+ secuencial.
- **Claude Code**: abrir un chat para F01, otro para F02 (paralelos). F03-F06: pegar cada fase en un chat nuevo (cola por git tags para las auto-encolables, manual para las visuales).

## 🔍 Análisis de automatización

| # | Fase | Clasificación | Razón |
|---|------|---------------|-------|
| 01 | Tipos + constantes | ✅ Auto-encolable | Solo archivos de código, `npm run build` verifica |
| 02 | Dataset semilla | ✅ Auto-encolable | Solo `mockData.ts`, `npm run build` verifica |
| 03 | Nav + limpieza | ✅ Auto-encolable | Eliminar/crear archivos, `npm run build` verifica |
| 04 | Temas + biblioteca | ⚠️ Manual | Requiere verificación visual de la UI |
| 05 | Ajustes + toggle IA | ⚠️ Manual | Requiere verificación visual + test de servicios |
| 06 | Verificación final | ⚠️ Manual | QA global con inspección visual |

**Cadena automática posible**: F01 ∥ F02 → F03 → ⏸️ F04 (manual) → ⏸️ F05 (manual) → ⏸️ F06 (manual)

## 🔗 Cola autónoma por git tags

> ⚠️ Limitación honesta: esta cola es frágil — depende de mantener abiertos los chats,
> no recupera si una fase falla a mitad. Para cadenas >4 fases o ejecuciones largas
> sin supervisión, usa `run-plan` (script externo que encadena las fases sin chats).

- Tags por fase: `reestructura-tematica-fase-NN-done`
- Antes de arrancar (si reejecutas el plan), borra tags viejos:
  `git tag -d $(git tag -l "reestructura-tematica-fase-*-done")`
- Pega cada FASE en un chat distinto; las auto-encolables esperarán al tag previo vía `Monitor`.
- Las ⚠️ Manual rompen la cadena — el usuario verifica visualmente y arranca manualmente la siguiente.

## 🛡️ Verificación global

Cada fase tiene su propia verificación. La F06 es QA global: `npm run build` + revisión de todas las vistas + test de servicios + verificación de migración de datos.

## 🌿 Estrategia de Git

- **Rama sugerida**: `feat/reestructura-tematica`
- **Commits**: uno por fase completada y verificada
- **Formato**: `feat: <resumen imperativo>` / `refactor: <resumen>` según la fase
- **Rollback global**: `git checkout main` + `git branch -D feat/reestructura-tematica` (si no se ha pusheado)

## 🚀 Despliegue

- `git push origin feat/reestructura-tematica`
- PR a main con `gh pr create` o merge directo
- Vercel auto-deploy al detectar push en main
- Smoke test post-deploy: abrir app en tablet y desktop, verificar las 5 vistas nuevas

## ⚠️ Riesgos globales

- **Migración de datos**: el cambio de `block: string` a `blocks: string[]` romperá localStorage existente. La F01 incluye lógica de migración automática en `storage.ts`.
- **Dataset masivo**: ~150+ expresiones harán `mockData.ts` un archivo largo (~2000+ LOC). Es aceptable como seed data — no es código lógico.
- **AI prompts desactualizados**: los prompts de `ollama.ts` y `deepseek.ts` tienen los 7 bloques hardcodeados — se actualizan en F01.
- **Regresión en flashcards**: al añadir filtro por tema a `useReview.ts`, no romper el flujo SM-2. F05 incluye verificación específica.
- **localStorage stale**: usuarios con datos viejos necesitan migración transparente. Cubierto en F01.

## 📌 Cómo usar este plan

1. Lee `CONTEXTO.md` para situarte.
2. **Opción manual (chats separados)**: abre un chat nuevo por fase, pega el contenido entero de `FASE_XX_<slug>.md`. La skill `ejecutor-plan` se activará. Las fases dependientes esperarán solas al tag de la previa.
3. **Opción autónoma (sin chats)**: desde la carpeta del plan, lanza `run-plan` — ejecuta todas las fases auto-encolables en serie/paralelo hasta que encuentre una ⚠️ Manual.
4. Las fases ⚠️ Manual siempre requieren tu intervención y rompen la cadena automática.
