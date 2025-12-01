
/**
 * =================================================================
 * CORE CONTRACT: UNIFIED COMPONENT STRUCTURE
 * =================================================================
 * This is the single source of truth for the structure of any
 * component within the page editor.
 */

// A strict list of all allowed component types.
export type ComponentType =
  | "Container"
  | "RichText"
  | "Image"
  | "Video"
  | "Button"
  | "Input"
  | "Checkbox"
  | "Divider"
  | "Carousel"
  | "Form";

// The unified structure for ANY component.
export type PageComponent = {
  id: string; // Unique identifier (e.g., UUID)
  type: ComponentType;
  props: AnyProps;
  children?: PageComponent[];
};

// The entire page is just an array of root-level components.
export type PageData = {
  pageStructure: PageComponent[];
};


/**
 * =================================================================
 * COMPONENT-SPECIFIC PROPS
 * =================================================================
 * Each component type has its own specific props interface.
 */

export type AnyProps =
  | ContainerProps
  | RichTextProps
  | ImageProps
  | VideoProps
  | ButtonProps
  | DividerProps
  | InputProps
  | CheckboxProps
  | CarouselProps
  | FormProps;


// 1. Container Props
export type ContainerProps = {
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
};

// 2. RichText Props
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
export type RichTextProps = {
  content: RichTextNode[];
  align?: "left" | "right" | "center" | "justify";
  spacing?: number;
  padding?: number;
};

// 3. Image Props
export type ImageProps = {
  src: string;
  alt: string;
  width?: string | number;
  maxWidth?: string | number;
  rounded?: string;
  shadow?: string;
  alignment?: "left" | "center" | "right";
};

// 4. Video Props
export type VideoProps = {
  youtubeId: string;
  autoplay?: boolean;
  controls?: boolean;
  ratio?: "16:9" | "4:3" | "1:1";
  alignment?: "left" | "center" | "right";
};

// 5. Button Props
export type ButtonProps = {
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

// 6. Divider Props
export type DividerProps = {
  thickness?: number;
  color?: string;
  spacing?: number;
};

// 7. Input Props (for Forms)
export type InputProps = {
    label: string;
    placeholder?: string;
    name: string; // for form submission
    required?: boolean;
};

// 8. Checkbox Props (for Forms)
export type CheckboxProps = {
    label: string;
    name: string;
    required?: boolean;
};

// 9. Carousel Props
export type CarouselProps = {
    // items are passed as children
};

// 10. Form Props
export type FormProps = {
    // children are the form fields (Input, Checkbox, etc.)
    // plus a submit Button.
};


/**
 * =================================================================
 * DEPRECATED - For reference only during transition.
 * These will be removed once all components are migrated.
 * =================================================================
 */
export type Cta = {
  text: string;
  href: string;
};

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
export type OldRichTextSectionData = { type: 'richtext'; content: any[], align?: 'left' | 'right' | 'center' | 'justify', spacing?: number; background?: string; padding?: number; };
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
