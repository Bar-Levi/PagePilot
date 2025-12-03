
"use client";
import React from 'react';
import type { ContainerProps } from '../types';
import { cn } from '@/lib/utils';

export const Container: React.FC<ContainerProps & { children: React.ReactNode; id: string; onClick?: () => void; style?: any; maxWidth?: string; textAlign?: string }> = ({
  style = {},
  children,
  id,
  onClick,
  maxWidth,
  textAlign,
}) => {
  const {
    background,
    padding,
    radius,
    border,
    flexDirection,
    alignItems,
    justifyContent,
    gap,
    width,
  } = style;

  const styles: React.CSSProperties = {
    backgroundColor: background,
    padding: typeof padding === 'number' ? `${padding}px` : padding,
    borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
    border,
    flexDirection: flexDirection || 'column',
    alignItems,
    justifyContent,
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    width,
    maxWidth: maxWidth || style.maxWidth,
    textAlign: textAlign || style.textAlign,
    display: 'flex', // Default to flexbox
    margin: '0 auto', // Center the container
    ...style, // Allow style overrides
  };

  return (
    <div
      style={styles}
      data-component-id={id}
      data-component-type="Container"
      onClick={onClick}
      className={onClick ? "cursor-pointer" : ""}
    >
      {children}
    </div>
  );
};
