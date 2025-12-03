"use client";
import React from "react";
import type { TextSpanProps } from "../types";

export const TextSpan: React.FC<
  TextSpanProps & { id: string; onClick?: () => void }
> = ({ id, text, bold, italic, underline, color, size, link, onClick }) => {
  const style: React.CSSProperties = {
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline ? "underline" : "none",
    color: color,
    fontSize: size ? `${size}px` : undefined,
  };

  const content = (
    <span style={style} data-component-id={id} data-component-type="TextSpan">
      {text}
    </span>
  );

  const wrappedContent = link ? (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  );

  if (onClick) {
    return (
      <span onClick={onClick} style={{ cursor: "pointer", display: "inline" }}>
        {wrappedContent}
      </span>
    );
  }

  return wrappedContent;
};
