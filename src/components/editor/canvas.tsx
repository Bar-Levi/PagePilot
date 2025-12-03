"use client";

import React, { useEffect } from "react";
import { useEditorStore } from "@/hooks/use-editor-store";
import { renderPage } from "./render-node";
import { MultiSelectBar } from "./multi-select-bar";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

export function Canvas() {
  const pageJson = useEditorStore((s) => s.pageJson);
  const deselect = useEditorStore((s) => s.deselect);
  const draggedId = useEditorStore((s) => s.draggedId);
  const addComponent = useEditorStore((s) => s.addComponent);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const devicePreview = useEditorStore((s) => s.devicePreview);

  // Device widths
  const deviceWidths = {
    desktop: '100%',
    laptop: '1440px',
    tablet: '768px',
    mobile: '375px',
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on canvas background
    if (e.target === e.currentTarget) {
      const clearSelection = useEditorStore.getState().clearSelection;
      const selectedIds = useEditorStore.getState().selectedIds;
      
      // Clear multi-select if active, otherwise single deselect
      if (selectedIds.length > 1) {
        clearSelection();
      } else {
        deselect();
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Allow dropping new components from palette
    if (e.dataTransfer.types.includes("application/x-component-type")) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const componentType = e.dataTransfer.getData("application/x-component-type");
    if (componentType) {
      // Create new component from palette
      const newComponent = createComponentFromType(componentType);
      if (newComponent) {
        // Add to root page
        addComponent("page-root", newComponent);
      }
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Get current state
      const state = useEditorStore.getState();
      const { selectedId, editingId, undo, redo, duplicateComponent, deleteComponent, copyComponent, pasteComponent } = state;
      
      // Don't trigger shortcuts when editing text
      if (editingId) return;
      
      // Check if Cmd (Mac) or Ctrl (Windows/Linux)
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      // Undo: Cmd/Ctrl + Z (without Shift)
      if (cmdOrCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      
      // Redo: Cmd/Ctrl + Shift + Z
      if (cmdOrCtrl && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
        return;
      }
      
      // Duplicate: Cmd/Ctrl + D
      if (cmdOrCtrl && e.key === 'd') {
        e.preventDefault();
        if (selectedId) {
          duplicateComponent(selectedId);
        }
        return;
      }
      
      // Copy: Cmd/Ctrl + C
      if (cmdOrCtrl && e.key === 'c') {
        e.preventDefault();
        if (selectedId && copyComponent) {
          copyComponent(selectedId);
        }
        return;
      }
      
      // Paste: Cmd/Ctrl + V
      if (cmdOrCtrl && e.key === 'v') {
        e.preventDefault();
        if (pasteComponent) {
          pasteComponent(selectedId || undefined);
        }
        return;
      }
      
      // Delete: Delete or Backspace key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (selectedId) {
          deleteComponent(selectedId);
        }
        return;
      }
    };
    
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={cn(
        "min-h-full p-8",
        "bg-gradient-to-br from-slate-100 via-slate-50 to-white",
        "dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      )}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Page Content - Responsive Viewport */}
      <div
        style={{
          width: deviceWidths[devicePreview],
          maxWidth: devicePreview === 'desktop' ? '1920px' : undefined,
          margin: '0 auto',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="relative bg-white dark:bg-slate-800 shadow-xl rounded-lg overflow-hidden">
          {renderPage(pageJson)}
        </div>
        
        {/* Device Width Indicator */}
        {devicePreview !== 'desktop' && (
          <div className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400">
            {deviceWidths[devicePreview]} viewport
          </div>
        )}
      </div>

      {/* Drop Zone Indicator (when dragging from palette) */}
      {draggedId === null && selectedIds.length < 2 && (
        <div className="mt-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center text-slate-500 dark:text-slate-400">
          <p>גרור רכיבים מהפאנל השמאלי להוספה</p>
        </div>
      )}

      {/* Multi-select Help Message */}
      {selectedIds.length >= 2 && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {selectedIds.length} רכיבים נבחרו • לחץ על "הוסף למיכל" למטה או לחץ על ESC לביטול
            </p>
          </div>
        </div>
      )}

      {/* Multi-select Action Bar */}
      <MultiSelectBar />
    </div>
  );
}

// ============================================================================
// Helper: Create component from type
// ============================================================================

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
          {
            id: `${id}-grid`,
            type: "Container",
            props: {
              style: {
                flexDirection: "row",
                gap: 32,
                justifyContent: "center",
              },
            },
            children: [
              {
                id: `${id}-feature-1`,
                type: "Container",
                props: {
                  style: {
                    padding: "24px",
                    background: "#f8fafc",
                    radius: "12px",
                    flexDirection: "column",
                    gap: 12,
                    maxWidth: "300px",
                  },
                },
                children: [
                  {
                    id: `${id}-feature-1-title`,
                    type: "RichText",
                    props: {
                      html: '<span style="font-size: 20px; font-weight: 600;">תכונה 1</span>',
                      align: "center",
                    },
                  },
                  {
                    id: `${id}-feature-1-desc`,
                    type: "RichText",
                    props: {
                      html: '<span style="font-size: 16px; color: #64748b;">תיאור קצר של התכונה</span>',
                      align: "center",
                    },
                  },
                ],
              },
            ],
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

    // New Components
    case "Carousel":
      return {
        id,
        type: "Carousel",
        props: {
          items: [
            { type: "image", src: "https://picsum.photos/seed/carousel1/800/450", alt: "Slide 1" },
            { type: "image", src: "https://picsum.photos/seed/carousel2/800/450", alt: "Slide 2" },
            { type: "image", src: "https://picsum.photos/seed/carousel3/800/450", alt: "Slide 3" },
          ],
          autoplay: false,
          showDots: true,
          showArrows: true,
          animation: "slide",
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
            { src: "https://picsum.photos/seed/gallery3/400/400", alt: "Image 3" },
            { src: "https://picsum.photos/seed/gallery4/400/400", alt: "Image 4" },
          ],
          columns: 2,
          gap: 16,
          lightbox: true,
          aspectRatio: "square",
        },
      };

    case "Card":
      return {
        id,
        type: "Card",
        props: {
          image: "https://picsum.photos/seed/card/600/400",
          imageAlt: "Card image",
          title: "כותרת הכרטיס",
          description: "תיאור קצר של התוכן בכרטיס. אפשר להוסיף כאן מידע נוסף.",
          buttonText: "קרא עוד",
          buttonLink: "#",
          shadow: "md",
          hover: true,
        },
      };

    case "Spacer":
      return {
        id,
        type: "Spacer",
        props: {
          height: 48,
          showLine: false,
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
          {
            id: `${id}-grid`,
            type: "Container",
            props: {
              style: {
                flexDirection: "row",
                gap: 24,
                justifyContent: "center",
              },
            },
            children: [
              {
                id: `${id}-testimonial-1`,
                type: "Container",
                props: {
                  style: {
                    padding: "24px",
                    background: "white",
                    radius: "12px",
                    flexDirection: "column",
                    gap: 12,
                    maxWidth: "350px",
                  },
                },
                children: [
                  {
                    id: `${id}-testimonial-1-text`,
                    type: "RichText",
                    props: {
                      html: '<span style="font-size: 16px; color: #64748b; font-style: italic;">"שירות מעולה! ממליץ בחום לכל מי שמחפש פתרון איכותי."</span>',
                      align: "center",
                    },
                  },
                  {
                    id: `${id}-testimonial-1-author`,
                    type: "RichText",
                    props: {
                      html: '<span style="font-size: 14px; font-weight: 600;">— ישראל ישראלי</span>',
                      align: "center",
                    },
                  },
                ],
              },
            ],
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
            maxWidth: "800px",
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

    default:
      return null;
  }
}
