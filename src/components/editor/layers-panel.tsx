"use client";

import React, { useState } from "react";
import { useEditorStore } from "@/hooks/use-editor-store";
import type { PageComponent } from "@/components/landing-page/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  GripVertical,
  Trash2,
  Layers,
  Type,
  Square,
  Image,
  Video,
  MousePointer,
  Minus,
  Layout,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

// Icon mapping for component types
const componentIcons: Record<string, React.ReactNode> = {
  Page: <Layout className="w-4 h-4" />,
  Container: <Square className="w-4 h-4" />,
  RichText: <Type className="w-4 h-4" />,
  Button: <MousePointer className="w-4 h-4" />,
  Image: <Image className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  Divider: <Minus className="w-4 h-4" />,
  TextContainer: <Type className="w-4 h-4" />,
  TextSpan: <Type className="w-4 h-4" />,
};

export function LayersPanel() {
  const pageJson = useEditorStore((s) => s.pageJson);
  const selectedId = useEditorStore((s) => s.selectedId);
  const select = useEditorStore((s) => s.select);
  const deleteComponent = useEditorStore((s) => s.deleteComponent);
  const moveComponent = useEditorStore((s) => s.moveComponent);
  const getParentId = useEditorStore((s) => s.getParentId);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(["page-root"])
  );
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set());
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleHidden = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleLocked = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLockedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (id === "page-root" || lockedIds.has(id)) {
      e.preventDefault();
      return;
    }
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      setDropTargetId(targetId);
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDragLeave = () => {
    setDropTargetId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      const targetParentId = getParentId(targetId);
      if (targetParentId) {
        // Find target index
        const findParent = (
          node: PageComponent,
          id: string
        ): PageComponent | null => {
          if (node.id === id) return node;
          if (node.children) {
            for (const child of node.children) {
              const found = findParent(child, id);
              if (found) return found;
            }
          }
          return null;
        };

        const parent = findParent(pageJson, targetParentId);
        if (parent?.children) {
          const targetIndex = parent.children.findIndex(
            (c) => c.id === targetId
          );
          moveComponent(draggedId, targetParentId, targetIndex);
        }
      }
    }
    setDraggedId(null);
    setDropTargetId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDropTargetId(null);
  };

  const renderNode = (node: PageComponent, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;
    const isHidden = hiddenIds.has(node.id);
    const isLocked = lockedIds.has(node.id);
    const isDragging = draggedId === node.id;
    const isDropTarget = dropTargetId === node.id;
    const isRoot = node.id === "page-root";

    const icon = componentIcons[node.type] || <Square className="w-4 h-4" />;

    // Get display name
    const displayName =
      node.type === "RichText"
        ? getTextPreview((node.props as any).html)
        : node.type === "Button"
          ? (node.props as any).text || "כפתור"
          : node.type;

    return (
      <div key={node.id}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={cn(
                "flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer transition-colors",
                "hover:bg-slate-100 dark:hover:bg-slate-700",
                isSelected && "bg-blue-100 dark:bg-blue-900/50",
                isDragging && "opacity-50",
                isDropTarget && "ring-2 ring-blue-500",
                isHidden && "opacity-40"
              )}
              style={{ paddingLeft: `${depth * 16 + 8}px` }}
              onClick={() => !isLocked && select(node.id)}
              draggable={!isRoot && !isLocked}
              onDragStart={(e) => handleDragStart(e, node.id)}
              onDragOver={(e) => handleDragOver(e, node.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, node.id)}
              onDragEnd={handleDragEnd}
            >
              {/* Drag Handle */}
              {!isRoot && (
                <GripVertical className="w-3 h-3 text-slate-400 cursor-grab" />
              )}

              {/* Expand/Collapse */}
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(node.id);
                  }}
                  className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              ) : (
                <div className="w-4" />
              )}

              {/* Icon */}
              <span className="text-slate-500 dark:text-slate-400">{icon}</span>

              {/* Name */}
              {renamingId === node.id ? (
                <Input
                  className="h-5 text-xs px-1"
                  defaultValue={displayName}
                  autoFocus
                  onBlur={() => setRenamingId(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      setRenamingId(null);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  className="text-xs truncate flex-1"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setRenamingId(node.id);
                  }}
                >
                  {displayName}
                </span>
              )}

              {/* Actions */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => toggleHidden(node.id, e)}
                  className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  title={isHidden ? "הצג" : "הסתר"}
                >
                  {isHidden ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </button>
                <button
                  onClick={(e) => toggleLocked(node.id, e)}
                  className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  title={isLocked ? "בטל נעילה" : "נעל"}
                >
                  {isLocked ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    <Unlock className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => select(node.id)}>
              בחר
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setRenamingId(node.id)}>
              שנה שם
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => toggleHidden(node.id, {} as any)}>
              {isHidden ? "הצג" : "הסתר"}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => toggleLocked(node.id, {} as any)}>
              {isLocked ? "בטל נעילה" : "נעל"}
            </ContextMenuItem>
            <ContextMenuSeparator />
            {!isRoot && (
              <ContextMenuItem
                onClick={() => deleteComponent(node.id)}
                className="text-red-600"
              >
                מחק
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Layers className="w-4 h-4" />
          <h3 className="font-semibold text-sm">שכבות</h3>
        </div>
      </div>

      {/* Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">{renderNode(pageJson)}</div>
      </ScrollArea>
    </div>
  );
}

// Helper to get text preview from HTML
function getTextPreview(html: string): string {
  if (!html) return "טקסט";
  const text = html.replace(/<[^>]*>/g, "").trim();
  return text.length > 20 ? text.substring(0, 20) + "..." : text || "טקסט";
}

