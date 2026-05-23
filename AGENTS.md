# AGENTS.md — Rules for Codex and AI Agents

This document defines rules for OpenAI Codex and any other AI agent working on this project. Read this before making any changes.

## Project

**Sparring English OS** — Personal English vocabulary app for a single user (Enrike, filmmaker, Madrid).
Learn vocabulary you already use in Spanish, translated to natural English.

## Stack

- **Framework:** Vite + React 18 + TypeScript
- **CSS:** Tailwind CSS v4 (utility classes only, design tokens in `src/styles/tokens.css`)
- **Storage:** Google Sheets via Google Apps Script (NO Supabase, NO Firebase, NO other backends)
- **AI:** DeepSeek API (cloud) + Ollama (local fallback)
- **TTS:** Web Speech API (browser-native)
- **Deploy:** Vercel

## Folder Structure

```
src/
  components/        # React components (PascalCase)
    ui/              # Reusable UI primitives
    layout/          # Layout components
  views/             # Page-level views
  hooks/             # Custom hooks (camelCase)
  services/          # API/external service calls (camelCase)
  utils/             # Pure utility functions (camelCase)
  types/             # TypeScript type definitions (camelCase)
  styles/            # Global styles, design tokens
  data/              # Mock data, seed data
  context/           # React context providers
public/              # Static assets
```

## Naming Conventions

- Components: `PascalCase.tsx` (e.g., `ExpressionCard.tsx`)
- Utils, hooks, services: `camelCase.ts` (e.g., `useReview.ts`, `deepseekService.ts`)
- Types: `camelCase.ts` in `src/types/` (e.g., `expression.ts`)
- Constants: `UPPER_SNAKE_CASE`

## Environment Variables

All prefixed with `VITE_`. Stored in `.env.local` (never committed).

```
VITE_GOOGLE_SCRIPT_URL       # Google Apps Script deployment URL
VITE_DEEPSEEK_API_KEY        # DeepSeek API key
VITE_OLLAMA_URL              # Ollama local URL (default: http://localhost:11434)
```

## Language

- UI text (labels, buttons, messages): **Spanish**
- Expression data: **Bilingual EN/ES**
- Code (variables, comments): **English**

## Responsive

- Desktop: 1280px+ (primary)
- Tablet: 768px-1024px (must work)

## Do NOT

- Create files outside the defined folder structure
- Delete or modify `src/data/mockData.ts` without asking
- Change SM-2 algorithm parameters without asking
- Install dependencies without stating the reason
- Hardcode API keys or secrets
- Use Firebase, Supabase, or any backend other than Google Apps Script
- Add emojis to the UI
- Write UI-facing text in English (it must be Spanish)

## Before Making Changes

1. Read `CHANGES.log` to understand recent work
2. Read `BRIEF.md` for feature context
3. Check existing code in the relevant directory before creating new files
4. Prefer editing existing files over creating new ones

## How to Verify Changes

```bash
npm run build      # Must pass TypeScript check + build with zero errors
npm run lint       # Must pass ESLint with zero errors
npm run dev        # Start dev server, visually check in browser
```

Verify that:
- No TypeScript errors
- No ESLint errors
- UI text is in Spanish
- No hardcoded API keys
- New files follow the naming conventions
- Changes are within the defined folder structure

## Logging Changes

After completing work, add an entry to `CHANGES.log` at the top of the log (below the header), following the existing format:

```
## YYYY-MM-DD — Short description
- What was done (bullet points)
- Branch: feature/xxx
- Status: description
```

## Key Technical Details

- **SM-2 Algorithm:** Anki-style spaced repetition. Parameters are calibrated. Do not modify `easeFactor` defaults, interval calculations, or rating thresholds without user approval.
- **Storage:** localStorage is source of truth. Google Sheets is cloud backup.
- **AI fallback:** Ollama (local) first, DeepSeek API (cloud) if Ollama is unavailable.
- **TTS:** Web Speech API, en-US, 4 speeds: slow (0.5x), normal (0.78x), fast (1.0x), native (1.2x).
