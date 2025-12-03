"use client";
import React from 'react';
import { designTokens } from '@/styles/design-tokens';
import NextLink from "next/link";
import { Button as ShadcnButton } from "@/components/ui/button";
import type { ButtonProps } from "../types";

export const ButtonComponent: React.FC<
  ButtonProps & { id?: string; onClick?: () => void; style?: any }
> = ({
  text,
  href,
  variant = "default",
  size = "default",
  radius,
  hoverColor, // Note: Tailwind doesn't easily support dynamic hover colors inline. This is a simplification.
  fontWeight,
  padding,
  id,
  onClick,
  style: additionalStyle,
}) => {
  const baseStyles: React.CSSProperties = {
    padding: size === 'sm' ? designTokens.spacing[2] : size === 'lg' ? designTokens.spacing[4] : designTokens.spacing[3],
    fontSize: size === 'sm' ? designTokens.typography.fontSize.sm : size === 'lg' ? designTokens.typography.fontSize.lg : designTokens.typography.fontSize.base,
    fontWeight: designTokens.typography.fontWeight.semibold,
    borderRadius: designTokens.borderRadius.md,
    border: 'none',
    cursor: 'pointer',
    transition: `all ${designTokens.transition.base}`,
    fontFamily: designTokens.typography.fontFamily.primary,
    ...additionalStyle,
  };

  return (
    <div data-component-id={id} data-component-type="Button" onClick={onClick}>
      <ShadcnButton
        asChild
        variant={variant}
        size={size}
        style={{ ...baseStyles, ...additionalStyle }}
      >
        <NextLink href={href || "#"}>{text || "Click Me"}</NextLink>
      </ShadcnButton>
    </div>
  );
};
