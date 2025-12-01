
"use client";
import React from 'react';
import type { ContainerProps } from '../types';
import { cn } from '@/lib/utils';

export const Container: React.FC<ContainerProps & { children: React.ReactNode; id: string }> = ({
  style = {},
  children,
  id,
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
    maxWidth,
  } = style;

  const styles: React.CSSProperties = {
    backgroundColor: background,
    padding: typeof padding === 'number' ? `${padding}px` : padding,
    borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
    border,
    flexDirection,
    alignItems,
    justifyContent,
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    width,
    maxWidth,
    display: 'flex', // Default to flexbox
  };

  return (
    <div style={styles} data-component-id={id} data-component-type="Container">
      {children}
    </div>
  );
};
