
"use client";
import React from "react";
import type { RichTextSectionData, RichTextNode } from "./types";
import { cn } from "@/lib/utils";

const renderNode = (node: RichTextNode, index: number) => {
  const style: React.CSSProperties = {
    fontWeight: node.bold ? "bold" : "normal",
    fontStyle: node.italic ? "italic" : "normal",
    textDecoration: node.underline ? "underline" : "none",
    color: node.color,
    fontSize: node.size ? `${node.size}px` : undefined,
    fontFamily: node.font,
  };

  const content = (
    <span key={index} style={style}>
      {node.text}
    </span>
  );

  if (node.link) {
    return (
      <a href={node.link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
};

export function RichTextSection({
  content,
  align = "left",
  spacing = 4,
  background,
  padding = 8,
}: RichTextSectionData) {
  
  const defaultContent: RichTextNode[] = [
    { text: "This is a ", size: 18 },
    { text: "Rich Text", size: 18, bold: true, color: "hsl(var(--primary))" },
    { text: " component. ", size: 18 },
    { text: "Edit me by changing the JSON!", size: 18, italic: true },
  ];

  const displayContent = content && content.length > 0 ? content : defaultContent;

  const sectionStyle: React.CSSProperties = {
    backgroundColor: background,
    paddingTop: `${padding * 4}px`,
    paddingBottom: `${padding * 4}px`,
    marginTop: `${spacing * 4}px`,
    marginBottom: `${spacing * 4}px`,
  };

  return (
    <section style={sectionStyle}>
      <div className="container">
        <p className={cn(`text-${align}`)}>
          {displayContent.map(renderNode)}
        </p>
      </div>
    </section>
  );
}
