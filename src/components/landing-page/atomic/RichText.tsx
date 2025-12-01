
"use client";
import React from "react";
import type { RichTextProps, RichTextNode } from "../types";
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


export const RichText: React.FC<RichTextProps> = ({ content = [], align = 'left' }) => {
  const defaultContent: RichTextNode[] = [
    { text: "This is a default Rich Text component.", size: 18 },
  ];
  const displayContent = content && content.length > 0 ? content : defaultContent;

  const textAlignMap = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
    justify: 'text-justify',
  };

  return (
    <p className={cn(textAlignMap[align])}>
      {displayContent.map(renderNode)}
    </p>
  );
};
