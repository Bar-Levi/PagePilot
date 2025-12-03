"use client";

import { useEffect, useCallback, useRef } from "react";
import { useEditorStore } from "./use-editor-store";
import type { PageComponent } from "@/components/landing-page/types";

export function useKeyboardShortcuts() {
  const selectedId = useEditorStore((s) => s.selectedId);
  const pageJson = useEditorStore((s) => s.pageJson);
  const deleteComponent = useEditorStore((s) => s.deleteComponent);
  const addComponent = useEditorStore((s) => s.addComponent);
  const moveComponent = useEditorStore((s) => s.moveComponent);
  const getParentId = useEditorStore((s) => s.getParentId);
  const getComponentById = useEditorStore((s) => s.getComponentById);
  const select = useEditorStore((s) => s.select);
      const deselect = useEditorStore((s) => s.deselect);
      const clearSelection = useEditorStore((s) => s.clearSelection);
      const selectedIds = useEditorStore((s) => s.selectedIds);
      const undo = useEditorStore((s) => s.undo);
      const redo = useEditorStore((s) => s.redo);

  const clipboardRef = useRef<PageComponent | null>(null);

  // Find parent and sibling index
  const findParentAndIndex = useCallback(
    (id: string): { parent: PageComponent | null; index: number } => {
      const parentId = getParentId(id);
      if (!parentId) return { parent: null, index: -1 };

      const findNode = (
        node: PageComponent,
        targetId: string
      ): PageComponent | null => {
        if (node.id === targetId) return node;
        if (node.children) {
          for (const child of node.children) {
            const found = findNode(child, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      const parent = findNode(pageJson, parentId);
      if (!parent?.children) return { parent: null, index: -1 };

      const index = parent.children.findIndex((c) => c.id === id);
      return { parent, index };
    },
    [pageJson, getParentId]
  );

  // Duplicate node with new IDs
  const duplicateNode = useCallback(
    (node: PageComponent): PageComponent => {
      const newId = `${node.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return {
        ...node,
        id: newId,
        children: node.children?.map((child) => duplicateNode(child)),
      };
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Only handle Escape in inputs
        if (e.key === "Escape") {
          target.blur();
          deselect();
        }
        return;
      }

      const isCtrl = e.ctrlKey || e.metaKey;

      // Undo: Ctrl+Z
      if (isCtrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (isCtrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }

      // Escape: Deselect (clear multi-select if active, otherwise single deselect)
      if (e.key === "Escape") {
        if (selectedIds.length > 1) {
          clearSelection();
        } else {
          deselect();
        }
        return;
      }

      // Following shortcuts require a selected component
      if (!selectedId || selectedId === "page-root") return;

      const selectedComponent = getComponentById(selectedId);
      if (!selectedComponent) return;

      const parentId = getParentId(selectedId);
      const { parent, index } = findParentAndIndex(selectedId);

      // Delete: Delete or Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteComponent(selectedId);
        return;
      }

      // Copy: Ctrl+C
      if (isCtrl && e.key === "c") {
        e.preventDefault();
        clipboardRef.current = JSON.parse(JSON.stringify(selectedComponent));
        return;
      }

      // Cut: Ctrl+X
      if (isCtrl && e.key === "x") {
        e.preventDefault();
        clipboardRef.current = JSON.parse(JSON.stringify(selectedComponent));
        deleteComponent(selectedId);
        return;
      }

      // Paste: Ctrl+V
      if (isCtrl && e.key === "v") {
        e.preventDefault();
        if (!clipboardRef.current || !parentId) return;

        const pasted = duplicateNode(clipboardRef.current);
        addComponent(parentId, pasted, index + 1);
        select(pasted.id);
        return;
      }

      // Duplicate: Ctrl+D
      if (isCtrl && e.key === "d") {
        e.preventDefault();
        if (!parentId) return;

        const duplicated = duplicateNode(selectedComponent);
        addComponent(parentId, duplicated, index + 1);
        select(duplicated.id);
        return;
      }

      // Group/Wrap in Container: Ctrl+G
      if (isCtrl && e.key === "g") {
        e.preventDefault();
        if (!parentId) return;

        const containerId = `container-${Date.now()}`;
        const container: PageComponent = {
          id: containerId,
          type: "Container",
          props: {
            style: {
              padding: "16px",
              flexDirection: "column",
              gap: 8,
            },
          },
          children: [JSON.parse(JSON.stringify(selectedComponent))],
        };

        deleteComponent(selectedId);
        addComponent(parentId, container, index);
        select(containerId);
        return;
      }

      // Move Up: Alt+ArrowUp
      if (e.altKey && e.key === "ArrowUp") {
        e.preventDefault();
        if (!parentId || !parent || index <= 0) return;
        moveComponent(selectedId, parentId, index - 1);
        return;
      }

      // Move Down: Alt+ArrowDown
      if (e.altKey && e.key === "ArrowDown") {
        e.preventDefault();
        if (!parentId || !parent || index >= (parent.children?.length || 0) - 1)
          return;
        moveComponent(selectedId, parentId, index + 2);
        return;
      }

      // Select Parent: ArrowUp (without Alt)
      if (e.key === "ArrowUp" && !e.altKey && !isCtrl) {
        e.preventDefault();
        if (parentId && parentId !== "page-root") {
          select(parentId);
        }
        return;
      }

      // Select First Child: ArrowDown (without Alt)
      if (e.key === "ArrowDown" && !e.altKey && !isCtrl) {
        e.preventDefault();
        if (selectedComponent.children && selectedComponent.children.length > 0) {
          select(selectedComponent.children[0].id);
        }
        return;
      }

      // Select Previous Sibling: ArrowLeft
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (parent && index > 0) {
          select(parent.children![index - 1].id);
        }
        return;
      }

      // Select Next Sibling: ArrowRight
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (parent && index < (parent.children?.length || 0) - 1) {
          select(parent.children![index + 1].id);
        }
        return;
      }
    },
    [
      selectedId,
      pageJson,
      deleteComponent,
      addComponent,
      moveComponent,
      getParentId,
      getComponentById,
      select,
      deselect,
      undo,
      redo,
      findParentAndIndex,
      duplicateNode,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

