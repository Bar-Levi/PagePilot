"use client";

import React from "react";
import type { CTAProps } from "../types";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";

type CTASectionProps = CTAProps & {
  id?: string;
  onClick?: () => void;
};

export function CTASection({
  headline,
  subheadline,
  buttonText,
  buttonLink,
  backgroundColor = "#1a1a1a",
  id,
  onClick,
}: CTASectionProps) {
  return (
    <section
      className="px-8 py-24"
      style={{ backgroundColor }}
      data-component-id={id}
      data-component-type="CTA"
      onClick={onClick}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {headline}
        </h2>
        
        {subheadline && (
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {subheadline}
          </p>
        )}

        <Button size="lg" variant="secondary" asChild>
          <NextLink href={buttonLink}>
            {buttonText}
          </NextLink>
        </Button>
      </div>
    </section>
  );
}

