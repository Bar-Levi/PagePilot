
"use client";
import React, { useRef } from "react";
import type { RichTextProps, RichTextNode } from "../types";
import { cn } from "@/lib/utils";
import { useEditorState } from "@/hooks/use-editor-state.tsx";

const renderNodeToHTML = (node: RichTextNode): string => {
  const style: React.CSSProperties = {
    fontWeight: node.bold ? "bold" : undefined,
    fontStyle: node.italic ? "italic" : undefined,
    textDecoration: node.underline ? "underline" : undefined,
    color: node.color,
    fontSize: node.size ? `${node.size}px` : undefined,
    fontFamily: node.font,
  };

  const styleString = Object.entries(style)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`)
    .join(';');

  const content = `<span style="${styleString}">${node.text}</span>`;

  if (node.link) {
    return `<a href="${node.link}" target="_blank" rel="noopener noreferrer">${content}</a>`;
  }

  return content;
};

// A simple parser, for now it just takes the whole innerHTML.
// In the future, this would parse HTML back into RichTextNode[]
const parseHTMLToContent = (html: string): RichTextNode[] => {
    // This is a simplification. A real implementation would need to parse
    // the HTML structure back into the RichTextNode[] format.
    // For now, we'll just create a single node with the plain text.
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return [{ text: text }];
};


export const RichText: React.FC<RichTextProps & { id: string }> = ({ id, content = [], align = 'left' }) => {
  const { updateComponentProps, selectedComponentId } = useEditorState();
  const editorRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedComponentId === id;

  const defaultContent: RichTextNode[] = [
    { text: "This is a default Rich Text component.", size: 18 },
  ];
  const displayContent = content && content.length > 0 ? content : defaultContent;
  
  const contentAsHTML = displayContent.map(renderNodeToHTML).join('');

  const handleInput = () => {
    if (editorRef.current) {
      const newHTML = editorRef.current.innerHTML;
      // In a real scenario, you'd parse this HTML back into your structured content.
      // For now, let's just update the first node's text for simplicity.
      const newContent = parseHTMLToContent(newHTML);
       updateComponentProps(id, { content: newContent, align });
    }
  };


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
      onInput={handleInput}
      className={cn("outline-none", textAlignMap[align])}
      style={{ whiteSpace: 'pre-wrap' }}
      dangerouslySetInnerHTML={{ __html: contentAsHTML }}
    />
  );
};
