"use client";
import React from 'react';

interface TestimonialsGridProps {
  testimonials: (string | { text: string; type?: string } | { quote: string; author?: string })[];
  accentColor?: string;
  id?: string;
}

export const TestimonialsGrid: React.FC<TestimonialsGridProps> = ({
  testimonials,
  accentColor = '#1A537D',
  id,
}) => {
  // Helper to extract text from item (string or object with different formats)
  const getText = (item: string | { text: string; type?: string } | { quote: string; author?: string }): { text: string; author?: string } => {
    if (typeof item === 'string') {
      return { text: item };
    }
    if (item && typeof item === 'object') {
      if ('quote' in item) {
        return { text: item.quote || '', author: item.author };
      }
      if ('text' in item) {
        return { text: item.text || '' };
      }
      // Fallback for any other object structure
      return { text: JSON.stringify(item) };
    }
    return { text: String(item) };
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
      {testimonials.map((testimonial, index) => {
        const { text, author } = getText(testimonial);
        return (
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
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              color: '#333', 
              marginBottom: author ? '1rem' : '0',
              textAlign: 'right',
              direction: 'rtl'
            }}>
              "{text}"
            </p>
            {author && (
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#666', 
                fontWeight: '600', 
                textAlign: 'right',
                direction: 'rtl'
              }}>
                — {author}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
