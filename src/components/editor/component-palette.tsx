"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Type,
  Square,
  Image,
  Video,
  MousePointer,
  Minus,
  Layout,
  Star,
  MessageSquare,
  CreditCard,
  HelpCircle,
  Megaphone,
  Layers,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type ComponentItem = {
  type: string;
  label: string;
  icon: React.ReactNode;
  category: "basic" | "section";
};

const components: ComponentItem[] = [
  // Basic Components
  { type: "RichText", label: "טקסט", icon: <Type className="w-5 h-5" />, category: "basic" },
  { type: "Button", label: "כפתור", icon: <MousePointer className="w-5 h-5" />, category: "basic" },
  { type: "Image", label: "תמונה", icon: <Image className="w-5 h-5" />, category: "basic" },
  { type: "Video", label: "וידאו", icon: <Video className="w-5 h-5" />, category: "basic" },
  { type: "Container", label: "מיכל", icon: <Square className="w-5 h-5" />, category: "basic" },
  { type: "Divider", label: "קו מפריד", icon: <Minus className="w-5 h-5" />, category: "basic" },

  // Section Templates
  { type: "Hero", label: "Hero", icon: <Layout className="w-5 h-5" />, category: "section" },
  { type: "Features", label: "תכונות", icon: <Star className="w-5 h-5" />, category: "section" },
  { type: "Testimonials", label: "המלצות", icon: <MessageSquare className="w-5 h-5" />, category: "section" },
  { type: "Pricing", label: "מחירון", icon: <CreditCard className="w-5 h-5" />, category: "section" },
  { type: "FAQ", label: "שאלות נפוצות", icon: <HelpCircle className="w-5 h-5" />, category: "section" },
  { type: "CTA", label: "קריאה לפעולה", icon: <Megaphone className="w-5 h-5" />, category: "section" },
];

export function ComponentPalette() {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("application/x-component-type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const basicComponents = components.filter((c) => c.category === "basic");
  const sectionComponents = components.filter((c) => c.category === "section");

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Layers className="w-5 h-5" />
          <h2 className="font-semibold">רכיבים</h2>
        </div>

        {/* Basic Components */}
        <div>
          <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            רכיבים בסיסיים
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {basicComponents.map((component) => (
              <ComponentCard
                key={component.type}
                component={component}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>

        {/* Section Templates */}
        <div>
          <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            תבניות סקשנים
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {sectionComponents.map((component) => (
              <ComponentCard
                key={component.type}
                component={component}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 גרור רכיב לקנבס להוספה, או לחץ פעמיים על רכיב קיים לעריכה
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}

// ============================================================================
// Component Card
// ============================================================================

function ComponentCard({
  component,
  onDragStart,
}: {
  component: ComponentItem;
  onDragStart: (e: React.DragEvent, type: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, component.type)}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-3",
        "bg-slate-50 dark:bg-slate-700/50 rounded-lg",
        "border border-slate-200 dark:border-slate-600",
        "cursor-grab active:cursor-grabbing",
        "hover:bg-slate-100 dark:hover:bg-slate-700",
        "hover:border-blue-300 dark:hover:border-blue-500",
        "transition-all duration-150",
        "select-none"
      )}
    >
      <div className="text-slate-600 dark:text-slate-300">{component.icon}</div>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {component.label}
      </span>
    </div>
  );
}
