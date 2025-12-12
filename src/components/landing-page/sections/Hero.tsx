"use client";

import React from "react";
import type { HeroProps } from "../types";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, Sparkles } from "lucide-react";

type HeroSectionProps = HeroProps & {
  id?: string;
  onClick?: () => void;
  badge?: string; // תג אופציונלי מעל הכותרת
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
};

export function HeroSection({
  headline,
  subheadline,
  buttonText,
  buttonLink,
  backgroundImage,
  backgroundGradient,
  alignment = "center",
  badge,
  secondaryButtonText,
  secondaryButtonLink,
  id,
  onClick,
}: HeroSectionProps) {
  const alignmentClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[alignment];

  // גרדיאנט מודרני ומרשים
  const defaultGradient = 
    "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)";
  
  const backgroundStyle: React.CSSProperties = {
    background: backgroundGradient || defaultGradient,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  };

  return (
    <section
      className={cn(
        "relative flex flex-col justify-center min-h-[85vh] px-6 py-32 overflow-hidden",
        alignmentClass
      )}
      style={backgroundStyle}
      data-component-id={id}
      data-component-type="Hero"
      onClick={onClick}
    >
      {/* Overlay gradient for better text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"
        aria-hidden="true"
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Badge */}
        {badge && (
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full",
            "bg-white/10 backdrop-blur-md border border-white/20",
            "text-white text-sm font-medium",
            "shadow-lg shadow-black/10",
            "animate-in fade-in slide-in-from-top-2 duration-700",
            alignment === "center" && "mx-auto"
          )}>
            <Sparkles className="w-4 h-4" />
            {badge}
          </div>
        )}

        {/* Headline */}
        <h1 
          className={cn(
            "text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
            "font-extrabold text-white leading-[1.1] tracking-tight",
            "drop-shadow-2xl",
            "animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200"
          )}
          style={{
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {headline}
        </h1>

        {/* Subheadline */}
        {subheadline && (
          <p 
            className={cn(
              "text-lg md:text-xl lg:text-2xl",
              "text-white/95 max-w-3xl leading-relaxed",
              "drop-shadow-lg",
              "animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300",
              alignment === "center" && "mx-auto"
            )}
          >
            {subheadline}
          </p>
        )}

        {/* CTA Buttons */}
        {buttonText && (
          <div 
            className={cn(
              "flex flex-wrap gap-4 pt-4",
              "animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500",
              alignment === "center" && "justify-center",
              alignment === "right" && "justify-end"
            )}
          >
            {/* Primary Button */}
            <Button 
              size="lg" 
              asChild
              className={cn(
                "h-14 px-8 text-base font-semibold",
                "bg-white text-purple-600 hover:bg-white/90",
                "shadow-2xl shadow-black/20",
                "hover:scale-105 hover:shadow-3xl",
                "transition-all duration-300",
                "group"
              )}
            >
              <NextLink href={buttonLink || "#"} className="flex items-center gap-2">
                {buttonText}
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </NextLink>
            </Button>

            {/* Secondary Button (optional) */}
            {secondaryButtonText && (
              <Button 
                size="lg" 
                variant="outline"
                asChild
                className={cn(
                  "h-14 px-8 text-base font-semibold",
                  "bg-white/10 text-white border-2 border-white/30",
                  "hover:bg-white/20 hover:border-white/50",
                  "backdrop-blur-sm",
                  "shadow-xl shadow-black/10",
                  "hover:scale-105",
                  "transition-all duration-300"
                )}
              >
                <NextLink href={secondaryButtonLink || "#"}>
                  {secondaryButtonText}
                </NextLink>
              </Button>
            )}
          </div>
        )}

        {/* Trust indicators / Social proof (optional) */}
        <div 
          className={cn(
            "flex flex-wrap items-center gap-6 pt-8 text-white/80 text-sm",
            "animate-in fade-in duration-1000 delay-700",
            alignment === "center" && "justify-center"
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40 backdrop-blur-sm"
                />
              ))}
            </div>
            <span className="font-medium">+1,000 לקוחות מרוצים</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
            <span className="mr-2 font-medium">5.0 דירוג ממוצע</span>
          </div>
        </div>
      </div>

      {/* Decorative bottom wave (optional) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/10 to-transparent" />
    </section>
  );
}
