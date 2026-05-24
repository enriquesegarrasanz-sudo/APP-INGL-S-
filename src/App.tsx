import { useState, useMemo, useCallback } from 'react';
import type { ExpressionStatus, Expression } from './types';

import { useExpressions } from './hooks/useExpressions';
import { useReview } from './hooks/useReview';

import Header from './components/layout/Header';
import Toast from './components/ui/Toast';
import ThemesView from './components/themes/ThemesView';
import LibraryView from './components/library/LibraryView';
import QuickAddModal from './components/library/QuickAddModal';
import ExpressionEditor from './components/library/ExpressionEditor';
import PronunciationView from './components/pronunciation/PronunciationView';
import FlashcardView from './components/flashcards/FlashcardView';
import SettingsView from './components/settings/SettingsView';

export default function App() {
  const { expressions, addExpression, updateExpression, deleteExpression, updateStatus, importData } = useExpressions();
  const review = useReview();

  const [view, setView] = useState('themes');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBlock, setFilterBlock] = useState<string>('all');
  const [filterContext, setFilterContext] = useState('');
  const [search, setSearch] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'grouped'>('all');
  const [activeBlock, setActiveBlock] = useState<string | null>(null);

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingExpr, setEditingExpr] = useState<Expression | null>(null);

  const [toast, setToast] = useState('');

  const allContexts = useMemo(() => {
    const contextSet = new Set<string>();
    expressions.forEach((expression) =>
      expression.contexts.forEach((context) => contextSet.add(context))
    );
    return [...contextSet].sort();
  }, [expressions]);

  const filtered = useMemo(() => {
    return expressions.filter((expression) => {
      if (filterStatus !== 'all' && expression.status !== filterStatus) return false;
      if (filterBlock !== 'all' && !expression.blocks.includes(filterBlock)) return false;
      if (
        filterContext &&
        !expression.contexts.some((context) =>
          context.toLowerCase().includes(filterContext.toLowerCase())
        )
      ) {
        return false;
      }
      if (search) {
        const normalizedSearch = search.toLowerCase();
        return (
          expression.english.toLowerCase().includes(normalizedSearch) ||
          expression.spanish_source.toLowerCase().includes(normalizedSearch) ||
          expression.meaning.toLowerCase().includes(normalizedSearch) ||
          expression.tags.some((tag) => tag.includes(normalizedSearch))
        );
      }
      return true;
    });
  }, [expressions, filterStatus, filterBlock, filterContext, search]);

  const handleSaveExpression = useCallback((expression: Expression) => {
    const existing = expressions.find((currentExpression) => currentExpression.id === expression.id);
    if (existing) {
      updateExpression(expression);
    } else {
      addExpression(expression);
    }
    setShowEditor(false);
    setShowQuickAdd(false);
    setEditingExpr(null);
    setToast('Expresion guardada');
  }, [expressions, addExpression, updateExpression]);

  const handleNavigateToBlock = useCallback((blockLabel: string) => {
    setView('library');
    setViewMode('grouped');
    setActiveBlock(blockLabel);
    setFilterBlock(blockLabel);
    setExpandedCard(null);
  }, []);

  const handleNavigateToExpression = useCallback((id: string) => {
    setExpandedCard(id);
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 50);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <Header currentView={view} onViewChange={setView} />

      <main className="px-4 sm:px-6 md:px-10 py-6 md:py-10 max-w-[1280px] mx-auto">
        {view === 'themes' && (
          <ThemesView
            expressions={expressions}
            onNavigateToBlock={handleNavigateToBlock}
          />
        )}

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
            onEdit={(expression) => {
              setEditingExpr(expression);
              setShowEditor(true);
            }}
            onNew={() => {
              setEditingExpr(null);
              setShowEditor(true);
            }}
            onQuickAdd={() => setShowQuickAdd(true)}
            onDelete={deleteExpression}
            onStatusChange={(id, status) => updateStatus(id, status as ExpressionStatus)}
            viewMode={viewMode}
            setViewMode={setViewMode}
            activeBlock={activeBlock}
            onNavigateToExpression={handleNavigateToExpression}
          />
        )}

        {view === 'pronunciation' && <PronunciationView expressions={expressions} />}

        {view === 'flashcards' && (
          <FlashcardView
            getDueCountForBlock={review.getDueCountForBlock}
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

        {view === 'settings' && (
          <SettingsView
            expressions={expressions}
            onImport={importData}
            copyText={(text) => setToast(text)}
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
          onClose={() => {
            setShowEditor(false);
            setEditingExpr(null);
          }}
        />
      )}
    </div>
  );
}
