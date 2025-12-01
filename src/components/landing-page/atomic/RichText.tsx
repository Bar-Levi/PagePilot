
"use client";
import React, { useRef, useEffect } from "react";
import type { RichTextProps, RichTextNode } from "../types";
import { cn } from "@/lib/utils";
import { useEditorState } from "@/hooks/use-editor-state.tsx";

const renderNodeToHTML = (node: RichTextNode): string => {
  let content = node.text || '';

  // Basic HTML escaping
  content = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
  // Replace newlines with <br> for multiline support
  content = content.replace(/\n/g, "<br />");
  
  const styles: string[] = [];
  if (node.bold) styles.push(`font-weight: 700`);
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

// Recursive parser to handle nested styles
const parseNodeToRichText = (node: Node, inheritedStyles: Partial<RichTextNode> = {}): RichTextNode[] => {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent ? [{ text: node.textContent, ...inheritedStyles }] : [];
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return [];
    }

    const el = node as HTMLElement;
    const newStyles: Partial<RichTextNode> = { ...inheritedStyles };

    // Apply tag-based styles first
    switch (el.tagName.toLowerCase()) {
        case 'b':
        case 'strong':
            newStyles.bold = true;
            break;
        case 'i':
        case 'em':
            newStyles.italic = true;
            break;
        case 'u':
            newStyles.underline = true;
            break;
        case 'a':
            newStyles.link = (el as HTMLAnchorElement).href;
            break;
    }

    // Apply inline styles, which can override tag-based ones
    if (el.style.fontWeight === 'bold' || parseInt(el.style.fontWeight) >= 700) newStyles.bold = true;
    if (el.style.fontWeight === 'normal') delete newStyles.bold;
    
    if (el.style.fontStyle === 'italic') newStyles.italic = true;
    if (el.style.fontStyle === 'normal') delete newStyles.italic;

    if (el.style.textDecoration === 'underline') newStyles.underline = true;
    // Note: checking for 'none' to remove underline is complex as it can be inherited. Sticking to adding it for now.
    
    if (el.style.color) newStyles.color = el.style.color;
    if (el.style.fontSize) newStyles.size = parseInt(el.style.fontSize, 10);
    if (el.style.fontFamily) newStyles.font = el.style.fontFamily;


    // Recursively parse children with the new styles
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

    // If parsing results in nothing, fallback to plain text
    if (nodes.length === 0 && tempDiv.textContent) {
       return [{ text: tempDiv.textContent }];
    }

    // A small optimization to merge adjacent nodes with identical styles
    if (nodes.length > 1) {
        const mergedNodes: RichTextNode[] = [nodes[0]];
        for (let i = 1; i < nodes.length; i++) {
            const prev = mergedNodes[mergedNodes.length - 1];
            const curr = nodes[i];
            const { text: prevText, ...prevStyles } = prev;
            const { text: currText, ...currStyles } = curr;

            if (JSON.stringify(prevStyles) === JSON.stringify(currStyles)) {
                prev.text += curr.text;
            } else {
                mergedNodes.push(curr);
            }
        }
        return mergedNodes;
    }

    return nodes;
};


export const RichText: React.FC<RichTextProps & { id: string }> = ({ id, content = [], align = 'left' }) => {
  const { updateComponentProps, selectedComponentId } = useEditorState();
  const editorRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedComponentId === id;
  const isEditing = useRef(false);

  const defaultContent: RichTextNode[] = [
    { text: "This is a default Rich Text component.", size: 18 },
  ];
  const displayContent = content && content.length > 0 ? content : defaultContent;
  
  const contentAsHTML = displayContent.map(renderNodeToHTML).join('');

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== contentAsHTML && !isEditing.current) {
      editor.innerHTML = contentAsHTML;
    }
  }, [contentAsHTML]);


  const handleBlur = () => {
    isEditing.current = false;
    if (editorRef.current) {
      const newHTML = editorRef.current.innerHTML;
      if (newHTML !== contentAsHTML) {
          const newContent = parseHTMLToContent(newHTML);
          updateComponentProps(id, { content: newContent, align });
      }
    }
  };
  
  const handleFocus = () => {
      isEditing.current = true;
  }

  const textAlignMap = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
    justify: 'text-justify',
  };

  return (
    <div
      ref={editorRef}
      contentEditable={isSelected}
      suppressContentEditableWarning={true}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn("outline-none w-full", isSelected && "ring-2 ring-blue-500 ring-offset-2", textAlignMap[align])}
      style={{ whiteSpace: 'pre-wrap' }}
      dangerouslySetInnerHTML={{ __html: contentAsHTML }}
    />
  );
};
