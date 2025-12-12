"use client";

import React, { useState } from "react";
import { useEditorStore } from "@/hooks/use-editor-store";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

type DropZoneProps = {
  parentId: string;
  index: number;
  orientation?: "horizontal" | "vertical";
};

/**
 * DropZone - אזור שחרור בין רכיבים
 * מאפשר גרירה של רכיבים קיימים או חדשים למיקום ספציפי
 */
export function DropZone({
  parentId,
  index,
  orientation = "vertical",
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const draggedId = useEditorStore((s) => s.draggedId);
  const addComponent = useEditorStore((s) => s.addComponent);
  const moveComponent = useEditorStore((s) => s.moveComponent);
  const getParentId = useEditorStore((s) => s.getParentId);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
    setIsExpanded(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if it's a new component from palette or existing component
    if (e.dataTransfer.types.includes("application/x-component-type") || draggedId) {
      e.dataTransfer.dropEffect = draggedId ? "move" : "copy";
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setIsExpanded(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setIsExpanded(false);

    // Handle new component from palette
    const componentType = e.dataTransfer.getData("application/x-component-type");
    if (componentType) {
      const newComponent = createComponentFromType(componentType);
      if (newComponent) {
        addComponent(parentId, newComponent, index);
      }
      return;
    }

    // Handle existing component being moved
    if (draggedId) {
      const draggedParentId = getParentId(draggedId);
      
      // Prevent dropping into itself
      if (draggedId === parentId) return;
      
      // Calculate the correct index
      let targetIndex = index;
      
      // If moving within the same parent, adjust index
      if (draggedParentId === parentId) {
        const pageJson = useEditorStore.getState().pageJson;
        const parent = findNodeById(pageJson, parentId);
        if (parent?.children) {
          const currentIndex = parent.children.findIndex(c => c.id === draggedId);
          if (currentIndex !== -1 && currentIndex < index) {
            targetIndex = index - 1;
          }
        }
      }
      
      moveComponent(draggedId, parentId, targetIndex);
    }
  };

  // Only show when dragging
  const isActive = draggedId || isDragOver;

  return (
    <div
      className={cn(
        "transition-all duration-200 ease-out",
        orientation === "vertical" ? "w-full" : "h-full",
        // Default state - thin line
        !isActive && "h-1 opacity-0 group-hover:opacity-100 group-hover:h-2",
        // Active/dragging state - expanded zone
        isActive && !isDragOver && (orientation === "vertical" ? "h-6" : "w-6"),
        // Drag over state - highlighted
        isDragOver && (orientation === "vertical" ? "h-16" : "w-16")
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={cn(
          "h-full w-full rounded-lg transition-all duration-200 flex items-center justify-center",
          // Default - subtle dashed line
          !isDragOver && isActive && "border-2 border-dashed border-blue-300 bg-blue-50/50",
          // Drag over - highlighted
          isDragOver && "border-2 border-solid border-blue-500 bg-blue-100"
        )}
      >
        {isDragOver && (
          <div className="flex items-center gap-2 text-blue-600">
            <Plus className="w-4 h-4" />
            <span className="text-xs font-medium">שחרר כאן</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Container Drop Zone - for dropping INTO a container
// ============================================================================

type ContainerDropZoneProps = {
  containerId: string;
  isEmpty?: boolean;
};

export function ContainerDropZone({
  containerId,
  isEmpty = false,
}: ContainerDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const draggedId = useEditorStore((s) => s.draggedId);
  const addComponent = useEditorStore((s) => s.addComponent);
  const moveComponent = useEditorStore((s) => s.moveComponent);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = draggedId ? "move" : "copy";
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set false if we're actually leaving the container
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const { clientX, clientY } = e;
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    // Handle new component from palette
    const componentType = e.dataTransfer.getData("application/x-component-type");
    if (componentType) {
      const newComponent = createComponentFromType(componentType);
      if (newComponent) {
        addComponent(containerId, newComponent);
      }
      return;
    }

    // Handle existing component being moved
    if (draggedId && draggedId !== containerId) {
      moveComponent(draggedId, containerId, 0);
    }
  };

  if (!isEmpty && !draggedId) return null;

  return (
    <div
      className={cn(
        "transition-all duration-200 rounded-lg",
        isEmpty ? "min-h-[80px] p-4" : "min-h-[40px] p-2",
        !isDragOver && "border-2 border-dashed border-slate-300 bg-slate-50/50",
        isDragOver && "border-2 border-solid border-blue-500 bg-blue-100"
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="h-full w-full flex flex-col items-center justify-center gap-2">
        {isEmpty && !isDragOver && (
          <>
            <div className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
              <Plus className="w-6 h-6 text-slate-400" />
            </div>
            <span className="text-sm text-slate-400 text-center">
              גרור רכיבים לכאן
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-600 text-center">
              או לחץ על כפתור + להוספה
            </span>
          </>
        )}
        {isDragOver && (
          <div className="flex flex-col items-center gap-2 text-blue-600">
            <div className="w-16 h-16 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center animate-pulse">
              <Plus className="w-8 h-8" />
            </div>
            <span className="text-sm font-semibold">שחרר כאן</span>
            <span className="text-xs text-blue-500">הוסף לקונטיינר</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function findNodeById(node: any, id: string): any {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
}

function createComponentFromType(type: string): any {
  const id = `${type.toLowerCase()}-${Date.now()}`;

  switch (type) {
    case "Container":
      return {
        id,
        type: "Container",
        props: {
          style: {
            padding: "32px",
            flexDirection: "column",
            gap: 16,
            background: "#f8fafc",
          },
        },
        children: [],
      };

    case "RichText":
      return {
        id,
        type: "RichText",
        props: {
          html: '<span style="font-size: 18px;">הקלד טקסט כאן...</span>',
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

    case "Hero":
      return {
        id,
        type: "Container",
        props: {
          style: {
            padding: "96px 32px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 24,
          },
        },
        children: [
          {
            id: `${id}-title`,
            type: "RichText",
            props: {
              html: '<span style="font-size: 48px; font-weight: 700; color: white;">כותרת ראשית</span>',
              align: "center",
            },
          },
          {
            id: `${id}-subtitle`,
            type: "RichText",
            props: {
              html: '<span style="font-size: 20px; color: rgba(255,255,255,0.9);">תת כותרת מרשימה שמסבירה את הערך</span>',
              align: "center",
            },
          },
          {
            id: `${id}-cta`,
            type: "Button",
            props: {
              text: "התחל עכשיו",
              href: "#",
              variant: "default",
              size: "lg",
            },
          },
        ],
      };

    case "Features":
      return {
        id,
        type: "Container",
        props: {
          style: {
            padding: "64px 32px",
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
          },
        },
        children: [
          {
            id: `${id}-title`,
            type: "RichText",
            props: {
              html: '<span style="font-size: 36px; font-weight: 700;">התכונות שלנו</span>',
              align: "center",
            },
          },
        ],
      };

    case "CTA":
      return {
        id,
        type: "Container",
        props: {
          style: {
            padding: "64px 32px",
            background: "#1a1a1a",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          },
        },
        children: [
          {
            id: `${id}-title`,
            type: "RichText",
            props: {
              html: '<span style="font-size: 32px; font-weight: 700; color: white;">מוכנים להתחיל?</span>',
              align: "center",
            },
          },
          {
            id: `${id}-button`,
            type: "Button",
            props: {
              text: "צור קשר",
              href: "#",
              variant: "default",
              size: "lg",
            },
          },
        ],
      };

    case "Carousel":
      return {
        id,
        type: "Carousel",
        props: {
          items: [
            { type: "image", src: "https://picsum.photos/seed/carousel1/800/450", alt: "Slide 1" },
            { type: "image", src: "https://picsum.photos/seed/carousel2/800/450", alt: "Slide 2" },
          ],
          autoplay: false,
          showDots: true,
          showArrows: true,
        },
      };

    case "ImageGallery":
      return {
        id,
        type: "ImageGallery",
        props: {
          images: [
            { src: "https://picsum.photos/seed/gallery1/400/400", alt: "Image 1" },
            { src: "https://picsum.photos/seed/gallery2/400/400", alt: "Image 2" },
          ],
          columns: 2,
          gap: 16,
        },
      };

    case "Card":
      return {
        id,
        type: "Card",
        props: {
          image: "https://picsum.photos/seed/card/600/400",
          title: "כותרת הכרטיס",
          description: "תיאור קצר של התוכן בכרטיס.",
          buttonText: "קרא עוד",
          buttonLink: "#",
        },
      };

    case "Spacer":
      return {
        id,
        type: "Spacer",
        props: {
          height: 48,
        },
      };

    case "Row":
      return {
        id,
        type: "Container",
        props: {
          style: {
            flexDirection: "row",
            gap: 24,
            alignItems: "stretch",
          },
        },
        children: [
          {
            id: `${id}-col-1`,
            type: "Container",
            props: {
              style: {
                flex: 1,
                padding: "16px",
                background: "#f8fafc",
              },
            },
            children: [],
          },
          {
            id: `${id}-col-2`,
            type: "Container",
            props: {
              style: {
                flex: 1,
                padding: "16px",
                background: "#f8fafc",
              },
            },
            children: [],
          },
        ],
      };

    case "Testimonials":
      return {
        id,
        type: "Container",
        props: {
          style: {
            padding: "64px 32px",
            background: "#f8fafc",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          },
        },
        children: [
          {
            id: `${id}-title`,
            type: "RichText",
            props: {
              html: '<span style="font-size: 36px; font-weight: 700;">מה הלקוחות אומרים</span>',
              align: "center",
            },
          },
        ],
      };

    case "Pricing":
      return {
        id,
        type: "Container",
        props: {
          style: {
            padding: "64px 32px",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          },
        },
        children: [
          {
            id: `${id}-title`,
            type: "RichText",
            props: {
              html: '<span style="font-size: 36px; font-weight: 700;">תוכניות מחירים</span>',
              align: "center",
            },
          },
        ],
      };

    case "FAQ":
      return {
        id,
        type: "Container",
        props: {
          style: {
            padding: "64px 32px",
            background: "#f8fafc",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          },
        },
        children: [
          {
            id: `${id}-title`,
            type: "RichText",
            props: {
              html: '<span style="font-size: 36px; font-weight: 700;">שאלות נפוצות</span>',
              align: "center",
            },
          },
        ],
      };

    case "ImageCarouselSection":
      return {
        id,
        type: "ImageCarouselSection",
        props: {
          headline: "גלריית תמונות",
          description: "",
          images: [
            { src: "https://picsum.photos/seed/carousel1/800/450", alt: "תמונה 1", caption: "" },
            { src: "https://picsum.photos/seed/carousel2/800/450", alt: "תמונה 2", caption: "" },
            { src: "https://picsum.photos/seed/carousel3/800/450", alt: "תמונה 3", caption: "" },
          ],
          backgroundColor: "#0A1628",
          headlineColor: "#FFFFFF",
          underlineColor: "#00D4AA",
          accentColor: "#00D4AA",
          showDots: true,
          showArrows: true,
          showCounter: true,
          aspectRatio: "16:9",
          imageObjectFit: "contain",
          autoplay: false,
        },
      };

    case "ImageText":
      return {
        id,
        type: "ImageText",
        props: {
          imageSrc: "https://picsum.photos/seed/imagetext/600/400",
          imageAlt: "תמונה",
          text: '<p style="font-size: 18px; line-height: 1.7;">הוסף כאן טקסט שיופיע לצד התמונה.</p>',
          imagePosition: "right",
          imageWidth: 50,
          gap: 32,
          alignment: "center",
        },
      };

    case "Accordion":
      return {
        id,
        type: "Accordion",
        props: {
          items: [
            { title: "שאלה ראשונה?", content: "תשובה לשאלה הראשונה." },
            { title: "שאלה שנייה?", content: "תשובה לשאלה השנייה." },
          ],
          allowMultiple: false,
        },
      };

    default:
      return null;
  }
}
