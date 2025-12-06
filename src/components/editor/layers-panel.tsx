"use client";

import React, { useState, useMemo } from "react";
import { useEditorStore } from "@/hooks/use-editor-store";
import type { PageComponent } from "@/components/landing-page/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Trash2,
  Layers,
  Type,
  Square,
  Image,
  Video,
  MousePointer,
  Minus,
  Layout,
  AlertTriangle,
  Star,
  Heart,
  Zap,
  Target,
  MessageSquare,
  HelpCircle,
  Phone,
  Plus,
  CreditCard,
  Users,
  TrendingUp,
  Info,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

// ============================================================================
// Section Categories
// ============================================================================

type SectionCategory = "awareness" | "trust" | "benefits" | "conversion";

const sectionCategories: Record<SectionCategory, {
  label: string;
  icon: React.ReactNode;
  color: string;
  types: string[];
}> = {
  awareness: {
    label: "מודעות",
    icon: <Star className="w-3.5 h-3.5" />,
    color: "text-blue-500",
    types: ["Hero", "Container"], // Hero sections usually are containers with gradients
  },
  trust: {
    label: "אמון",
    icon: <Heart className="w-3.5 h-3.5" />,
    color: "text-pink-500",
    types: ["TestimonialsGrid", "Testimonials", "StatsGrid", "Stats", "Logos"],
  },
  benefits: {
    label: "יתרונות",
    icon: <Zap className="w-3.5 h-3.5" />,
    color: "text-amber-500",
    types: ["Features", "Steps", "Benefits", "HowItWorks"],
  },
  conversion: {
    label: "המרה",
    icon: <Target className="w-3.5 h-3.5" />,
    color: "text-emerald-500",
    types: ["CTA", "Pricing", "ContactForm", "Contact", "FAQ", "FAQAccordion"],
  },
};

function getSectionCategory(type: string, props: any): SectionCategory | null {
  // Check if it's a hero-like container (has gradient background)
  if (type === "Container" && props?.style?.background?.includes("gradient")) {
    return "awareness";
  }
  
  for (const [category, config] of Object.entries(sectionCategories)) {
    if (config.types.includes(type)) {
      return category as SectionCategory;
    }
  }
  return null;
}

// ============================================================================
// Missing Data Detection
// ============================================================================

interface MissingItem {
  field: string;
  message: string;
  severity: "warning" | "critical";
}

function getMissingDataForComponent(component: PageComponent): MissingItem[] {
  const missing: MissingItem[] = [];
  const props = component.props as any;

  // Check for missing images
  if (component.type === "Image") {
    if (!props.src || props.src.includes("placeholder")) {
      missing.push({
        field: "image",
        message: "תמונה חסרה או placeholder",
        severity: "warning",
      });
    }
  }

  // Check for missing button content
  if (component.type === "Button") {
    if (!props.text || props.text.trim() === "") {
      missing.push({
        field: "buttonText",
        message: "טקסט כפתור חסר",
        severity: "critical",
      });
    }
    if (!props.href || props.href === "#") {
      missing.push({
        field: "buttonLink",
        message: "קישור כפתור לא הוגדר",
        severity: "warning",
      });
    }
  }

  // Check for empty testimonials
  if (component.type === "TestimonialsGrid" || component.type === "Testimonials") {
    if (!props.testimonials || props.testimonials.length === 0) {
      missing.push({
        field: "testimonials",
        message: "אין המלצות להצגה",
        severity: "warning",
      });
    }
  }

  // Check for empty FAQ
  if (component.type === "FAQAccordion" || component.type === "FAQ") {
    if (!props.items || props.items.length === 0) {
      missing.push({
        field: "faqItems",
        message: "אין שאלות נפוצות",
        severity: "warning",
      });
    }
  }

  // Recursively check children
  if (component.children) {
    for (const child of component.children) {
      missing.push(...getMissingDataForComponent(child));
    }
  }

  return missing;
}

// ============================================================================
// Icon Mapping
// ============================================================================

const componentIcons: Record<string, React.ReactNode> = {
  Page: <Layout className="w-4 h-4" />,
  Container: <Square className="w-4 h-4" />,
  RichText: <Type className="w-4 h-4" />,
  Button: <MousePointer className="w-4 h-4" />,
  Image: <Image className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  Divider: <Minus className="w-4 h-4" />,
  Hero: <Star className="w-4 h-4" />,
  Features: <Zap className="w-4 h-4" />,
  Testimonials: <MessageSquare className="w-4 h-4" />,
  TestimonialsGrid: <MessageSquare className="w-4 h-4" />,
  FAQ: <HelpCircle className="w-4 h-4" />,
  FAQAccordion: <HelpCircle className="w-4 h-4" />,
  CTA: <Target className="w-4 h-4" />,
  Contact: <Phone className="w-4 h-4" />,
  ContactForm: <Phone className="w-4 h-4" />,
  Pricing: <CreditCard className="w-4 h-4" />,
  Stats: <TrendingUp className="w-4 h-4" />,
  StatsGrid: <TrendingUp className="w-4 h-4" />,
  Steps: <Zap className="w-4 h-4" />,
};

// ============================================================================
// Enhanced Layers Panel
// ============================================================================

export function LayersPanel() {
  const pageJson = useEditorStore((s) => s.pageJson);
  const selectedId = useEditorStore((s) => s.selectedId);
  const select = useEditorStore((s) => s.select);
  const deleteComponent = useEditorStore((s) => s.deleteComponent);
  const moveComponent = useEditorStore((s) => s.moveComponent);
  const getParentId = useEditorStore((s) => s.getParentId);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["awareness", "trust", "benefits", "conversion"])
  );
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  // Group sections by category
  const groupedSections = useMemo(() => {
    const groups: Record<SectionCategory | "other", PageComponent[]> = {
      awareness: [],
      trust: [],
      benefits: [],
      conversion: [],
      other: [],
    };

    const rootChildren = pageJson.children || [];
    for (const child of rootChildren) {
      const category = getSectionCategory(child.type, child.props);
      if (category) {
        groups[category].push(child);
      } else {
        groups.other.push(child);
      }
    }

    return groups;
  }, [pageJson]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      setDropTargetId(targetId);
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDragLeave = () => {
    setDropTargetId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      const targetParentId = getParentId(targetId);
      if (targetParentId) {
        const parent = pageJson.children?.find((c) => c.id === targetId);
        const targetIndex = pageJson.children?.findIndex((c) => c.id === targetId) || 0;
        moveComponent(draggedId, "page-root", targetIndex);
      }
    }
    setDraggedId(null);
    setDropTargetId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDropTargetId(null);
  };

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Layers className="w-4 h-4" />
              <h3 className="font-semibold text-sm">סקשנים</h3>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Plus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>הוסף סקשן</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Grouped Sections */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {(Object.entries(sectionCategories) as [SectionCategory, typeof sectionCategories[SectionCategory]][]).map(
              ([category, config]) => {
                const sections = groupedSections[category];
                if (sections.length === 0) return null;

                const isExpanded = expandedCategories.has(category);

                return (
                  <Collapsible
                    key={category}
                    open={isExpanded}
                    onOpenChange={() => toggleCategory(category)}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className={config.color}>{config.icon}</span>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {config.label}
                        </span>
                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                          {sections.length}
                        </Badge>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 space-y-0.5">
                      {sections.map((section) => (
                        <SectionItem
                          key={section.id}
                          section={section}
                          isSelected={selectedId === section.id}
                          isDragging={draggedId === section.id}
                          isDropTarget={dropTargetId === section.id}
                          onSelect={() => select(section.id)}
                          onDelete={() => deleteComponent(section.id)}
                          onDragStart={(e) => handleDragStart(e, section.id)}
                          onDragOver={(e) => handleDragOver(e, section.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, section.id)}
                          onDragEnd={handleDragEnd}
                        />
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              }
            )}

            {/* Other sections */}
            {groupedSections.other.length > 0 && (
              <Collapsible
                open={expandedCategories.has("other")}
                onOpenChange={() => toggleCategory("other")}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                  <div className="flex items-center gap-2">
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      אחר
                    </span>
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                      {groupedSections.other.length}
                    </Badge>
                  </div>
                  {expandedCategories.has("other") ? (
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-0.5">
                  {groupedSections.other.map((section) => (
                    <SectionItem
                      key={section.id}
                      section={section}
                      isSelected={selectedId === section.id}
                      isDragging={draggedId === section.id}
                      isDropTarget={dropTargetId === section.id}
                      onSelect={() => select(section.id)}
                      onDelete={() => deleteComponent(section.id)}
                      onDragStart={(e) => handleDragStart(e, section.id)}
                      onDragOver={(e) => handleDragOver(e, section.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, section.id)}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </ScrollArea>

        {/* Add Section Button */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Plus className="w-4 h-4" />
            הוסף סקשן חדש
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ============================================================================
// Section Item Component
// ============================================================================

interface SectionItemProps {
  section: PageComponent;
  isSelected: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

function SectionItem({
  section,
  isSelected,
  isDragging,
  isDropTarget,
  onSelect,
  onDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: SectionItemProps) {
  const missingItems = useMemo(() => getMissingDataForComponent(section), [section]);
  const hasCritical = missingItems.some((m) => m.severity === "critical");
  const hasWarning = missingItems.length > 0;

  const icon = componentIcons[section.type] || <Square className="w-4 h-4" />;
  const preview = getContentPreview(section);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-2 mr-2 rounded-lg cursor-pointer transition-all",
            "hover:bg-slate-100 dark:hover:bg-slate-700",
            isSelected && "bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500",
            isDragging && "opacity-50",
            isDropTarget && "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
          )}
          onClick={onSelect}
          draggable
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
        >
          {/* Drag Handle */}
          <GripVertical className="w-3 h-3 text-slate-400 cursor-grab flex-shrink-0" />

          {/* Icon */}
          <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">
            {icon}
          </span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium truncate">
                {section.type}
              </span>
              {hasWarning && (
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle
                      className={cn(
                        "w-3.5 h-3.5 flex-shrink-0",
                        hasCritical ? "text-red-500" : "text-amber-500"
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[200px]">
                    <p className="font-medium mb-1">מידע חסר:</p>
                    <ul className="text-xs space-y-0.5">
                      {missingItems.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className={item.severity === "critical" ? "text-red-400" : "text-amber-400"}>
                            •
                          </span>
                          {item.message}
                        </li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            {preview && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {preview}
              </p>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onSelect}>בחר</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="w-4 h-4 ml-2" />
          מחק
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function getContentPreview(component: PageComponent): string | null {
  const props = component.props as any;

  // Check for direct headline/text
  if (props.headline) return props.headline;
  if (props.text) return props.text.substring(0, 30);
  if (props.html) {
    const text = props.html.replace(/<[^>]*>/g, "").trim();
    return text.length > 30 ? text.substring(0, 30) + "..." : text;
  }

  // Check children for text content
  if (component.children) {
    for (const child of component.children) {
      const childProps = child.props as any;
      if (child.type === "RichText" && childProps.html) {
        const text = childProps.html.replace(/<[^>]*>/g, "").trim();
        if (text) return text.length > 30 ? text.substring(0, 30) + "..." : text;
      }
    }
  }

  return null;
}
