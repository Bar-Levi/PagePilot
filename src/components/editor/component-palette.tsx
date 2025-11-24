import {
  Heading1,
  GalleryVertical,
  MessageSquareQuote,
  List,
  CircleDollarSign,
  Youtube,
  Hand,
  Type,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const components = [
  { name: "Hero", icon: GalleryVertical },
  { name: "Text + Image", icon: Type },
  { name: "Testimonials", icon: MessageSquareQuote },
  { name: "FAQ", icon: List },
  { name: "Pricing", icon: CircleDollarSign },
  { name: "Video", icon: Youtube },
  { name: "CTA", icon: Hand },
];

export function ComponentPalette() {
  return (
    <div className="p-4">
      <h3 className="mb-4 text-md font-medium">Components</h3>
      <div className="grid grid-cols-2 gap-3">
        {components.map((comp) => (
          <Card
            key={comp.name}
            className="group cursor-grab hover:bg-primary/10 hover:border-primary transition-colors"
          >
            <CardContent className="flex flex-col items-center justify-center p-4 aspect-square">
              <comp.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="mt-2 text-sm text-center font-medium">
                {comp.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
       <p className="text-xs text-muted-foreground text-center mt-4">Drag-and-drop coming soon!</p>
    </div>
  );
}
