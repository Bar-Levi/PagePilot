
"use client";

import { createContext, useState, useCallback, useContext, ReactNode, useMemo } from 'react';
import type { PageData, PageComponent } from '@/components/landing-page/types';

// Helper function to recursively find and update a component
const updateComponentRecursively = (
  components: PageComponent[],
  id: string,
  newProps: any
): PageComponent[] => {
  return components.map(component => {
    if (component.id === id) {
      // Merge new props with existing props
      const mergedProps = { ...component.props, ...newProps };
      return { ...component, props: mergedProps };
    }
    if (component.children) {
      return { ...component, children: updateComponentRecursively(component.children, id, newProps) };
    }
    return component;
  });
};

const findComponentRecursively = (components: PageComponent[], id: string): PageComponent | null => {
  for (const component of components) {
    if (component.id === id) {
      return component;
    }
    if (component.children) {
      const found = findComponentRecursively(component.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};


type EditorContextType = {
  history: PageData[];
  setHistory: React.Dispatch<React.SetStateAction<PageData[]>>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedComponentId: string | null;
  setSelectedComponentId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedComponent: PageComponent | null;
  updateComponentProps: (id: string, newProps: any) => void;
};

export const EditorStateContext = createContext<EditorContextType | null>(null);

export const EditorStateProvider = ({
  children,
  initialPageData,
}: {
  children: ReactNode;
  initialPageData: PageData;
}) => {
  const [history, setHistory] = useState<PageData[]>([initialPageData]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const updateComponentProps = useCallback((id: string, newProps: any) => {
    const currentPageData = history[currentIndex];
    
    const newPageStructure = updateComponentRecursively(currentPageData.pageStructure, id, newProps);
    
    const newPageData = { ...currentPageData, pageStructure: newPageStructure };

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newPageData);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [currentIndex, history]);

  const selectedComponent = useMemo(() => {
    if (!selectedComponentId) return null;
    const currentPageData = history[currentIndex];
    return findComponentRecursively(currentPageData.pageStructure, selectedComponentId);
  }, [selectedComponentId, history, currentIndex]);


  const value = {
    history,
    setHistory,
    currentIndex,
    setCurrentIndex,
    selectedComponentId,
    setSelectedComponentId,
    selectedComponent,
    updateComponentProps,
  };

  return (
    <EditorStateContext.Provider value={value}>
      {children}
    </EditorStateContext.Provider>
  );
};

export const useEditorState = () => {
    const context = useContext(EditorStateContext);
    if (!context) {
        throw new Error('useEditorState must be used within an EditorStateProvider');
    }
    return context;
}
