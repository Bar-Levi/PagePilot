"use client";

import { cn } from "@/lib/utils";
import type { PageComponent } from "../landing-page/types";
import { useNewEditorContext } from "@/hooks/use-new-editor-context";
import { useState, useRef } from "react";
import { InlineTextEditor } from "./inline-text-editor";
import { ResizeHandles } from "./resize-handles";

type EditableComponentWrapperProps = {
  children: React.ReactNode;
  component: PageComponent;
  isSelected: boolean;
  onSelect: (id: string | null, multiSelect?: boolean) => void;
};

export function EditableComponentWrapper({
  children,
  component,
  isSelected,
  onSelect,
}: EditableComponentWrapperProps) {
  const {
    hoveredComponentId,
    setHoveredComponentId,
    editMode,
    updateComponentProps,
  } = useNewEditorContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const isCurrentlyHovered = hoveredComponentId === component.id;

  const handleResize = (dimensions: { width?: number; height?: number }) => {
    const newStyle = {
      ...component.props.style,
      ...dimensions,
    };
    updateComponentProps(component.id, { style: newStyle });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHoveredComponentId(component.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoveredComponentId(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (editMode === "select") {
      e.stopPropagation();
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (editMode === "select" && dragStartPos.current && !isDragging) {
      const deltaX = Math.abs(e.clientX - dragStartPos.current.x);
      const deltaY = Math.abs(e.clientY - dragStartPos.current.y);

      // Start dragging if moved more than 5 pixels
      if (deltaX > 5 || deltaY > 5) {
        setIsDragging(true);
        // TODO: Initialize drag operation
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      // TODO: Complete drag operation
    } else {
      // Allow selection in all modes, but with different behaviors
      const multiSelect = e.shiftKey || e.ctrlKey;
      onSelect(component.id, multiSelect);
    }
    dragStartPos.current = null;
  };

  const handleSelect = (e: React.MouseEvent) => {
    console.log(
      "EditableComponentWrapper handleSelect:",
      component.id,
      component.type
    );
    e.stopPropagation();
    const multiSelect = e.shiftKey || e.ctrlKey;
    onSelect(component.id, multiSelect);
  };

  const getOutlineClass = () => {
    if (isSelected) {
      return "ring-2 ring-blue-500 ring-offset-2";
    }
    if (isCurrentlyHovered) {
      return "ring-1 ring-blue-300 ring-offset-1";
    }
    return "ring-0";
  };

  const getHoverClass = () => {
    if (editMode === "select" || editMode === "text-edit") {
      return "hover:ring-1 hover:ring-blue-300 hover:ring-offset-1";
    }
    return "";
  };

  return (
    <div
      className={cn(
        "relative group transition-all duration-150 ease-in-out",
        getOutlineClass(),
        getHoverClass(),
        isSelected && "z-10",
        isDragging && "opacity-50"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        cursor: isDragging
          ? "grabbing"
          : editMode === "select"
          ? "grab"
          : "default",
      }}
    >
      {/* Component Type Label */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t-md pointer-events-none z-20 shadow-sm">
          {component.type}
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <>
          {/* Corner indicators */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full border border-white pointer-events-none z-20" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white pointer-events-none z-20" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full border border-white pointer-events-none z-20" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white pointer-events-none z-20" />

          {/* Resize Handles */}
          {editMode === "select" && (
            <ResizeHandles component={component} onResize={handleResize} />
          )}
        </>
      )}

      {/* Hover tooltip for non-selected components */}
      {isCurrentlyHovered && !isSelected && (
        <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-md pointer-events-none z-20 opacity-90">
          {component.type}
        </div>
      )}

      {/* Drag preview */}
      {isDragging && (
        <div className="fixed top-0 left-0 pointer-events-none z-50 opacity-80 transform rotate-2">
          <div className="bg-white border-2 border-blue-500 rounded shadow-lg p-2 max-w-xs">
            <div className="text-xs text-gray-600 mb-1">{component.type}</div>
            <div className="text-sm truncate">
              {component.type === "TextSpan"
                ? component.props.text?.substring(0, 30) + "..."
                : component.type === "Image"
                ? "🖼️ Image"
                : component.type === "Button"
                ? component.props.text
                : `${component.type} Component`}
            </div>
          </div>
        </div>
      )}

      {/* Drop zone indicators */}
      {isCurrentlyHovered && isDragging && (
        <>
          {/* Drop above */}
          <div className="absolute -top-0.5 left-0 right-0 h-1 bg-blue-500 rounded-full opacity-75 pointer-events-none z-30" />
          {/* Drop below */}
          <div className="absolute -bottom-0.5 left-0 right-0 h-1 bg-blue-500 rounded-full opacity-75 pointer-events-none z-30" />
        </>
      )}

      {/* Inline Text Editor for TextSpan components when in text-edit mode */}
      {component.type === "TextSpan" &&
      isSelected &&
      editMode === "text-edit" ? (
        <InlineTextEditor component={component} />
      ) : (
        children
      )}
    </div>
  );
}
