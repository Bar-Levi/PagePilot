"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  LayoutTemplate,
  Briefcase,
  ShoppingBag,
  Calendar,
  Palette,
  Rocket,
  Heart,
  Plus,
} from "lucide-react";
import { useEditorStore } from "@/hooks/use-editor-store";
import type { PageComponent } from "@/components/landing-page/types";

// Template category
type TemplateCategory = "all" | "business" | "saas" | "ecommerce" | "event" | "portfolio" | "nonprofit";

// Template definition
type Template = {
  id: string;
  name: string;
  nameHe: string;
  category: TemplateCategory;
  description: string;
  thumbnail: string;
  structure: PageComponent[];
  tags: string[];
};

// Section template definition
type SectionTemplate = {
  id: string;
  type: string;
  name: string;
  nameHe: string;
  variant: string;
  thumbnail: string;
  structure: PageComponent;
};

// Full page templates
const pageTemplates: Template[] = [
  {
    id: "startup-landing",
    name: "Startup Landing",
    nameHe: "דף נחיתה לסטארטאפ",
    category: "saas",
    description: "דף נחיתה מודרני לסטארטאפים וחברות טכנולוגיה",
    thumbnail: "https://picsum.photos/seed/startup/400/300",
    tags: ["SaaS", "Tech", "Modern"],
    structure: [
      {
        id: "hero-startup",
        type: "Container",
        props: {
          style: {
            padding: "120px 32px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          },
        },
        children: [
          {
            id: "hero-startup-title",
            type: "RichText",
            props: {
              html: '<span style="font-size: 56px; font-weight: 800; color: white;">הפתרון שהעסק שלך חיכה לו</span>',
              align: "center",
            },
          },
          {
            id: "hero-startup-subtitle",
            type: "RichText",
            props: {
              html: '<span style="font-size: 22px; color: rgba(255,255,255,0.9); max-width: 600px; display: block;">אוטומציה חכמה שחוסכת לך זמן וכסף. התחל בחינם היום.</span>',
              align: "center",
            },
          },
          {
            id: "hero-startup-cta",
            type: "Button",
            props: {
              text: "התחל בחינם",
              href: "#",
              variant: "default",
              size: "lg",
            },
          },
        ],
      },
    ],
  },
  {
    id: "business-corporate",
    name: "Corporate Business",
    nameHe: "עסק תאגידי",
    category: "business",
    description: "דף נחיתה מקצועי לעסקים ותאגידים",
    thumbnail: "https://picsum.photos/seed/business/400/300",
    tags: ["Business", "Corporate", "Professional"],
    structure: [],
  },
  {
    id: "ecommerce-product",
    name: "Product Launch",
    nameHe: "השקת מוצר",
    category: "ecommerce",
    description: "דף נחיתה להשקת מוצר חדש",
    thumbnail: "https://picsum.photos/seed/product/400/300",
    tags: ["E-commerce", "Product", "Launch"],
    structure: [],
  },
  {
    id: "event-conference",
    name: "Conference Event",
    nameHe: "אירוע כנס",
    category: "event",
    description: "דף נחיתה לכנסים ואירועים",
    thumbnail: "https://picsum.photos/seed/event/400/300",
    tags: ["Event", "Conference", "Registration"],
    structure: [],
  },
  {
    id: "portfolio-creative",
    name: "Creative Portfolio",
    nameHe: "פורטפוליו יצירתי",
    category: "portfolio",
    description: "דף נחיתה לאנשי קריאייטיב ומעצבים",
    thumbnail: "https://picsum.photos/seed/portfolio/400/300",
    tags: ["Portfolio", "Creative", "Designer"],
    structure: [],
  },
  {
    id: "nonprofit-charity",
    name: "Charity Organization",
    nameHe: "ארגון צדקה",
    category: "nonprofit",
    description: "דף נחיתה לארגונים ללא מטרות רווח",
    thumbnail: "https://picsum.photos/seed/charity/400/300",
    tags: ["Nonprofit", "Charity", "Donation"],
    structure: [],
  },
];

// Section templates
const sectionTemplates: SectionTemplate[] = [
  // Hero variants
  {
    id: "hero-centered",
    type: "Hero",
    name: "Centered Hero",
    nameHe: "Hero ממורכז",
    variant: "centered",
    thumbnail: "https://picsum.photos/seed/hero1/200/120",
    structure: {
      id: `hero-${Date.now()}`,
      type: "Container",
      props: {
        style: {
          padding: "96px 32px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        },
      },
      children: [
        {
          id: `hero-title-${Date.now()}`,
          type: "RichText",
          props: {
            html: '<span style="font-size: 48px; font-weight: 700; color: white;">כותרת ראשית</span>',
            align: "center",
          },
        },
        {
          id: `hero-subtitle-${Date.now()}`,
          type: "RichText",
          props: {
            html: '<span style="font-size: 20px; color: rgba(255,255,255,0.9);">תת כותרת שמסבירה את הערך</span>',
            align: "center",
          },
        },
        {
          id: `hero-cta-${Date.now()}`,
          type: "Button",
          props: { text: "התחל עכשיו", href: "#", variant: "default", size: "lg" },
        },
      ],
    },
  },
  {
    id: "hero-split",
    type: "Hero",
    name: "Split Hero",
    nameHe: "Hero מפוצל",
    variant: "split",
    thumbnail: "https://picsum.photos/seed/hero2/200/120",
    structure: {
      id: `hero-split-${Date.now()}`,
      type: "Container",
      props: {
        style: {
          padding: "64px 32px",
          flexDirection: "row",
          alignItems: "center",
          gap: 48,
        },
      },
      children: [],
    },
  },
  // Features variants
  {
    id: "features-grid",
    type: "Features",
    name: "Features Grid",
    nameHe: "תכונות ברשת",
    variant: "grid",
    thumbnail: "https://picsum.photos/seed/features1/200/120",
    structure: {
      id: `features-${Date.now()}`,
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
          id: `features-title-${Date.now()}`,
          type: "RichText",
          props: {
            html: '<span style="font-size: 36px; font-weight: 700;">התכונות שלנו</span>',
            align: "center",
          },
        },
      ],
    },
  },
  {
    id: "features-cards",
    type: "Features",
    name: "Features Cards",
    nameHe: "תכונות בכרטיסים",
    variant: "cards",
    thumbnail: "https://picsum.photos/seed/features2/200/120",
    structure: {
      id: `features-cards-${Date.now()}`,
      type: "Container",
      props: {
        style: { padding: "64px 32px", flexDirection: "column", gap: 32 },
      },
      children: [],
    },
  },
  // Testimonials variants
  {
    id: "testimonials-cards",
    type: "Testimonials",
    name: "Testimonials Cards",
    nameHe: "המלצות בכרטיסים",
    variant: "cards",
    thumbnail: "https://picsum.photos/seed/testimonials1/200/120",
    structure: {
      id: `testimonials-${Date.now()}`,
      type: "Container",
      props: {
        style: {
          padding: "64px 32px",
          background: "#f8fafc",
          flexDirection: "column",
          gap: 32,
        },
      },
      children: [],
    },
  },
  {
    id: "testimonials-slider",
    type: "Testimonials",
    name: "Testimonials Slider",
    nameHe: "המלצות בסליידר",
    variant: "slider",
    thumbnail: "https://picsum.photos/seed/testimonials2/200/120",
    structure: {
      id: `testimonials-slider-${Date.now()}`,
      type: "Container",
      props: {
        style: { padding: "64px 32px", flexDirection: "column", gap: 32 },
      },
      children: [],
    },
  },
  // Pricing variants
  {
    id: "pricing-simple",
    type: "Pricing",
    name: "Simple Pricing",
    nameHe: "מחירון פשוט",
    variant: "simple",
    thumbnail: "https://picsum.photos/seed/pricing1/200/120",
    structure: {
      id: `pricing-${Date.now()}`,
      type: "Container",
      props: {
        style: { padding: "64px 32px", flexDirection: "column", gap: 32 },
      },
      children: [],
    },
  },
  {
    id: "pricing-comparison",
    type: "Pricing",
    name: "Pricing Comparison",
    nameHe: "השוואת מחירים",
    variant: "comparison",
    thumbnail: "https://picsum.photos/seed/pricing2/200/120",
    structure: {
      id: `pricing-comparison-${Date.now()}`,
      type: "Container",
      props: {
        style: { padding: "64px 32px", flexDirection: "column", gap: 32 },
      },
      children: [],
    },
  },
  // CTA variants
  {
    id: "cta-simple",
    type: "CTA",
    name: "Simple CTA",
    nameHe: "CTA פשוט",
    variant: "simple",
    thumbnail: "https://picsum.photos/seed/cta1/200/120",
    structure: {
      id: `cta-${Date.now()}`,
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
          id: `cta-title-${Date.now()}`,
          type: "RichText",
          props: {
            html: '<span style="font-size: 32px; font-weight: 700; color: white;">מוכנים להתחיל?</span>',
            align: "center",
          },
        },
        {
          id: `cta-button-${Date.now()}`,
          type: "Button",
          props: { text: "צור קשר", href: "#", variant: "default", size: "lg" },
        },
      ],
    },
  },
];

const categoryIcons: Record<TemplateCategory, React.ReactNode> = {
  all: <LayoutTemplate className="w-4 h-4" />,
  business: <Briefcase className="w-4 h-4" />,
  saas: <Rocket className="w-4 h-4" />,
  ecommerce: <ShoppingBag className="w-4 h-4" />,
  event: <Calendar className="w-4 h-4" />,
  portfolio: <Palette className="w-4 h-4" />,
  nonprofit: <Heart className="w-4 h-4" />,
};

const categoryLabels: Record<TemplateCategory, string> = {
  all: "הכל",
  business: "עסקי",
  saas: "SaaS",
  ecommerce: "מסחר",
  event: "אירועים",
  portfolio: "פורטפוליו",
  nonprofit: "מלכ\"רים",
};

export function TemplatesGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("all");
  const [selectedTab, setSelectedTab] = useState<"pages" | "sections">("pages");
  const [open, setOpen] = useState(false);

  const setPageJson = useEditorStore((s) => s.setPageJson);
  const addComponent = useEditorStore((s) => s.addComponent);

  // Filter templates
  const filteredPageTemplates = pageTemplates.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.nameHe.includes(searchQuery) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const filteredSectionTemplates = sectionTemplates.filter((template) => {
    return (
      !searchQuery ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.nameHe.includes(searchQuery)
    );
  });

  // Apply page template
  const applyPageTemplate = (template: Template) => {
    if (template.structure.length === 0) {
      alert("תבנית זו עדיין בפיתוח");
      return;
    }

    const newPage: PageComponent = {
      id: "page-root",
      type: "Page",
      props: {},
      children: template.structure.map((section) => ({
        ...section,
        id: `${section.id}-${Date.now()}`,
      })),
    };

    setPageJson(newPage);
    setOpen(false);
  };

  // Add section template
  const addSectionTemplate = (template: SectionTemplate) => {
    const newSection = {
      ...template.structure,
      id: `${template.structure.id}-${Date.now()}`,
    };
    addComponent("page-root", newSection);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <LayoutTemplate className="w-4 h-4 mr-2" />
          תבניות
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5" />
            גלריית תבניות
          </DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="pages">דפים מלאים</TabsTrigger>
              <TabsTrigger value="sections">סקשנים</TabsTrigger>
            </TabsList>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="חפש תבנית..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Pages Tab */}
          <TabsContent value="pages">
            {/* Category Filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {(Object.keys(categoryLabels) as TemplateCategory[]).map(
                (category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {categoryIcons[category]}
                    <span className="mr-1">{categoryLabels[category]}</span>
                  </Button>
                )
              )}
            </div>

            {/* Templates Grid */}
            <ScrollArea className="h-[50vh]">
              <div className="grid grid-cols-3 gap-4">
                {filteredPageTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group border rounded-lg overflow-hidden hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => applyPageTemplate(template)}
                  >
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                      <img
                        src={template.thumbnail}
                        alt={template.nameHe}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <Plus className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm">{template.nameHe}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {template.description}
                      </p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Sections Tab */}
          <TabsContent value="sections">
            <ScrollArea className="h-[50vh]">
              {/* Group by section type */}
              {["Hero", "Features", "Testimonials", "Pricing", "CTA"].map(
                (sectionType) => {
                  const sections = filteredSectionTemplates.filter(
                    (s) => s.type === sectionType
                  );
                  if (sections.length === 0) return null;

                  return (
                    <div key={sectionType} className="mb-6">
                      <h3 className="font-medium text-sm mb-3">{sectionType}</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {sections.map((template) => (
                          <div
                            key={template.id}
                            className="group border rounded-lg overflow-hidden hover:border-blue-500 transition-colors cursor-pointer"
                            onClick={() => addSectionTemplate(template)}
                          >
                            <div className="aspect-[5/3] bg-slate-100 relative overflow-hidden">
                              <img
                                src={template.thumbnail}
                                alt={template.nameHe}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <Plus className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                            <div className="p-2">
                              <h4 className="font-medium text-xs">
                                {template.nameHe}
                              </h4>
                              <p className="text-[10px] text-slate-500">
                                {template.variant}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

