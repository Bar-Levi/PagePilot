"use client";

import React, { useState } from "react";
import { useEditorStore } from "@/hooks/use-editor-store";
import type { RelativePosition } from "@/lib/json-utils";
import type { PageComponent } from "@/components/landing-page/types";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Type,
  Image,
  Square,
  MousePointer,
  Minus,
  Video,
  LayoutGrid,
  CreditCard,
  Heading,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type ComponentTypeOption = {
  type: PageComponent["type"];
  label: string;
  icon: React.ReactNode;
  category: "basic" | "media" | "layout";
};

type AddComponentMenuProps = {
  targetId: string;
  className?: string;
};

// ============================================================================
// Component Options
// ============================================================================

const componentOptions: ComponentTypeOption[] = [
  // Basic
  { type: "RichText", label: "טקסט", icon: <Type className="w-4 h-4" />, category: "basic" },
  { type: "Heading", label: "כותרת", icon: <Heading className="w-4 h-4" />, category: "basic" },
  { type: "Button", label: "כפתור", icon: <MousePointer className="w-4 h-4" />, category: "basic" },
  { type: "Divider", label: "קו מפריד", icon: <Minus className="w-4 h-4" />, category: "basic" },
  
  // Media
  { type: "Image", label: "תמונה", icon: <Image className="w-4 h-4" />, category: "media" },
  { type: "Video", label: "וידאו", icon: <Video className="w-4 h-4" />, category: "media" },
  
  // Layout
  { type: "Container", label: "קונטיינר", icon: <Square className="w-4 h-4" />, category: "layout" },
  { type: "Card", label: "כרטיס", icon: <CreditCard className="w-4 h-4" />, category: "layout" },
];

// ============================================================================
// Position Options
// ============================================================================

type PositionOption = {
  position: RelativePosition;
  label: string;
  icon: React.ReactNode;
  description: string;
};

const positionOptions: PositionOption[] = [
  { position: "above", label: "למעלה", icon: <ArrowUp className="w-4 h-4" />, description: "הוסף מעל רכיב זה" },
  { position: "below", label: "למטה", icon: <ArrowDown className="w-4 h-4" />, description: "הוסף מתחת לרכיב זה" },
  { position: "left", label: "שמאל", icon: <ArrowLeft className="w-4 h-4" />, description: "הוסף משמאל (יהפוך לשורה)" },
  { position: "right", label: "ימין", icon: <ArrowRight className="w-4 h-4" />, description: "הוסף מימין (יהפוך לשורה)" },
];

// ============================================================================
// Component Factory
// ============================================================================

function createComponentByType(type: PageComponent["type"]): PageComponent {
  const id = `${type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  switch (type) {
    case "Container":
      return {
        id,
        type: "Container",
        props: {
          layout: "column",
          style: {
            padding: "24px",
            gap: 16,
            flexDirection: "column",
            background: "#f8fafc",
            radius: "8px",
          },
        },
        children: [],
      };

    case "RichText":
      return {
        id,
        type: "RichText",
        props: {
          html: '<span style="font-size: 16px;">טקסט חדש - לחץ פעמיים לעריכה</span>',
          align: "right",
        },
      };

    case "Heading":
      return {
        id,
        type: "RichText",
        props: {
          html: '<span style="font-size: 28px; font-weight: 700;">כותרת חדשה</span>',
          align: "right",
        },
      };

    case "Button":
      return {
        id,
        type: "Button",
        props: {
          text: "כפתור חדש",
          href: "#",
          variant: "default",
          size: "default",
        },
      };

    case "Image":
      return {
        id,
        type: "Image",
        props: {
          src: "https://picsum.photos/seed/new/600/400",
          alt: "תמונה חדשה",
          alignment: "center",
        },
      };

    case "Video":
      return {
        id,
        type: "Video",
        props: {
          youtubeId: "dQw4w9WgXcQ",
          ratio: "16:9",
          alignment: "center",
        },
      };

    case "Divider":
      return {
        id,
        type: "Divider",
        props: {
          thickness: 1,
          color: "#e2e8f0",
          spacing: 24,
        },
      };

    case "Card":
      return {
        id,
        type: "Card",
        props: {
          title: "כותרת כרטיס",
          description: "תיאור קצר של התוכן",
          buttonText: "קרא עוד",
          buttonLink: "#",
          shadow: "md",
        },
      };

    default:
      return {
        id,
        type: "RichText",
        props: {
          html: '<span>תוכן חדש</span>',
        },
      };
  }
}

// ============================================================================
// Main Component
// ============================================================================

export function AddComponentMenu({ targetId, className }: AddComponentMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"position" | "type">("position");
  const [selectedPosition, setSelectedPosition] = useState<RelativePosition | null>(null);

  const addComponentRelativeTo = useEditorStore((s) => s.addComponentRelativeTo);

  const handlePositionSelect = (position: RelativePosition) => {
    setSelectedPosition(position);
    setStep("type");
  };

  const handleTypeSelect = (type: PageComponent["type"]) => {
    if (!selectedPosition) return;

    const newComponent = createComponentByType(type);
    addComponentRelativeTo(targetId, selectedPosition, newComponent);

    // Reset and close
    setIsOpen(false);
    setStep("position");
    setSelectedPosition(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setStep("position");
      setSelectedPosition(null);
    }
  };

  return (
    <TooltipProvider>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-7 w-7", className)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">הוסף רכיב יחסית לרכיב זה</p>
            </TooltipContent>
          </Tooltip>
        </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        {step === "position" && (
          <div className="p-2">
            <p className="text-xs font-medium text-slate-500 mb-2 px-2">
              בחר מיקום להוספה:
            </p>
            <div className="grid grid-cols-2 gap-1">
              {positionOptions.map((option) => (
                <Tooltip key={option.position}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handlePositionSelect(option.position)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg text-sm",
                        "hover:bg-slate-100 dark:hover:bg-slate-800",
                        "transition-colors text-right w-full"
                      )}
                    >
                      <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-700">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{option.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2 px-2">
              💡 שמאל/ימין יהפכו את הקונטיינר לשורה
            </p>
          </div>
        )}

        {step === "type" && (
          <div className="p-2">
            <div className="flex items-center gap-2 mb-2 px-2">
              <button
                onClick={() => setStep("position")}
                className="text-xs text-blue-500 hover:underline"
              >
                ← חזור
              </button>
              <span className="text-xs text-slate-500">
                הוסף {positionOptions.find((p) => p.position === selectedPosition)?.label}
              </span>
            </div>

            {/* Basic Components */}
            <div className="mb-2">
              <p className="text-xs font-medium text-slate-400 px-2 mb-1">בסיסי</p>
              <div className="grid grid-cols-2 gap-1">
                {componentOptions
                  .filter((c) => c.category === "basic")
                  .map((option) => (
                    <button
                      key={option.type}
                      onClick={() => handleTypeSelect(option.type)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg text-sm",
                        "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                        "transition-colors text-right"
                      )}
                    >
                      <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                        {option.icon}
                      </div>
                      <span>{option.label}</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Media Components */}
            <div className="mb-2">
              <p className="text-xs font-medium text-slate-400 px-2 mb-1">מדיה</p>
              <div className="grid grid-cols-2 gap-1">
                {componentOptions
                  .filter((c) => c.category === "media")
                  .map((option) => (
                    <button
                      key={option.type}
                      onClick={() => handleTypeSelect(option.type)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg text-sm",
                        "hover:bg-green-50 dark:hover:bg-green-900/20",
                        "transition-colors text-right"
                      )}
                    >
                      <div className="p-1.5 rounded bg-green-100 dark:bg-green-900/30 text-green-600">
                        {option.icon}
                      </div>
                      <span>{option.label}</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Layout Components */}
            <div>
              <p className="text-xs font-medium text-slate-400 px-2 mb-1">מבנה</p>
              <div className="grid grid-cols-2 gap-1">
                {componentOptions
                  .filter((c) => c.category === "layout")
                  .map((option) => (
                    <button
                      key={option.type}
                      onClick={() => handleTypeSelect(option.type)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg text-sm",
                        "hover:bg-purple-50 dark:hover:bg-purple-900/20",
                        "transition-colors text-right"
                      )}
                    >
                      <div className="p-1.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                        {option.icon}
                      </div>
                      <span>{option.label}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
    </TooltipProvider>
  );
}

// ============================================================================
// Quick Add Buttons - for showing inline add buttons
// ============================================================================

type QuickAddButtonProps = {
  targetId: string;
  position: RelativePosition;
  className?: string;
};

export function QuickAddButton({ targetId, position, className }: QuickAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const addComponentRelativeTo = useEditorStore((s) => s.addComponentRelativeTo);

  const handleTypeSelect = (type: PageComponent["type"]) => {
    const newComponent = createComponentByType(type);
    addComponentRelativeTo(targetId, position, newComponent);
    setIsOpen(false);
  };

  const positionIcon = {
    above: <ArrowUp className="w-3 h-3" />,
    below: <ArrowDown className="w-3 h-3" />,
    left: <ArrowLeft className="w-3 h-3" />,
    right: <ArrowRight className="w-3 h-3" />,
  }[position];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-center",
            "w-6 h-6 rounded-full",
            "bg-blue-500 text-white",
            "hover:bg-blue-600 transition-colors",
            "shadow-md",
            className
          )}
          title={`הוסף ${position === "above" ? "למעלה" : position === "below" ? "למטה" : position === "left" ? "משמאל" : "מימין"}`}
        >
          <Plus className="w-3 h-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="center">
        <div className="grid grid-cols-2 gap-1">
          {componentOptions.slice(0, 6).map((option) => (
            <button
              key={option.type}
              onClick={() => handleTypeSelect(option.type)}
              className={cn(
                "flex items-center gap-2 p-2 rounded text-xs",
                "hover:bg-slate-100 dark:hover:bg-slate-800",
                "transition-colors"
              )}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

