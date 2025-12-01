
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
  
  if (node.bold) {
    content = `<b>${content}</b>`;
  }
  if (node.italic) {
    content = `<i>${content}</i>`;
  }
  if (node.underline) {
    content = `<u>${content}</u>`;
  }

  const styles: string[] = [];
  if (node.color) styles.push(`color: ${node.color}`);
  if (node.size) styles.push(`font-size: ${node.size}px`);
  if (node.font) styles.push(`font-family: ${node.font}`);

  if (styles.length > 0 || node.link) {
     const styleString = styles.join('; ');
     const tag = node.link ? `a href="${node.link}" target="_blank" rel="noopener noreferrer"` : 'span';
     content = `<${tag} style="${styleString}">${content}</${tag}>`;
  }

  return content;
};


// Very basic parser. This is a weak point and should be improved.
const parseHTMLToContent = (html: string): RichTextNode[] => {
    // For now, this is a major simplification. It just strips HTML for plain text.
    // A proper implementation needs a real HTML parser.
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Simplistic approach: create one node per text block, try to guess some styles
    // This will lose nested formatting.
    if (tempDiv.childNodes.length === 0) {
        return [{ text: tempDiv.textContent || "" }];
    }

    const nodes: RichTextNode[] = [];
    tempDiv.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            if(child.textContent) nodes.push({ text: child.textContent });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            const el = child as HTMLElement;
            const style = window.getComputedStyle(el);
            nodes.push({
                text: el.textContent || "",
                bold: parseInt(style.fontWeight, 10) >= 700,
                italic: style.fontStyle === 'italic',
                // This is not reliable for underline. `execCommand` uses <u> tags
                underline: el.tagName === 'U',
                color: style.color,
                size: parseInt(style.fontSize, 10)
            });
        }
    })

    if (nodes.length === 0 && tempDiv.textContent) {
       return [{ text: tempDiv.textContent }];
    }

    return nodes.length > 0 ? nodes : [{text: ''}];
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
          // This is where a proper HTML -> RichTextNode[] parser would be critical.
          // For now, we store the raw HTML as a temporary solution to keep formatting.
          // We will create a new prop, say `htmlContent` to not break the `content` prop logic.
          // This is a hack for now.
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
