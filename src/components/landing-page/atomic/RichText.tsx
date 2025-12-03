"use client";

import React, { useEffect, useRef } from 'react';
import type { RichTextProps } from '../types';

export const RichText: React.FC<RichTextProps & { id: string; onChange?: (html: string) => void; onSelect?: (id: string, type: string, element: HTMLDivElement) => void }> = ({
  id,
  html,
  align = 'left',
  onChange,
  onSelect,
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current && divRef.current.innerHTML !== html) {
      divRef.current.innerHTML = html;
    }
  }, [html]);

  const handleInput = () => {
    if (divRef.current && onChange) {
      const newHtml = divRef.current.innerHTML;
      onChange(newHtml);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent default behavior for some keys to maintain control
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Insert a line break instead of paragraph
      document.execCommand('insertHTML', false, '<br>');
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    console.log('RichText clicked:', id);
    // On click, mark this RichText as selected and set the active element
    if (onSelect && divRef.current) {
      onSelect(id, 'RichText', divRef.current);
    }
  };

  return (
    <div
      ref={divRef}
      contentEditable
      suppressContentEditableWarning={true}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      style={{
        textAlign: align,
        outline: 'none',
        minHeight: '1em',
        padding: '4px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      data-component-id={id}
      data-component-type="RichText"
    />
  );
};
