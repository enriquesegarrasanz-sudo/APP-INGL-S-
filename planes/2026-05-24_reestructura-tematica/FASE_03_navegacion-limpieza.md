# FASE 03: Navegación + vistas nuevas + limpieza

> Pegar entero como primer mensaje en un chat nuevo. La skill `ejecutor-plan`
> se activará automáticamente. Carga también `./CONTEXTO.md` si no está en contexto.

**Plan-slug**: `reestructura-tematica`
**Ruta del repo**: `C:\Users\i-gamer\Documents\APP INGLÉS`

## Objetivo de esta fase

Reestructurar la navegación de la app: eliminar las vistas de Práctica oral y Scripts paralelos (archivos + referencias), actualizar los tabs del Header a las 5 vistas nuevas (Temas, Biblioteca, Pronunciación, Repaso, Ajustes), limpiar App.tsx de todo lo relacionado con scripts y practice, y crear los archivos placeholder para las vistas nuevas (ThemesView, SettingsView).

## 📍 Estado actual del código

- **Archivos afectados**:
  - `src/App.tsx` (203 LOC) — imports de ParallelView, PracticeView, ScriptEditor + useScripts; routing; modales de scripts
  - `src/components/layout/Header.tsx` (75 LOC) — array TABS con 6 entries
  - `src/components/practice/PracticeView.tsx` (179 LOC) — [ELIMINAR]
  - `src/components/scripts/ParallelView.tsx` (164 LOC) — [ELIMINAR]
  - `src/components/scripts/ScriptEditor.tsx` (209 LOC) — [ELIMINAR]
  - `src/hooks/useScripts.ts` (25 LOC) — [ELIMINAR]
  - `src/lib/storage.ts` (146 LOC) — tiene funciones loadScripts/saveScripts
  - `src/types/index.ts` — tiene tipos ParallelScript/ScriptBlock (si no se eliminaron en F01)
- **Puntos de integración**:
  - `App.tsx:5` — `import { useScripts } from './hooks/useScripts'`
  - `App.tsx:14-15` — imports de ParallelView, ScriptEditor, PracticeView
  - `App.tsx:25` — `const { scripts, addScript, updateScript, deleteScript } = useScripts()`
  - `App.tsx:39-40` — estado de showScriptEditor, editingScript
  - `App.tsx:86-96` — handleSaveScript callback
  - `App.tsx:150-166` — rendering de scripts y practice views
  - `App.tsx:194-200` — ScriptEditor modal
  - `Header.tsx:6-13` — array TABS
- **⚠️ Archivos monolíticos**: ninguno

## ✅ Criterios de aceptación

- [ ] Los archivos `PracticeView.tsx`, `ParallelView.tsx`, `ScriptEditor.tsx`, `useScripts.ts` están eliminados
- [ ] `App.tsx` no contiene imports ni referencias a scripts, practice, useScripts, ParallelView, ScriptEditor, PracticeView
- [ ] `App.tsx` ya no tiene estado de `showScriptEditor`, `editingScript`, ni `handleSaveScript`
- [ ] Header.tsx tiene exactamente 5 tabs: Temas, Biblioteca, Pronunciación, Repaso, Ajustes
- [ ] La vista por defecto al cargar la app es 'themes' (no 'library')
- [ ] Existe `src/components/themes/ThemesView.tsx` como placeholder (renderiza un div con título)
- [ ] Existe `src/components/settings/SettingsView.tsx` como placeholder (renderiza un div con título)
- [ ] `App.tsx` renderiza ThemesView y SettingsView según el estado `view`
- [ ] `storage.ts` ya no exporta `loadScripts` ni `saveScripts`
- [ ] `types/index.ts` ya no exporta `ParallelScript`, `ScriptBlock`
- [ ] `npm run build` pasa sin errores
- [ ] No hay regresión en: biblioteca, pronunciación, flashcards

## Precondiciones

- [ ] Estado del repo: rama `feat/reestructura-tematica`
- [ ] Fases previas completadas: Fase 01 (tipos actualizados)
- [ ] Tag esperado: `reestructura-tematica-fase-01-done`

## 🕐 Espera automática

Esta fase depende de **Fase 01**. El ejecutor-plan debe esperar al tag antes de arrancar.

- **Tag a esperar**: `reestructura-tematica-fase-01-done`
- **Comando de polling**:
  ```bash
  until git -C "C:\Users\i-gamer\Documents\APP INGLÉS" tag | grep -q "^reestructura-tematica-fase-01-done$"; do sleep 30; done
  ```

> **Instrucción para el ejecutor-plan**: pasa este comando a la herramienta `Monitor`
> (NO a `Bash`). Monitor espera sin consumir contexto/tokens y notifica al acabar.
> En Windows, el comando asume shell bash (Git Bash / WSL). En PowerShell nativo no funciona tal cual.

## 🛠️ Herramienta recomendada

**Ejecutar con**: Claude Code
- **Justificación**: eliminación de archivos + reestructuración de App.tsx. Requiere cuidado con los imports y el estado.

## 🤖 Modelo y esfuerzo

**Claude Code** — Sonnet 4.6 · Esfuerzo: Medio
**Codex (OpenAI)** — gpt-5.4 · `reasoning.effort`: medium
- **Equivalencia funcional**: Sonnet 4.6 ≈ gpt-5.4 para esta fase.
- **Justificación**: limpieza quirúrgica — eliminar archivos, quitar imports, actualizar array de tabs.

## 📝 Prompt ejecutable

**Archivos a leer antes de empezar**:
- `src/App.tsx` — para entender todas las referencias a scripts/practice que hay que eliminar
- `src/components/layout/Header.tsx` — para actualizar los tabs
- `src/lib/storage.ts` — para limpiar funciones de scripts
- `src/types/index.ts` — para verificar que ParallelScript/ScriptBlock se eliminaron (o eliminarlos ahora)

1. **ELIMINAR archivos** (borrar completamente):
   - `src/components/practice/PracticeView.tsx`
   - `src/components/scripts/ParallelView.tsx`
   - `src/components/scripts/ScriptEditor.tsx`
   - `src/hooks/useScripts.ts`
   - Si las carpetas `practice/` y `scripts/` quedan vacías, eliminarlas también.

2. **CREAR placeholders** para las vistas nuevas:
   - `src/components/themes/ThemesView.tsx` — componente que recibe `expressions: Expression[]` y renderiza un título "Bloques temáticos" con un grid placeholder. Importar `THEME_BLOCKS` de `../../types`. Mostrar un card por bloque con label_es y un conteo de expresiones filtradas por ese bloque (`expressions.filter(e => e.blocks.includes(block.label)).length`).
   - `src/components/settings/SettingsView.tsx` — componente que renderiza un título "Ajustes" con secciones placeholder para: IA (toggle), Google Sync, Export/Import.

3. **LIMPIAR `src/App.tsx`**:
   - Eliminar imports: `useScripts`, `ParallelView`, `ScriptEditor`, `PracticeView`
   - Añadir imports: `ThemesView` desde `./components/themes/ThemesView`, `SettingsView` desde `./components/settings/SettingsView`
   - Eliminar: `const { scripts, addScript, updateScript, deleteScript } = useScripts()`
   - Eliminar estados: `showScriptEditor`, `editingScript`
   - Eliminar: `handleSaveScript` callback
   - Eliminar: `handleImport` — moverlo conceptualmente a SettingsView (por ahora quitar)
   - Cambiar vista por defecto: `useState('themes')` en vez de `useState('library')`
   - Actualizar el switch de renderizado:
     - `view === 'themes'` → `<ThemesView expressions={expressions} />`
     - `view === 'library'` → mantener `<LibraryView .../>` (se reestructurará en F04)
     - `view === 'pronunciation'` → mantener
     - `view === 'flashcards'` → mantener
     - `view === 'settings'` → `<SettingsView />`
     - ELIMINAR: `view === 'scripts'` y `view === 'practice'`
   - Eliminar el modal de `ScriptEditor` al final del JSX
   - Limpiar props que ya no se usan (scripts de DataView si es necesario)

4. **ACTUALIZAR `src/components/layout/Header.tsx`**:
   - Reemplazar array TABS:
     ```ts
     const TABS = [
       { key: 'themes', label: 'Temas' },
       { key: 'library', label: 'Biblioteca' },
       { key: 'pronunciation', label: 'Pronunciación' },
       { key: 'flashcards', label: 'Repaso' },
       { key: 'settings', label: 'Ajustes' },
     ];
     ```

5. **LIMPIAR `src/lib/storage.ts`**:
   - Eliminar: `loadScripts()`, `saveScripts()`, key `scripts` del `STORAGE_KEYS`
   - Actualizar `AppData` en `exportAllData()` / `importAllData()` — quitar `scripts`
   - Actualizar `syncToCloud()` y `syncFromCloud()` — quitar `scripts`

6. **LIMPIAR `src/types/index.ts`** (si no se hizo en F01):
   - Eliminar: `ParallelScript`, `ScriptBlock`
   - Actualizar `AppData`: quitar `scripts: ParallelScript[]`

## 🧩 Skills y subagentes

- **Skills existentes que aplican**: ninguna
- **Skills a crear**: ninguna
- **Subagentes**: ninguno

## 🔗 Dependencias y paralelización

- Depende de: Fase 01
- Paraleliza con: —
- **Seguridad de paralelización**: 🔒 Secuencial obligatorio — modifica `App.tsx` que es el root
- **Si Codex**: No paralelizable

## 🛡️ Verificación de esta fase

**Técnica**:
- [ ] `npm run build` pasa sin errores
- [ ] No quedan imports huérfanos a archivos eliminados
- [ ] Criterios de aceptación ✅ repasados uno a uno

**Funcional**:
- [ ] Camino principal: la app abre en la vista "Temas" por defecto
- [ ] Se puede navegar a Biblioteca, Pronunciación, Repaso y Ajustes
- [ ] Edge case: no hay tab de Scripts ni Práctica

**Integridad**:
- [ ] Regresión a vigilar: `FlashcardView` sigue funcionando (SM-2, due count, sesiones)
- [ ] Regresión a vigilar: `PronunciationView` sigue listando expresiones con TTS
- [ ] Regresión a vigilar: `LibraryView` sigue filtrando y mostrando cards (aunque el filtro de bloques mostrará los 10 nuevos)

## 🌿 Git en esta fase

- **Antes**: rama `feat/reestructura-tematica`, F01 completada
- **Commit sugerido**: `refactor: remove scripts/practice views, add themes/settings nav`
- **Señal de finalización**:
  ```bash
  git -C "C:\Users\i-gamer\Documents\APP INGLÉS" tag reestructura-tematica-fase-03-done
  ```
- **Si falla verificación**: `git reset --hard HEAD~1` + borrar tag

## ⚠️ Riesgos de esta fase

- **Imports rotos**: al eliminar archivos, cualquier import olvidado romperá el build. Verificar que no queden referencias a los archivos eliminados.
- **DataView depende de scripts**: `DataView` recibe `scripts` como prop y muestra conteo de scripts/bloques. Hay que limpiar esas props y el StatCard de "Scripts" y "Bloques".
- **Rollback**: `git reset --hard HEAD~1`
