"use client";
import React from 'react';

interface TextProps {
  text: string;
  style?: React.CSSProperties;
  id?: string;
}

export const Text: React.FC<TextProps> = ({
  text,
  style,
  id,
}) => {
  return (
    <p
      style={{ ...style, textAlign: 'right', direction: 'rtl' }}
      data-component-id={id}
      data-component-type="Text"
    >
      {text}
    </p>
  );
};
