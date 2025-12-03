"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useEditorStore } from "@/hooks/use-editor-store";
import { cn } from "@/lib/utils";

type ResizeHandlesProps = {
  nodeId: string;
};

type HandlePosition =
  | "top-left"
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left";

const handlePositions: HandlePosition[] = [
  "top-left",
  "top",
  "top-right",
  "right",
  "bottom-right",
  "bottom",
  "bottom-left",
  "left",
];

export function ResizeHandles({ nodeId }: ResizeHandlesProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<HandlePosition | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  const updateProps = useEditorStore((s) => s.updateProps);
  const getComponentById = useEditorStore((s) => s.getComponentById);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, position: HandlePosition) => {
      e.preventDefault();
      e.stopPropagation();

      const component = getComponentById(nodeId);
      if (!component) return;

      const element = document.querySelector(
        `[data-component-id="${nodeId}"]`
      ) as HTMLElement;
      if (!element) return;

      const rect = element.getBoundingClientRect();

      setIsResizing(true);
      setActiveHandle(position);
      setStartPos({ x: e.clientX, y: e.clientY });
      setStartSize({ width: rect.width, height: rect.height });
    },
    [nodeId, getComponentById]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !activeHandle) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      let newWidth = startSize.width;
      let newHeight = startSize.height;

      // Calculate new dimensions based on handle position
      switch (activeHandle) {
        case "right":
          newWidth = startSize.width + deltaX;
          break;
        case "left":
          newWidth = startSize.width - deltaX;
          break;
        case "bottom":
          newHeight = startSize.height + deltaY;
          break;
        case "top":
          newHeight = startSize.height - deltaY;
          break;
        case "top-right":
          newWidth = startSize.width + deltaX;
          newHeight = startSize.height - deltaY;
          break;
        case "top-left":
          newWidth = startSize.width - deltaX;
          newHeight = startSize.height - deltaY;
          break;
        case "bottom-right":
          newWidth = startSize.width + deltaX;
          newHeight = startSize.height + deltaY;
          break;
        case "bottom-left":
          newWidth = startSize.width - deltaX;
          newHeight = startSize.height + deltaY;
          break;
      }

      // Minimum size constraints
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(30, newHeight);

      // Update component props
      const component = getComponentById(nodeId);
      if (component) {
        const currentStyle = (component.props as any).style || {};
        updateProps(nodeId, {
          style: {
            ...currentStyle,
            width: `${Math.round(newWidth)}px`,
            // Only update height for certain handle positions
            ...(["top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"].includes(activeHandle) && {
              minHeight: `${Math.round(newHeight)}px`,
            }),
          },
        });
      }
    },
    [isResizing, activeHandle, startPos, startSize, nodeId, getComponentById, updateProps]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setActiveHandle(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const getHandleStyles = (position: HandlePosition): string => {
    const baseStyles =
      "absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm z-50 hover:bg-blue-100";

    const positionStyles: Record<HandlePosition, string> = {
      "top-left": "-top-1.5 -left-1.5 cursor-nwse-resize",
      top: "-top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize",
      "top-right": "-top-1.5 -right-1.5 cursor-nesw-resize",
      right: "top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize",
      "bottom-right": "-bottom-1.5 -right-1.5 cursor-nwse-resize",
      bottom: "-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize",
      "bottom-left": "-bottom-1.5 -left-1.5 cursor-nesw-resize",
      left: "top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize",
    };

    return cn(baseStyles, positionStyles[position]);
  };

  return (
    <>
      {handlePositions.map((position) => (
        <div
          key={position}
          className={getHandleStyles(position)}
          onMouseDown={(e) => handleMouseDown(e, position)}
        />
      ))}
    </>
  );
}
