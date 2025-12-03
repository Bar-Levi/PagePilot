"use client";
import React from 'react';

interface GridProps {
  columns?: number;
  gap?: string;
  style?: React.CSSProperties;
  id?: string;
  children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({
  columns = 3,
  gap = '1rem',
  style,
  id,
  children,
}) => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
    ...style,
  };

  return (
    <div
      style={gridStyle}
      data-component-id={id}
      data-component-type="Grid"
    >
      {children}
    </div>
  );
};
