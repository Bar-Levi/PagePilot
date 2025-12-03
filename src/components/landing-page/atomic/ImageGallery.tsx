"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import NextImage from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export type GalleryImage = {
  src: string;
  alt?: string;
  caption?: string;
};

export type ImageGalleryProps = {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  gap?: number;
  lightbox?: boolean;
  aspectRatio?: "square" | "landscape" | "portrait" | "auto";
  rounded?: string;
};

export function ImageGalleryComponent({
  images = [],
  columns = 3,
  gap = 16,
  lightbox = true,
  aspectRatio = "square",
  rounded = "8px",
}: ImageGalleryProps & { id?: string; onClick?: () => void }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const columnsClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  const aspectClass = {
    square: "aspect-square",
    landscape: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  }[aspectRatio];

  const openLightbox = (index: number) => {
    if (lightbox) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  if (images.length === 0) {
    return (
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-8 text-center">
        <p className="text-slate-500">הוסף תמונות לגלריה</p>
      </div>
    );
  }

  return (
    <>
      {/* Gallery Grid */}
      <div
        className={cn("grid", columnsClass)}
        style={{ gap: `${gap}px` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative overflow-hidden group cursor-pointer",
              aspectClass
            )}
            style={{ borderRadius: rounded }}
            onClick={() => openLightbox(index)}
          >
            <NextImage
              src={image.src || `https://picsum.photos/seed/gallery-${index}/400/400`}
              alt={image.alt || `Gallery image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Hover Overlay */}
            {lightbox && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}

            {/* Caption on hover */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-white text-sm">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <NextImage
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt || ""}
              width={1200}
              height={800}
              className="max-h-[90vh] w-auto object-contain"
            />

            {/* Caption */}
            {images[lightboxIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white text-center">
                  {images[lightboxIndex].caption}
                </p>
              </div>
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

