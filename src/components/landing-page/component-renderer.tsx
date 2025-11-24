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

export function ComponentRenderer({ sections }: { sections: Section[] }) {
  if (!sections || !Array.isArray(sections)) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">No page sections found.</p>
      </div>
    );
  }

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
        return <Component key={index} {...section} />;
      })}
    </>
  );
}
