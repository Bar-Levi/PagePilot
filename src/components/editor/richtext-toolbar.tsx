"use client";

import React, { useState, useCallback, useRef } from "react";
import { useEditorStore, useSelectedComponent } from "@/hooks/use-editor-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Palette,
  Type,
  Sparkles,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  toggleBoldOnRange,
  cleanBoldHTML,
  isBold,
  normalizeBoldHTML,
  applyFontSizeToRange,
  normalizeAllHTML,
  cleanAllHTML,
} from "@/lib/richtext-helpers";

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72];

const colors = [
  "#000000",
  "#1a1a1a",
  "#333333",
  "#666666",
  "#999999",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

export function RichTextToolbar() {
  const activeElement = useEditorStore((s) => s.activeRichTextElement);
  const selectedComponent = useSelectedComponent();
  const updateProps = useEditorStore((s) => s.updateProps);

  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [isBoldActive, setIsBoldActive] = useState(false);

  // Store saved selection to restore after DOM changes
  const savedSelectionRef = useRef<{
    range: Range;
    text: string;
    container: HTMLElement;
  } | null>(null);

  // Check if there's a text selection and if it's bold
  React.useEffect(() => {
    const checkSelection = () => {
      const selection = window.getSelection();

      // First check if we have a saved selection
      if (
        savedSelectionRef.current &&
        savedSelectionRef.current.container === activeElement
      ) {
        setHasSelection(true);
        // Check if saved selection is bold
        try {
          const savedRange = savedSelectionRef.current.range;
          if (activeElement && !savedRange.collapsed) {
            const selectionIsBold = isBold(savedRange.commonAncestorContainer);
            setIsBoldActive(selectionIsBold);
          }
        } catch (e) {
          // If saved range is invalid, check current selection
        }
      }

      // Also check current selection
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const hasTextSelected =
          !range.collapsed &&
          activeElement &&
          activeElement.contains(range.commonAncestorContainer);

        if (hasTextSelected) {
          setHasSelection(true);

          // Check if selection is bold
          const selectionIsBold = isBold(range.commonAncestorContainer);
          setIsBoldActive(selectionIsBold);

          // Update saved selection
          savedSelectionRef.current = {
            range: range.cloneRange(),
            text: range.toString(),
            container: activeElement,
          };
        } else if (!savedSelectionRef.current) {
          // Only clear if no saved selection
          setHasSelection(false);
          setIsBoldActive(false);
        }
      } else if (!savedSelectionRef.current) {
        // Only clear if no saved selection
        setHasSelection(false);
        setIsBoldActive(false);
      }
    };

    // Check on selection change (with debounce to avoid flickering)
    let timeoutId: NodeJS.Timeout;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkSelection, 50);
    };

    // Check on selection change
    document.addEventListener("selectionchange", debouncedCheck);
    // Also check on mouse/keyboard events
    document.addEventListener("mouseup", checkSelection);
    document.addEventListener("keyup", checkSelection);

    // Initial check
    checkSelection();

    // Clear saved selection when clicking outside the active element
    const handleClickOutside = (e: MouseEvent) => {
      if (activeElement && !activeElement.contains(e.target as Node)) {
        // Check if the click created a new selection elsewhere
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (!activeElement.contains(range.commonAncestorContainer)) {
            // Selection is outside active element - clear saved selection
            savedSelectionRef.current = null;
            setHasSelection(false);
            setIsBoldActive(false);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("selectionchange", debouncedCheck);
      document.removeEventListener("mouseup", checkSelection);
      document.removeEventListener("keyup", checkSelection);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeElement]);

  // Save selection and update HTML (with normalization)
  const saveAndUpdate = useCallback(() => {
    if (activeElement && selectedComponent) {
      // Normalize HTML before saving
      normalizeAllHTML(activeElement);
      const cleanedHTML = cleanAllHTML(activeElement.innerHTML);
      updateProps(selectedComponent.id, { html: cleanedHTML });
    }
  }, [activeElement, selectedComponent, updateProps]);

  // Save current selection to ref
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !activeElement) {
      return null;
    }

    const range = selection.getRangeAt(0);

    // Only save if there's actual text selected and it's within activeElement
    if (
      !range.collapsed &&
      activeElement.contains(range.commonAncestorContainer)
    ) {
      savedSelectionRef.current = {
        range: range.cloneRange(), // Clone to preserve
        text: range.toString(),
        container: activeElement,
      };
      return true;
    }

    return false;
  }, [activeElement]);

  // Restore saved selection
  const restoreSelection = useCallback(() => {
    if (!savedSelectionRef.current || !activeElement) {
      return false;
    }

    const { range: savedRange, text, container } = savedSelectionRef.current;

    // Verify container is still the same
    if (container !== activeElement) {
      return false;
    }

    const selection = window.getSelection();
    if (!selection) return false;

    try {
      // Try to restore the exact range
      selection.removeAllRanges();
      selection.addRange(savedRange);

      // Update hasSelection state
      setHasSelection(true);

      return true;
    } catch (e) {
      // Fallback: find by text content
      console.warn("Failed to restore exact range, trying fallback:", e);

      if (text) {
        const walker = document.createTreeWalker(
          activeElement,
          NodeFilter.SHOW_TEXT,
          null
        );

        let node: Node | null;
        while ((node = walker.nextNode())) {
          const nodeText = node.textContent || "";
          const index = nodeText.indexOf(text);
          if (index !== -1) {
            const fallbackRange = document.createRange();
            fallbackRange.setStart(node, index);
            fallbackRange.setEnd(node, index + text.length);
            selection.removeAllRanges();
            selection.addRange(fallbackRange);

            // Update saved selection with the fallback range
            savedSelectionRef.current = {
              range: fallbackRange.cloneRange(),
              text,
              container: activeElement,
            };

            setHasSelection(true);
            return true;
          }
        }
      }
    }

    return false;
  }, [activeElement]);

  // Apply formatting with span - ONLY on selected text
  const applySpanStyle = useCallback(
    (styleProperty: string, styleValue: string) => {
      if (!activeElement) return;

      // Try to restore saved selection first, or get current selection
      const selection = window.getSelection();
      let range: Range | null = null;

      if (selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        // Save current selection if valid
        if (
          !range.collapsed &&
          activeElement.contains(range.commonAncestorContainer)
        ) {
          saveSelection();
        }
      }

      // If no current selection, try to restore saved one
      if (!range || range.collapsed) {
        if (savedSelectionRef.current) {
          range = savedSelectionRef.current.range;
        } else {
          return; // No selection available
        }
      }

      // Verify selection is within the active element
      if (!activeElement.contains(range.commonAncestorContainer)) {
        return;
      }

      // Save selection before modifying DOM (clone the range)
      const rangeToUse = range.cloneRange();
      const selectedText = rangeToUse.toString();

      // Create span with style
      const span = document.createElement("span");
      span.style.setProperty(styleProperty, styleValue);

      try {
        // Extract and wrap selected content
        const fragment = rangeToUse.extractContents();
        span.appendChild(fragment);
        rangeToUse.insertNode(span);

        // Save the selected text for later restoration
        const textToFind = selectedText || span.textContent || "";

        // Immediately update savedSelectionRef to point to the new span
        // This ensures the selection is available even if user clicks another button quickly
        const tempRange = document.createRange();
        tempRange.selectNodeContents(span);
        savedSelectionRef.current = {
          range: tempRange.cloneRange(),
          text: textToFind,
          container: activeElement,
        };

        // Normalize HTML (this may modify the span we just created)
        normalizeAllHTML(activeElement);

        // After normalization, find the text again and restore selection
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          try {
            // Find the text in the DOM after normalization
            const walker = document.createTreeWalker(
              activeElement,
              NodeFilter.SHOW_TEXT,
              null
            );

            let foundNode: Node | null = null;
            let foundIndex = -1;

            let node: Node | null;
            while ((node = walker.nextNode())) {
              const text = node.textContent || "";
              const index = text.indexOf(textToFind);
              if (index !== -1) {
                foundNode = node;
                foundIndex = index;
                break;
              }
            }

            if (foundNode && foundIndex !== -1) {
              // Create a new range for the found text
              const newRange = document.createRange();
              newRange.setStart(foundNode, foundIndex);
              newRange.setEnd(foundNode, foundIndex + textToFind.length);

              // Update saved selection
              savedSelectionRef.current = {
                range: newRange.cloneRange(),
                text: textToFind,
                container: activeElement,
              };

              // Restore selection
              const currentSelection = window.getSelection();
              if (currentSelection) {
                currentSelection.removeAllRanges();
                currentSelection.addRange(newRange);
                setHasSelection(true);
              }
            } else {
              // Fallback: try to select the span we created (if it still exists)
              const spans = activeElement.querySelectorAll("span");
              for (const s of Array.from(spans)) {
                if (s.textContent?.includes(textToFind)) {
                  const fallbackRange = document.createRange();
                  fallbackRange.selectNodeContents(s);
                  savedSelectionRef.current = {
                    range: fallbackRange.cloneRange(),
                    text: textToFind,
                    container: activeElement,
                  };
                  const currentSelection = window.getSelection();
                  if (currentSelection) {
                    currentSelection.removeAllRanges();
                    currentSelection.addRange(fallbackRange);
                    setHasSelection(true);
                  }
                  break;
                }
              }
            }

            // Update the HTML in the store
            saveAndUpdate();
          } catch (e) {
            console.error(
              "Failed to restore selection after normalization:",
              e
            );
            // Fallback: try to restore saved selection
            restoreSelection();
            saveAndUpdate();
          }
        });
      } catch (e) {
        console.error("Failed to apply style:", e);
        // Try to restore saved selection on error
        restoreSelection();
      }
    },
    [activeElement, saveAndUpdate, saveSelection, restoreSelection]
  );

  // Apply font size - removes existing font-size and applies uniform size
  const applyFontSize = useCallback(
    (fontSize: string) => {
      if (!activeElement) return;

      // Try to restore saved selection first, or get current selection
      const selection = window.getSelection();
      let range: Range | null = null;

      if (selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        // Save current selection if valid
        if (
          !range.collapsed &&
          activeElement.contains(range.commonAncestorContainer)
        ) {
          saveSelection();
        }
      }

      // If no current selection, try to restore saved one
      if (!range || range.collapsed) {
        if (savedSelectionRef.current) {
          range = savedSelectionRef.current.range;
        } else {
          return; // No selection available
        }
      }

      // Verify selection is within the active element
      if (!activeElement.contains(range.commonAncestorContainer)) {
        return;
      }

      // Use the helper to apply font size
      const newRange = applyFontSizeToRange(range, activeElement, fontSize);

      // Save the selected text for later restoration
      const textToFind = newRange ? newRange.toString() : range.toString();

      // Immediately update savedSelectionRef if we have a new range
      if (newRange) {
        savedSelectionRef.current = {
          range: newRange.cloneRange(),
          text: textToFind,
          container: activeElement,
        };
      }

      // Normalize HTML after font size change (this may modify the DOM)
      normalizeAllHTML(activeElement);

      // After normalization, restore selection using requestAnimationFrame
      requestAnimationFrame(() => {
        try {
          if (newRange) {
            // Try to find the text again after normalization
            const walker = document.createTreeWalker(
              activeElement,
              NodeFilter.SHOW_TEXT,
              null
            );

            let foundNode: Node | null = null;
            let foundIndex = -1;

            let node: Node | null;
            while ((node = walker.nextNode())) {
              const text = node.textContent || "";
              const index = text.indexOf(textToFind);
              if (index !== -1) {
                foundNode = node;
                foundIndex = index;
                break;
              }
            }

            if (foundNode && foundIndex !== -1) {
              // Create a new range for the found text
              const restoredRange = document.createRange();
              restoredRange.setStart(foundNode, foundIndex);
              restoredRange.setEnd(foundNode, foundIndex + textToFind.length);

              // Update saved selection
              savedSelectionRef.current = {
                range: restoredRange.cloneRange(),
                text: textToFind,
                container: activeElement,
              };

              // Restore selection
              const currentSelection = window.getSelection();
              if (currentSelection) {
                currentSelection.removeAllRanges();
                currentSelection.addRange(restoredRange);
                setHasSelection(true);
              }
            } else {
              // Fallback: try to restore using the saved range
              restoreSelection();
            }
          } else {
            // Fallback: try to restore saved selection
            restoreSelection();
          }

          // Save the updated HTML
          saveAndUpdate();
        } catch (e) {
          console.error(
            "Failed to restore selection after font size change:",
            e
          );
          restoreSelection();
          saveAndUpdate();
        }
      });
    },
    [activeElement, saveAndUpdate, saveSelection, restoreSelection]
  );

  // Toggle bold using semantic <strong> tags
  const toggleBold = useCallback(() => {
    if (!activeElement) return;

    // Try to restore saved selection first, or get current selection
    const selection = window.getSelection();
    let range: Range | null = null;

    if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
      // Save current selection if valid
      if (
        !range.collapsed &&
        activeElement.contains(range.commonAncestorContainer)
      ) {
        saveSelection();
      }
    }

    // If no current selection, try to restore saved one
    if (!range || range.collapsed) {
      if (savedSelectionRef.current) {
        range = savedSelectionRef.current.range;
      } else {
        return; // No selection available
      }
    }

    // Verify selection is within the active element
    if (!activeElement.contains(range.commonAncestorContainer)) {
      return;
    }

    // Use the helper to toggle bold - it returns the new range to select
    const newRange = toggleBoldOnRange(range, activeElement);

    // Save the selected text for later restoration
    const textToFind = newRange ? newRange.toString() : range.toString();

    // Immediately update savedSelectionRef if we have a new range
    if (newRange) {
      savedSelectionRef.current = {
        range: newRange.cloneRange(),
        text: textToFind,
        container: activeElement,
      };
    }

    // Normalize HTML (this modifies DOM but preserves structure)
    normalizeBoldHTML(activeElement);
    normalizeAllHTML(activeElement);

    // After normalization, restore selection using requestAnimationFrame
    requestAnimationFrame(() => {
      try {
        if (newRange) {
          // Try to find the text again after normalization
          const walker = document.createTreeWalker(
            activeElement,
            NodeFilter.SHOW_TEXT,
            null
          );

          let foundNode: Node | null = null;
          let foundIndex = -1;

          let node: Node | null;
          while ((node = walker.nextNode())) {
            const text = node.textContent || "";
            const index = text.indexOf(textToFind);
            if (index !== -1) {
              foundNode = node;
              foundIndex = index;
              break;
            }
          }

          if (foundNode && foundIndex !== -1) {
            // Create a new range for the found text
            const restoredRange = document.createRange();
            restoredRange.setStart(foundNode, foundIndex);
            restoredRange.setEnd(foundNode, foundIndex + textToFind.length);

            // Update saved selection
            savedSelectionRef.current = {
              range: restoredRange.cloneRange(),
              text: textToFind,
              container: activeElement,
            };

            // Restore selection
            const currentSelection = window.getSelection();
            if (currentSelection) {
              currentSelection.removeAllRanges();
              currentSelection.addRange(restoredRange);
              setHasSelection(true);
            }
          } else {
            // Fallback: try to restore using the saved range
            restoreSelection();
          }
        } else {
          // Fallback: try to restore saved selection
          restoreSelection();
        }

        // Save the updated HTML
        saveAndUpdate();
      } catch (e) {
        console.error("Failed to restore selection after bold toggle:", e);
        restoreSelection();
        saveAndUpdate();
      }
    });
  }, [activeElement, saveAndUpdate, saveSelection, restoreSelection]);

  // Toggle formatting (italic, underline) - ONLY on selected text
  // Note: Bold now uses toggleBold() above
  const toggleStyle = useCallback(
    (styleProperty: string, onValue: string, offValue: string) => {
      if (!activeElement) return;

      // Try to restore saved selection first, or get current selection
      const selection = window.getSelection();
      let range: Range | null = null;

      if (selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        // Save current selection if valid
        if (
          !range.collapsed &&
          activeElement.contains(range.commonAncestorContainer)
        ) {
          saveSelection();
        }
      }

      // If no current selection, try to restore saved one
      if (!range || range.collapsed) {
        if (savedSelectionRef.current) {
          range = savedSelectionRef.current.range;
        } else {
          return; // No selection available
        }
      }

      // Verify selection is within the active element
      if (!activeElement.contains(range.commonAncestorContainer)) {
        return;
      }

      // Check if already has this style in the selected range
      const parentSpan = range.commonAncestorContainer.parentElement;
      const currentValue =
        parentSpan?.style.getPropertyValue(styleProperty) || "";
      const isActive = currentValue === onValue;

      if (isActive && parentSpan && parentSpan !== activeElement) {
        // Remove style from the span
        const selectedText = range.toString();
        parentSpan.style.removeProperty(styleProperty);
        if (!parentSpan.style.cssText) {
          // If no more styles, unwrap the span
          const parent = parentSpan.parentNode;
          while (parentSpan.firstChild) {
            parent?.insertBefore(parentSpan.firstChild, parentSpan);
          }
          parent?.removeChild(parentSpan);
        }

        // Normalize HTML after removing style (before restoring selection)
        normalizeAllHTML(activeElement);

        // Restore selection using requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          try {
            if (selection && selectedText) {
              // Try to restore selection on the unwrapped content
              const walker = document.createTreeWalker(
                activeElement,
                NodeFilter.SHOW_TEXT,
                null
              );

              let foundNode: Node | null = null;
              let foundIndex = -1;

              let node: Node | null;
              while ((node = walker.nextNode())) {
                const text = node.textContent || "";
                const index = text.indexOf(selectedText);
                if (index !== -1) {
                  foundNode = node;
                  foundIndex = index;
                  break;
                }
              }

              if (foundNode && foundIndex !== -1) {
                const fallbackRange = document.createRange();
                fallbackRange.setStart(foundNode, foundIndex);
                fallbackRange.setEnd(
                  foundNode,
                  foundIndex + selectedText.length
                );

                const currentSelection = window.getSelection();
                if (currentSelection) {
                  currentSelection.removeAllRanges();
                  currentSelection.addRange(fallbackRange);
                }

                // Update saved selection
                savedSelectionRef.current = {
                  range: fallbackRange.cloneRange(),
                  text: selectedText,
                  container: activeElement,
                };
                setHasSelection(true);
              } else {
                // Fallback: try to restore saved selection
                restoreSelection();
              }
            } else {
              restoreSelection();
            }

            // Save the updated HTML
            saveAndUpdate();
          } catch (e) {
            console.warn(
              "Failed to restore selection after removing style:",
              e
            );
            restoreSelection();
            saveAndUpdate();
          }
        });
      } else {
        // Apply style to selected text only (this already preserves selection)
        applySpanStyle(styleProperty, onValue);
      }
    },
    [
      activeElement,
      applySpanStyle,
      saveAndUpdate,
      saveSelection,
      restoreSelection,
    ]
  );

  // Handle alignment change
  const handleAlignChange = useCallback(
    (align: string) => {
      if (selectedComponent) {
        updateProps(selectedComponent.id, { align });
      }
    },
    [selectedComponent, updateProps]
  );

  // Handle link insertion
  const handleLinkInsert = useCallback(() => {
    if (!activeElement || !linkUrl) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const link = document.createElement("a");
    link.href = linkUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.color = "#3b82f6";
    link.style.textDecoration = "underline";

    try {
      const fragment = range.extractContents();
      link.appendChild(fragment);
      range.insertNode(link);
      saveAndUpdate();
    } catch (e) {
      console.error("Failed to insert link:", e);
    }

    setLinkUrl("");
    setIsLinkPopoverOpen(false);
  }, [activeElement, linkUrl, saveAndUpdate]);

  // Keyboard shortcuts for RichText editing
  React.useEffect(() => {
    if (!activeElement) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when the active element is focused or has selection
      const target = e.target as HTMLElement;
      const isInActiveElement =
        activeElement.contains(target) || activeElement === target;

      if (!isInActiveElement) return;

      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;

      // Ctrl+B - Bold
      if (isCtrl && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleBold();
        return;
      }

      // Ctrl+I - Italic
      if (isCtrl && e.key.toLowerCase() === "i") {
        e.preventDefault();
        toggleStyle("font-style", "italic", "normal");
        return;
      }

      // Ctrl+U - Underline
      if (isCtrl && e.key.toLowerCase() === "u") {
        e.preventDefault();
        toggleStyle("text-decoration", "underline", "none");
        return;
      }

      // Ctrl+K - Link (open link popover)
      if (isCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (!range.collapsed) {
            setIsLinkPopoverOpen(true);
          }
        }
        return;
      }

      // Ctrl+Z - Undo (only if not in input/textarea)
      if (isCtrl && e.key.toLowerCase() === "z" && !isShift) {
        // Let the default browser undo work for contentEditable
        // We don't preventDefault here to allow native undo
        return;
      }

      // Ctrl+Y or Ctrl+Shift+Z - Redo
      if (
        isCtrl &&
        (e.key.toLowerCase() === "y" ||
          (e.key.toLowerCase() === "z" && isShift))
      ) {
        // Let the default browser redo work for contentEditable
        // We don't preventDefault here to allow native redo
        return;
      }

      // Ctrl+L - Align Left
      if (isCtrl && e.key.toLowerCase() === "l") {
        e.preventDefault();
        handleAlignChange("left");
        return;
      }

      // Ctrl+E - Align Center
      if (isCtrl && e.key.toLowerCase() === "e") {
        e.preventDefault();
        handleAlignChange("center");
        return;
      }

      // Ctrl+R - Align Right
      if (isCtrl && e.key.toLowerCase() === "r") {
        e.preventDefault();
        handleAlignChange("right");
        return;
      }
    };

    // Add event listener to document to catch all keyboard events
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    activeElement,
    toggleBold,
    toggleStyle,
    handleAlignChange,
    setIsLinkPopoverOpen,
  ]);

  const currentAlign = (selectedComponent?.props as any)?.align || "right";

  return (
    <TooltipProvider>
      <div className="h-12 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-1 px-4 shrink-0">
        {/* Bold */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ToolbarButton
                icon={<Bold className="w-4 h-4" />}
                title={
                  hasSelection
                    ? isBoldActive
                      ? "הסר מודגש (Ctrl+B)"
                      : "החל מודגש (Ctrl+B)"
                    : "סמן טקסט כדי להחיל מודגש"
                }
                onClick={toggleBold}
                disabled={!hasSelection}
                active={isBoldActive}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {hasSelection
                ? isBoldActive
                  ? "הסר מודגש מהטקסט המסומן"
                  : "החל מודגש על הטקסט המסומן"
                : "סמן טקסט תחילה"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Italic */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ToolbarButton
                icon={<Italic className="w-4 h-4" />}
                title={
                  hasSelection ? "נטוי (Ctrl+I)" : "סמן טקסט כדי להחיל נטוי"
                }
                onClick={() => toggleStyle("font-style", "italic", "normal")}
                disabled={!hasSelection}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {hasSelection ? "החל נטוי על הטקסט המסומן" : "סמן טקסט תחילה"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Underline */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ToolbarButton
                icon={<Underline className="w-4 h-4" />}
                title={
                  hasSelection
                    ? "קו תחתון (Ctrl+U)"
                    : "סמן טקסט כדי להחיל קו תחתון"
                }
                onClick={() =>
                  toggleStyle("text-decoration", "underline", "none")
                }
                disabled={!hasSelection}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {hasSelection ? "החל קו תחתון על הטקסט המסומן" : "סמן טקסט תחילה"}
            </p>
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* Font Size */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select
                value="18"
                onValueChange={(size) => applyFontSize(`${size}px`)}
                disabled={!hasSelection}
              >
                <SelectTrigger
                  className={cn(
                    "w-20 h-8",
                    !hasSelection && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Type className="w-3 h-3 mr-1" />
                  <SelectValue placeholder="גודל" />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {hasSelection ? "שנה גודל גופן לטקסט המסומן" : "סמן טקסט תחילה"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Color Picker */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      !hasSelection && "opacity-50 cursor-not-allowed"
                    )}
                    title={hasSelection ? "צבע" : "סמן טקסט כדי לשנות צבע"}
                    disabled={!hasSelection}
                  >
                    <Palette className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="grid grid-cols-7 gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded border border-slate-200 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => applySpanStyle("color", color)}
                      />
                    ))}
                  </div>
                  <div className="mt-2">
                    <Input
                      type="color"
                      className="w-full h-8"
                      onChange={(e) => applySpanStyle("color", e.target.value)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {hasSelection ? "שנה צבע לטקסט המסומן" : "סמן טקסט תחילה"}
            </p>
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* Alignment */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ToolbarButton
                icon={<AlignRight className="w-4 h-4" />}
                title="יישור לימין (Ctrl+R)"
                active={currentAlign === "right"}
                onClick={() => handleAlignChange("right")}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">יישר טקסט לימין (Ctrl+R)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ToolbarButton
                icon={<AlignCenter className="w-4 h-4" />}
                title="יישור למרכז (Ctrl+E)"
                active={currentAlign === "center"}
                onClick={() => handleAlignChange("center")}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">יישר טקסט למרכז (Ctrl+E)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ToolbarButton
                icon={<AlignLeft className="w-4 h-4" />}
                title="יישור לשמאל (Ctrl+L)"
                active={currentAlign === "left"}
                onClick={() => handleAlignChange("left")}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">יישר טקסט לשמאל (Ctrl+L)</p>
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Popover
                open={isLinkPopoverOpen}
                onOpenChange={setIsLinkPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="קישור (Ctrl+K)"
                  >
                    <Link className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">כתובת קישור</label>
                      <Input
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://..."
                        dir="ltr"
                      />
                    </div>
                    <Button
                      onClick={handleLinkInsert}
                      className="w-full"
                      size="sm"
                    >
                      הוסף קישור
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {hasSelection
                ? "הוסף קישור לטקסט המסומן (Ctrl+K)"
                : "סמן טקסט תחילה כדי להוסיף קישור"}
            </p>
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* AI Assist */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          title="שיפור עם AI"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">AI</span>
        </Button>
      </div>
    </TooltipProvider>
  );
}

// ============================================================================
// Toolbar Button Component
// ============================================================================

function ToolbarButton({
  icon,
  title,
  active,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8",
        active && "bg-slate-100 dark:bg-slate-700 text-blue-600",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {icon}
    </Button>
  );
}
