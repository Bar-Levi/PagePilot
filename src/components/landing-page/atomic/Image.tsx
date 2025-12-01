
"use client";
import React from 'react';
import NextImage from 'next/image';
import type { ImageProps } from '../types';
import { cn } from '@/lib/utils';

export const ImageComponent: React.FC<ImageProps> = ({
  src,
  alt,
  width = "100%",
  maxWidth,
  rounded,
  shadow,
  alignment = 'center',
}) => {
  const styles: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    borderRadius: rounded,
    boxShadow: shadow,
  };

  const alignmentClass = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }[alignment];

  return (
    <div style={{ width: '100%' }} className={cn(alignmentClass)}>
      <div style={styles} className="relative aspect-video">
        <NextImage
          src={src || "https://picsum.photos/seed/placeholder-img/600/400"}
          alt={alt || "Placeholder image"}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};
