import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { TestimonialsSectionData } from "./types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function TestimonialsSection({
  headline,
  testimonials,
  onUpdate,
}: TestimonialsSectionData & { onUpdate: (d: Partial<TestimonialsSectionData>) => void }) {
    const defaultTestimonials = [
    { quote: "This is a game-changer! Highly recommended.", author: "Jane Doe", role: "CEO, Example Inc.", avatar: { src: PlaceHolderImages.find(p=>p.id==='avatar-1')?.imageUrl || "https://picsum.photos/seed/avatar1/100/100", alt: "Jane Doe" } },
    { quote: "Absolutely love it. The best tool I've ever used.", author: "John Smith", role: "Developer, Tech Co.", avatar: { src: PlaceHolderImages.find(p=>p.id==='avatar-2')?.imageUrl || "https://picsum.photos/seed/avatar2/100/100", alt: "John Smith" } },
    { quote: "Incredible results and so easy to use.", author: "Sam Wilson", role: "Designer, Creative Studio", avatar: { src: PlaceHolderImages.find(p=>p.id==='avatar-3')?.imageUrl || "https://picsum.photos/seed/avatar3/100/100", alt: "Sam Wilson" } },
  ];
  
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  const handleTestimonialUpdate = (index: number, field: 'quote' | 'author' | 'role', value: string) => {
    const updatedTestimonials = [...displayTestimonials];
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
    onUpdate({ testimonials: updatedTestimonials });
  }

  return (
    <section className="py-24 md:py-32 bg-secondary">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold font-headline"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ headline: e.currentTarget.textContent || "" })}
          >
            {headline || "What Our Customers Say"}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <blockquote 
                  className="text-lg mb-4 flex-1"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleTestimonialUpdate(index, 'quote', e.currentTarget.textContent || "")}
                >
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar?.src || `https://picsum.photos/seed/avatar${index+1}/100/100`}
                      alt={testimonial.avatar?.alt || testimonial.author}
                      fill
                      className="object-cover"
                      data-ai-hint="person portrait"
                    />
                  </div>
                  <div>
                    <p 
                      className="font-semibold"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleTestimonialUpdate(index, 'author', e.currentTarget.textContent || "")}
                    >
                      {testimonial.author}
                    </p>
                    <p 
                      className="text-sm text-muted-foreground"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleTestimonialUpdate(index, 'role', e.currentTarget.textContent || "")}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
