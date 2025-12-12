"use client";

import React, { useRef, useState } from "react";
import type { PageComponent } from "@/components/landing-page/types";
import { useEditorStore } from "@/hooks/use-editor-store";
import { cn } from "@/lib/utils";
import {
  GripVertical,
  Pencil,
  Trash2,
  Copy,
  Check,
  Plus,
  LayoutGrid,
  Columns,
  Rows,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ResizeHandles } from "./resize-handles";
import { AddComponentMenu } from "./add-component-menu";

type EditableWrapperProps = {
  node: PageComponent;
  parentId: string | null;
  children: React.ReactNode;
};

export function EditableWrapper({
  node,
  parentId,
  children,
}: EditableWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dropPosition, setDropPosition] = useState<
    "before" | "after" | "inside" | null
  >(null);

  // Store state
  const selectedId = useEditorStore((s) => s.selectedId);
  const hoveredId = useEditorStore((s) => s.hoveredId);
  const editingId = useEditorStore((s) => s.editingId);
  const draggedId = useEditorStore((s) => s.draggedId);

  // Store actions
  const select = useEditorStore((s) => s.select);
  const toggleSelect = useEditorStore((s) => s.toggleSelect);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const setHovered = useEditorStore((s) => s.setHovered);
  const startEditing = useEditorStore((s) => s.startEditing);
  const stopEditing = useEditorStore((s) => s.stopEditing);
  const deleteComponent = useEditorStore((s) => s.deleteComponent);
  const duplicateComponent = useEditorStore((s) => s.duplicateComponent);
  const startDrag = useEditorStore((s) => s.startDrag);
  const endDrag = useEditorStore((s) => s.endDrag);
  const moveComponent = useEditorStore((s) => s.moveComponent);
  const addComponent = useEditorStore((s) => s.addComponent);
  const updateContainerLayout = useEditorStore((s) => s.updateContainerLayout);
  const getParentId = useEditorStore((s) => s.getParentId);
  const getComponentById = useEditorStore((s) => s.getComponentById);
  const pageJson = useEditorStore((s) => s.pageJson);

  const isSelected = selectedId === node.id;
  const isMultiSelected = selectedIds.includes(node.id);
  const isHovered = hoveredId === node.id;
  const isEditing = editingId === node.id;
  const isDragging = draggedId === node.id;
  const isContainer =
    node.type === "Container" ||
    node.type === "TextContainer" ||
    node.type === "Form";

  // Get current layout for containers
  const currentLayout =
    isContainer && node.props
      ? (node.props as any).layout ||
        (node.props as any).style?.flexDirection ||
        "column"
      : null;

  // Visual selection styles
  const selectionStyle: React.CSSProperties = isSelected ? {
    outline: '2px solid #3b82f6',
    outlineOffset: '2px',
    position: 'relative',
  } : isHovered ? {
    outline: '1px dashed #3b82f6',
    outlineOffset: '2px',
    position: 'relative',
  } : {
    position: 'relative',
  };

  // Handlers
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      if (e.shiftKey) {
        // Shift+Click: Toggle multi-select
        toggleSelect(node.id);
      } else {
        // Regular click: Single select
        select(node.id);
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startEditing(node.id);
  };

  const handleMouseEnter = () => {
    if (!draggedId) {
      setHovered(node.id);
    }
  };

  const handleMouseLeave = () => {
    if (hoveredId === node.id) {
      setHovered(null);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteComponent(node.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    startEditing(node.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopEditing();
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateComponent(node.id);
  };

  const handleToggleLayout = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isContainer) {
      const newLayout = currentLayout === "row" ? "column" : "row";
      updateContainerLayout(node.id, newLayout);
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    startDrag(node.id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", node.id);
    e.dataTransfer.setData("application/x-component-id", node.id);

    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      e.dataTransfer.setDragImage(wrapperRef.current, rect.width / 2, 20);
    }
  };

  const handleDragEnd = () => {
    endDrag();
    setIsDragOver(false);
    setDropPosition(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !draggedId &&
      !e.dataTransfer.types.includes("application/x-component-type")
    ) {
      return;
    }

    if (draggedId === node.id) {
      return;
    }

    if (draggedId) {
      const isDescendant = isDescendantOf(pageJson, draggedId, node.id);
      if (isDescendant) {
        return;
      }
    }

    e.dataTransfer.dropEffect = draggedId ? "move" : "copy";
    setIsDragOver(true);

    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const height = rect.height;

      if (isContainer) {
        if (y < height * 0.25) {
          setDropPosition("before");
        } else if (y > height * 0.75) {
          setDropPosition("after");
        } else {
          setDropPosition("inside");
        }
      } else {
        if (y < height / 2) {
          setDropPosition("before");
        } else {
          setDropPosition("after");
        }
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();

    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setIsDragOver(false);
        setDropPosition(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDropPosition(null);

    const componentType = e.dataTransfer.getData(
      "application/x-component-type"
    );
    if (componentType) {
      const newComponent = createComponentFromType(componentType);
      if (newComponent) {
        if (dropPosition === "inside" && isContainer) {
          addComponent(node.id, newComponent);
        } else if (parentId) {
          const parent = getComponentById(parentId);
          if (parent?.children) {
            const currentIndex = parent.children.findIndex(
              (c) => c.id === node.id
            );
            const insertIndex =
              dropPosition === "before" ? currentIndex : currentIndex + 1;
            addComponent(parentId, newComponent, insertIndex);
          }
        }
      }
      endDrag();
      return;
    }

    if (!draggedId || draggedId === node.id) {
      endDrag();
      return;
    }

    const isDescendant = isDescendantOf(pageJson, draggedId, node.id);
    if (isDescendant) {
      endDrag();
      return;
    }

    if (dropPosition === "inside" && isContainer) {
      moveComponent(draggedId, node.id, 0);
    } else if (parentId) {
      const parent = getComponentById(parentId);
      if (parent?.children) {
        const currentIndex = parent.children.findIndex((c) => c.id === node.id);
        const draggedParentId = getParentId(draggedId);

        let insertIndex =
          dropPosition === "before" ? currentIndex : currentIndex + 1;

        if (draggedParentId === parentId) {
          const draggedIndex = parent.children.findIndex(
            (c) => c.id === draggedId
          );
          if (draggedIndex < insertIndex) {
            insertIndex--;
          }
        }

        moveComponent(draggedId, parentId, insertIndex);
      }
    }

    endDrag();
  };

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative group transition-all duration-150",
        isHovered &&
          !isSelected &&
          !isMultiSelected &&
          !isEditing &&
          "ring-1 ring-blue-300",
        isSelected && !isEditing && "ring-2 ring-blue-500",
        isMultiSelected &&
          !isSelected &&
          !isEditing &&
          "ring-2 ring-blue-400 bg-blue-50/20",
        isEditing && "ring-2 ring-green-500 bg-green-50/30",
        isDragging && "opacity-50 scale-95",
        isDragOver && dropPosition === "before" && "ring-t-4 ring-blue-500",
        isDragOver && dropPosition === "after" && "ring-b-4 ring-blue-500",
        isDragOver &&
          dropPosition === "inside" &&
          "ring-2 ring-purple-500 bg-purple-50/30"
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-component-id={node.id}
      data-component-type={node.type}
      data-parent-id={parentId}
    >
      {/* Drop indicator - Before */}
      {isDragOver && dropPosition === "before" && (
        <div className="absolute -top-1 left-0 right-0 h-1 bg-blue-500 rounded-full z-50">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
            הוסף כאן
          </div>
        </div>
      )}

      {/* Drop indicator - After */}
      {isDragOver && dropPosition === "after" && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-500 rounded-full z-50">
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
            הוסף כאן
          </div>
        </div>
      )}

      {/* Drop indicator - Inside (for containers) */}
      {isDragOver && dropPosition === "inside" && isContainer && (
        <div className="absolute inset-0 border-2 border-dashed border-purple-500 bg-purple-100/50 rounded-lg z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-purple-500 text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            הוסף לקונטיינר
          </div>
        </div>
      )}

      {/* Multi-select indicator */}
      {isMultiSelected && !isEditing && (
        <div className="absolute -top-2 -right-2 z-50 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-slate-800 animate-in zoom-in-50 duration-200">
          {selectedIds.indexOf(node.id) + 1}
        </div>
      )}

      {/* Control Bar - shown on hover or selection */}
      {(isHovered || isSelected || isMultiSelected) && !isEditing && (
        <TooltipProvider>
          <div className="absolute -top-9 left-0 flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-1 z-50">
            {/* Drag Handle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  draggable
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-slate-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">גרור לסידור מחדש (Ctrl+Alt+Arrow)</p>
              </TooltipContent>
            </Tooltip>

            {/* Component Type Label */}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-slate-500 px-2 border-l border-r border-slate-200 dark:border-slate-700 font-medium cursor-help">
                  {node.type}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">סוג הרכיב</p>
              </TooltipContent>
            </Tooltip>

            {/* Add Component Menu */}
            <AddComponentMenu targetId={node.id} />

            {/* Layout Toggle (for containers) */}
            {isContainer && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleToggleLayout}
                  >
                    {currentLayout === "row" ? (
                      <Rows className="w-3.5 h-3.5" />
                    ) : (
                      <Columns className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {currentLayout === "row"
                      ? "שנה לעמודה (↑↓)"
                      : "שנה לשורה (←→)"}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Duplicate Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleDuplicate}
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">שכפל (Ctrl+D)</p>
              </TooltipContent>
            </Tooltip>

            {/* Edit Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleEdit}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">ערוך (Double Click)</p>
              </TooltipContent>
            </Tooltip>

            {/* Delete Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">מחק (Delete)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )}

      {/* Save Button - shown when editing */}
      {isEditing && (
        <div className="absolute -top-9 left-0 flex items-center gap-1 bg-green-500 text-white rounded-lg shadow-lg p-1 z-50">
          <span className="text-xs px-2 font-medium">מצב עריכה</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white hover:bg-green-600"
            onClick={handleSave}
            title="שמור"
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Resize Handles - shown when selected */}
      {isSelected && !isEditing && <ResizeHandles nodeId={node.id} />}

      {/* Content */}
      <div className={cn(isEditing && "pointer-events-auto")}>{children}</div>
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function isDescendantOf(
  root: PageComponent,
  parentId: string,
  childId: string
): boolean {
  const parent = findNodeById(root, parentId);
  if (!parent) return false;

  const checkChildren = (node: PageComponent): boolean => {
    if (node.id === childId) return true;
    if (node.children) {
      return node.children.some((child) => checkChildren(child));
    }
    return false;
  };

  return checkChildren(parent);
}

function findNodeById(node: PageComponent, id: string): PageComponent | null {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
}

function createComponentFromType(type: string): PageComponent | null {
  const id = `${type.toLowerCase()}-${Date.now()}`;

  switch (type) {
    case "Container":
      return {
        id,
        type: "Container",
        props: {
          layout: "column",
          style: {
            padding: "32px",
            flexDirection: "column",
            gap: 16,
            background: "#f8fafc",
          },
        },
        children: [],
      };

    case "RichText":
      return {
        id,
        type: "RichText",
        props: {
          html: '<span style="font-size: 18px;">הקלד טקסט כאן...</span>',
          align: "right",
        },
      };

    case "Button":
      return {
        id,
        type: "Button",
        props: {
          text: "כפתור חדש",
          href: "#",
          variant: "default",
          size: "default",
        },
      };

    case "Image":
      return {
        id,
        type: "Image",
        props: {
          src: "https://picsum.photos/seed/new/600/400",
          alt: "תמונה חדשה",
          alignment: "center",
        },
      };

    case "Video":
      return {
        id,
        type: "Video",
        props: {
          youtubeId: "dQw4w9WgXcQ",
          ratio: "16:9",
          alignment: "center",
        },
      };

    case "Divider":
      return {
        id,
        type: "Divider",
        props: {
          thickness: 1,
          color: "#e2e8f0",
          spacing: 24,
        },
      };

    case "ImageCarouselSection":
      return {
        id,
        type: "ImageCarouselSection",
        props: {
          headline: "גלריית תמונות",
          description: "",
          images: [
            { src: "https://picsum.photos/seed/carousel1/800/450", alt: "תמונה 1", caption: "" },
            { src: "https://picsum.photos/seed/carousel2/800/450", alt: "תמונה 2", caption: "" },
            { src: "https://picsum.photos/seed/carousel3/800/450", alt: "תמונה 3", caption: "" },
          ],
          backgroundColor: "#0A1628",
          headlineColor: "#FFFFFF",
          underlineColor: "#00D4AA",
          accentColor: "#00D4AA",
          showDots: true,
          showArrows: true,
          showCounter: true,
          aspectRatio: "16:9",
          imageObjectFit: "contain",
          autoplay: false,
        },
      };

    case "ImageText":
      return {
        id,
        type: "ImageText",
        props: {
          imageSrc: "https://picsum.photos/seed/imagetext/600/400",
          imageAlt: "תמונה",
          text: '<p style="font-size: 18px; line-height: 1.7;">הוסף כאן טקסט שיופיע לצד התמונה.</p>',
          imagePosition: "right",
          imageWidth: 50,
          gap: 32,
          alignment: "center",
        },
      };

    case "Accordion":
      return {
        id,
        type: "Accordion",
        props: {
          items: [
            { title: "שאלה ראשונה?", content: "תשובה לשאלה הראשונה." },
            { title: "שאלה שנייה?", content: "תשובה לשאלה השנייה." },
          ],
          allowMultiple: false,
        },
      };

    default:
      return null;
  }
}
