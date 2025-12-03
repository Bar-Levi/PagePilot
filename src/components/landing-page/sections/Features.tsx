"use client";

import React from "react";
import type { FeaturesProps } from "../types";
import { cn } from "@/lib/utils";
import { Star, Zap, Shield, Heart, Target, Sparkles } from "lucide-react";

type FeaturesSectionProps = FeaturesProps & {
  id?: string;
  onClick?: () => void;
};

// Map of icon names to components
const iconMap: Record<string, React.ReactNode> = {
  star: <Star className="w-8 h-8" />,
  zap: <Zap className="w-8 h-8" />,
  shield: <Shield className="w-8 h-8" />,
  heart: <Heart className="w-8 h-8" />,
  target: <Target className="w-8 h-8" />,
  sparkles: <Sparkles className="w-8 h-8" />,
};

export function FeaturesSection({
  headline = "התכונות שלנו",
  subheadline,
  features,
  columns = 3,
  id,
  onClick,
}: FeaturesSectionProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <section
      className="px-8 py-24 bg-white"
      data-component-id={id}
      data-component-type="Features"
      onClick={onClick}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {headline}
          </h2>
          {subheadline && (
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {subheadline}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className={cn("grid gap-8", gridCols)}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                {feature.icon && iconMap[feature.icon]
                  ? iconMap[feature.icon]
                  : <Star className="w-8 h-8" />}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

