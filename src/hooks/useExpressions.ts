import { useState, useEffect, useCallback } from 'react';
import type { AppData, Expression, ExpressionStatus } from '../types';
import { importAllData, loadExpressions, saveExpressions } from '../lib/storage';
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
      related_ids: expr.related_ids ?? [],
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

  const importData = useCallback((data: Partial<AppData>) => {
    importAllData(data);
    setExpressions(loadExpressions());
  }, []);

  return { expressions, addExpression, updateExpression, deleteExpression, updateStatus, importData };
}
