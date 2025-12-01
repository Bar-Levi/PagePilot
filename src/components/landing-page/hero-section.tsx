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
  onUpdate,
  ...props
}: HeroSectionData & { onUpdate: (d: Partial<HeroSectionData>) => void }) {
  const placeholderImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const imageUrl = image?.src || placeholderImage?.imageUrl || "https://picsum.photos/seed/hero-placeholder/1200/800";
  const imageAlt = image?.alt || "Hero image";

  const handleImageClick = () => {
    const newSrc = window.prompt("Enter new image URL:", imageUrl);
    if (newSrc) {
      onUpdate({ ...props, headline, subheadline, cta, image: { ...image, src: newSrc } });
    }
  };

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh]">
      <div className="absolute inset-0 cursor-pointer group" onClick={handleImageClick}>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          data-ai-hint="background texture"
          priority
        />
        <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center">
            <span className="text-white bg-black/50 rounded-md px-3 py-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Click to edit image
            </span>
        </div>
      </div>
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
          <Link href={cta?.href || "#"}>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ cta: { ...cta, text: e.currentTarget.textContent || "" }})}
            >
                {cta?.text || "Get Started"}
            </span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
