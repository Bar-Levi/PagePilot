"use client";
import React from 'react';

interface TestimonialsGridProps {
  testimonials: (string | { text: string; type?: string })[];
  accentColor?: string;
  id?: string;
}

export const TestimonialsGrid: React.FC<TestimonialsGridProps> = ({
  testimonials,
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
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
      }}
      data-component-id={id}
      data-component-type="TestimonialsGrid"
    >
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          style={{
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: `4px solid ${accentColor}`,
          }}
        >
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#333' }}>
            "{getText(testimonial)}"
          </p>
        </div>
      ))}
    </div>
  );
};
