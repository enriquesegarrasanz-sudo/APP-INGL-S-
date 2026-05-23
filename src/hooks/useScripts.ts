import { useState, useEffect, useCallback } from 'react';
import type { ParallelScript } from '../types';
import { loadScripts, saveScripts } from '../lib/storage';

export function useScripts() {
  const [scripts, setScripts] = useState<ParallelScript[]>(() => loadScripts());

  useEffect(() => {
    saveScripts(scripts);
  }, [scripts]);

  const addScript = useCallback((script: ParallelScript) => {
    setScripts((prev) => [...prev, script]);
  }, []);

  const updateScript = useCallback((script: ParallelScript) => {
    setScripts((prev) => prev.map((s) => (s.id === script.id ? script : s)));
  }, []);

  const deleteScript = useCallback((id: string) => {
    setScripts((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { scripts, addScript, updateScript, deleteScript };
}
