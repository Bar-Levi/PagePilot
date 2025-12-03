"use client";
import React from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  id,
  className,
  style,
  children,
}) => {
  return (
    <section
      id={id}
      className={className}
      style={style}
      data-component-id={id}
      data-component-type="Section"
    >
      {children}
    </section>
  );
};
