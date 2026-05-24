# FASE 05: Ajustes + toggle IA + repaso por tema

> ⚠️ Fase manual — requiere verificación visual + test de servicios IA.

> Pegar entero como primer mensaje en un chat nuevo. La skill `ejecutor-plan`
> se activará automáticamente. Carga también `./CONTEXTO.md` si no está en contexto.

**Plan-slug**: `reestructura-tematica`
**Ruta del repo**: `C:\Users\i-gamer\Documents\APP INGLÉS`

## Objetivo de esta fase

Implementar la vista de Ajustes con: toggle manual de IA (Ollama local vs DeepSeek cloud), estado de conexión de servicios, configuración de Google Sync, y export/import (migrado desde DataView). Además, añadir filtro por tema al sistema de repaso con flashcards (SM-2).

## 📍 Estado actual del código

- **Archivos afectados**:
  - `src/components/settings/SettingsView.tsx` — placeholder creado en F03
  - `src/components/flashcards/FlashcardView.tsx` (227 LOC) — sin filtro por tema
  - `src/components/data/DataView.tsx` (208 LOC) — su funcionalidad se migra a Settings
  - `src/hooks/useReview.ts` (127 LOC) — `startSession()` sin filtro por bloque
  - `src/lib/ai/provider.ts` (34 LOC) — auto-detección sin control del usuario
  - `src/lib/storage.ts` (146 LOC) — funciones de sync y export
  - `src/App.tsx` — routing, estado
- **Puntos de integración**:
  - `provider.ts:8-23` — `getAIProvider()` intenta Ollama primero, DeepSeek después (sin control del usuario)
  - `useReview.ts:21` — `startSession()` llama `selectReviewBatch(fresh, batchSize)` sin filtro de bloque
  - `spaced-repetition.ts` — `selectReviewBatch()` recibe solo `expressions` y `batchSize`
  - `App.tsx:169-176` — rendering de DataView con props de scripts (ya eliminado en F03)
- **⚠️ Archivos monolíticos**: ninguno

## ✅ Criterios de aceptación

- [ ] SettingsView tiene 3 secciones: IA, Sincronización, Datos
- [ ] Sección IA: toggle con 3 opciones: "Auto" (comportamiento actual), "Local (Ollama)", "DeepSeek (Cloud)". El toggle se persiste en localStorage
- [ ] Al seleccionar "Local", solo se usa Ollama. Al seleccionar "DeepSeek", solo se usa DeepSeek. "Auto" mantiene el fallback actual
- [ ] Cada opción muestra un indicador de estado: verde si el servicio está disponible, rojo si no
- [ ] Sección Sincronización: muestra estado de Google Apps Script (configurado/no configurado), última sincronización, botón "Sincronizar ahora"
- [ ] Sección Datos: botones de exportar JSON, exportar Markdown, importar JSON (migrados de DataView)
- [ ] DataView se elimina (su funcionalidad está en SettingsView)
- [ ] FlashcardView tiene un selector de tema antes de empezar la sesión: "Todos" o uno de los 10 bloques
- [ ] Al elegir un tema, `startSession()` solo incluye expresiones de ese bloque
- [ ] El `useReview` acepta un parámetro `blockFilter: string | null` en `startSession()`
- [ ] `npm run build` pasa sin errores

## Precondiciones

- [ ] Estado del repo: rama `feat/reestructura-tematica`
- [ ] Fases previas completadas: Fase 03 (navegación), Fase 04 (temas + biblioteca)
- [ ] Tag esperado: `reestructura-tematica-fase-04-done`

## 🛠️ Herramienta recomendada

**Ejecutar con**: Claude Code
- **Justificación**: lógica de estado para AI provider + modificación de hook de repaso. Requiere verificación visual y test de servicios.

## 🤖 Modelo y esfuerzo

**Claude Code** — Sonnet 4.6 · Esfuerzo: Alto
**Codex (OpenAI)** — gpt-5.4 · `reasoning.effort`: high
- **Equivalencia funcional**: Sonnet 4.6 ≈ gpt-5.4 para esta fase.
- **Justificación**: múltiples archivos con lógica de estado + UI + servicios.

## 📝 Prompt ejecutable

**Archivos a leer antes de empezar**:
- `src/components/settings/SettingsView.tsx` — placeholder a reemplazar
- `src/components/data/DataView.tsx` — funcionalidad a migrar
- `src/lib/ai/provider.ts` — lógica de auto-detección a modificar
- `src/lib/ai/ollama.ts` — para verificar disponibilidad
- `src/lib/ai/deepseek.ts` — para verificar disponibilidad
- `src/hooks/useReview.ts` — para añadir filtro por bloque
- `src/lib/spaced-repetition.ts` — `selectReviewBatch()` actual
- `src/components/flashcards/FlashcardView.tsx` — para añadir selector de tema
- `src/lib/storage.ts` — funciones de export/import/sync

1. **IMPLEMENTAR `src/components/settings/SettingsView.tsx`** (reescribir placeholder):

   Props: `expressions: Expression[]`, `onImport: (data: { expressions?: Expression[] }) => void`, `copyText: (text: string, label?: string) => void`

   **Sección 1: Proveedor de IA**
   - Título: "Inteligencia Artificial"
   - 3 botones de selección (tipo radio visual):
     - "Automático" — detecta Ollama, si no disponible usa DeepSeek (comportamiento actual)
     - "Local (Ollama)" — solo Ollama, muestra error si no disponible
     - "DeepSeek (Cloud)" — solo DeepSeek, requiere API key
   - Estado de cada servicio (al cargar, hacer ping a ambos):
     - Ollama: circulito verde/rojo + "Conectado" / "No disponible"
     - DeepSeek: circulito verde/rojo + "Configurado" / "Sin API key"
   - Persistir la selección en localStorage key `sparring-ai-provider` con valores: `'auto' | 'ollama' | 'deepseek'`
   - Crear un hook `useAIPreference()` en `src/hooks/useAIPreference.ts` que:
     - Lee la preferencia de localStorage
     - Expone `preference`, `setPreference`, `ollamaStatus`, `deepseekStatus`
     - Al montar, verifica disponibilidad de ambos servicios (async)

   **Sección 2: Sincronización**
   - Migrar la sección "Sincronización en la nube" de DataView tal cual
   - Mostrar: estado (configurado/no), última sync, botón sincronizar

   **Sección 3: Datos**
   - Migrar los botones de Export JSON, Import JSON, Export Markdown de DataView
   - Mantener la misma funcionalidad

   **Sección 4: Estadísticas** (mini resumen)
   - Total expresiones, activas, aprendiendo, dominadas
   - Sin la complejidad de DataView — solo contadores básicos

2. **MODIFICAR `src/lib/ai/provider.ts`** — respetar la preferencia del usuario:

   ```ts
   type AIPreference = 'auto' | 'ollama' | 'deepseek';

   function getPreference(): AIPreference {
     return (localStorage.getItem('sparring-ai-provider') as AIPreference) || 'auto';
   }

   export async function getAIProvider(): Promise<AIProvider | null> {
     const pref = getPreference();

     if (pref === 'ollama') {
       return (await ollama.available()) ? ollama : null;
     }
     if (pref === 'deepseek') {
       return (await deepseek.available()) ? deepseek : null;
     }
     // 'auto' — comportamiento actual: Ollama primero, DeepSeek fallback
     if (await ollama.available()) return ollama;
     if (await deepseek.available()) return deepseek;
     return null;
   }
   ```

3. **CREAR `src/hooks/useAIPreference.ts`**:
   - Hook que gestiona la preferencia de IA
   - Al montar: pings a Ollama y DeepSeek para verificar disponibilidad
   - Expone: `preference`, `setPreference(pref)`, `ollamaStatus: 'available' | 'unavailable' | 'checking'`, `deepseekStatus: idem`
   - `setPreference` persiste en localStorage y re-verifica el servicio seleccionado

4. **MODIFICAR `src/hooks/useReview.ts`** — añadir filtro por bloque:

   Cambiar `startSession(batchSize = 10)` a `startSession(batchSize = 10, blockFilter: string | null = null)`:
   - Si `blockFilter` no es null, filtrar `fresh` para solo incluir expresiones donde `e.blocks.includes(blockFilter)` antes de pasarlas a `selectReviewBatch()`

5. **MODIFICAR `src/components/flashcards/FlashcardView.tsx`** — añadir selector de tema:

   En el dashboard (State A, cuando no hay sesión activa):
   - Antes del botón "Empezar repaso", añadir un selector de tema:
     - Dropdown o pills con: "Todos" + los 10 bloques (label_es)
     - Estado local: `selectedBlock: string | null` (null = todos)
   - Al clicar "Empezar repaso", pasar `selectedBlock` a `startSession(batchSize, selectedBlock)`
   - Mostrar el `dueCount` filtrado por bloque seleccionado (si es posible, o mostrar el global)

   Nuevas props necesarias:
   - `startSession: (batchSize?: number, blockFilter?: string | null) => void`

6. **ELIMINAR `src/components/data/DataView.tsx`** — su funcionalidad migrada a SettingsView

7. **ACTUALIZAR `src/App.tsx`**:
   - Eliminar import y rendering de DataView
   - Pasar props correctas a SettingsView: `expressions`, `onImport`, `copyText`
   - Actualizar `startSession` prop de FlashcardView para aceptar el blockFilter

## 🧩 Skills y subagentes

- **Skills existentes que aplican**: ninguna
- **Skills a crear**: ninguna
- **Subagentes**: ninguno

## 🔗 Dependencias y paralelización

- Depende de: Fase 03, Fase 04
- Paraleliza con: —
- **Seguridad de paralelización**: 🔒 Secuencial obligatorio
- **Si Codex**: No paralelizable

## 🛡️ Verificación de esta fase

**Técnica**:
- [ ] `npm run build` pasa sin errores
- [ ] Criterios de aceptación ✅ repasados uno a uno

**Funcional**:
- [ ] Camino principal: ir a Ajustes → cambiar IA a "Local" → volver a Biblioteca → añadir expresión rápida con IA → usa Ollama (si disponible) o muestra error
- [ ] Camino principal: ir a Repaso → seleccionar "Cine y Narrativa" → empezar sesión → solo salen expresiones de Cinema & Storytelling
- [ ] Edge case: toggle IA a "DeepSeek" sin API key configurada → muestra estado "Sin API key" en rojo, no intenta llamar
- [ ] Edge case: repaso con "Todos" → comportamiento idéntico al actual
- [ ] Verificar en desktop y tablet

**Integridad**:
- [ ] Regresión a vigilar: `QuickAddModal.tsx` — usa `autoFillExpression()` de provider.ts. Verificar que el toggle de IA afecta correctamente el provider usado
- [ ] Regresión a vigilar: SM-2 no alterado — `applyReview()`, `calculateSM2()` no se tocan
- [ ] Regresión a vigilar: la funcionalidad de export/import en SettingsView funciona igual que en DataView

## 🌿 Git en esta fase

- **Antes**: rama `feat/reestructura-tematica`, F04 completada
- **Commit sugerido**: `feat: add settings view with AI toggle and review by theme`
- **Señal de finalización**:
  ```bash
  git -C "C:\Users\i-gamer\Documents\APP INGLÉS" tag reestructura-tematica-fase-05-done
  ```
- **Si falla verificación**: `git reset --hard HEAD~1` + borrar tag

## ⚠️ Riesgos de esta fase

- **Toggle de IA sin efecto inmediato**: cambiar el provider solo afecta la próxima llamada a `getAIProvider()`. No hay estado global reactivo — si el usuario cambia y luego usa Quick Add, debe funcionar. Verificar.
- **Ping a Ollama timeout**: el ping a Ollama tiene timeout de 3s. Si el servicio está lento, puede marcar como no disponible falsamente. Es el comportamiento actual — no cambiamos.
- **DataView eliminado**: cualquier referencia olvidada a DataView romperá el build. Verificar.
- **Rollback**: `git reset --hard HEAD~1`
