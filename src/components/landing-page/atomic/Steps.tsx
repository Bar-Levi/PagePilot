"use client";
import React from 'react';

interface StepsProps {
  items: (string | { text: string; type?: string })[];
  accentColor?: string;
  id?: string;
}

export const Steps: React.FC<StepsProps> = ({
  items,
  accentColor = '#1A537D',
  id,
}) => {
  // Helper to extract text from item (string or object)
  const getText = (item: string | { text: string; type?: string }): string => {
    return typeof item === 'string' ? item : item.text;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        position: 'relative',
        direction: 'rtl',
      }}
      data-component-id={id}
      data-component-type="Steps"
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              minWidth: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: accentColor,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              flexShrink: 0,
            }}
          >
            {index + 1}
          </div>
          <div style={{ flex: 1, paddingTop: '0.5rem' }}>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.6', color: '#333', textAlign: 'right', direction: 'rtl' }}>
              {getText(item)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
