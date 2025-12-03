"use client";

import React from "react";
import { cn } from "@/lib/utils";
import NextImage from "next/image";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";

export type CardProps = {
  image?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  rounded?: string;
  padding?: string;
  imagePosition?: "top" | "left" | "right";
  imageAspectRatio?: "square" | "video" | "portrait";
};

export function CardComponent({
  image,
  imageAlt = "Card image",
  title,
  description,
  buttonText,
  buttonLink = "#",
  shadow = "md",
  hover = true,
  rounded = "12px",
  padding = "16px",
  imagePosition = "top",
  imageAspectRatio = "video",
}: CardProps & { id?: string; onClick?: () => void }) {
  const shadowClass = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  }[shadow];

  const aspectClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  }[imageAspectRatio];

  const isHorizontal = imagePosition === "left" || imagePosition === "right";

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-800 overflow-hidden",
        shadowClass,
        hover && "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        isHorizontal && "flex"
      )}
      style={{ borderRadius: rounded }}
    >
      {/* Image */}
      {image && (
        <div
          className={cn(
            "relative overflow-hidden",
            isHorizontal ? "w-1/3 shrink-0" : aspectClass,
            imagePosition === "right" && "order-2"
          )}
        >
          <NextImage
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div
        className={cn("flex flex-col", isHorizontal && "flex-1")}
        style={{ padding }}
      >
        {title && (
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-slate-600 dark:text-slate-300 mb-4 flex-1">
            {description}
          </p>
        )}

        {buttonText && (
          <div>
            <Button asChild variant="default" size="sm">
              <NextLink href={buttonLink}>{buttonText}</NextLink>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

