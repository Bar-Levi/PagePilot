"use client";

import React, { useState, useRef } from "react";
import { GripVertical, Edit3, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewEditorContext } from "@/hooks/use-new-editor-context";
import type { PageComponent } from "../landing-page/types";

type EditableBlockProps = {
  node: PageComponent;
  parentId: string | null;
  children: React.ReactNode;
};

export function EditableBlock({
  node,
  parentId,
  children,
}: EditableBlockProps) {
  const {
    editingComponentId,
    setEditingComponentId,
    reorderComponents,
    pageJson,
  } = useNewEditorContext();

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const isEditing = editingComponentId === node.id;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingComponentId(isEditing ? null : node.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingComponentId(null);
  };

  // Find parent and siblings for reordering
  const findParentAndSiblings = (
    json: any,
    targetId: string
  ): { parent: any; siblings: any[] } | null => {
    // Check if any children match
    for (const child of json.children || []) {
      if (child.id === targetId) {
        return { parent: json, siblings: json.children };
      }
      const result = findParentAndSiblings(child, targetId);
      if (result) return result;
    }
    return null;
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (!parentId) return;
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", node.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isDragging) return;
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (!parentId || isDragging) return;

    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId === node.id) return;

    // Find parent and siblings
    const result = findParentAndSiblings(pageJson, node.id);
    if (!result) return;

    const { siblings } = result;
    const draggedIndex = siblings.findIndex((s) => s.id === draggedId);
    const targetIndex = siblings.findIndex((s) => s.id === node.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder siblings array
    const newSiblings = [...siblings];
    const [draggedItem] = newSiblings.splice(draggedIndex, 1);
    newSiblings.splice(targetIndex, 0, draggedItem);

    // Update JSON
    reorderComponents(parentId, newSiblings);
  };

  return (
    <div
      ref={dragRef}
      className={`relative group editable-block transition-all duration-200 ${
        isHovered && !isEditing ? "ring-2 ring-blue-300 ring-offset-2" : ""
      } ${
        isEditing ? "ring-2 ring-green-400 ring-offset-2 bg-green-50/50" : ""
      } ${dragOver ? "ring-2 ring-purple-400 ring-offset-2" : ""} ${
        isDragging ? "opacity-50" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable={!!parentId}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Control Bar */}
      <div
        className={`absolute -top-2 -right-2 z-10 flex items-center gap-1 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          isEditing ? "opacity-100" : ""
        }`}
      >
        {parentId && (
          <div
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-move"
            draggable
            onDragStart={handleDragStart}
          >
            <GripVertical className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
        )}

        {isEditing ? (
          <Button
            size="sm"
            variant="default"
            className="h-6 px-2 text-xs"
            onClick={handleSave}
          >
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={handleEdit}
          >
            <Edit3 className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
