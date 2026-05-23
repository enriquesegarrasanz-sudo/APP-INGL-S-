import type { Expression, ReviewQuality } from '../types';

/**
 * SM-2 algorithm — the same spaced repetition system used by Anki.
 *
 * Quality scale:
 *   0 = complete blackout
 *   1 = incorrect, but recognized after seeing answer
 *   2 = incorrect, but easy to recall once seen
 *   3 = correct, with significant difficulty
 *   4 = correct, with some hesitation
 *   5 = perfect response
 */

interface SM2Result {
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string;
}

export function calculateSM2(
  quality: ReviewQuality,
  currentEF: number,
  currentInterval: number,
  currentRepetitions: number
): SM2Result {
  let ef = currentEF;
  let interval: number;
  let repetitions: number;

  if (quality >= 3) {
    if (currentRepetitions === 0) {
      interval = 1;
    } else if (currentRepetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(currentInterval * ef);
    }
    repetitions = currentRepetitions + 1;
  } else {
    interval = 1;
    repetitions = 0;
  }

  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    ease_factor: Math.round(ef * 100) / 100,
    interval,
    repetitions,
    next_review: nextDate.toISOString(),
  };
}

export function applyReview(expression: Expression, quality: ReviewQuality): Expression {
  const result = calculateSM2(
    quality,
    expression.ease_factor,
    expression.interval,
    expression.repetitions
  );

  return {
    ...expression,
    ease_factor: result.ease_factor,
    interval: result.interval,
    repetitions: result.repetitions,
    next_review: result.next_review,
    last_practiced: new Date().toISOString(),
  };
}

export function getDueExpressions(expressions: Expression[]): Expression[] {
  const now = new Date();
  return expressions.filter((expr) => {
    if (!expr.next_review) return true;
    return new Date(expr.next_review) <= now;
  });
}

export function getReviewableExpressions(expressions: Expression[]): Expression[] {
  return expressions.filter(
    (expr) => expr.status === 'active' || expr.status === 'learning' || expr.status === 'needs_review'
  );
}

export function selectReviewBatch(expressions: Expression[], batchSize = 10): Expression[] {
  const due = getDueExpressions(getReviewableExpressions(expressions));

  if (due.length <= batchSize) return shuffleArray(due);

  const sorted = [...due].sort((a, b) => {
    if (!a.next_review) return -1;
    if (!b.next_review) return 1;
    return new Date(a.next_review).getTime() - new Date(b.next_review).getTime();
  });

  return shuffleArray(sorted.slice(0, batchSize));
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const QUALITY_LABELS: Record<ReviewQuality, { label: string; description: string; color: string }> = {
  0: { label: 'No la sé', description: 'No me salía de ninguna manera', color: 'var(--color-danger)' },
  1: { label: 'Mal', description: 'Incorrecta, pero la reconocí al verla', color: 'var(--color-danger)' },
  2: { label: 'Casi', description: 'Incorrecta, pero fácil de recordar al verla', color: 'var(--color-status-learning)' },
  3: { label: 'Difícil', description: 'Correcta, pero me costó', color: 'var(--color-status-learning)' },
  4: { label: 'Bien', description: 'Correcta, con algo de duda', color: 'var(--color-success)' },
  5: { label: 'Perfecto', description: 'Respuesta inmediata y natural', color: 'var(--color-status-mastered)' },
};
