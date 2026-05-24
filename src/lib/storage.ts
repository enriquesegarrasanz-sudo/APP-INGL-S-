import type { AppData, Expression, ReviewSession } from '../types';
import { INITIAL_EXPRESSIONS } from '../data/mockData';

const OLD_BLOCK_MAP: Record<string, string> = {
  'Ideas in development': 'Ideas & Creativity',
  'Clarity and structure': 'Structure & Systems',
  'Judgment and decisions': 'Judgment & Decisions',
  'Systems and architecture': 'AI & Technology',
  'Learning and practice': 'Ideas & Creativity',
  'Memory and organization': 'Structure & Systems',
  'Communication': 'Communication',
};

export function migrateExpression(expr: Record<string, unknown>): Expression {
  const migrated = { ...expr } as Record<string, unknown>;

  if (typeof migrated.block === 'string') {
    migrated.blocks = [OLD_BLOCK_MAP[migrated.block] ?? 'Communication'];
    delete migrated.block;
  }

  if (!Array.isArray(migrated.blocks) || migrated.blocks.length === 0) {
    migrated.blocks = ['Communication'];
  }

  if (!Array.isArray(migrated.related_ids)) {
    migrated.related_ids = [];
  }

  return migrated as unknown as Expression;
}

const STORAGE_KEYS = {
  expressions: 'sparring-expressions',
  reviews: 'sparring-reviews',
  lastSync: 'sparring-last-sync',
} as const;

// ── localStorage (fast, instant) ──

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage save error:', e);
  }
}

// ── Google Sheets via Apps Script (persistent cloud) ──

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

async function cloudLoad(): Promise<AppData | null> {
  if (!SCRIPT_URL) return null;
  try {
    const res = await fetch(`${SCRIPT_URL}?action=load`, { method: 'GET' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('Cloud load error:', e);
    return null;
  }
}

async function cloudSave(data: AppData): Promise<boolean> {
  if (!SCRIPT_URL) return false;
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'save', data }),
    });
    return res.ok;
  } catch (e) {
    console.error('Cloud save error:', e);
    return false;
  }
}

// ── Public API ──

export function loadExpressions(): Expression[] {
  const raw = loadLocal<Record<string, unknown>[]>(STORAGE_KEYS.expressions, []);
  const source = raw.length > 0 ? raw : (INITIAL_EXPRESSIONS as unknown as Record<string, unknown>[]);
  return source.map(migrateExpression);
}

export function saveExpressions(expressions: Expression[]): void {
  saveLocal(STORAGE_KEYS.expressions, expressions);
  debouncedCloudSync();
}

export function loadReviews(): ReviewSession[] {
  return loadLocal(STORAGE_KEYS.reviews, []);
}

export function saveReviews(reviews: ReviewSession[]): void {
  saveLocal(STORAGE_KEYS.reviews, reviews);
  debouncedCloudSync();
}

// ── Sync logic ──

let syncTimer: ReturnType<typeof setTimeout> | null = null;

function debouncedCloudSync(): void {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncToCloud(), 3000);
}

async function syncToCloud(): Promise<void> {
  const data: AppData = {
    expressions: loadExpressions(),
    reviews: loadReviews(),
  };
  const ok = await cloudSave(data);
  if (ok) {
    saveLocal(STORAGE_KEYS.lastSync, new Date().toISOString());
  }
}

export async function syncFromCloud(): Promise<AppData | null> {
  const cloud = await cloudLoad();
  if (!cloud) return null;

  if (cloud.expressions?.length > 0) saveLocal(STORAGE_KEYS.expressions, cloud.expressions);
  if (cloud.reviews?.length > 0) saveLocal(STORAGE_KEYS.reviews, cloud.reviews);
  saveLocal(STORAGE_KEYS.lastSync, new Date().toISOString());

  return cloud;
}

export function getLastSyncTime(): string | null {
  return loadLocal<string | null>(STORAGE_KEYS.lastSync, null);
}

export function isCloudConfigured(): boolean {
  return !!SCRIPT_URL;
}

// ── Export / Import ──

export function exportAllData(): AppData {
  return {
    expressions: loadExpressions(),
    reviews: loadReviews(),
  };
}

export function importAllData(data: Partial<AppData>): void {
  if (data.expressions) saveLocal(STORAGE_KEYS.expressions, data.expressions);
  if (data.reviews) saveLocal(STORAGE_KEYS.reviews, data.reviews);
  debouncedCloudSync();
}
