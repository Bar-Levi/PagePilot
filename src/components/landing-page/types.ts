
export type Cta = {
  text: string;
  href: string;
};

// =================================================================
// 1. ATOMIC COMPONENTS (Building Blocks)
// =================================================================

// 1.1 RichText Node
export type RichTextNode = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  size?: number;
  font?: string;
  link?: string;
};

// 1.2 Image Component
export type ImageComponentData = {
  type: "image";
  src: string;
  alt: string;
  width?: string | number;
  maxWidth?: string | number;
  rounded?: string;
  shadow?: string;
  alignment?: "left" | "center" | "right";
};

// 1.3 Video Component (YouTube only)
export type VideoComponentData = {
  type: "video";
  youtubeId: string;
  autoplay?: boolean;
  controls?: boolean;
  ratio?: "16:9" | "4:3" | "1:1";
  alignment?: "left" | "center" | "right";
};

// 1.4 Button Component
export type ButtonComponentData = {
  type: "button";
  text: string;
  href: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  radius?: string;
  iconBefore?: string; // Lucide icon name
  iconAfter?: string;  // Lucide icon name
  hoverColor?: string;
  fontWeight?: string;
  padding?: string;
};

// 1.5 RichText Component
export type RichTextComponentData = {
  type: "richtext";
  content: RichTextNode[];
  align?: "left" | "right" | "center" | "justify";
};

// 1.6 Divider Component
export type DividerComponentData = {
  type: "divider";
  thickness?: number;
  color?: string;
  spacing?: number;
};


// =================================================================
// 2. LAYOUT COMPONENT (The Core)
// =================================================================

// 2.1 Container Component
export type ContainerComponentData = {
  type: "container";
  style?: {
    background?: string;
    padding?: string | number;
    radius?: string | number;
    border?: string;
    flexDirection?: "row" | "column";
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
    justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
    gap?: string | number;
    width?: string;
    maxWidth?: string;
  };
  children: AnyComponent[];
};


// =================================================================
// 3. AGGREGATE TYPES
// =================================================================

// A union of all possible components
export type AnyComponent =
  | RichTextComponentData
  | ImageComponentData
  | VideoComponentData
  | ButtonComponentData
  | DividerComponentData
  | ContainerComponentData;

// The root of the page structure
export type PageData = {
  pageStructure: AnyComponent[];
};

// Keeping old types for now to avoid breaking the app completely
// These will be removed in subsequent steps.
export type OldHeroSectionData = {
  type: "hero";
  headline: string;
  subheadline: string;
  cta: Cta;
  image: { src: string, alt: string };
};
export type OldTextImageSectionData = { type: "text-image"; headline: string; text: string; image: { src: string, alt: string }; imagePosition: "left" | "right"; };
export type OldTestimonialsSectionData = { type: "testimonials"; headline: string; testimonials: { quote: string; author: string; role: string; avatar: { src: string, alt: string } }[]; };
export type OldFaqSectionData = { type: "faq"; headline: string; questions: { question: string; answer: string }[]; };
export type OldCtaSectionData = { type: "cta"; headline: string; subheadline: string; cta: Cta; };
export type OldRichTextSectionData = { type: 'richtext'; content: RichTextNode[], align?: 'left' | 'right' | 'center' | 'justify', spacing?: number; background?: string; padding?: number; };
export type OldPricingSectionData = { type: 'pricing', headline: string; plans: any[] };
export type OldVideoSectionData = { type: 'video', headline: string; youtubeId: string };

export type Section =
  | OldHeroSectionData
  | OldTextImageSectionData
  | OldTestimonialsSectionData
  | OldFaqSectionData
  | OldCtaSectionData
  | OldRichTextSectionData
  | OldPricingSectionData
  | OldVideoSectionData;
