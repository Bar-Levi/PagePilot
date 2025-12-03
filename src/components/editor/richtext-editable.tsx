"use client";

import React, { useRef, useEffect } from 'react';

interface RichTextEditableProps {
  id: string;
  html: string;
  align?: "left" | "center" | "right";
  onChange: (html: string) => void;
  onSelect: (id: string, type: string, element: HTMLDivElement) => void;
}

export const RichTextEditable: React.FC<RichTextEditableProps> = ({
  id,
  html,
  align = 'left',
  onChange,
  onSelect,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Sync HTML from props to DOM when html changes
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== html) {
      ref.current.innerHTML = html;
    }
  }, [html]);

  const updateHtml = () => {
    if (ref.current) {
      const newHTML = ref.current.innerHTML;
      onChange(newHTML);
    }
  };

  const handleSelect = () => {
    if (ref.current) {
      onSelect(id, "RichText", ref.current);
    }
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={updateHtml}
      onClick={handleSelect}
      style={{
        textAlign: align,
        outline: 'none',
        minHeight: '1em',
        padding: '8px',
        borderRadius: '4px',
        border: '2px solid transparent',
        transition: 'border-color 0.2s',
        cursor: 'text',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      data-component-id={id}
      data-component-type="RichText"
    />
  );
};
