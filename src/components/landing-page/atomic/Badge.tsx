"use client";
import React from 'react';
import { designTokens } from '@/styles/design-tokens';

export interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  size = 'md',
}) => {
  const variantStyles = {
    primary: { bg: '#3b82f615', color: '#3b82f6', border: '#3b82f6' },
    secondary: { bg: '#64748b15', color: '#64748b', border: '#64748b' },
    success: { bg: '#10b98115', color: '#10b981', border: '#10b981' },
    warning: { bg: '#f59e0b15', color: '#f59e0b', border: '#f59e0b' },
    danger: { bg: '#ef444415', color: '#ef4444', border: '#ef4444' },
    info: { bg: '#06b6d415', color: '#06b6d4', border: '#06b6d4' },
  };

  const sizeStyles = {
    sm: { padding: `${designTokens.spacing[1]} ${designTokens.spacing[2]}`, fontSize: designTokens.typography.fontSize.xs },
    md: { padding: `${designTokens.spacing[1]} ${designTokens.spacing[3]}`, fontSize: designTokens.typography.fontSize.sm },
    lg: { padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`, fontSize: designTokens.typography.fontSize.base },
  };

  const style = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <span
      style={{
        display: 'inline-block',
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}30`,
        borderRadius: designTokens.borderRadius.full,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: designTokens.typography.fontWeight.semibold,
        fontFamily: designTokens.typography.fontFamily.primary,
      }}
    >
      {text}
    </span>
  );
};
