
"use client";
import React, { useRef, useEffect, useCallback } from "react";
import type { RichTextProps } from "../types";
import { cn } from "@/lib/utils";
import { useEditorState, ApplyStyleFunc, GetActiveStylesFunc } from "@/hooks/use-editor-state.tsx";

const getSelectionStyles = (
  editor: HTMLElement
): Record<string, string | boolean> => {
  const styles: Record<string, string | boolean> = {};
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return styles;

  let node = selection.focusNode;
  if (!node || !editor.contains(node)) return styles;

  // Traverse up to find the element containing the text
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentElement;
  }
  
  if (node && node instanceof HTMLElement) {
    const element = node as HTMLElement;
    const computedStyle = window.getComputedStyle(element);

    styles.bold = parseInt(computedStyle.fontWeight, 10) >= 700;
    styles.italic = computedStyle.fontStyle === "italic";
    styles.underline = computedStyle.textDecorationLine.includes("underline");
    
    const fontSize = computedStyle.fontSize;
    if (fontSize.endsWith('px')) {
        // Remove 'px' and convert to number
        styles.size = parseInt(fontSize.replace('px', ''), 10);
    }
    
    // Convert rgb to hex for the color input
    const rgbColor = computedStyle.color;
    try {
        const hexColor = '#' + rgbColor.match(/\d+/g)!.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
        styles.color = hexColor;
    } catch {
        styles.color = '#000000'; // fallback
    }
  }

  return styles;
};


export const RichText: React.FC<RichTextProps & { id: string }> = ({
  id,
  html,
  align = "left",
}) => {
  const {
    updateComponentProps,
    selectedComponentId,
    textActionHandlers,
  } = useEditorState();
  const editorRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedComponentId === id;

  const handleApplyStyle: ApplyStyleFunc = useCallback((style, value) => {
    if (!editorRef.current) return;
    document.execCommand('styleWithCSS', false, 'true');

    if (style === 'align') {
      updateComponentProps(id, { align: value });
      return;
    }

    if (style === 'bold') document.execCommand('bold');
    else if (style === 'italic') document.execCommand('italic');
    else if (style === 'underline') document.execCommand('underline');
    else if (style === 'foreColor') document.execCommand('foreColor', false, value);
    else if (style === 'fontSize') {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.fontSize = `${value}px`;
            try {
                range.surroundContents(span);
            } catch (e) {
                document.execCommand('fontSize', false, '7'); // Fallback size
                const fontElements = editorRef.current.getElementsByTagName('font');
                for (let i = 0; i < fontElements.length; i++) {
                    if (fontElements[i].size === '7') {
                        fontElements[i].style.fontSize = `${value}px`;
                        fontElements[i].removeAttribute('size');
                    }
                }
            }
        }
    }
    
    updateComponentProps(id, { html: editorRef.current.innerHTML });
    document.execCommand('styleWithCSS', false, 'false');
  }, [id, updateComponentProps]);

  const handleGetActiveStyles: GetActiveStylesFunc = useCallback(() => {
    if (!editorRef.current) return {};
    const styles = getSelectionStyles(editorRef.current);
    return { ...styles, align };
  }, [align]);

  useEffect(() => {
    if (isSelected) {
      textActionHandlers.current = {
        applyStyle: handleApplyStyle,
        getActiveStyles: handleGetActiveStyles,
      };
      
      return () => {
        textActionHandlers.current = null;
      };
    }
  }, [isSelected, textActionHandlers, handleApplyStyle, handleGetActiveStyles]);

  // Update DOM only if HTML prop changes from outside (e.g., undo/redo)
  // and only if the component is not currently selected to avoid cursor jumps.
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== html && !isSelected) {
      editorRef.current.innerHTML = html;
    }
  }, [html, isSelected]);
  
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
