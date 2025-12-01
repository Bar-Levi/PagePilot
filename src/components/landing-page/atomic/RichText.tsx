
"use client";
import React, { useRef, useEffect } from "react";
import type { RichTextProps, RichTextNode } from "../types";
import { cn } from "@/lib/utils";
import { useEditorState } from "@/hooks/use-editor-state.tsx";

const renderNodeToHTML = (node: RichTextNode): string => {
  let content = node.text || '';
  content = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br />");
  
  const styles: string[] = [];
  if (node.bold) styles.push(`font-weight: bold`);
  if (node.italic) styles.push(`font-style: italic`);
  if (node.underline) styles.push(`text-decoration: underline`);
  if (node.color) styles.push(`color: ${node.color}`);
  if (node.size) styles.push(`font-size: ${node.size}px`);
  if (node.font) styles.push(`font-family: ${node.font}`);

  if (styles.length === 0 && !node.link) {
    return content;
  }

  const styleString = styles.join('; ');
  const tag = node.link ? `a href="${node.link}" target="_blank" rel="noopener noreferrer"` : 'span';
  
  return `<${tag} style="${styleString}">${content}</${tag}>`;
};

const parseNodeToRichText = (node: Node, inheritedStyles: Partial<RichTextNode> = {}): RichTextNode[] => {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent ? [{ text: node.textContent, ...inheritedStyles }] : [];
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return [];
    }

    const el = node as HTMLElement;
    const newStyles: Partial<RichTextNode> = { ...inheritedStyles };
    
    // Read styles from the element's style attribute
    if (el.style.fontWeight === 'bold' || parseInt(el.style.fontWeight) >= 700) newStyles.bold = true;
    else if (el.style.fontWeight === 'normal') delete newStyles.bold;
    
    if (el.style.fontStyle === 'italic') newStyles.italic = true;
    else if (el.style.fontStyle === 'normal') delete newStyles.italic;

    if (el.style.textDecoration.includes('underline')) newStyles.underline = true;
    
    if (el.style.color) newStyles.color = el.style.color;
    if (el.style.fontSize) newStyles.size = parseInt(el.style.fontSize, 10);
    if (el.style.fontFamily) newStyles.font = el.style.fontFamily;
    
    // Also check for legacy tags
    switch (el.tagName.toLowerCase()) {
        case 'b': case 'strong': newStyles.bold = true; break;
        case 'i': case 'em': newStyles.italic = true; break;
        case 'u': newStyles.underline = true; break;
        case 'a': newStyles.link = (el as HTMLAnchorElement).href; break;
    }

    let childNodes: RichTextNode[] = [];
    el.childNodes.forEach(child => {
        childNodes = childNodes.concat(parseNodeToRichText(child, newStyles));
    });

    return childNodes;
};

const parseHTMLToContent = (html: string): RichTextNode[] => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    let nodes: RichTextNode[] = [];
    tempDiv.childNodes.forEach(child => {
        nodes = nodes.concat(parseNodeToRichText(child));
    });

    if (nodes.length === 0 && tempDiv.textContent) {
       return [{ text: tempDiv.textContent }];
    }

    if (nodes.length > 1) {
        const mergedNodes: RichTextNode[] = [nodes[0]];
        for (let i = 1; i < nodes.length; i++) {
            const prev = mergedNodes[mergedNodes.length - 1];
            const curr = nodes[i];
            const { text: prevText, ...prevStyles } = prev;
            const { text: currText, ...currStyles } = curr;

            if (JSON.stringify(prevStyles) === JSON.stringify(currStyles) && prevText) {
                prev.text += currText;
            } else {
                mergedNodes.push(curr);
            }
        }
        return mergedNodes;
    }

    return nodes;
};

export const RichText: React.FC<RichTextProps & { id: string }> = ({ id, content = [], align = 'left' }) => {
  const { updateComponentProps, selectedComponentId, __setApplyStyleFunction, __setGetActiveStylesFunction } = useEditorState() as any;
  const editorRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedComponentId === id;
  const isEditing = useRef(false);

  const defaultContent: RichTextNode[] = [{ text: "Rich Text", size: 18 }];
  const displayContent = content && content.length > 0 ? content : defaultContent;
  const contentAsHTML = displayContent.map(renderNodeToHTML).join('');

  const handleUpdate = () => {
    if (editorRef.current) {
      const newHTML = editorRef.current.innerHTML;
      if (newHTML !== contentAsHTML) {
        const newContent = parseHTMLToContent(newHTML);
        updateComponentProps(id, { content: newContent, align });
      }
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== contentAsHTML && !isEditing.current) {
      editor.innerHTML = contentAsHTML;
    }
  }, [contentAsHTML]);

  const applyStyle = (style: string, value: any) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    if (style === 'align') {
      updateComponentProps(id, { align: value });
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    document.execCommand('styleWithCSS', false, 'true');
    switch (style) {
        case 'bold': document.execCommand('bold'); break;
        case 'italic': document.execCommand('italic'); break;
        case 'underline': document.execCommand('underline'); break;
        case 'size': document.execCommand('fontSize', false, '7'); 
            // Hack to apply custom size
            let fontElements = window.getSelection()!.focusNode!.parentElement!.getElementsByTagName('font');
            for (let i = 0; i < fontElements.length; i++) {
                fontElements[i].removeAttribute("size");
                fontElements[i].style.fontSize = value + 'px';
            }
            break;
        case 'color': document.execCommand('foreColor', false, value); break;
    }
    document.execCommand('styleWithCSS', false, 'false');

    handleUpdate();
  };

  const getStyles = () => {
    if (!isSelected || !window.getSelection || window.getSelection()!.rangeCount === 0) {
      return { align };
    }
    const selection = window.getSelection()!;
    let node = selection.focusNode;
    if (!node) return { align };

    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }
    
    if (!(node instanceof HTMLElement)) return { align };

    const computedStyle = window.getComputedStyle(node);
    return {
      bold: computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight) >= 700,
      italic: computedStyle.fontStyle === 'italic',
      underline: computedStyle.textDecoration.includes('underline'),
      size: parseInt(computedStyle.fontSize, 10),
      color: computedStyle.color,
      align: align,
    };
  };

  useEffect(() => {
    if (isSelected) {
      __setApplyStyleFunction(() => applyStyle);
      __setGetActiveStylesFunction(() => getStyles);
      const editor = editorRef.current;
      const onSelectionChange = () => {
        // This is a dummy state update to force re-render of the toolbar
        // which will then call getActiveStyles
        editor?.dispatchEvent(new Event('selectionchange-custom', { bubbles: true }));
      };
      document.addEventListener('selectionchange', onSelectionChange);
      return () => {
        document.removeEventListener('selectionchange', onSelectionChange);
        __setApplyStyleFunction(undefined);
        __setGetActiveStylesFunction(undefined);
      }
    }
  }, [isSelected]);
  

  const handleBlur = () => {
    isEditing.current = false;
    handleUpdate();
  };
  
  const handleFocus = () => {
    isEditing.current = true;
  }

  return (
    <div
      ref={editorRef}
      contentEditable={isSelected}
      suppressContentEditableWarning={true}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn("outline-none w-full", isSelected && "ring-2 ring-blue-500 ring-offset-2", `text-${align}`)}
      style={{ whiteSpace: 'pre-wrap' }}
      dangerouslySetInnerHTML={{ __html: contentAsHTML }}
    />
  );
};
