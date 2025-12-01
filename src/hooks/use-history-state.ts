
import { useState, useCallback, useMemo, useContext } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import type { PageData, PageComponent } from '@/components/landing-page/types';
import { EditorStateContext } from './use-editor-state.tsx';


export function useHistoryState() {
  const context = useContext(EditorStateContext);
  if (!context) {
    throw new Error('useHistoryState must be used within an EditorStateProvider');
  }

  const { history, setHistory, currentIndex, setCurrentIndex, selectedComponent, setSelectedComponentId } = context;

  const pageData = useMemo(() => history[currentIndex], [history, currentIndex]);
  
  const setPageData = useCallback((newState: PageData | ((prevState: PageData) => PageData)) => {
    const resolvedState = typeof newState === 'function' ? (newState as (prevState: PageData) => PageData)(pageData) : newState;
    
    // Simple deep-ish compare
    if (JSON.stringify(resolvedState) === JSON.stringify(pageData)) {
      return;
    }

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(resolvedState);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [currentIndex, history, pageData, setHistory, setCurrentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, setCurrentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length, setCurrentIndex]);

  const canUndo = useMemo(() => currentIndex > 0, [currentIndex]);
  const canRedo = useMemo(() => currentIndex < history.length - 1, [currentIndex, history.length]);

  useHotkeys('mod+z', undo, { preventDefault: true });
  useHotkeys('mod+y', redo, { preventDefault: true });
  useHotkeys('mod+shift+z', redo, { preventDefault: true });

  return {
    pageData,
    setPageData,
    selectedComponent,
    selectComponent: setSelectedComponentId,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
