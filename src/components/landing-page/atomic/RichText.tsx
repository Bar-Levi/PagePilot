"use client";
import React, { useRef, useEffect, useCallback } from "react";
import type { RichTextProps } from "../types";
import { cn } from "@/lib/utils";
import { useEditorState, ApplyStyleFunc, GetActiveStylesFunc } from "@/hooks/use-editor-state.tsx";

// --- Utility Functions ---

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
  
  if (node && editor.contains(node) && node instanceof HTMLElement) {
    const element = node as HTMLElement;
    const computedStyle = window.getComputedStyle(element);

    styles.bold =
      computedStyle.fontWeight === "bold" ||
      parseInt(computedStyle.fontWeight) >= 700;
    styles.italic = computedStyle.fontStyle === "italic";
    styles.underline = computedStyle.textDecorationLine.includes("underline");
    
    const fontSize = computedStyle.fontSize;
    if (fontSize.endsWith('px')) {
      styles.size = parseInt(fontSize, 10);
    }
    
    styles.color = computedStyle.color;
  }

  return styles;
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
    registerTextActionHandlers,
  } = useEditorState();
  const editorRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedComponentId === id;

  const applyStyle: ApplyStyleFunc = useCallback((style, value) => {
    if (!editorRef.current) return;
    document.execCommand("styleWithCSS", false, 'true');

    if (style === 'align') {
        updateComponentProps(id, { align: value });
        return;
    }
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);

    // Create a new span to wrap the selection
    const span = document.createElement('span');

    switch (style) {
      case 'bold':
        span.style.fontWeight = 'bold';
        break;
      case 'italic':
        span.style.fontStyle = 'italic';
        break;
      case 'underline':
        span.style.textDecoration = 'underline';
        break;
      case 'size':
        if (value) span.style.fontSize = `${value}px`;
        break;
      case 'color':
        if (value) span.style.color = value;
        break;
      default:
        document.execCommand("styleWithCSS", false, 'false');
        return;
    }
    
    // This is a simplified approach. A real implementation would need to handle
    // splitting nodes and merging styles. For now, we wrap.
    try {
        range.surroundContents(span);
    } catch(e) {
        // Fallback for cases where selection spans across multiple block elements
        // which can't be wrapped by a single span.
        if (style === 'bold') document.execCommand('bold');
        if (style === 'italic') document.execCommand('italic');
        if (style === 'underline') document.execCommand('underline');
        if (style === 'foreColor' && value) document.execCommand('foreColor', false, value);
    }

    selection.removeAllRanges();
    selection.addRange(range);
    
    // Update the component's HTML
    updateComponentProps(id, { html: editorRef.current.innerHTML });
    document.execCommand("styleWithCSS", false, 'false');
  }, [id, updateComponentProps]);

  const getActiveStyles: GetActiveStylesFunc = useCallback(() => {
    if (!editorRef.current) return {};
    const styles = getSelectionStyles(editorRef.current);
    return { ...styles, align };
  }, [align]);


  // Register/unregister the functions with the global state when this component is selected/deselected
  useEffect(() => {
    if (isSelected) {
      registerTextActionHandlers({ applyStyle, getActiveStyles });
      
      return () => {
        registerTextActionHandlers(null);
      };
    }
  }, [isSelected, registerTextActionHandlers, applyStyle, getActiveStyles]);

  // Update DOM if HTML prop changes from outside (e.g., undo/redo)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html;
    }
  }, [html]);

  const handleInput = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      // We don't call updateComponentProps here on every input to avoid cursor jumps
      // and performance issues. It's handled on blur or via explicit formatting actions.
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