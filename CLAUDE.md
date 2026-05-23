# CLAUDE.md — Project Rules for Claude Code

## Project

**Sparring English OS** — Personal English vocabulary learning app for Enrike (filmmaker, Madrid).
Philosophy: learn vocabulary you ALREADY use in Spanish, translated to natural English equivalents. Not Duolingo, not generic.

## Stack

- **Framework:** Vite + React 18 + TypeScript
- **CSS:** Tailwind CSS v4 (utility classes only)
- **Storage:** Google Sheets via Google Apps Script (NO Supabase, NO Firebase)
- **AI:** DeepSeek API (cloud) + Ollama (local fallback)
- **TTS:** Web Speech API with speed control
- **Deploy:** Vercel

## Folder Structure

```
src/
  components/        # React components (PascalCase: ExpressionCard.tsx)
    ui/              # Reusable UI primitives (Button.tsx, Modal.tsx)
    layout/          # Layout components (Header.tsx, Sidebar.tsx)
  views/             # Page-level views (Library.tsx, Flashcards.tsx)
  hooks/             # Custom hooks (camelCase: useExpressions.ts)
  services/          # API and external service calls (camelCase: googleSheets.ts)
  utils/             # Pure utility functions (camelCase: sm2Algorithm.ts)
  types/             # TypeScript type definitions (camelCase: expression.ts)
  styles/            # Global styles and design tokens (tokens.css)
  data/              # Mock data and seed data (mockData.ts)
  context/           # React context providers (ExpressionContext.tsx)
public/              # Static assets
```

## Naming Conventions

- **Components:** PascalCase (`ExpressionCard.tsx`, `FlashcardDeck.tsx`)
- **Utilities/hooks/services:** camelCase (`useReview.ts`, `deepseekService.ts`)
- **Types:** camelCase files in `src/types/` (`expression.ts`, `script.ts`)
- **CSS:** Tailwind utility classes. Design tokens in `src/styles/tokens.css`
- **Constants:** UPPER_SNAKE_CASE (`MAX_REVIEW_CARDS`, `DEFAULT_SPEED`)

## Environment Variables

All env vars use the `VITE_` prefix. Store in `.env.local` (never commit).

```
VITE_GOOGLE_SCRIPT_URL=       # Google Apps Script deployment URL
VITE_DEEPSEEK_API_KEY=        # DeepSeek API key
VITE_OLLAMA_URL=              # Ollama local URL (default: http://localhost:11434)
```

**NEVER hardcode API keys in source code.**

## Language Rules

- **UI text (labels, buttons, messages):** Spanish
- **Expression data:** Bilingual EN/ES (expressions stored in both languages)
- **Code (variables, comments):** English

## Responsive Design

- **Desktop-first:** 1280px+ (primary target)
- **Tablet:** 768px-1024px (must work)
- No mobile optimization required (not a priority)

## Critical Rules — Do NOT

- Do NOT create files outside the defined folder structure
- Do NOT delete or modify `src/data/mockData.ts` without asking the user
- Do NOT change the SM-2 algorithm parameters without asking the user
- Do NOT install new dependencies without stating why
- Do NOT hardcode API keys or secrets anywhere
- Do NOT use Firebase, Supabase, or any backend besides Google Apps Script
- Do NOT add emojis to the UI
- Do NOT write UI text in English (user-facing text is Spanish)

## Build and Dev Commands

```bash
npm run dev        # Start dev server
npm run build      # TypeScript check + production build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Key Technical Decisions

- **SM-2 Algorithm:** Anki-style spaced repetition. Parameters are tuned — do not modify without user approval.
- **Storage flow:** localStorage (instant) syncs to Google Sheets (persistent cloud backup).
- **AI flow:** Try Ollama (localhost) first, fall back to DeepSeek API if unavailable.
- **TTS speeds:** slow (0.5x), normal (0.78x), fast (1.0x), native (1.2x) — American English voice.
