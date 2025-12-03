"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { PageComponent, AnyProps, ContainerProps } from "@/components/landing-page/types";
import type { RelativePosition } from "@/lib/json-utils";

// ============================================================================
// Types
// ============================================================================

export type PageNode = PageComponent;

export type EditorState = {
  // Page Data
  pageJson: PageNode;

  // Selection
  selectedId: string | null;
  selectedIds: string[]; // Multi-select support
  hoveredId: string | null;

  // Edit Mode
  editingId: string | null; // component currently being edited inline

  // History (Undo/Redo)
  history: PageNode[];
  historyIndex: number;

  // Drag & Drop
  draggedId: string | null;
  dropTargetId: string | null;

  // Business Context (for RAG)
  businessContext: string;

  // Clipboard (for copy/paste)
  clipboard: PageComponent | null;

  // Device Preview (for responsive design)
  devicePreview: 'desktop' | 'laptop' | 'tablet' | 'mobile';

  // Active RichText Element (for toolbar)
  activeRichTextElement: HTMLDivElement | null;
};

export type EditorActions = {
  // Initialize
  setPageJson: (pageJson: PageNode) => void;

  // CRUD
  updateProps: (id: string, props: Partial<AnyProps>) => void;
  addComponent: (
    parentId: string,
    component: PageComponent,
    index?: number
  ) => void;
  deleteComponent: (id: string) => void;
  moveComponent: (id: string, newParentId: string, newIndex: number) => void;
  reorderChildren: (parentId: string, newOrder: string[]) => void;
  duplicateComponent: (id: string) => void;

  // Relative Insertion (new!)
  addComponentRelativeTo: (
    targetId: string,
    position: RelativePosition,
    component: PageComponent
  ) => void;
  updateContainerLayout: (containerId: string, layout: "row" | "column") => void;

  // Selection
  select: (id: string) => void;
  toggleSelect: (id: string) => void; // Toggle selection (for Shift+Click)
  selectMultiple: (ids: string[]) => void; // Select multiple at once
  clearSelection: () => void; // Clear all selections
  deselect: () => void;
  setHovered: (id: string | null) => void;

  // Multi-select operations
  moveComponentsToContainer: (componentIds: string[], containerId: string) => void;

  // Edit Mode
  startEditing: (id: string) => void;
  stopEditing: () => void;

  // History
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;

  // Drag & Drop
  startDrag: (id: string) => void;
  setDropTarget: (id: string | null) => void;
  endDrag: () => void;

  // Business Context
  setBusinessContext: (context: string) => void;

  // RichText
  setActiveRichTextElement: (element: HTMLDivElement | null) => void;

  // Clipboard
  copyComponent: (id: string) => void;
  pasteComponent: (targetParentId?: string) => void;

  // Device Preview
  setDevicePreview: (device: 'desktop' | 'laptop' | 'tablet' | 'mobile') => void;

  // Helpers
  getComponentById: (id: string) => PageComponent | null;
  getParentId: (id: string) => string | null;
};

// ============================================================================
// Helper Functions
// ============================================================================

function findComponentById(
  node: PageNode,
  id: string
): PageComponent | null {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findComponentById(child, id);
      if (found) return found;
    }
  }
  return null;
}

function findParentId(
  node: PageNode,
  targetId: string,
  parentId: string | null = null
): string | null {
  if (node.id === targetId) return parentId;
  if (node.children) {
    for (const child of node.children) {
      const found = findParentId(child, targetId, node.id);
      if (found !== null) return found;
    }
  }
  return null;
}

function updatePropsInTree(
  node: PageNode,
  id: string,
  newProps: Partial<AnyProps>
): PageNode {
  if (node.id === id) {
    return { ...node, props: { ...node.props, ...newProps } };
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((child) =>
        updatePropsInTree(child, id, newProps)
      ),
    };
  }
  return node;
}

function addComponentToTree(
  node: PageNode,
  parentId: string,
  component: PageComponent,
  index?: number
): PageNode {
  if (node.id === parentId) {
    const children = node.children ? [...node.children] : [];
    if (index !== undefined && index >= 0 && index <= children.length) {
      children.splice(index, 0, component);
    } else {
      children.push(component);
    }
    return { ...node, children };
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((child) =>
        addComponentToTree(child, parentId, component, index)
      ),
    };
  }
  return node;
}

function deleteComponentFromTree(node: PageNode, id: string): PageNode | null {
  if (node.id === id) return null;
  if (node.children) {
    const newChildren = node.children
      .map((child) => deleteComponentFromTree(child, id))
      .filter((child): child is PageNode => child !== null);
    return { ...node, children: newChildren };
  }
  return node;
}

function moveComponentInTree(
  node: PageNode,
  componentId: string,
  newParentId: string,
  newIndex: number
): PageNode {
  // First, find and remove the component
  const component = findComponentById(node, componentId);
  if (!component) return node;

  // Remove from current location
  let result = deleteComponentFromTree(node, componentId);
  if (!result) return node;

  // Add to new location
  result = addComponentToTree(result, newParentId, component, newIndex);
  return result;
}

function reorderChildrenInTree(
  node: PageNode,
  parentId: string,
  newOrder: string[]
): PageNode {
  if (node.id === parentId && node.children) {
    const childMap = new Map(node.children.map((c) => [c.id, c]));
    const reorderedChildren = newOrder
      .map((id) => childMap.get(id))
      .filter((c): c is PageComponent => c !== undefined);
    return { ...node, children: reorderedChildren };
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((child) =>
        reorderChildrenInTree(child, parentId, newOrder)
      ),
    };
  }
  return node;
}

function isDescendantOf(
  root: PageNode,
  ancestorId: string,
  descendantId: string
): boolean {
  const ancestor = findComponentById(root, ancestorId);
  if (!ancestor) return false;

  const checkChildren = (node: PageNode): boolean => {
    if (node.id === descendantId) return true;
    if (node.children) {
      return node.children.some((child) => checkChildren(child));
    }
    return false;
  };

  return checkChildren(ancestor);
}

function duplicateComponentInTree(
  node: PageNode,
  componentId: string
): { tree: PageNode; newId: string | null } {
  const component = findComponentById(node, componentId);
  if (!component) return { tree: node, newId: null };

  const parentId = findParentId(node, componentId);
  if (!parentId) return { tree: node, newId: null };

  // Deep clone and generate new IDs
  const cloneWithNewIds = (comp: PageComponent): PageComponent => {
    const newId = `${comp.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      ...comp,
      id: newId,
      children: comp.children?.map(cloneWithNewIds),
    };
  };

  const clonedComponent = cloneWithNewIds(component);

  // Find parent and insert after the original
  const parent = findComponentById(node, parentId);
  if (!parent?.children) return { tree: node, newId: null };

  const index = parent.children.findIndex((c) => c.id === componentId);
  if (index === -1) return { tree: node, newId: null };

  const updatedTree = addComponentToTree(node, parentId, clonedComponent, index + 1);
  return { tree: updatedTree, newId: clonedComponent.id };
}

function getRequiredLayout(position: RelativePosition): "row" | "column" {
  if (position === "left" || position === "right") {
    return "row";
  }
  return "column";
}

function updateContainerLayoutInTree(
  node: PageNode,
  containerId: string,
  layout: "row" | "column"
): PageNode {
  if (node.id === containerId) {
    const props = node.props as ContainerProps;
    return {
      ...node,
      props: {
        ...props,
        layout,
        style: {
          ...props.style,
          flexDirection: layout,
        },
      },
    };
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((child) =>
        updateContainerLayoutInTree(child, containerId, layout)
      ),
    };
  }
  return node;
}

function addComponentRelativeToInTree(
  node: PageNode,
  targetId: string,
  position: RelativePosition,
  component: PageComponent
): PageNode {
  const parentId = findParentId(node, targetId);
  if (!parentId) return node;

  const parent = findComponentById(node, parentId);
  if (!parent?.children) return node;

  const targetIndex = parent.children.findIndex((c) => c.id === targetId);
  if (targetIndex === -1) return node;

  // Calculate insert index
  const insertIndex =
    position === "above" || position === "left"
      ? targetIndex
      : targetIndex + 1;

  // Update parent layout based on position
  const requiredLayout = getRequiredLayout(position);
  let updatedTree = updateContainerLayoutInTree(node, parentId, requiredLayout);

  // Add the component
  updatedTree = addComponentToTree(updatedTree, parentId, component, insertIndex);

  return updatedTree;
}

// ============================================================================
// Default Page
// ============================================================================

const defaultPageJson: PageNode = {
  id: "page-root",
  type: "Page",
  props: {},
  children: [],
};

// ============================================================================
// Store
// ============================================================================

export const useEditorStore = create<EditorState & EditorActions>()(
  immer((set, get) => ({
    // Initial State
    pageJson: defaultPageJson,
    selectedId: null,
    selectedIds: [],
    hoveredId: null,
    editingId: null,
    history: [defaultPageJson],
    historyIndex: 0,
    draggedId: null,
    dropTargetId: null,
    businessContext: "",
    clipboard: null,
    devicePreview: 'desktop',
    activeRichTextElement: null,

    // Initialize
    setPageJson: (pageJson) => {
      set((state) => {
        state.pageJson = pageJson;
        state.history = [pageJson];
        state.historyIndex = 0;
      });
    },

    // CRUD Operations
    updateProps: (id, props) => {
      set((state) => {
        state.pageJson = updatePropsInTree(state.pageJson, id, props);
      });
      get().saveToHistory();
    },

    addComponent: (parentId, component, index) => {
      set((state) => {
        state.pageJson = addComponentToTree(
          state.pageJson,
          parentId,
          component,
          index
        );
      });
      get().saveToHistory();
    },

    deleteComponent: (id) => {
      set((state) => {
        const result = deleteComponentFromTree(state.pageJson, id);
        if (result) {
          state.pageJson = result;
          if (state.selectedId === id) {
            state.selectedId = null;
          }
          if (state.editingId === id) {
            state.editingId = null;
          }
        }
      });
      get().saveToHistory();
    },

    moveComponent: (id, newParentId, newIndex) => {
      set((state) => {
        state.pageJson = moveComponentInTree(
          state.pageJson,
          id,
          newParentId,
          newIndex
        );
      });
      get().saveToHistory();
    },

    reorderChildren: (parentId, newOrder) => {
      set((state) => {
        state.pageJson = reorderChildrenInTree(
          state.pageJson,
          parentId,
          newOrder
        );
      });
      get().saveToHistory();
    },

    duplicateComponent: (id) => {
      set((state) => {
        const { tree, newId } = duplicateComponentInTree(state.pageJson, id);
        state.pageJson = tree;
        if (newId) {
          state.selectedId = newId;
        }
      });
      get().saveToHistory();
    },

    // Relative Insertion
    addComponentRelativeTo: (targetId, position, component) => {
      set((state) => {
        state.pageJson = addComponentRelativeToInTree(
          state.pageJson,
          targetId,
          position,
          component
        );
        state.selectedId = component.id;
      });
      get().saveToHistory();
    },

    updateContainerLayout: (containerId, layout) => {
      set((state) => {
        state.pageJson = updateContainerLayoutInTree(
          state.pageJson,
          containerId,
          layout
        );
      });
      get().saveToHistory();
    },

    // Multi-select operations
    moveComponentsToContainer: (componentIds, containerId) => {
      set((state) => {
        // Prevent moving container into itself or its descendants
        const container = findComponentById(state.pageJson, containerId);
        if (!container) return;

        // Filter out invalid moves (circular references)
        const validIds = componentIds.filter((id) => {
          if (id === containerId) return false; // Can't move container into itself
          const isDescendant = isDescendantOf(state.pageJson, id, containerId);
          if (isDescendant) return false; // Can't move parent into child
          return true;
        });

        if (validIds.length === 0) {
          console.warn("No valid components to move");
          return;
        }

        // Move each valid component to the container
        let updatedTree = state.pageJson;
        for (const id of validIds) {
          updatedTree = moveComponentInTree(updatedTree, id, containerId, 0);
        }
        state.pageJson = updatedTree;

        // Clear selection after move
        state.selectedIds = [];
        state.selectedId = null;
      });
      get().saveToHistory();
    },

    // Selection
    select: (id) => {
      set((state) => {
        state.selectedId = id;
        state.selectedIds = [id]; // Single select also updates multi-select
        // Stop editing if selecting a different component
        if (state.editingId && state.editingId !== id) {
          state.editingId = null;
        }
      });
    },

    toggleSelect: (id) => {
      set((state) => {
        const index = state.selectedIds.indexOf(id);
        if (index === -1) {
          // Add to selection
          state.selectedIds.push(id);
          if (state.selectedIds.length === 1) {
            state.selectedId = id;
          }
        } else {
          // Remove from selection
          state.selectedIds.splice(index, 1);
          if (state.selectedId === id) {
            state.selectedId = state.selectedIds.length > 0 ? state.selectedIds[0] : null;
          }
        }
      });
    },

    selectMultiple: (ids) => {
      set((state) => {
        state.selectedIds = [...ids];
        state.selectedId = ids.length > 0 ? ids[0] : null;
      });
    },

    clearSelection: () => {
      set((state) => {
        state.selectedIds = [];
        state.selectedId = null;
      });
    },

    deselect: () => {
      set((state) => {
        state.selectedId = null;
        state.selectedIds = [];
        state.editingId = null;
        state.activeRichTextElement = null;
      });
    },

    setHovered: (id) => {
      set((state) => {
        state.hoveredId = id;
      });
    },

    // Edit Mode
    startEditing: (id) => {
      set((state) => {
        state.editingId = id;
        state.selectedId = id;
      });
    },

    stopEditing: () => {
      set((state) => {
        state.editingId = null;
      });
    },

    // History (Undo/Redo)
    saveToHistory: () => {
      set((state) => {
        // Remove any future history if we're not at the end
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(state.pageJson)));

        // Limit history to 50 entries
        if (newHistory.length > 50) {
          newHistory.shift();
        } else {
          state.historyIndex++;
        }
        state.history = newHistory;
      });
    },

    undo: () => {
      set((state) => {
        if (state.historyIndex > 0) {
          state.historyIndex--;
          state.pageJson = JSON.parse(
            JSON.stringify(state.history[state.historyIndex])
          );
        }
      });
    },

    redo: () => {
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex++;
          state.pageJson = JSON.parse(
            JSON.stringify(state.history[state.historyIndex])
          );
        }
      });
    },

    // Drag & Drop
    startDrag: (id) => {
      set((state) => {
        state.draggedId = id;
      });
    },

    setDropTarget: (id) => {
      set((state) => {
        state.dropTargetId = id;
      });
    },

    endDrag: () => {
      set((state) => {
        state.draggedId = null;
        state.dropTargetId = null;
      });
    },

    // Business Context
    setBusinessContext: (context) => {
      set((state) => {
        state.businessContext = context;
      });
    },

    // RichText
    setActiveRichTextElement: (element) => {
      set((state) => {
        state.activeRichTextElement = element as any;
      });
    },

    // Clipboard Operations
    copyComponent: (id) => {
      const component = get().getComponentById(id);
      if (component) {
        set((state) => {
          state.clipboard = JSON.parse(JSON.stringify(component));
        });
      }
    },

    pasteComponent: (targetParentId) => {
      const clipboard = get().clipboard;
      if (!clipboard) return;

      // Clone with new IDs
      const cloneWithNewIds = (comp: PageComponent): PageComponent => {
        const newId = `${comp.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return {
          ...comp,
          id: newId,
          children: comp.children?.map(cloneWithNewIds),
        };
      };

      const cloned = cloneWithNewIds(clipboard);
      const parentId = targetParentId || get().selectedId || 'page-root';
      get().addComponent(parentId, cloned);
    },

    // Device Preview
    setDevicePreview: (device) => {
      set((state) => {
        state.devicePreview = device;
      });
    },

    // Helpers
    getComponentById: (id) => {
      return findComponentById(get().pageJson, id);
    },

    getParentId: (id) => {
      return findParentId(get().pageJson, id);
    },
  }))
);

// ============================================================================
// Selector Hooks (for performance optimization)
// ============================================================================

export const useSelectedComponent = () => {
  const selectedId = useEditorStore((s) => s.selectedId);
  const getComponentById = useEditorStore((s) => s.getComponentById);
  return selectedId ? getComponentById(selectedId) : null;
};

export const useIsSelected = (id: string) => {
  return useEditorStore((s) => s.selectedId === id);
};

export const useIsHovered = (id: string) => {
  return useEditorStore((s) => s.hoveredId === id);
};

export const useIsEditing = (id: string) => {
  return useEditorStore((s) => s.editingId === id);
};

export const useCanUndo = () => {
  return useEditorStore((s) => s.historyIndex > 0);
};

export const useCanRedo = () => {
  return useEditorStore((s) => s.historyIndex < s.history.length - 1);
};

