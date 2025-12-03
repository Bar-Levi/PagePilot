"use client";

import React from "react";
import type { HeroProps } from "../types";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

type HeroSectionProps = HeroProps & {
  id?: string;
  onClick?: () => void;
};

export function HeroSection({
  headline,
  subheadline,
  buttonText,
  buttonLink,
  backgroundImage,
  backgroundGradient,
  alignment = "center",
  id,
  onClick,
}: HeroSectionProps) {
  const alignmentClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[alignment];

  const backgroundStyle: React.CSSProperties = {
    background: backgroundGradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <section
      className={cn(
        "flex flex-col justify-center min-h-[70vh] px-8 py-24",
        alignmentClass
      )}
      style={backgroundStyle}
      data-component-id={id}
      data-component-type="Hero"
      onClick={onClick}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          {headline}
        </h1>
        
        {subheadline && (
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            {subheadline}
          </p>
        )}

        {buttonText && (
          <div className="pt-4">
            <Button size="lg" asChild>
              <NextLink href={buttonLink || "#"}>
                {buttonText}
              </NextLink>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

