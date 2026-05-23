import { useState, useEffect, useCallback } from 'react';
import type { Expression, ExpressionStatus } from '../types';
import { loadExpressions, saveExpressions } from '../lib/storage';
import { generateId } from '../lib/utils';

type NewExpression = Omit<Expression, 'id' | 'ease_factor' | 'interval' | 'repetitions' | 'next_review' | 'created_at'>;

export function useExpressions() {
  const [expressions, setExpressions] = useState<Expression[]>(() => loadExpressions());

  useEffect(() => {
    saveExpressions(expressions);
  }, [expressions]);

  const addExpression = useCallback((expr: NewExpression) => {
    const newExpr: Expression = {
      ...expr,
      id: generateId(expr.english),
      ease_factor: 2.5,
      interval: 0,
      repetitions: 0,
      next_review: null,
      created_at: new Date().toISOString(),
    };
    setExpressions((prev) => [...prev, newExpr]);
  }, []);

  const updateExpression = useCallback((expr: Expression) => {
    setExpressions((prev) => prev.map((e) => (e.id === expr.id ? expr : e)));
  }, []);

  const deleteExpression = useCallback((id: string) => {
    setExpressions((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateStatus = useCallback((id: string, status: ExpressionStatus) => {
    setExpressions((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  }, []);

  return { expressions, addExpression, updateExpression, deleteExpression, updateStatus };
}
