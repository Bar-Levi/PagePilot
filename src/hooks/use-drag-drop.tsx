"use client";

import { useState, useCallback, useRef, createContext, useContext, ReactNode } from 'react';
import type { PageComponent } from '@/components/landing-page/types';

type DragState = {
  isDragging: boolean;
  draggedComponent: PageComponent | null;
  draggedId: string | null;
  dragOffset: { x: number; y: number };
  dropTarget: {
    componentId: string | null;
    position: 'before' | 'after' | 'inside';
  } | null;
};

type DragContextType = {
  dragState: DragState;
  startDrag: (component: PageComponent, startPos: { x: number; y: number }) => void;
  updateDrag: (currentPos: { x: number; y: number }) => void;
  endDrag: () => void;
  findDropTarget: (position: { x: number; y: number }) => { componentId: string | null; position: 'before' | 'after' | 'inside' } | null;
};

const DragContext = createContext<DragContextType | null>(null);

export const DragProvider = ({ children }: { children: ReactNode }) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedComponent: null,
    draggedId: null,
    dragOffset: { x: 0, y: 0 },
    dropTarget: null,
  });

  const draggedElementRef = useRef<HTMLElement | null>(null);

  const startDrag = useCallback((component: PageComponent, startPos: { x: number; y: number }) => {
    setDragState({
      isDragging: true,
      draggedComponent: component,
      draggedId: component.id,
      dragOffset: startPos,
      dropTarget: null,
    });
  }, []);

  const updateDrag = useCallback((currentPos: { x: number; y: number }) => {
    setDragState(prev => ({
      ...prev,
      dropTarget: findDropTarget(currentPos),
    }));
  }, []);

  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedComponent: null,
      draggedId: null,
      dragOffset: { x: 0, y: 0 },
      dropTarget: null,
    });
  }, []);

  const findDropTarget = useCallback((position: { x: number; y: number }) => {
    // This function would need to be implemented to find components under the cursor
    // For now, return null - will be implemented when integrating with the canvas
    return null;
  }, []);

  const value: DragContextType = {
    dragState,
    startDrag,
    updateDrag,
    endDrag,
    findDropTarget,
  };

  return (
    <DragContext.Provider value={value}>
      {children}
    </DragContext.Provider>
  );
};

export const useDragDrop = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragProvider');
  }
  return context;
};
