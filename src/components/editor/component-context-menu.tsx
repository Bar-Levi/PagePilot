"use client";

import React, { useRef, useCallback } from "react";
import { useEditorStore } from "@/hooks/use-editor-store";
import type { PageComponent } from "@/components/landing-page/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import {
  Copy,
  Clipboard,
  Scissors,
  Trash2,
  ChevronUp,
  ChevronDown,
  Square,
  CopyPlus,
  Pencil,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ArrowUpToLine,
  ArrowDownToLine,
} from "lucide-react";

type ComponentContextMenuProps = {
  children: React.ReactNode;
  componentId: string;
};

export function ComponentContextMenu({
  children,
  componentId,
}: ComponentContextMenuProps) {
  const pageJson = useEditorStore((s) => s.pageJson);
  const deleteComponent = useEditorStore((s) => s.deleteComponent);
  const addComponent = useEditorStore((s) => s.addComponent);
  const moveComponent = useEditorStore((s) => s.moveComponent);
  const getParentId = useEditorStore((s) => s.getParentId);
  const getComponentById = useEditorStore((s) => s.getComponentById);
  const select = useEditorStore((s) => s.select);
  const startEditing = useEditorStore((s) => s.startEditing);

  const clipboardRef = useRef<PageComponent | null>(null);

  const component = getComponentById(componentId);
  const parentId = getParentId(componentId);
  const isRoot = componentId === "page-root";

  // Find parent and sibling index
  const findParentAndIndex = useCallback((): {
    parent: PageComponent | null;
    index: number;
  } => {
    if (!parentId) return { parent: null, index: -1 };

    const findNode = (
      node: PageComponent,
      id: string
    ): PageComponent | null => {
      if (node.id === id) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child, id);
          if (found) return found;
        }
      }
      return null;
    };

    const parent = findNode(pageJson, parentId);
    if (!parent?.children) return { parent: null, index: -1 };

    const index = parent.children.findIndex((c) => c.id === componentId);
    return { parent, index };
  }, [pageJson, parentId, componentId]);

  const { parent, index } = findParentAndIndex();

  const canMoveUp = parent && index > 0;
  const canMoveDown = parent && index < (parent.children?.length || 0) - 1;

  // Duplicate node with new IDs
  const duplicateNode = (node: PageComponent): PageComponent => {
    const newId = `${node.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      ...node,
      id: newId,
      children: node.children?.map(duplicateNode),
    };
  };

  const handleCopy = () => {
    if (component) {
      clipboardRef.current = JSON.parse(JSON.stringify(component));
    }
  };

  const handleCut = () => {
    if (component) {
      clipboardRef.current = JSON.parse(JSON.stringify(component));
      deleteComponent(componentId);
    }
  };

  const handlePaste = () => {
    if (!clipboardRef.current || !parentId) return;
    const pasted = duplicateNode(clipboardRef.current);
    addComponent(parentId, pasted, index + 1);
    select(pasted.id);
  };

  const handleDuplicate = () => {
    if (!component || !parentId) return;
    const duplicated = duplicateNode(component);
    addComponent(parentId, duplicated, index + 1);
    select(duplicated.id);
  };

  const handleDelete = () => {
    deleteComponent(componentId);
  };

  const handleMoveUp = () => {
    if (!parentId || !canMoveUp) return;
    moveComponent(componentId, parentId, index - 1);
  };

  const handleMoveDown = () => {
    if (!parentId || !canMoveDown) return;
    moveComponent(componentId, parentId, index + 2);
  };

  const handleMoveToTop = () => {
    if (!parentId) return;
    moveComponent(componentId, parentId, 0);
  };

  const handleMoveToBottom = () => {
    if (!parentId || !parent?.children) return;
    moveComponent(componentId, parentId, parent.children.length);
  };

  const handleWrapInContainer = () => {
    if (!component || !parentId) return;

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
      children: [JSON.parse(JSON.stringify(component))],
    };

    deleteComponent(componentId);
    addComponent(parentId, container, index);
    select(containerId);
  };

  const handleEdit = () => {
    startEditing(componentId);
  };

  if (!component) return <>{children}</>;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {/* Edit */}
        <ContextMenuItem onClick={handleEdit}>
          <Pencil className="w-4 h-4 mr-2" />
          ערוך
          <ContextMenuShortcut>לחיצה כפולה</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Copy/Cut/Paste */}
        <ContextMenuItem onClick={handleCopy} disabled={isRoot}>
          <Copy className="w-4 h-4 mr-2" />
          העתק
          <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={handleCut} disabled={isRoot}>
          <Scissors className="w-4 h-4 mr-2" />
          גזור
          <ContextMenuShortcut>Ctrl+X</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem
          onClick={handlePaste}
          disabled={!clipboardRef.current || isRoot}
        >
          <Clipboard className="w-4 h-4 mr-2" />
          הדבק
          <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={handleDuplicate} disabled={isRoot}>
          <CopyPlus className="w-4 h-4 mr-2" />
          שכפל
          <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Move */}
        <ContextMenuSub>
          <ContextMenuSubTrigger disabled={isRoot}>
            <ChevronUp className="w-4 h-4 mr-2" />
            הזז
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={handleMoveToTop} disabled={!canMoveUp}>
              <ArrowUpToLine className="w-4 h-4 mr-2" />
              הזז לראש
            </ContextMenuItem>
            <ContextMenuItem onClick={handleMoveUp} disabled={!canMoveUp}>
              <ChevronUp className="w-4 h-4 mr-2" />
              הזז למעלה
              <ContextMenuShortcut>Alt+↑</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleMoveDown} disabled={!canMoveDown}>
              <ChevronDown className="w-4 h-4 mr-2" />
              הזז למטה
              <ContextMenuShortcut>Alt+↓</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={handleMoveToBottom}
              disabled={!canMoveDown}
            >
              <ArrowDownToLine className="w-4 h-4 mr-2" />
              הזז לסוף
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Wrap */}
        <ContextMenuItem onClick={handleWrapInContainer} disabled={isRoot}>
          <Square className="w-4 h-4 mr-2" />
          עטוף במיכל
          <ContextMenuShortcut>Ctrl+G</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Delete */}
        <ContextMenuItem
          onClick={handleDelete}
          disabled={isRoot}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          מחק
          <ContextMenuShortcut>Delete</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

