"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useEditorStore } from "./use-editor-store";

/**
 * New Editor Context Hook
 * 
 * Provides a context-based API for the editor store.
 * This bridges the gap between Zustand store and Context-based consumption.
 */

export type EditMode = "select" | "text-edit" | "drag";

interface NewEditorContextValue {
  // Selection state
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
  hoveredComponentId: string | null;
  setHoveredComponentId: (id: string | null) => void;
  
  // Edit mode
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;
  
  // Component operations
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  deleteComponent: (id: string) => void;
  
  // Page JSON
  pageJson: any;
  setPageJson: (json: any) => void;
}

const NewEditorContext = createContext<NewEditorContextValue | null>(null);

export function NewEditorProvider({ children }: { children: ReactNode }) {
  const store = useEditorStore();

  const value: NewEditorContextValue = {
    // Selection
    selectedComponentId: store.selectedId,
    setSelectedComponentId: (id) => {
      if (id) {
        store.select(id);
      } else {
        store.deselect();
      }
    },
    hoveredComponentId: store.hoveredId,
    setHoveredComponentId: (id) => store.setHovered(id),
    
    // Edit mode (default to select mode, map from store if exists)
    editMode: "select",
    setEditMode: () => {}, // No-op for now
    
    // Component operations
    updateComponentProps: store.updateProps,
    deleteComponent: store.deleteComponent,
    
    // Page JSON
    pageJson: store.pageJson,
    setPageJson: store.setPageJson,
  };

  return (
    <NewEditorContext.Provider value={value}>
      {children}
    </NewEditorContext.Provider>
  );
}

export function useNewEditorContext(): NewEditorContextValue {
  const context = useContext(NewEditorContext);
  
  if (!context) {
    // Return a mock context for non-editing scenarios (like public landing pages)
    // This allows components to be used outside of the editor
    return {
      selectedComponentId: null,
      setSelectedComponentId: () => {},
      hoveredComponentId: null,
      setHoveredComponentId: () => {},
      editMode: "select",
      setEditMode: () => {},
      updateComponentProps: () => {},
      deleteComponent: () => {},
      pageJson: { id: "root", type: "Page", props: {}, children: [] },
      setPageJson: () => {},
    };
  }
  
  return context;
}

export default NewEditorContext;
