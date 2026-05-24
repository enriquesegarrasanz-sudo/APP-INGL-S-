# FASE 06: Verificación de implementación y QA

> ⚠️ Fase manual — requiere inspección visual completa de todas las vistas.

> Pegar entero como primer mensaje en un chat nuevo. La skill `ejecutor-plan`
> se activará automáticamente. Carga también `./CONTEXTO.md` si no está en contexto.

**Plan-slug**: `reestructura-tematica`
**Ruta del repo**: `C:\Users\i-gamer\Documents\APP INGLÉS`

## Objetivo de esta fase

Verificar que todo lo planificado en las fases 01-05 está implementado correctamente, el build pasa, no hay regresiones, y la app funciona visualmente en desktop (1280px) y tablet (768px).

## 📍 Estado actual del código

- **Archivos verificados**: todos los tocados en F01-F05
- **Fases previas completadas**: todas (F01-F05)

## ✅ Criterios de aceptación (checklist global)

### Modelo de datos (F01)
- [ ] `Expression` tiene `blocks: string[]` (no `block: string`)
- [ ] `Expression` tiene `related_ids: string[]`
- [ ] `BLOCKS` tiene 10 bloques temáticos
- [ ] `THEME_BLOCKS` tiene metadata completa (label_es, description, priority)
- [ ] `ParallelScript` y `ScriptBlock` eliminados de types
- [ ] Migración automática funciona: datos viejos con `block: string` se convierten a `blocks: string[]`

### Dataset (F02)
- [ ] `INITIAL_EXPRESSIONS` tiene ≥150 expresiones
- [ ] Cada bloque tiene ≥10 expresiones
- [ ] Todos los campos están completos en cada expresión
- [ ] ≥30% de expresiones tienen `related_ids` con al menos 1 conexión
- [ ] Los IDs en `related_ids` referencian expresiones que existen en el dataset
- [ ] `INITIAL_SCRIPTS` eliminado

### Navegación (F03)
- [ ] 5 tabs: Temas, Biblioteca, Pronunciación, Repaso, Ajustes
- [ ] Vista por defecto: Temas
- [ ] Archivos eliminados: PracticeView, ParallelView, ScriptEditor, useScripts
- [ ] No quedan imports ni referencias a archivos eliminados

### Vista de Temas (F04)
- [ ] Grid de 10 bloques temáticos con nombre ES/EN, conteo, progreso
- [ ] Clicar bloque → Biblioteca filtrada por ese bloque
- [ ] Biblioteca con toggle "Vista general" / "Por temas"
- [ ] ExpressionCard muestra múltiples bloques como tags
- [ ] ExpressionCard muestra expresiones relacionadas con links
- [ ] Clicar expresión relacionada → scroll + expandir

### Ajustes y Repaso (F05)
- [ ] SettingsView con 3 secciones: IA, Sincronización, Datos
- [ ] Toggle de IA funciona: Auto / Local / DeepSeek
- [ ] Estado de servicios: indicadores verde/rojo
- [ ] Export/import JSON y Markdown funcionan
- [ ] FlashcardView tiene selector de tema antes de empezar sesión
- [ ] Repaso filtrado por tema funciona correctamente

## Precondiciones

- [ ] Fases F01-F05 completadas
- [ ] Tags: `reestructura-tematica-fase-01-done` a `reestructura-tematica-fase-05-done`

## 🛠️ Herramienta recomendada

**Ejecutar con**: Claude Code
- **Justificación**: verificación global, build check, inspección visual.

## 🤖 Modelo y esfuerzo

**Claude Code** — Sonnet 4.6 · Esfuerzo: Medio
**Codex (OpenAI)** — gpt-5.4 · `reasoning.effort`: medium
- **Justificación**: verificación, no implementación. Esfuerzo medio.

## 📝 Prompt ejecutable

**Archivos a leer antes de empezar**:
- `src/types/index.ts` — verificar modelo de datos
- `src/data/mockData.ts` — verificar dataset (al menos cabecera y conteo)
- `src/App.tsx` — verificar routing y estado
- `src/components/layout/Header.tsx` — verificar tabs
- `src/components/themes/ThemesView.tsx` — verificar implementación
- `src/components/settings/SettingsView.tsx` — verificar implementación
- `src/components/library/LibraryView.tsx` — verificar reestructuración
- `src/components/library/ExpressionCard.tsx` — verificar conexiones
- `src/components/flashcards/FlashcardView.tsx` — verificar selector de tema
- `src/hooks/useReview.ts` — verificar filtro por bloque
- `src/lib/ai/provider.ts` — verificar toggle de IA
- `src/lib/storage.ts` — verificar migración

Ejecuta estas comprobaciones en orden:

1. **Build completo**: `npm run build`. Debe pasar sin errores ni warnings nuevos. Si falla, diagnostica y corrige antes de continuar.

2. **Checklist de implementación**: repasa cada punto de la checklist de criterios de aceptación arriba. Para cada uno:
   - Lee el archivo relevante y verifica que la implementación existe
   - Si falta algo, impleméntalo antes de continuar
   - Marca como completado en tu respuesta

3. **Verificación de archivos eliminados**: confirma que estos archivos NO existen:
   - `src/components/practice/PracticeView.tsx`
   - `src/components/scripts/ParallelView.tsx`
   - `src/components/scripts/ScriptEditor.tsx`
   - `src/hooks/useScripts.ts`
   - `src/components/data/DataView.tsx`

4. **Verificación de archivos creados**: confirma que estos archivos EXISTEN y no son placeholders vacíos:
   - `src/components/themes/ThemesView.tsx`
   - `src/components/settings/SettingsView.tsx`
   - `src/hooks/useAIPreference.ts`

5. **Verificación de integridad del dataset**:
   - Contar expresiones en INITIAL_EXPRESSIONS
   - Verificar que cada bloque tiene ≥10
   - Verificar que related_ids referencian IDs existentes (script de validación)

6. **Verificación de migración**: limpiar localStorage (`localStorage.removeItem('sparring-expressions')`) y recargar — debe cargar las nuevas expresiones seed. Luego simular datos viejos con `block: string` y verificar que se migran.

7. **Regresiones a vigilar**:
   - Pronunciación: ¿la vista lista expresiones? ¿TTS funciona?
   - Flashcards: ¿se puede iniciar una sesión? ¿el SM-2 calcula correctamente?
   - Library: ¿los filtros funcionan con los 10 bloques nuevos?
   - Editor: ¿se pueden crear/editar expresiones con múltiples bloques?
   - Quick Add: ¿la IA auto-fill funciona (si hay servicio disponible)?

8. **Verificación visual** (con preview tools o manual):
   - Desktop (1280px): Temas, Biblioteca (ambas vistas), Repaso, Ajustes
   - Tablet (768px): mismas vistas

9. **Estado final**:
   - Si todo pasa: commit final con mensaje `feat: verify restructuring implementation`
   - Crear tag: `reestructura-tematica-fase-06-done`
   - Si algo falla: describe el problema exacto. No avances al deploy.

## 🧩 Skills y subagentes

- **Skills existentes que aplican**: `verificador-implementacion` (para validación automática si existe)
- **Skills a crear**: ninguna
- **Subagentes**: Explore (para búsqueda de imports huérfanos — `grep -r "PracticeView\|ParallelView\|ScriptEditor\|useScripts\|DataView" src/`)

## 🔗 Dependencias y paralelización

- Depende de: todas las fases anteriores (F01-F05)
- Paraleliza con: —
- **Seguridad de paralelización**: 🔒 Depende de todas — última fase

## 🛡️ Verificación de esta fase

**Técnica**:
- [ ] `npm run build` pasa sin errores
- [ ] No quedan imports huérfanos a archivos eliminados (grep confirms 0 matches)

**Funcional**:
- [ ] Todos los caminos principales verificados (ver checklist arriba)

**Integridad**:
- [ ] No hay datos perdidos en la migración
- [ ] El SM-2 funciona correctamente con el dataset nuevo

## 🌿 Git en esta fase

- **Antes**: rama `feat/reestructura-tematica`, F05 completada
- **Commit sugerido**: `feat: verify restructuring implementation`
- **Señal de finalización**:
  ```bash
  git -C "C:\Users\i-gamer\Documents\APP INGLÉS" tag reestructura-tematica-fase-06-done
  ```

## ⚠️ Riesgos de esta fase

- **Falsos positivos**: verificar visualmente, no solo que compila
- **Rollback**: no aplica — esta fase no modifica código salvo correcciones menores
