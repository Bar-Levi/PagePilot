"use client";

import React from "react";
import type { PricingProps } from "../types";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

type PricingSectionProps = PricingProps & {
  id?: string;
  onClick?: () => void;
};

export function PricingSection({
  headline = "תוכניות מחירים",
  subheadline,
  plans,
  id,
  onClick,
}: PricingSectionProps) {
  return (
    <section
      className="px-8 py-24 bg-white"
      data-component-id={id}
      data-component-type="Pricing"
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

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "rounded-2xl p-8 transition-all",
                plan.highlighted
                  ? "bg-primary text-white shadow-xl scale-105"
                  : "bg-slate-50 hover:bg-slate-100"
              )}
            >
              {/* Plan Name */}
              <h3 className={cn(
                "text-xl font-semibold mb-2",
                plan.highlighted ? "text-white" : "text-slate-900"
              )}>
                {plan.name}
              </h3>

              {/* Description */}
              {plan.description && (
                <p className={cn(
                  "text-sm mb-4",
                  plan.highlighted ? "text-white/80" : "text-slate-600"
                )}>
                  {plan.description}
                </p>
              )}

              {/* Price */}
              <div className="mb-6">
                <span className={cn(
                  "text-4xl font-bold",
                  plan.highlighted ? "text-white" : "text-slate-900"
                )}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={cn(
                    "text-sm mr-1",
                    plan.highlighted ? "text-white/70" : "text-slate-500"
                  )}>
                    /{plan.period}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <Check className={cn(
                      "w-5 h-5 shrink-0",
                      plan.highlighted ? "text-white" : "text-primary"
                    )} />
                    <span className={cn(
                      "text-sm",
                      plan.highlighted ? "text-white/90" : "text-slate-700"
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Button
                variant={plan.highlighted ? "secondary" : "default"}
                className="w-full"
                asChild
              >
                <NextLink href={plan.buttonLink || "#"}>
                  {plan.buttonText || "בחר תוכנית"}
                </NextLink>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

