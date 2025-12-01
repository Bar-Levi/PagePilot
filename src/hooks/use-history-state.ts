import { useState, useCallback, useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export function useHistoryState<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = useMemo(() => history[currentIndex], [history, currentIndex]);

  const setState = useCallback((newState: T | ((prevState: T) => T)) => {
    const resolvedState = typeof newState === 'function' ? (newState as (prevState: T) => T)(state) : newState;
    
    if (JSON.stringify(resolvedState) === JSON.stringify(state)) {
      return;
    }

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(resolvedState);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [currentIndex, history, state]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = useMemo(() => currentIndex > 0, [currentIndex]);
  const canRedo = useMemo(() => currentIndex < history.length - 1, [currentIndex, history.length]);

  useHotkeys('mod+z', undo, { preventDefault: true });
  useHotkeys('mod+y', redo, { preventDefault: true });
  useHotkeys('mod+shift+z', redo, { preventDefault: true });


  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
