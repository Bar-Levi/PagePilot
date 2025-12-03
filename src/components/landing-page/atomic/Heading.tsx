"use client";
import React from 'react';

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  style?: React.CSSProperties;
  id?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  level,
  text,
  style,
  id,
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return React.createElement(
    Tag,
    {
      style: { ...style, textAlign: 'right', direction: 'rtl' },
      'data-component-id': id,
      'data-component-type': 'Heading',
    },
    text
  );
};
