"use client";
import React from 'react';
import { designTokens } from '@/styles/design-tokens';

export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  accentColor?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  accentColor = '#3b82f6',
}) => {
  return (
    <div
      style={{
        padding: designTokens.spacing[6],
        background: '#ffffff',
        borderRadius: designTokens.borderRadius.xl,
        border: '1px solid #e2e8f0',
        boxShadow: designTokens.shadow.sm,
        transition: `all ${designTokens.transition.base}`,
        maxWidth: '350px',
        width: '100%',
      }}
      className="hover-lift"
    >
      {/* Icon */}
      <div
        style={{
          width: '64px',
          height: '64px',
          background: `${accentColor}15`,
          borderRadius: designTokens.borderRadius.xl,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: designTokens.spacing[4],
          fontSize: designTokens.typography.fontSize['3xl'],
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: designTokens.typography.fontSize.xl,
          fontWeight: designTokens.typography.fontWeight.bold,
          marginBottom: designTokens.spacing[2],
          color: '#1a1a1a',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: designTokens.typography.fontSize.base,
          color: '#64748b',
          lineHeight: designTokens.typography.lineHeight.relaxed,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
};
