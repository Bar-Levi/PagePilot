"use client";

import React from "react";
import type { TestimonialsProps } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

type TestimonialsSectionProps = TestimonialsProps & {
  id?: string;
  onClick?: () => void;
};

export function TestimonialsSection({
  headline = "מה הלקוחות אומרים",
  testimonials,
  id,
  onClick,
}: TestimonialsSectionProps) {
  return (
    <section
      className="px-8 py-24 bg-slate-50"
      data-component-id={id}
      data-component-type="Testimonials"
      onClick={onClick}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            {headline}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              
              <p className="text-slate-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>
                    {testimonial.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-900">
                    {testimonial.author}
                  </p>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-sm text-slate-500">
                      {testimonial.role}
                      {testimonial.role && testimonial.company && " · "}
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

