"use client";
import React from 'react';
import { designTokens } from '@/styles/design-tokens';

export interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  features: string[];
  ctaText?: string;
  ctaHref?: string;
  highlighted?: boolean;
  accentColor?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period = 'לחודש',
  features = [],
  ctaText = 'התחל עכשיו',
  ctaHref = '#',
  highlighted = false,
  accentColor = '#3b82f6',
}) => {
  return (
    <div
      style={{
        position: 'relative',
        padding: designTokens.spacing[8],
        background: highlighted 
          ? `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}05 100%)`
          : '#ffffff',
        borderRadius: designTokens.borderRadius.xl,
        border: highlighted 
          ? `2px solid ${accentColor}`
          : '1px solid #e2e8f0',
        boxShadow: highlighted 
          ? designTokens.shadow.xl
          : designTokens.shadow.md,
        transition: `all ${designTokens.transition.base}`,
        maxWidth: '400px',
        width: '100%',
      }}
      className="hover-lift"
    >
      {/* Highlighted Badge */}
      {highlighted && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            right: '50%',
            transform: 'translateX(50%)',
            background: accentColor,
            color: 'white',
            padding: `${designTokens.spacing[1]} ${designTokens.spacing[4]}`,
            borderRadius: designTokens.borderRadius.full,
            fontSize: designTokens.typography.fontSize.sm,
            fontWeight: designTokens.typography.fontWeight.semibold,
            boxShadow: designTokens.shadow.md,
          }}
        >
          מומלץ
        </div>
      )}

      {/* Title */}
      <h3
        style={{
          fontSize: designTokens.typography.fontSize['2xl'],
          fontWeight: designTokens.typography.fontWeight.bold,
          marginBottom: designTokens.spacing[2],
          textAlign: 'center',
          color: '#1a1a1a',
        }}
      >
        {title}
      </h3>

      {/* Price */}
      <div style={{ textAlign: 'center', marginBottom: designTokens.spacing[6] }}>
        <span
          style={{
            fontSize: designTokens.typography.fontSize['5xl'],
            fontWeight: designTokens.typography.fontWeight.bold,
            color: accentColor,
          }}
        >
          {price}
        </span>
        <span
          style={{
            fontSize: designTokens.typography.fontSize.lg,
            color: '#64748b',
            marginRight: designTokens.spacing[2],
          }}
        >
          {period}
        </span>
      </div>

      {/* Features List */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          marginBottom: designTokens.spacing[6],
        }}
      >
        {features.map((feature, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: designTokens.spacing[3],
              marginBottom: designTokens.spacing[3],
              fontSize: designTokens.typography.fontSize.base,
              color: '#475569',
            }}
          >
            <span
              style={{
                color: accentColor,
                fontSize: designTokens.typography.fontSize.xl,
              }}
            >
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <a
        href={ctaHref}
        style={{
          display: 'block',
          width: '100%',
          padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
          background: highlighted ? accentColor : '#f1f5f9',
          color: highlighted ? 'white' : '#1a1a1a',
          textAlign: 'center',
          borderRadius: designTokens.borderRadius.lg,
          fontSize: designTokens.typography.fontSize.base,
          fontWeight: designTokens.typography.fontWeight.semibold,
          textDecoration: 'none',
          transition: `all ${designTokens.transition.base}`,
          cursor: 'pointer',
        }}
        className="hover-scale"
      >
        {ctaText}
      </a>
    </div>
  );
};
