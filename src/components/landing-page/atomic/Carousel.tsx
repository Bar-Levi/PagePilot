"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";

export type CarouselItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
  caption?: string;
  youtubeId?: string;
};

export type CarouselProps = {
  items: CarouselItem[];
  autoplay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  animation?: "slide" | "fade";
  aspectRatio?: "16:9" | "4:3" | "1:1" | "21:9";
};

export function CarouselComponent({
  items = [],
  autoplay = false,
  interval = 5000,
  showDots = true,
  showArrows = true,
  animation = "slide",
  aspectRatio = "16:9",
}: CarouselProps & { id?: string; onClick?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const aspectRatioClass = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "21:9": "aspect-[21/9]",
  }[aspectRatio];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay
  useEffect(() => {
    if (!autoplay || isHovered || items.length <= 1) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoplay, interval, isHovered, items.length, goToNext]);

  if (items.length === 0) {
    return (
      <div
        className={cn(
          "bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center",
          aspectRatioClass
        )}
      >
        <p className="text-slate-500">הוסף פריטים לקרוסלה</p>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div
      className="relative w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Content */}
      <div className={cn("relative overflow-hidden rounded-lg", aspectRatioClass)}>
        {/* Slides */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-500",
            animation === "fade" ? "opacity-100" : ""
          )}
          style={
            animation === "slide"
              ? { transform: `translateX(-${currentIndex * 100}%)` }
              : {}
          }
        >
          {animation === "slide" ? (
            <div
              className="flex h-full"
              style={{ width: `${items.length * 100}%` }}
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  className="relative h-full"
                  style={{ width: `${100 / items.length}%` }}
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
          ) : (
            renderItem(currentItem)
          )}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white shadow-lg"
            onClick={goToPrev}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white shadow-lg"
            onClick={goToNext}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </>
      )}

      {/* Dots */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white w-4"
                  : "bg-white/50 hover:bg-white/75"
              )}
              onClick={() => goToIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Caption */}
      {currentItem.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-8">
          <p className="text-white text-center">{currentItem.caption}</p>
        </div>
      )}
    </div>
  );
}

// Render individual item
function renderItem(item: CarouselItem) {
  if (item.type === "video" && item.youtubeId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${item.youtubeId}`}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <NextImage
      src={item.src || "https://picsum.photos/seed/carousel/800/450"}
      alt={item.alt || "Carousel image"}
      fill
      className="object-cover"
    />
  );
}

