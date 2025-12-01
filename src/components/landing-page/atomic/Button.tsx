
"use client";
import React from 'react';
import NextLink from 'next/link';
import { Button as ShadcnButton } from '@/components/ui/button';
import type { ButtonProps } from '../types';

export const ButtonComponent: React.FC<ButtonProps> = ({
  text,
  href,
  variant = 'default',
  size = 'default',
  radius,
  hoverColor, // Note: Tailwind doesn't easily support dynamic hover colors inline. This is a simplification.
  fontWeight,
  padding,
}) => {
  const style: React.CSSProperties = {
    borderRadius: radius,
    fontWeight,
    padding,
  };

  return (
    <ShadcnButton asChild variant={variant} size={size} style={style}>
      <NextLink href={href || '#'}>
        {text || 'Click Me'}
      </NextLink>
    </ShadcnButton>
  );
};
