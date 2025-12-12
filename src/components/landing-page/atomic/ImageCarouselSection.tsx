"use client";

import React, { useState, useEffect, useCallback } from "react";
import NextImage from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

// Type definitions for carousel items
export interface CarouselImage {
  src: string;
  alt?: string;
  caption?: string;
}

export interface ImageCarouselSectionProps {
  // Content
  headline: string;
  description?: string;
  images: CarouselImage[];
  
  // Colors
  backgroundColor?: string;
  headlineColor?: string;
  descriptionColor?: string;
  accentColor?: string;
  underlineColor?: string;
  
  // Navigation styling
  arrowBackgroundColor?: string;
  arrowColor?: string;
  dotActiveColor?: string;
  dotInactiveColor?: string;
  
  // Settings
  autoplay?: boolean;
  autoplayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showCounter?: boolean;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "21:9" | "auto";
  imageObjectFit?: "cover" | "contain" | "fill";
  maxImageWidth?: string;
  
  // Editor props
  id?: string;
}

export const ImageCarouselSection: React.FC<ImageCarouselSectionProps> = ({
  headline,
  description,
  images = [],
  backgroundColor = "#0A1628",
  headlineColor = "#FFFFFF",
  descriptionColor = "#94A3B8",
  accentColor = "#00D4AA",
  underlineColor = "#00D4AA",
  arrowBackgroundColor = "rgba(255,255,255,0.1)",
  arrowColor = "#FFFFFF",
  dotActiveColor = "#00D4AA",
  dotInactiveColor = "rgba(255,255,255,0.3)",
  autoplay = false,
  autoplayInterval = 5000,
  showDots = true,
  showArrows = true,
  showCounter = true,
  aspectRatio = "16:9",
  imageObjectFit = "contain",
  maxImageWidth = "900px",
  id,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const totalImages = images.length;

  const goToNext = useCallback(() => {
    if (totalImages <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const goToPrev = useCallback(() => {
    if (totalImages <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || isPaused || isHovered || totalImages <= 1) return;

    const timer = setInterval(goToNext, autoplayInterval);
    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, isPaused, isHovered, totalImages, goToNext]);

  // Get aspect ratio class
  const getAspectRatioStyle = (): React.CSSProperties => {
    switch (aspectRatio) {
      case "16:9":
        return { aspectRatio: "16/9" };
      case "4:3":
        return { aspectRatio: "4/3" };
      case "1:1":
        return { aspectRatio: "1/1" };
      case "21:9":
        return { aspectRatio: "21/9" };
      default:
        return {};
    }
  };

  const currentImage = images[currentIndex];

  return (
    <section
      data-component-id={id}
      data-component-type="ImageCarouselSection"
      style={{
        backgroundColor,
        padding: "80px 24px",
        direction: "rtl",
      }}
    >
      {/* Headline with underline */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "60px",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 700,
            color: headlineColor,
            margin: 0,
            marginBottom: "16px",
            lineHeight: 1.2,
          }}
        >
          {headline}
        </h2>
        
        {/* Decorative underline */}
        <div
          style={{
            width: "80px",
            height: "4px",
            backgroundColor: underlineColor,
            margin: "0 auto",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* Carousel Container */}
      <div
        style={{
          maxWidth: maxImageWidth,
          margin: "0 auto",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Display */}
        {totalImages > 0 ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              ...getAspectRatioStyle(),
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            }}
          >
            {/* Current Image */}
            <NextImage
              src={currentImage?.src || "/placeholder-image.png"}
              alt={currentImage?.alt || `תמונה ${currentIndex + 1}`}
              fill
              style={{
                objectFit: imageObjectFit,
              }}
              priority={currentIndex === 0}
            />

            {/* Gradient overlay for captions */}
            {currentImage?.caption && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                  padding: "40px 24px 16px",
                }}
              >
                <p
                  style={{
                    color: "#FFFFFF",
                    fontSize: "14px",
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  {currentImage.caption}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              ...getAspectRatioStyle(),
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: "18px",
            }}
          >
            הוסף תמונות לקרוסלה
          </div>
        )}

        {/* Navigation Controls */}
        {totalImages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
              marginTop: "32px",
            }}
          >
            {/* Left Arrow */}
            {showArrows && (
              <button
                onClick={goToPrev}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: arrowBackgroundColor,
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = accentColor;
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = arrowBackgroundColor;
                  e.currentTarget.style.transform = "scale(1)";
                }}
                aria-label="הקודם"
              >
                <ChevronRight size={24} color={arrowColor} />
              </button>
            )}

            {/* Pause/Play + Dots */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 20px",
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: "24px",
              }}
            >
              {/* Pause/Play Button */}
              {autoplay && (
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  aria-label={isPaused ? "הפעל" : "עצור"}
                >
                  {isPaused ? (
                    <Play size={16} color={arrowColor} fill={arrowColor} />
                  ) : (
                    <Pause size={16} color={arrowColor} />
                  )}
                </button>
              )}

              {/* Dots */}
              {showDots && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToIndex(index)}
                      style={{
                        width: index === currentIndex ? "24px" : "8px",
                        height: "8px",
                        borderRadius: "4px",
                        backgroundColor:
                          index === currentIndex
                            ? dotActiveColor
                            : dotInactiveColor,
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      aria-label={`עבור לתמונה ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Arrow */}
            {showArrows && (
              <button
                onClick={goToNext}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: arrowBackgroundColor,
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = accentColor;
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = arrowBackgroundColor;
                  e.currentTarget.style.transform = "scale(1)";
                }}
                aria-label="הבא"
              >
                <ChevronLeft size={24} color={arrowColor} />
              </button>
            )}
          </div>
        )}

        {/* Counter */}
        {showCounter && totalImages > 1 && (
          <div
            style={{
              textAlign: "center",
              marginTop: "16px",
              color: accentColor,
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {currentIndex + 1} / {totalImages}
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p
          style={{
            maxWidth: "700px",
            margin: "40px auto 0",
            fontSize: "18px",
            lineHeight: 1.7,
            color: descriptionColor,
            textAlign: "center",
          }}
        >
          {description}
        </p>
      )}
    </section>
  );
};

export default ImageCarouselSection;
