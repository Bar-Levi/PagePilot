"use client";
import React, { useState } from 'react';
import { designTokens } from '@/styles/design-tokens';

export interface ContactFormProps {
  fields?: Array<{
    name: string;
    type: 'text' | 'email' | 'tel' | 'textarea';
    label: string;
    required?: boolean;
    placeholder?: string;
  }>;
  submitText?: string;
  accentColor?: string;
  onSubmit?: (data: Record<string, string>) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  fields = [
    { name: 'name', type: 'text', label: 'שם מלא', required: true, placeholder: 'הכנס את שמך' },
    { name: 'email', type: 'email', label: 'אימייל', required: true, placeholder: 'example@email.com' },
    { name: 'message', type: 'textarea', label: 'הודעה', required: true, placeholder: 'כתוב את הודעתך כאן...' },
  ],
  submitText = 'שלח',
  accentColor = '#3b82f6',
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '600px',
        width: '100%',
        padding: designTokens.spacing[8],
        background: '#ffffff',
        borderRadius: designTokens.borderRadius.xl,
        boxShadow: designTokens.shadow.lg,
      }}
    >
      {fields.map((field) => (
        <div
          key={field.name}
          style={{
            marginBottom: designTokens.spacing[6],
          }}
        >
          <label
            htmlFor={field.name}
            style={{
              display: 'block',
              fontSize: designTokens.typography.fontSize.sm,
              fontWeight: designTokens.typography.fontWeight.semibold,
              color: '#1a1a1a',
              marginBottom: designTokens.spacing[2],
              textAlign: 'right',
            }}
          >
            {field.label}
            {field.required && <span style={{ color: accentColor }}> *</span>}
          </label>
          
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              rows={5}
              style={{
                width: '100%',
                padding: designTokens.spacing[3],
                fontSize: designTokens.typography.fontSize.base,
                border: '1px solid #e2e8f0',
                borderRadius: designTokens.borderRadius.md,
                transition: `all ${designTokens.transition.fast}`,
                fontFamily: designTokens.typography.fontFamily.primary,
                resize: 'vertical',
                direction: 'rtl',
                textAlign: 'right',
              }}
              onFocus={(e) => e.target.style.borderColor = accentColor}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              style={{
                width: '100%',
                padding: designTokens.spacing[3],
                fontSize: designTokens.typography.fontSize.base,
                border: '1px solid #e2e8f0',
                borderRadius: designTokens.borderRadius.md,
                transition: `all ${designTokens.transition.fast}`,
                fontFamily: designTokens.typography.fontFamily.primary,
                direction: 'rtl',
                textAlign: 'right',
              }}
              onFocus={(e) => e.target.style.borderColor = accentColor}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitted}
        style={{
          width: '100%',
          padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
          background: submitted ? '#10b981' : accentColor,
          color: 'white',
          fontSize: designTokens.typography.fontSize.base,
          fontWeight: designTokens.typography.fontWeight.semibold,
          border: 'none',
          borderRadius: designTokens.borderRadius.lg,
          cursor: submitted ? 'default' : 'pointer',
          transition: `all ${designTokens.transition.base}`,
          fontFamily: designTokens.typography.fontFamily.primary,
        }}
        className={!submitted ? 'hover-scale' : ''}
      >
        {submitted ? '✓ נשלח בהצלחה!' : submitText}
      </button>
    </form>
  );
};
