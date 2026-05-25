import { useState, useMemo, useCallback } from 'react';
import type { ExpressionStatus, Expression } from './types';

import { useExpressions } from './hooks/useExpressions';
import { useReview } from './hooks/useReview';
import { AudioSettingsProvider } from './context/AudioSettingsContext';

import ErrorBoundary from './components/ui/ErrorBoundary';
import Header from './components/layout/Header';
import Toast from './components/ui/Toast';
import DashboardView from './components/dashboard/DashboardView';
import ThemesView from './components/themes/ThemesView';
import PersonalMapView from './components/map/PersonalMapView';
import LibraryView from './components/library/LibraryView';
import QuickAddModal from './components/library/QuickAddModal';
import ExpressionEditor from './components/library/ExpressionEditor';
import FlashcardView from './components/flashcards/FlashcardView';
import StatsView from './components/stats/StatsView';
import SettingsView from './components/settings/SettingsView';

export default function App() {
  const { expressions, addExpression, updateExpression, deleteExpression, updateStatus, importData } = useExpressions();
  const review = useReview(expressions);

  const [view, setView] = useState('dashboard');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBlock, setFilterBlock] = useState<string>('all');
  const [filterContext, setFilterContext] = useState('all');
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
        filterContext !== 'all' &&
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

  const handleStartReview = useCallback((blockFilter?: string | null) => {
    setView('flashcards');
    if (blockFilter) {
      review.startSession(10, blockFilter);
    }
  }, [review]);

  const handleStartBlockReview = useCallback((blockLabel: string) => {
    setView('flashcards');
    review.startSession(10, blockLabel);
  }, [review]);

  return (
    <ErrorBoundary>
    <AudioSettingsProvider>
    <div className="min-h-screen bg-bg text-text font-sans">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <Header currentView={view} onViewChange={setView} />

      <main className="px-4 sm:px-6 md:px-10 py-6 md:py-10 max-w-[1280px] mx-auto">
        {view === 'dashboard' && (
          <DashboardView
            expressions={expressions}
            onStartReview={handleStartReview}
            onNavigateToBlock={handleNavigateToBlock}
            onQuickAdd={() => setShowQuickAdd(true)}
            onViewChange={setView}
          />
        )}

        {view === 'themes' && (
          <ThemesView
            expressions={expressions}
            onNavigateToBlock={handleNavigateToBlock}
            onStartBlockReview={handleStartBlockReview}
          />
        )}

        {view === 'map' && <PersonalMapView />}

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

        {view === 'stats' && (
          <StatsView expressions={expressions} />
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
          existingExpressions={expressions}
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
    </AudioSettingsProvider>
    </ErrorBoundary>
  );
}
