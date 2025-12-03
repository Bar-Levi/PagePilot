"use client";
import React from "react";
import NextLink from "next/link";
import { Button as ShadcnButton } from "@/components/ui/button";
import type { ButtonProps } from "../types";

export const ButtonComponent: React.FC<
  ButtonProps & { id?: string; onClick?: () => void; style?: any }
> = ({
  text,
  href,
  variant = "default",
  size = "default",
  radius,
  hoverColor, // Note: Tailwind doesn't easily support dynamic hover colors inline. This is a simplification.
  fontWeight,
  padding,
  id,
  onClick,
  style: additionalStyle,
}) => {
  const style: React.CSSProperties = {
    borderRadius: radius,
    fontWeight,
    padding,
  };

  return (
    <div data-component-id={id} data-component-type="Button" onClick={onClick}>
      <ShadcnButton
        asChild
        variant={variant}
        size={size}
        style={{ ...style, ...additionalStyle }}
      >
        <NextLink href={href || "#"}>{text || "Click Me"}</NextLink>
      </ShadcnButton>
    </div>
  );
};
