import { useState, useCallback, useMemo } from 'react';
import type { Expression, ReviewSession, ReviewQuality } from '../types';
import { selectReviewBatch, applyReview, getDueExpressions, getReviewableExpressions } from '../lib/spaced-repetition';
import { loadExpressions, saveExpressions, loadReviews, saveReviews } from '../lib/storage';

export function useReview(sourceExpressions?: Expression[]) {
  const [expressions, setExpressions] = useState<Expression[]>(
    () => sourceExpressions ?? loadExpressions()
  );
  const [currentSession, setCurrentSession] = useState<ReviewSession | null>(null);
  const [batch, setBatch] = useState<Expression[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const reviewExpressions = sourceExpressions ?? expressions;

  const dueCount = useMemo(
    () => getDueExpressions(getReviewableExpressions(reviewExpressions)).length,
    [reviewExpressions]
  );

  const getDueCountForBlock = useCallback((blockFilter: string | null) => {
    const filtered = blockFilter
      ? reviewExpressions.filter((expression) => expression.blocks.includes(blockFilter))
      : reviewExpressions;
    return getDueExpressions(getReviewableExpressions(filtered)).length;
  }, [reviewExpressions]);

  const currentCard = batch.length > 0 && cardIndex < batch.length ? batch[cardIndex] : null;
  const totalCards = batch.length;

  const startSession = useCallback((batchSize = 10, blockFilter: string | null = null) => {
    const fresh = reviewExpressions;
    setExpressions(fresh);

    const filtered = blockFilter
      ? fresh.filter((expression) => expression.blocks.includes(blockFilter))
      : fresh;
    const selected = selectReviewBatch(filtered, batchSize);
    if (selected.length === 0) return;

    const session: ReviewSession = {
      id: `review-${Date.now()}`,
      started_at: new Date().toISOString(),
      completed_at: null,
      cards_reviewed: 0,
      correct_count: 0,
      results: [],
    };

    setBatch(selected);
    setCardIndex(0);
    setIsFlipped(false);
    setCurrentSession(session);
  }, [reviewExpressions]);

  const flipCard = useCallback(() => {
    setIsFlipped(true);
  }, []);

  const rateCard = useCallback((quality: ReviewQuality) => {
    if (!currentSession || !currentCard) return;

    // Apply SM-2 to the expression
    const updated = applyReview(currentCard, quality);

    // Update expressions list and persist
    const newExpressions = reviewExpressions.map((e) => (e.id === updated.id ? updated : e));
    setExpressions(newExpressions);
    saveExpressions(newExpressions);

    // Update session results
    const updatedSession: ReviewSession = {
      ...currentSession,
      cards_reviewed: currentSession.cards_reviewed + 1,
      correct_count: currentSession.correct_count + (quality >= 3 ? 1 : 0),
      results: [
        ...currentSession.results,
        {
          expression_id: currentCard.id,
          quality,
          reviewed_at: new Date().toISOString(),
        },
      ],
    };

    const nextIndex = cardIndex + 1;

    if (nextIndex >= batch.length) {
      // Session complete
      const completedSession: ReviewSession = {
        ...updatedSession,
        completed_at: new Date().toISOString(),
      };
      setCurrentSession(completedSession);

      // Persist the completed session
      const reviews = loadReviews();
      saveReviews([...reviews, completedSession]);

      setBatch([]);
      setCardIndex(0);
      setIsFlipped(false);
    } else {
      // Advance to next card
      setCurrentSession(updatedSession);
      setCardIndex(nextIndex);
      setIsFlipped(false);
    }
  }, [currentSession, currentCard, reviewExpressions, cardIndex, batch.length]);

  const endSession = useCallback(() => {
    if (currentSession && currentSession.cards_reviewed > 0 && !currentSession.completed_at) {
      const completedSession: ReviewSession = {
        ...currentSession,
        completed_at: new Date().toISOString(),
      };

      const reviews = loadReviews();
      saveReviews([...reviews, completedSession]);
    }

    setCurrentSession(null);
    setBatch([]);
    setCardIndex(0);
    setIsFlipped(false);
  }, [currentSession]);

  return {
    dueCount,
    getDueCountForBlock,
    currentSession,
    currentCard,
    cardIndex,
    totalCards,
    isFlipped,
    startSession,
    flipCard,
    rateCard,
    endSession,
  };
}
