"use client";
import React, { useState } from 'react';

interface FAQAccordionProps {
  items: (string | { question: string; answer: string })[];
  accentColor?: string;
  id?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  accentColor = '#1A537D',
  id,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Parse FAQ items - handle both string format and object format
  const parsedItems = items.map(item => {
    if (typeof item === 'string') {
      const parts = item.split(' ת: ');
      const question = parts[0]?.replace('ש: ', '') || '';
      const answer = parts[1] || '';
      return { question, answer };
    }
    return item; // Already an object with question/answer
  });

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      data-component-id={id}
      data-component-type="FAQAccordion"
    >
      {parsedItems.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            style={{
              width: '100%',
              padding: '1.25rem',
              textAlign: 'right',
              backgroundColor: openIndex === index ? accentColor : '#F8F8F8',
              color: openIndex === index ? '#FFFFFF' : '#333333',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.125rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{item.question}</span>
            <span style={{ fontSize: '1.5rem' }}>
              {openIndex === index ? '−' : '+'}
            </span>
          </button>
          {openIndex === index && (
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: '#FFFFFF',
                borderTop: `1px solid ${accentColor}20`,
              }}
            >
              <p style={{ color: '#666666', lineHeight: '1.6' }}>
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
