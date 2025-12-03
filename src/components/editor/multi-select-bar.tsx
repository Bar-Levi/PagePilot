"use client";

import React, { useState, useEffect } from "react";
import { useEditorStore } from "@/hooks/use-editor-store";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Layers,
  X,
  Square,
  Columns,
  Rows,
  Check,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MultiSelectBar - Floating action bar for multi-select operations
 * Shows when multiple components are selected
 */
export function MultiSelectBar() {
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const moveComponentsToContainer = useEditorStore((s) => s.moveComponentsToContainer);
  const getComponentById = useEditorStore((s) => s.getComponentById);
  const pageJson = useEditorStore((s) => s.pageJson);

  const [targetContainerId, setTargetContainerId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  // Don't show if less than 2 components selected
  if (selectedIds.length < 2) {
    return null;
  }

  // Helper: Check if a node is a descendant of any selected component
  const isDescendantOfSelected = (nodeId: string): boolean => {
    const findNode = (root: any, id: string): any => {
      if (root.id === id) return root;
      if (root.children) {
        for (const child of root.children) {
          const found = findNode(child, id);
          if (found) return found;
        }
      }
      return null;
    };

    const checkDescendant = (ancestor: any, descendantId: string): boolean => {
      if (ancestor.id === descendantId) return true;
      if (ancestor.children) {
        return ancestor.children.some((child: any) => checkDescendant(child, descendantId));
      }
      return false;
    };

    for (const selectedId of selectedIds) {
      const selectedNode = findNode(pageJson, selectedId);
      if (selectedNode && checkDescendant(selectedNode, nodeId)) {
        return true;
      }
    }
    return false;
  };

  // Get all containers that can receive components
  const getAvailableContainers = (): Array<{ id: string; label: string; path: string }> => {
    const containers: Array<{ id: string; label: string; path: string }> = [];

    const traverse = (node: any, path: string[] = []) => {
      if (
        node.type === "Container" ||
        node.type === "TextContainer" ||
        node.type === "Form" ||
        node.type === "Page"
      ) {
        // Don't include selected components or their descendants
        if (!selectedIds.includes(node.id) && !isDescendantOfSelected(node.id)) {
          const fullPath = path.length > 0 ? path.join(" > ") : "";
          const label = node.type === "Page" ? "דף ראשי" : `${node.type}${fullPath ? ` (${fullPath})` : ""}`;
          containers.push({ id: node.id, label, path: fullPath });
        }
      }

      if (node.children) {
        node.children.forEach((child: any, index: number) => {
          const childPath = [...path];
          if (child.type === "Container" || child.type === "TextContainer" || child.type === "Form") {
            childPath.push(`${index + 1}`);
          }
          traverse(child, childPath);
        });
      }
    };

    traverse(pageJson);
    return containers;
  };

  const availableContainers = getAvailableContainers();

  const handleMoveToContainer = () => {
    if (targetContainerId && !isMoving) {
      setIsMoving(true);
      moveComponentsToContainer(selectedIds, targetContainerId);
      setIsOpen(false);
      setTargetContainerId(null);
      
      // Reset moving state after animation
      setTimeout(() => setIsMoving(false), 300);
    }
  };

  const handleCreateNewContainer = (layout: "row" | "column") => {
    if (isMoving) return;
    
    setIsMoving(true);
    const newContainerId = `container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newContainer = {
      id: newContainerId,
      type: "Container" as const,
      props: {
        layout,
        style: {
          padding: "24px",
          gap: 16,
          flexDirection: layout,
          background: "#f8fafc",
          radius: "8px",
        },
      },
      children: [],
    };

    // First add the container to the page root
    const addComponent = useEditorStore.getState().addComponent;
    addComponent("page-root", newContainer);

    // Then move selected components to it
    setTimeout(() => {
      moveComponentsToContainer(selectedIds, newContainerId);
      setIsMoving(false);
    }, 100);

    setIsOpen(false);
    setTargetContainerId(null);
  };

  // Reset selection when popover closes without action
  useEffect(() => {
    if (!isOpen && targetContainerId) {
      setTargetContainerId(null);
    }
  }, [isOpen, targetContainerId]);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
          "bg-white dark:bg-slate-800 rounded-lg shadow-2xl",
          "border-2 border-blue-500",
          "px-4 py-3 flex items-center gap-3",
          "animate-in slide-in-from-bottom-4 duration-300",
          isMoving && "opacity-75 pointer-events-none"
        )}
      >
        {/* Selection Count with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-help">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">
                {selectedIds.length} רכיבים נבחרו
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">לחץ על ESC או X כדי לבטל את הבחירה</p>
          </TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />

        {/* Move to Container Button */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2"
                  disabled={isMoving}
                >
                  <Square className="w-4 h-4" />
                  הוסף למיכל
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">העבר את הרכיבים הנבחרים למיכל</p>
              </TooltipContent>
            </Tooltip>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="center">
            <div className="space-y-3">
              {/* Info Banner */}
              <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {selectedIds.length} רכיבים יועברו למיכל הנבחר
                </p>
              </div>

              {/* Existing Containers */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <span>בחר מיכל קיים:</span>
                  {availableContainers.length > 0 && (
                    <span className="text-xs text-slate-400 font-normal">
                      ({availableContainers.length})
                    </span>
                  )}
                </h3>
                <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin">
                  {availableContainers.length > 0 ? (
                    availableContainers.map((container) => (
                      <button
                        key={container.id}
                        onClick={() => setTargetContainerId(container.id)}
                        className={cn(
                          "w-full text-right px-3 py-2 rounded-lg text-sm",
                          "hover:bg-slate-100 dark:hover:bg-slate-700",
                          "transition-colors",
                          "border border-transparent",
                          targetContainerId === container.id &&
                            "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{container.label}</span>
                          {targetContainerId === container.id && (
                            <Check className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-4">
                      אין מיכלים זמינים
                    </p>
                  )}
                </div>
              </div>

              {/* Create New Container */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold mb-2">
                  או צור מיכל חדש:
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleCreateNewContainer("column")}
                        disabled={isMoving}
                      >
                        <Columns className="w-4 h-4" />
                        עמודה
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">מיכל עם פריסה אנכית</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleCreateNewContainer("row")}
                        disabled={isMoving}
                      >
                        <Rows className="w-4 h-4" />
                        שורה
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">מיכל עם פריסה אופקית</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Action Button */}
              {targetContainerId && (
                <Button
                  className="w-full mt-2"
                  onClick={handleMoveToContainer}
                  disabled={isMoving}
                >
                  {isMoving ? "מעביר..." : "העבר למיכל"}
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Selection Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={clearSelection}
              disabled={isMoving}
            >
              <X className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">בטל בחירה (ESC)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
