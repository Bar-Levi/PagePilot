import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HeroSectionData } from "./types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function HeroSection({
  headline,
  subheadline,
  cta,
  image,
  onUpdate
}: HeroSectionData & { onUpdate: (d: Partial<HeroSectionData>) => void }) {
  const placeholderImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const imageUrl = image?.src || placeholderImage?.imageUrl || "https://picsum.photos/seed/hero-placeholder/1200/800";
  const imageAlt = image?.alt || "Hero image";

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh]">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover"
        data-ai-hint="background texture"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="relative container h-full flex flex-col items-center justify-center text-center text-white space-y-6">
        <h1 
          className="text-4xl md:text-6xl font-extrabold tracking-tighter font-headline"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate({ headline: e.currentTarget.textContent || "" })}
        >
          {headline || "Your Compelling Headline Here"}
        </h1>
        <p 
          className="max-w-3xl text-lg md:text-xl text-white/90"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate({ subheadline: e.currentTarget.textContent || "" })}
        >
          {subheadline ||
            "This is a catchy subheadline that explains your value proposition."}
        </p>
        <Button asChild size="lg">
          <Link href={cta?.href || "#"}>{cta?.text || "Get Started"}</Link>
        </Button>
      </div>
    </section>
  );
}
