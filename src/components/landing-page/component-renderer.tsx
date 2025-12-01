"use client";

import { Section } from "./types";
import { HeroSection } from "./hero-section";
import { TestimonialsSection } from "./testimonials-section";
import { FaqSection } from "./faq-section";
import { PricingSection } from "./pricing-section";
import { CtaSection } from "./cta-section";
import { VideoSection } from "./video-section";
import { TextImageSection } from "./text-image-section";

const componentMap: { [key: string]: React.ComponentType<any> } = {
  hero: HeroSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  pricing: PricingSection,
  cta: CtaSection,
  video: VideoSection,
  "text-image": TextImageSection,
};

type ComponentRendererProps = {
  sections: Section[];
  onUpdate: (sections: Section[]) => void;
};

export function ComponentRenderer({ sections, onUpdate }: ComponentRendererProps) {
  if (!sections || !Array.isArray(sections)) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">No page sections found.</p>
      </div>
    );
  }

  const handleSectionUpdate = (index: number, newProps: Partial<Section>) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], ...newProps };
    onUpdate(updatedSections);
  };

  return (
    <>
      {sections.map((section, index) => {
        const Component = componentMap[section.type];
        if (!Component) {
          console.warn(
            `Component of type "${section.type}" not found.`,
            section
          );
          return (
            <div key={index} className="py-12 bg-destructive/10 text-center">
              <p className="text-destructive font-semibold">
                Error: Component type "{section.type}" is not supported.
              </p>
            </div>
          );
        }
        return <Component key={index} {...section} onUpdate={(newProps: Partial<Section>) => handleSectionUpdate(index, newProps)} />;
      })}
    </>
  );
}
