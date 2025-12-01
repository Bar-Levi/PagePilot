import Image from "next/image";
import { cn } from "@/lib/utils";
import type { TextImageSectionData } from "./types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function TextImageSection({
  headline,
  text,
  image,
  imagePosition = "right",
}: TextImageSectionData) {
  const placeholderImage = PlaceHolderImages.find(p => p.id === 'feature-1');
  const imageUrl = image?.src || placeholderImage?.imageUrl || "https://picsum.photos/seed/text-image-placeholder/600/400";
  const imageAlt = image?.alt || "Feature image";
  
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <div
          className={cn(
            "grid md:grid-cols-2 gap-12 md:gap-16 items-center"
          )}
        >
          <div
            className={cn(
              "space-y-4",
              imagePosition === "left" && "md:order-last"
            )}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              {headline || "Feature Headline"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {text || "Describe the feature or benefit in detail here. Explain how it helps the user and what makes it special."}
            </p>
          </div>
          <div className="aspect-video relative overflow-hidden rounded-lg shadow-lg">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              data-ai-hint="product feature"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
