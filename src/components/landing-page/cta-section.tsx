import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CtaSectionData } from "./types";

export function CtaSection({ headline, subheadline, cta, onUpdate }: CtaSectionData & { onUpdate: (d: Partial<CtaSectionData>) => void }) {
  return (
    <section className="py-24 md:py-32 bg-primary/10">
      <div className="container text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 
            className="text-3xl md:text-4xl font-bold font-headline text-primary-foreground"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ headline: e.currentTarget.textContent || "" })}
          >
            {headline || "Ready to Get Started?"}
          </h2>
          <p 
            className="text-lg text-muted-foreground"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ subheadline: e.currentTarget.textContent || "" })}
          >
            {subheadline || "Sign up today and start building your perfect landing page in minutes. No credit card required."}
          </p>
          <Button asChild size="lg">
            <Link href={cta?.href || "#"}>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdate({ cta: { ...cta, text: e.currentTarget.textContent || "" } })}
              >
                {cta?.text || "Create Your Page"}
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
