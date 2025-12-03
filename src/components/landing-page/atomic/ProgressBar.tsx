"use client";
import React from 'react';
import { designTokens } from '@/styles/design-tokens';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = '#3b82f6',
  height = 12,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div style={{ width: '100%' }}>
      {(label || showPercentage) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: designTokens.spacing[2],
          }}
        >
          {label && (
            <span
              style={{
                fontSize: designTokens.typography.fontSize.sm,
                fontWeight: designTokens.typography.fontWeight.medium,
                color: '#1a1a1a',
              }}
            >
              {label}
            </span>
          )}
          {showPercentage && (
            <span
              style={{
                fontSize: designTokens.typography.fontSize.sm,
                fontWeight: designTokens.typography.fontWeight.semibold,
                color: color,
              }}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          background: '#e2e8f0',
          borderRadius: designTokens.borderRadius.full,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: color,
            transition: `width ${designTokens.transition.slow}`,
            borderRadius: designTokens.borderRadius.full,
          }}
        />
      </div>
    </div>
  );
};
