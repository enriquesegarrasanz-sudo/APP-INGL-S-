# BRIEF.md — What Gets Built

## App Overview

**Name:** Sparring English OS
**User:** Enrike Segarra, filmmaker based in Madrid. Single user, personal app.
**Core concept:** A personal English vocabulary operating system. Maps YOUR Spanish expressions to their natural English equivalents. This is not Duolingo. This is not generic. This is a tool built around how you actually speak.

## Views (7)

1. **Library** — Browse, search, and manage all saved expressions. Filter by category, mastery level, favorites. Quick Add with AI assistance.
2. **Pronunciation** — Listen to any expression at 4 speeds. Compare slow/fast. Practice ear training for natural American English.
3. **Flashcards** — Anki-style spaced repetition using the SM-2 algorithm. Review due cards, rate difficulty, track progress over time.
4. **Scripts** — Curated scripts (movie scenes, conversations, monologues) with expression highlights. Context-based learning.
5. **Practice** — Generate ChatGPT practice prompts based on your weakest expressions. Copy-paste into ChatGPT for conversational practice.
6. **Data** — View stats, export/import JSON, sync status with Google Sheets, review history.
7. **Settings** — Configure AI provider (Ollama/DeepSeek), Google Sheets URL, TTS voice, app preferences.

## Data Model

### Expression
- `id`: string (UUID)
- `spanish`: string (the expression in Spanish)
- `english`: string (natural English equivalent)
- `category`: string (e.g., "coloquial", "profesional", "cine")
- `context`: string (example sentence or usage note)
- `notes`: string (personal notes)
- `favorite`: boolean
- **SM-2 fields:**
  - `easeFactor`: number (default 2.5)
  - `interval`: number (days until next review)
  - `repetitions`: number (successful review count)
  - `nextReview`: string (ISO date)
  - `lastReview`: string (ISO date)
- `createdAt`: string (ISO date)
- `updatedAt`: string (ISO date)

### Script
- `id`: string (UUID)
- `title`: string
- `source`: string (movie, show, or original)
- `content`: string (the script text)
- `expressionIds`: string[] (linked expression IDs)
- `createdAt`: string (ISO date)

### ReviewSession
- `id`: string (UUID)
- `date`: string (ISO date)
- `expressionsReviewed`: number
- `correctCount`: number
- `averageEaseFactor`: number
- `duration`: number (seconds)

## Key Interactions

- **Add Expression:** Quick Add (type Spanish, AI suggests English + category) or Manual Add (fill all fields).
- **Review Flashcards:** Show Spanish side, think of English, flip card, rate difficulty (Again / Hard / Good / Easy). SM-2 updates interval.
- **Listen to Pronunciation:** Click any expression to hear TTS at selected speed. Toggle between 4 speeds.
- **Generate Practice Prompt:** Select expressions, generate a ChatGPT prompt for conversational practice. Copy to clipboard.
- **Export/Import:** Download all data as JSON. Import JSON to restore or migrate.

## Storage Flow

```
User action
  -> localStorage (instant, offline-capable)
  -> Google Sheets sync (persistent cloud backup via Apps Script)
```

localStorage is the source of truth for the app. Google Sheets is the backup and external access layer.

## AI Flow

```
User requests AI assistance (Quick Add, suggestions)
  -> Try Ollama (localhost:11434) first
  -> If Ollama unavailable, fall back to DeepSeek API
  -> Return result to UI
```

## TTS Configuration

- **Engine:** Web Speech API (browser-native, no API key needed)
- **Language:** en-US (American English)
- **Speeds:**
  - Slow: 0.5x rate
  - Normal: 0.78x rate
  - Fast: 1.0x rate
  - Native: 1.2x rate

## Design Principles

- Clean, minimal, professional
- White background, dark text
- No emojis in the UI
- Typography-driven hierarchy
- Generous whitespace
- Desktop-first (1280px+), must work on tablet (768px-1024px)
- UI language: Spanish
- Data language: Bilingual EN/ES
