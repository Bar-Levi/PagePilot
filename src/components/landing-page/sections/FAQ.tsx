"use client";

import React from "react";
import type { FAQProps } from "../types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQSectionProps = FAQProps & {
  id?: string;
  onClick?: () => void;
};

export function FAQSection({
  headline = "שאלות נפוצות",
  questions,
  id,
  onClick,
}: FAQSectionProps) {
  return (
    <section
      className="px-8 py-24 bg-slate-50"
      data-component-id={id}
      data-component-type="FAQ"
      onClick={onClick}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            {headline}
          </h2>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {questions.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-right text-lg font-medium text-slate-900 hover:text-primary">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

