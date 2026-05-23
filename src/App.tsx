import { useState, useMemo, useCallback } from 'react';
import type { ExpressionStatus, Expression, ParallelScript } from './types';

import { useExpressions } from './hooks/useExpressions';
import { useScripts } from './hooks/useScripts';
import { useReview } from './hooks/useReview';

import Header from './components/layout/Header';
import Toast from './components/ui/Toast';
import LibraryView from './components/library/LibraryView';
import QuickAddModal from './components/library/QuickAddModal';
import ExpressionEditor from './components/library/ExpressionEditor';
import PronunciationView from './components/pronunciation/PronunciationView';
import FlashcardView from './components/flashcards/FlashcardView';
import ParallelView from './components/scripts/ParallelView';
import ScriptEditor from './components/scripts/ScriptEditor';
import PracticeView from './components/practice/PracticeView';
import DataView from './components/data/DataView';

import { copyToClipboard } from './lib/utils';
import { importAllData } from './lib/storage';

export default function App() {
  const { expressions, addExpression, updateExpression, deleteExpression, updateStatus } = useExpressions();
  const { scripts, addScript, updateScript, deleteScript } = useScripts();
  const review = useReview();

  const [view, setView] = useState('library');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBlock, setFilterBlock] = useState<string>('all');
  const [filterContext, setFilterContext] = useState('');
  const [search, setSearch] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingExpr, setEditingExpr] = useState<Expression | null>(null);
  const [showScriptEditor, setShowScriptEditor] = useState(false);
  const [editingScript, setEditingScript] = useState<ParallelScript | null>(null);

  const [toast, setToast] = useState('');

  const allContexts = useMemo(() => {
    const s = new Set<string>();
    expressions.forEach((e) => e.contexts.forEach((c) => s.add(c)));
    return [...s].sort();
  }, [expressions]);

  const filtered = useMemo(() => {
    return expressions.filter((e) => {
      if (filterStatus !== 'all' && e.status !== filterStatus) return false;
      if (filterBlock !== 'all' && e.block !== filterBlock) return false;
      if (filterContext && !e.contexts.some((c) => c.toLowerCase().includes(filterContext.toLowerCase()))) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          e.english.toLowerCase().includes(s) ||
          e.spanish_source.toLowerCase().includes(s) ||
          e.meaning.toLowerCase().includes(s) ||
          e.tags.some((t) => t.includes(s))
        );
      }
      return true;
    });
  }, [expressions, filterStatus, filterBlock, filterContext, search]);

  const copyText = useCallback((text: string, label?: string) => {
    copyToClipboard(text).then(() => {
      setToast(label || 'Copiado');
    });
  }, []);

  const handleSaveExpression = useCallback((expr: Expression) => {
    const existing = expressions.find((e) => e.id === expr.id);
    if (existing) {
      updateExpression(expr);
    } else {
      addExpression(expr);
    }
    setShowEditor(false);
    setShowQuickAdd(false);
    setEditingExpr(null);
    setToast('Expresion guardada');
  }, [expressions, addExpression, updateExpression]);

  const handleSaveScript = useCallback((script: ParallelScript) => {
    const existing = scripts.find((s) => s.id === script.id);
    if (existing) {
      updateScript(script);
    } else {
      addScript(script);
    }
    setShowScriptEditor(false);
    setEditingScript(null);
    setToast('Script guardado');
  }, [scripts, addScript, updateScript]);

  const handleImport = useCallback((data: { expressions?: Expression[]; scripts?: ParallelScript[] }) => {
    importAllData(data);
    window.location.reload();
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <Header currentView={view} onViewChange={setView} />

      <main className="px-6 md:px-10 py-10 max-w-[1280px] mx-auto">
        {view === 'library' && (
          <LibraryView
            expressions={filtered}
            allExpressions={expressions}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterBlock={filterBlock}
            setFilterBlock={setFilterBlock}
            filterContext={filterContext}
            setFilterContext={setFilterContext}
            search={search}
            setSearch={setSearch}
            allContexts={allContexts}
            expandedCard={expandedCard}
            setExpandedCard={setExpandedCard}
            onEdit={(e) => { setEditingExpr(e); setShowEditor(true); }}
            onNew={() => { setEditingExpr(null); setShowEditor(true); }}
            onQuickAdd={() => setShowQuickAdd(true)}
            onDelete={deleteExpression}
            onStatusChange={(id, status) => updateStatus(id, status as ExpressionStatus)}
          />
        )}

        {view === 'pronunciation' && <PronunciationView expressions={expressions} />}

        {view === 'flashcards' && (
          <FlashcardView
            dueCount={review.dueCount}
            currentSession={review.currentSession}
            currentCard={review.currentCard}
            cardIndex={review.cardIndex}
            totalCards={review.totalCards}
            isFlipped={review.isFlipped}
            startSession={review.startSession}
            flipCard={review.flipCard}
            rateCard={review.rateCard}
            endSession={review.endSession}
          />
        )}

        {view === 'scripts' && (
          <ParallelView
            scripts={scripts}
            expressions={expressions}
            onEdit={(s) => { setEditingScript(s); setShowScriptEditor(true); }}
            onNew={() => { setEditingScript(null); setShowScriptEditor(true); }}
            onDelete={deleteScript}
            copyText={copyText}
          />
        )}

        {view === 'practice' && (
          <PracticeView
            expressions={expressions}
            allContexts={allContexts}
            copyText={copyText}
          />
        )}

        {view === 'data' && (
          <DataView
            expressions={expressions}
            scripts={scripts}
            onImport={handleImport}
            copyText={copyText}
          />
        )}
      </main>

      {showQuickAdd && (
        <QuickAddModal
          onSave={handleSaveExpression}
          onClose={() => setShowQuickAdd(false)}
        />
      )}

      {showEditor && (
        <ExpressionEditor
          expression={editingExpr}
          onSave={handleSaveExpression}
          onClose={() => { setShowEditor(false); setEditingExpr(null); }}
        />
      )}

      {showScriptEditor && (
        <ScriptEditor
          script={editingScript}
          onSave={handleSaveScript}
          onClose={() => { setShowScriptEditor(false); setEditingScript(null); }}
        />
      )}
    </div>
  );
}
