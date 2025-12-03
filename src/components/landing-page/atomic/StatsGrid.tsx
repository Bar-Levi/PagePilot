"use client";
import React from 'react';

interface StatsGridProps {
  stats: Array<{ label: string; value: string }>;
  textColor?: string;
  id?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  textColor = '#FFFFFF',
  id,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        textAlign: 'center',
        direction: 'rtl',
      }}
      data-component-id={id}
      data-component-type="StatsGrid"
    >
      {stats.map((stat, index) => (
        <div key={index}>
          <div
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: textColor,
              marginBottom: '0.5rem',
            }}
          >
            {stat.value}
          </div>
          <div
            style={{
              fontSize: '1.125rem',
              color: textColor,
              opacity: 0.9,
              direction: 'rtl',
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
