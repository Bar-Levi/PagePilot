"use client";

import React from "react";
import { useEditorStore, useSelectedComponent } from "@/hooks/use-editor-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Copy,
  Clipboard,
  Trash2,
  ChevronUp,
  ChevronDown,
  Square,
  CopyPlus,
} from "lucide-react";
import type { PageComponent } from "@/components/landing-page/types";

export function QuickActions() {
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectedComponent = useSelectedComponent();
  const pageJson = useEditorStore((s) => s.pageJson);
  const deleteComponent = useEditorStore((s) => s.deleteComponent);
  const addComponent = useEditorStore((s) => s.addComponent);
  const moveComponent = useEditorStore((s) => s.moveComponent);
  const getParentId = useEditorStore((s) => s.getParentId);
  const select = useEditorStore((s) => s.select);

  const [clipboard, setClipboard] = React.useState<PageComponent | null>(null);

  if (!selectedId || !selectedComponent || selectedId === "page-root") {
    return null;
  }

  const parentId = getParentId(selectedId);

  // Find parent and sibling index
  const findParentAndIndex = (): {
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

    const index = parent.children.findIndex((c) => c.id === selectedId);
    return { parent, index };
  };

  const { parent, index } = findParentAndIndex();

  const canMoveUp = parent && index > 0;
  const canMoveDown = parent && index < (parent.children?.length || 0) - 1;

  // Duplicate component
  const handleDuplicate = () => {
    if (!parentId || !selectedComponent) return;

    const duplicateNode = (node: PageComponent): PageComponent => {
      const newId = `${node.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return {
        ...node,
        id: newId,
        children: node.children?.map(duplicateNode),
      };
    };

    const duplicated = duplicateNode(selectedComponent);
    addComponent(parentId, duplicated, index + 1);
    select(duplicated.id);
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (selectedComponent) {
      setClipboard(JSON.parse(JSON.stringify(selectedComponent)));
    }
  };

  // Paste from clipboard
  const handlePaste = () => {
    if (!clipboard || !parentId) return;

    const pasteNode = (node: PageComponent): PageComponent => {
      const newId = `${node.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return {
        ...node,
        id: newId,
        children: node.children?.map(pasteNode),
      };
    };

    const pasted = pasteNode(clipboard);
    addComponent(parentId, pasted, index + 1);
    select(pasted.id);
  };

  // Move up
  const handleMoveUp = () => {
    if (!parentId || !canMoveUp) return;
    moveComponent(selectedId, parentId, index - 1);
  };

  // Move down
  const handleMoveDown = () => {
    if (!parentId || !canMoveDown) return;
    moveComponent(selectedId, parentId, index + 2);
  };

  // Wrap in container
  const handleWrapInContainer = () => {
    if (!parentId || !selectedComponent) return;

    // Create new container with the selected component as child
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

    // Delete old component and add container at same position
    deleteComponent(selectedId);
    addComponent(parentId, container, index);
    select(containerId);
  };

  // Delete
  const handleDelete = () => {
    deleteComponent(selectedId);
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
          {/* Component Type Label */}
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2 border-r border-slate-200 dark:border-slate-700 mr-1">
            {selectedComponent.type}
          </span>

          {/* Duplicate */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleDuplicate}
              >
                <CopyPlus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>שכפל (Ctrl+D)</TooltipContent>
          </Tooltip>

          {/* Copy */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopy}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>העתק (Ctrl+C)</TooltipContent>
          </Tooltip>

          {/* Paste */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handlePaste}
                disabled={!clipboard}
              >
                <Clipboard className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>הדבק (Ctrl+V)</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Move Up */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleMoveUp}
                disabled={!canMoveUp}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>הזז למעלה</TooltipContent>
          </Tooltip>

          {/* Move Down */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleMoveDown}
                disabled={!canMoveDown}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>הזז למטה</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Wrap in Container */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleWrapInContainer}
              >
                <Square className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>עטוף במיכל (Ctrl+G)</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Delete */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>מחק (Delete)</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

