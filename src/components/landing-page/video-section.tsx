import { PlayCircle } from "lucide-react";
import type { VideoSectionData } from "./types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function VideoSection({ headline, youtubeId, onUpdate }: VideoSectionData & { onUpdate: (d: Partial<VideoSectionData>) => void }) {
  const videoSrc = `https://www.youtube.com/embed/${youtubeId || 'dQw4w9WgXcQ'}`;
  const placeholderImage = PlaceHolderImages.find(p => p.id === 'video-placeholder');

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold font-headline"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ headline: e.currentTarget.textContent || "" })}
          >
            {headline || "See It in Action"}
          </h2>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video relative rounded-lg shadow-2xl overflow-hidden border">
             <iframe
                className="absolute inset-0 w-full h-full"
                src={videoSrc}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
