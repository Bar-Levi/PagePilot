"use client";
import React from 'react';

interface SimpleCardProps {
  style?: React.CSSProperties;
  id?: string;
  children?: React.ReactNode;
}

export const SimpleCard: React.FC<SimpleCardProps> = ({
  style,
  id,
  children,
}) => {
  return (
    <div
      style={style}
      data-component-id={id}
      data-component-type="Card"
    >
      {children}
    </div>
  );
};
