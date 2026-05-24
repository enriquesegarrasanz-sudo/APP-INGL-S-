# FASE 04: Vista de temas + biblioteca reestructurada

> ⚠️ Fase manual — requiere verificación visual de la UI tras implementar.

> Pegar entero como primer mensaje en un chat nuevo. La skill `ejecutor-plan`
> se activará automáticamente. Carga también `./CONTEXTO.md` si no está en contexto.

**Plan-slug**: `reestructura-tematica`
**Ruta del repo**: `C:\Users\i-gamer\Documents\APP INGLÉS`

## Objetivo de esta fase

Implementar la vista principal de Temas (grid de bloques temáticos con progreso) y reestructurar la Biblioteca para organizar expresiones por tema con vista jerárquica, filtros por bloque, y conexiones tipo Obsidian (ver expresiones relacionadas). Incluir navegación de Temas → detalle de bloque con las expresiones de ese tema.

## 📍 Estado actual del código

- **Archivos afectados**:
  - `src/components/themes/ThemesView.tsx` — placeholder creado en F03
  - `src/components/library/LibraryView.tsx` (131 LOC) — vista plana actual
  - `src/components/library/FilterBar.tsx` (99 LOC) — filtros con bloques viejos
  - `src/components/library/ExpressionCard.tsx` (243 LOC) — muestra `expr.block` (ahora `blocks`)
  - `src/App.tsx` — routing y estado de filtros
- **Puntos de integración**:
  - `App.tsx:29-30` — estado de filtros (`filterBlock`, etc.)
  - `App.tsx:49-65` — lógica de filtrado `filtered` con `e.block`
  - `App.tsx:110-131` — rendering de LibraryView con props
  - `ExpressionCard.tsx:63` — `<Tag>{expr.block}</Tag>` → debe usar `expr.blocks`
  - `FilterBar.tsx` — dropdown de bloques usa `BLOCKS` antiguo
- **⚠️ Archivos monolíticos**: ninguno

## ✅ Criterios de aceptación

- [ ] Vista Temas muestra un grid de 10 cards temáticas, cada una con: nombre en español, nombre en inglés, conteo de expresiones, barra de progreso (% mastered+active vs total)
- [ ] Clicar un bloque temático navega a la Biblioteca filtrada por ese bloque
- [ ] La Biblioteca tiene una vista jerárquica: cabeceras de sección por bloque temático, con las expresiones agrupadas debajo
- [ ] La Biblioteca tiene un toggle "Vista general" / "Por temas" — la vista general muestra todas las expresiones sin agrupar (como antes)
- [ ] El filtro de bloques en FilterBar muestra los 10 bloques nuevos
- [ ] ExpressionCard muestra todos los bloques de la expresión (tags múltiples, no solo uno)
- [ ] ExpressionCard muestra una sección "Relacionadas" cuando hay `related_ids`, con links a esas expresiones
- [ ] Al clicar una expresión relacionada, se expande la tarjeta de esa expresión (o se scrollea a ella)
- [ ] `npm run build` pasa sin errores
- [ ] No hay regresión en: pronunciación, flashcards

## Precondiciones

- [ ] Estado del repo: rama `feat/reestructura-tematica`
- [ ] Fases previas completadas: Fase 01 (tipos), Fase 03 (navegación + placeholder)
- [ ] Tag esperado: `reestructura-tematica-fase-03-done`
- [ ] Idealmente F02 también completada (dataset semilla) para tener datos reales

## 🛠️ Herramienta recomendada

**Ejecutar con**: Claude Code
- **Justificación**: implementación de UI compleja con lógica de estado. Requiere verificación visual.

## 🤖 Modelo y esfuerzo

**Claude Code** — Sonnet 4.6 · Esfuerzo: Alto
**Codex (OpenAI)** — gpt-5.4 · `reasoning.effort`: high
- **Equivalencia funcional**: Sonnet 4.6 ≈ gpt-5.4 para esta fase.
- **Justificación**: componentes React con lógica de filtrado y navegación entre vistas.

## 📝 Prompt ejecutable

**Archivos a leer antes de empezar**:
- `src/components/themes/ThemesView.tsx` — placeholder a reemplazar
- `src/components/library/LibraryView.tsx` — estructura actual a reestructurar
- `src/components/library/FilterBar.tsx` — filtros a actualizar
- `src/components/library/ExpressionCard.tsx` — card a modificar (blocks + related)
- `src/App.tsx` — estado y routing actual
- `src/types/index.ts` — THEME_BLOCKS y tipo Expression

1. **IMPLEMENTAR `src/components/themes/ThemesView.tsx`** (reescribir el placeholder):

   Props: `expressions: Expression[]`, `onNavigateToBlock: (blockLabel: string) => void`

   Diseño:
   - Título: "Temas" (h2, font-black)
   - Grid responsivo: 2 columnas en tablet, 3-4 en desktop
   - Cada card de tema:
     - Nombre en español (label_es de THEME_BLOCKS) como título
     - Nombre en inglés (label) como subtítulo en text-muted
     - Descripción corta
     - Conteo: "X expresiones"
     - Barra de progreso: (mastered + active) / total * 100%
     - Indicador de prioridad (si priority === 1, mostrar un badge sutil)
     - onClick → `onNavigateToBlock(block.label)`
   - Estilo: bg-card, border-border-light, rounded-xl, hover:shadow-md. Colores por prioridad:
     - P1: borde accent sutil
     - P2-P4: borde normal

2. **REESTRUCTURAR `src/components/library/LibraryView.tsx`**:

   Nuevas props adicionales: `viewMode: 'all' | 'grouped'`, `setViewMode`, `activeBlock: string | null`

   Cambios:
   - Añadir toggle "Vista general" / "Por temas" (dos botones, estilo tab)
   - Si `viewMode === 'grouped'`:
     - Agrupar expresiones por bloque (una expresión puede aparecer en varios grupos)
     - Mostrar cabecera de sección con nombre del bloque + conteo
     - Cada sección es colapsable
     - Si `activeBlock` está definido (viniendo de ThemesView), expandir solo ese bloque
   - Si `viewMode === 'all'`: renderizado actual (lista plana)
   - Mantener los botones de "Expresión rápida" y "Editor completo"

3. **ACTUALIZAR `src/components/library/FilterBar.tsx`**:
   - Actualizar el dropdown de bloques para usar `THEME_BLOCKS` (o `BLOCKS` con los 10 nuevos)
   - Mostrar label_es como texto visible del dropdown, label como value

4. **ACTUALIZAR `src/components/library/ExpressionCard.tsx`**:
   - Donde muestra `<Tag>{expr.block}</Tag>`, cambiar a mapear `expr.blocks` (multiple tags)
   - Añadir sección "Expresiones relacionadas" al final del contenido expandido:
     - Si `expr.related_ids.length > 0`, mostrar una lista de links
     - Cada link muestra el `english` de la expresión relacionada
     - Al clicar → expandir esa tarjeta (callback `onNavigateToExpression(id)`)
   - Nueva prop: `allExpressions: Expression[]` (para resolver related_ids a nombres)
   - Nueva prop: `onNavigateToExpression: (id: string) => void`

5. **ACTUALIZAR `src/App.tsx`**:
   - Añadir estado: `viewMode: 'all' | 'grouped'` (default `'all'`), `activeBlock: string | null` (default `null`)
   - Añadir handler: `handleNavigateToBlock(blockLabel: string)` → cambia view a 'library', viewMode a 'grouped', activeBlock a blockLabel, filterBlock al blockLabel
   - Añadir handler: `handleNavigateToExpression(id: string)` → cambia expandedCard a id, scrollea al card
   - Actualizar ThemesView: `<ThemesView expressions={expressions} onNavigateToBlock={handleNavigateToBlock} />`
   - Actualizar LibraryView: pasar `viewMode`, `setViewMode`, `activeBlock`, `onNavigateToExpression`
   - Actualizar ExpressionCard en LibraryView: pasar `allExpressions` y `onNavigateToExpression`
   - Actualizar la lógica de filtrado `filtered`: cambiar `e.block !== filterBlock` a `!e.blocks.includes(filterBlock)` para soportar multi-bloque

6. **NO tocar**: FlashcardView, PronunciationView, SettingsView, useReview, storage, AI providers

## 🧩 Skills y subagentes

- **Skills existentes que aplican**: `mobile-adapter` (si hay que verificar responsive) — ejecutar después como verificación
- **Skills a crear**: ninguna
- **Subagentes**: ninguno

## 🔗 Dependencias y paralelización

- Depende de: Fase 01, Fase 03
- Paraleliza con: —
- **Seguridad de paralelización**: 🔒 Secuencial obligatorio — modifica archivos compartidos
- **Si Codex**: No paralelizable

## 🛡️ Verificación de esta fase

**Técnica**:
- [ ] `npm run build` pasa sin errores
- [ ] Criterios de aceptación ✅ repasados uno a uno

**Funcional**:
- [ ] Camino principal: abrir app → ver 10 bloques temáticos → clicar "Cine y Narrativa" → ver biblioteca filtrada con expresiones de Cinema & Storytelling
- [ ] Edge case: expresión con múltiples bloques aparece en ambos grupos en vista "Por temas"
- [ ] Edge case: clicar expresión relacionada expande la card correspondiente
- [ ] Verificar en desktop (1280px) y tablet (768px)

**Integridad**:
- [ ] Regresión a vigilar: `PronunciationView` — lista de expresiones puede romperse si algo cambió en el modelo de datos
- [ ] Regresión a vigilar: `FlashcardView` — no debe verse afectada (no toca useReview)
- [ ] Regresión a vigilar: lógica de filtrado en App.tsx — la función `filtered` debe filtrar correctamente con `blocks.includes()` en vez de `=== block`

## 🌿 Git en esta fase

- **Antes**: rama `feat/reestructura-tematica`, F03 completada
- **Commit sugerido**: `feat: implement themes grid and restructured library with connections`
- **Señal de finalización**:
  ```bash
  git -C "C:\Users\i-gamer\Documents\APP INGLÉS" tag reestructura-tematica-fase-04-done
  ```
- **Si falla verificación**: `git reset --hard HEAD~1` + borrar tag

## ⚠️ Riesgos de esta fase

- **UI compleja**: la vista de temas con progreso y la biblioteca con agrupación son los componentes más complejos del plan. Verificar visualmente.
- **Multi-bloque en agrupación**: una expresión con 3 bloques aparecerá 3 veces en vista "Por temas". Puede confundir, pero es el comportamiento correcto (tipo Obsidian).
- **Scroll to expression**: navegar a una expresión relacionada requiere scroll automático. Usar `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`.
- **Rollback**: `git reset --hard HEAD~1`
