"use client";

import React, { useState, useMemo } from "react";
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
  Search,
  ChevronDown,
  ChevronRight,
  Link2,
  Grid3X3,
  Images,
  Columns,
  CreditCardIcon,
  ListCollapse,
  LayoutList,
  Space,
  Users,
  BarChart3,
  Mail,
  TextCursor,
  AtSign,
  AlignLeft,
  CheckSquare,
  List,
  Send,
  Sparkles,
  Play,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Component definition
type ComponentDef = {
  type: string;
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  description?: string;
  popular?: boolean;
};

// Category definition
type Category = {
  id: string;
  label: string;
  icon: React.ReactNode;
  components: ComponentDef[];
};

// All categories and components
const categories: Category[] = [
  {
    id: "basic",
    label: "רכיבים בסיסיים",
    icon: <Layers className="w-4 h-4" />,
    components: [
      {
        type: "RichText",
        label: "טקסט",
        labelEn: "Text",
        icon: <Type className="w-5 h-5" />,
        description: "טקסט עשיר עם עיצוב",
        popular: true,
      },
      {
        type: "Heading",
        label: "כותרת",
        labelEn: "Heading",
        icon: <TextCursor className="w-5 h-5" />,
        description: "כותרת H1, H2, H3",
      },
      {
        type: "Button",
        label: "כפתור",
        labelEn: "Button",
        icon: <MousePointer className="w-5 h-5" />,
        description: "כפתור קריאה לפעולה",
        popular: true,
      },
      {
        type: "Link",
        label: "קישור",
        labelEn: "Link",
        icon: <Link2 className="w-5 h-5" />,
        description: "קישור טקסט",
      },
      {
        type: "Divider",
        label: "קו מפריד",
        labelEn: "Divider",
        icon: <Minus className="w-5 h-5" />,
        description: "קו הפרדה אופקי",
      },
    ],
  },
  {
    id: "media",
    label: "מדיה",
    icon: <Image className="w-4 h-4" />,
    components: [
      {
        type: "Image",
        label: "תמונה",
        labelEn: "Image",
        icon: <Image className="w-5 h-5" />,
        description: "תמונה בודדת",
        popular: true,
      },
      {
        type: "ImageGallery",
        label: "גלריית תמונות",
        labelEn: "Image Gallery",
        icon: <Images className="w-5 h-5" />,
        description: "רשת תמונות עם lightbox",
      },
      {
        type: "Video",
        label: "וידאו YouTube",
        labelEn: "YouTube Video",
        icon: <Video className="w-5 h-5" />,
        description: "הטמעת וידאו מ-YouTube",
      },
      {
        type: "VideoVimeo",
        label: "וידאו Vimeo",
        labelEn: "Vimeo Video",
        icon: <Play className="w-5 h-5" />,
        description: "הטמעת וידאו מ-Vimeo",
      },
      {
        type: "Carousel",
        label: "קרוסלת תמונות",
        labelEn: "Image Carousel",
        icon: <Grid3X3 className="w-5 h-5" />,
        description: "סליידר תמונות",
        popular: true,
      },
      {
        type: "VideoCarousel",
        label: "קרוסלת וידאו",
        labelEn: "Video Carousel",
        icon: <Video className="w-5 h-5" />,
        description: "סליידר וידאו",
      },
    ],
  },
  {
    id: "structure",
    label: "מבנה",
    icon: <Square className="w-4 h-4" />,
    components: [
      {
        type: "Container",
        label: "מיכל",
        labelEn: "Container",
        icon: <Square className="w-5 h-5" />,
        description: "מיכל גמיש לרכיבים",
        popular: true,
      },
      {
        type: "Row",
        label: "שורה",
        labelEn: "Row",
        icon: <Columns className="w-5 h-5" />,
        description: "פריסת עמודות",
      },
      {
        type: "Card",
        label: "כרטיס",
        labelEn: "Card",
        icon: <CreditCardIcon className="w-5 h-5" />,
        description: "כרטיס עם תמונה וטקסט",
      },
      {
        type: "Accordion",
        label: "אקורדיון",
        labelEn: "Accordion",
        icon: <ListCollapse className="w-5 h-5" />,
        description: "רשימה מתקפלת",
      },
      {
        type: "Tabs",
        label: "טאבים",
        labelEn: "Tabs",
        icon: <LayoutList className="w-5 h-5" />,
        description: "תוכן בלשוניות",
      },
      {
        type: "Spacer",
        label: "ספייסר",
        labelEn: "Spacer",
        icon: <Space className="w-5 h-5" />,
        description: "רווח אנכי",
      },
    ],
  },
  {
    id: "sections",
    label: "סקשנים מוכנים",
    icon: <Layout className="w-4 h-4" />,
    components: [
      {
        type: "Hero",
        label: "Hero",
        labelEn: "Hero Section",
        icon: <Layout className="w-5 h-5" />,
        description: "סקשן פתיחה מרשים",
        popular: true,
      },
      {
        type: "Features",
        label: "תכונות",
        labelEn: "Features",
        icon: <Star className="w-5 h-5" />,
        description: "הצגת תכונות המוצר",
        popular: true,
      },
      {
        type: "Testimonials",
        label: "המלצות",
        labelEn: "Testimonials",
        icon: <MessageSquare className="w-5 h-5" />,
        description: "חוות דעת לקוחות",
      },
      {
        type: "Pricing",
        label: "מחירון",
        labelEn: "Pricing",
        icon: <CreditCard className="w-5 h-5" />,
        description: "טבלת מחירים",
      },
      {
        type: "FAQ",
        label: "שאלות נפוצות",
        labelEn: "FAQ",
        icon: <HelpCircle className="w-5 h-5" />,
        description: "שאלות ותשובות",
      },
      {
        type: "Team",
        label: "צוות",
        labelEn: "Team",
        icon: <Users className="w-5 h-5" />,
        description: "הצגת חברי הצוות",
      },
      {
        type: "Logos",
        label: "לוגואים",
        labelEn: "Logos",
        icon: <Images className="w-5 h-5" />,
        description: "רצועת לוגואים של לקוחות",
      },
      {
        type: "Stats",
        label: "סטטיסטיקות",
        labelEn: "Stats",
        icon: <BarChart3 className="w-5 h-5" />,
        description: "מספרים מרשימים",
      },
      {
        type: "Contact",
        label: "צור קשר",
        labelEn: "Contact",
        icon: <Mail className="w-5 h-5" />,
        description: "טופס יצירת קשר",
      },
      {
        type: "CTA",
        label: "קריאה לפעולה",
        labelEn: "CTA",
        icon: <Megaphone className="w-5 h-5" />,
        description: "סקשן סיום עם CTA",
      },
    ],
  },
  {
    id: "forms",
    label: "טפסים",
    icon: <AlignLeft className="w-4 h-4" />,
    components: [
      {
        type: "Input",
        label: "שדה טקסט",
        labelEn: "Text Input",
        icon: <TextCursor className="w-5 h-5" />,
        description: "שדה קלט טקסט",
      },
      {
        type: "EmailInput",
        label: "שדה אימייל",
        labelEn: "Email Input",
        icon: <AtSign className="w-5 h-5" />,
        description: "שדה קלט אימייל",
      },
      {
        type: "Textarea",
        label: "אזור טקסט",
        labelEn: "Textarea",
        icon: <AlignLeft className="w-5 h-5" />,
        description: "שדה טקסט רב-שורתי",
      },
      {
        type: "Checkbox",
        label: "תיבת סימון",
        labelEn: "Checkbox",
        icon: <CheckSquare className="w-5 h-5" />,
        description: "תיבת סימון",
      },
      {
        type: "Select",
        label: "בחירה",
        labelEn: "Select",
        icon: <List className="w-5 h-5" />,
        description: "רשימה נפתחת",
      },
      {
        type: "SubmitButton",
        label: "כפתור שליחה",
        labelEn: "Submit Button",
        icon: <Send className="w-5 h-5" />,
        description: "כפתור שליחת טופס",
      },
    ],
  },
  {
    id: "animations",
    label: "אנימציות",
    icon: <Sparkles className="w-4 h-4" />,
    components: [
      {
        type: "FadeIn",
        label: "Fade In",
        labelEn: "Fade In",
        icon: <Sparkles className="w-5 h-5" />,
        description: "הופעה הדרגתית",
      },
      {
        type: "SlideIn",
        label: "Slide In",
        labelEn: "Slide In",
        icon: <Sparkles className="w-5 h-5" />,
        description: "החלקה לתוך המסך",
      },
      {
        type: "ZoomIn",
        label: "Zoom In",
        labelEn: "Zoom In",
        icon: <Sparkles className="w-5 h-5" />,
        description: "התקרבות",
      },
      {
        type: "Bounce",
        label: "Bounce",
        labelEn: "Bounce",
        icon: <Sparkles className="w-5 h-5" />,
        description: "קפיצה",
      },
      {
        type: "Parallax",
        label: "Parallax",
        labelEn: "Parallax",
        icon: <Sparkles className="w-5 h-5" />,
        description: "אפקט פרלקס",
      },
    ],
  },
];

export function ComponentPaletteV2() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["basic", "media", "sections"])
  );

  // Filter components by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories
      .map((category) => ({
        ...category,
        components: category.components.filter(
          (c) =>
            c.label.toLowerCase().includes(query) ||
            c.labelEn.toLowerCase().includes(query) ||
            c.description?.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.components.length > 0);
  }, [searchQuery]);

  // Get popular components
  const popularComponents = useMemo(() => {
    return categories
      .flatMap((c) => c.components)
      .filter((c) => c.popular);
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("application/x-component-type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 mb-3">
          <Layers className="w-5 h-5" />
          <h2 className="font-semibold">רכיבים</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="חפש רכיב..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-right"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Popular Components (when not searching) */}
          {!searchQuery && (
            <div className="mb-6">
              <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Star className="w-3 h-3" />
                פופולריים
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {popularComponents.map((component) => (
                  <ComponentCard
                    key={component.type}
                    component={component}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {filteredCategories.map((category) => (
            <Collapsible
              key={category.id}
              open={expandedCategories.has(category.id) || !!searchQuery}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                {expandedCategories.has(category.id) || searchQuery ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                {category.icon}
                {category.label}
                <span className="text-xs text-slate-400 mr-auto">
                  ({category.components.length})
                </span>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {category.components.map((component) => (
                    <ComponentCard
                      key={component.type}
                      component={component}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}

          {/* No results */}
          {searchQuery && filteredCategories.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>לא נמצאו רכיבים</p>
              <p className="text-xs mt-1">נסה חיפוש אחר</p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 גרור רכיב לקנבס להוספה, או לחץ פעמיים על רכיב קיים לעריכה
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Component Card
function ComponentCard({
  component,
  onDragStart,
}: {
  component: ComponentDef;
  onDragStart: (e: React.DragEvent, type: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, component.type)}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 p-3",
        "bg-slate-50 dark:bg-slate-700/50 rounded-lg",
        "border border-slate-200 dark:border-slate-600",
        "cursor-grab active:cursor-grabbing",
        "hover:bg-slate-100 dark:hover:bg-slate-700",
        "hover:border-blue-300 dark:hover:border-blue-500",
        "transition-all duration-150",
        "select-none group relative"
      )}
      title={component.description}
    >
      {/* Popular badge */}
      {component.popular && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" />
      )}

      <div className="text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {component.icon}
      </div>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 text-center">
        {component.label}
      </span>
    </div>
  );
}

