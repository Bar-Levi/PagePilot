
"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import type { RichTextProps } from "../types";
import { cn } from "@/lib/utils";
import { useEditorState } from "@/hooks/use-editor-state.tsx";

// --- Utility Functions ---

/**
 * Gets the active styles (bold, color, etc.) from the current selection.
 * It traverses up the DOM tree from the selection to find the applied CSS styles.
 */
const getSelectionStyles = (
  editor: HTMLElement
): Record<string, string | boolean> => {
  const styles: Record<string, string | boolean> = {};
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return styles;

  let node = selection.focusNode;
  if (!node) return styles;

  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentElement;
  }

  if (node && editor.contains(node)) {
    const element = node as HTMLElement;
    const computedStyle = window.getComputedStyle(element);

    styles.bold =
      computedStyle.fontWeight === "bold" ||
      parseInt(computedStyle.fontWeight) >= 700;
    styles.italic = computedStyle.fontStyle === "italic";
    styles.underline = computedStyle.textDecoration.includes("underline");
    
    const fontSize = computedStyle.fontSize;
    if (fontSize.endsWith('px')) {
      styles.size = parseInt(fontSize, 10).toString();
    } else {
      styles.size = fontSize;
    }
    
    styles.color = computedStyle.color;
  }
  return styles;
};

/**
 * Applies a style to the current selection by wrapping it in a <span>.
 * This is the core function for text formatting.
 */
const applyStyleToSelection = (style: string, value?: string) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return; // Don't apply to empty selection

  document.execCommand("styleWithCSS", false, 'true');

  switch (style) {
    case "bold":
      document.execCommand("bold");
      break;
    case "italic":
      document.execCommand("italic");
      break;
    case "underline":
      document.execCommand("underline");
      break;
    case "size":
        // This is a hacky part of execCommand. '7' corresponds to the largest size.
        // A more robust solution would be to wrap in a span manually.
        // For now, let's use a span wrapper for size.
        const sizeSpan = document.createElement('span');
        if (value) sizeSpan.style.fontSize = `${value}px`;
        try {
            range.surroundContents(sizeSpan);
        } catch (e) {
             console.warn("Could not wrap selection, applying via execCommand fallback (this may be less reliable).", e);
        }
      break;
    case "color":
      if (value) document.execCommand("foreColor", false, value);
      break;
  }
  document.execCommand("styleWithCSS", false, 'false');
};

// --- React Component ---

export const RichText: React.FC<RichTextProps & { id: string }> = ({
  id,
  html,
  align = "left",
}) => {
  const {
    updateComponentProps,
    selectedComponentId,
    setApplyStyle,
    setGetActiveStyles,
  } = useEditorState();
  const editorRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedComponentId === id;

  const [activeStyles, setActiveStyles] = useState({});

  // This function will be passed up to the global state
  const handleApplyStyle = useCallback((style: string, value?: any) => {
    if (style === "align") {
      updateComponentProps(id, { align: value });
    } else {
      applyStyleToSelection(style, value);
      // After applying, immediately update the component's HTML in the global state
      if (editorRef.current) {
        updateComponentProps(id, { html: editorRef.current.innerHTML });
      }
    }
  }, [id, updateComponentProps]);

  const handleGetActiveStyles = useCallback(() => {
    if (!editorRef.current) return {};
    const styles = getSelectionStyles(editorRef.current);
    return { ...styles, align };
  }, [align]);

  // Register the functions with the global state when this component is selected
  useEffect(() => {
    if (isSelected) {
      setApplyStyle?.(() => handleApplyStyle);
      setGetActiveStyles?.(() => handleGetActiveStyles);
      
      const editor = editorRef.current;
      const updateToolbar = () => setActiveStyles(handleGetActiveStyles());

      document.addEventListener("selectionchange", updateToolbar);
      editor?.addEventListener("keyup", updateToolbar);
      editor?.addEventListener("click", updateToolbar);
      
      // Initial update
      updateToolbar();

      return () => {
        document.removeEventListener("selectionchange", updateToolbar);
        editor?.removeEventListener("keyup", updateToolbar);
        editor?.removeEventListener("click", updateToolbar);
        setApplyStyle?.(undefined);
        setGetActiveStyles?.(undefined);
      };
    }
  }, [isSelected, align, handleApplyStyle, handleGetActiveStyles, setApplyStyle, setGetActiveStyles]);

  // Update DOM if HTML prop changes from outside (e.g., undo/redo)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html;
    }
  }, [html]);

  const handleInput = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      // Note: We don't call updateComponentProps on every input to avoid cursor jumps
      // It's handled on blur or via formatting buttons.
    }
  };
  
  const handleBlur = () => {
      if (editorRef.current) {
          const newHtml = editorRef.current.innerHTML;
          if (newHtml !== html) {
              updateComponentProps(id, { html: newHtml });
          }
      }
  }

  return (
    <div
      ref={editorRef}
      contentEditable={isSelected}
      suppressContentEditableWarning={true}
      onInput={handleInput}
      onBlur={handleBlur}
      className={cn(
        "outline-none w-full",
        isSelected && "ring-2 ring-blue-500 ring-offset-2",
        `text-${align}`
      )}
      style={{ whiteSpace: "pre-wrap" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
