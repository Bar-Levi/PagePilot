/**
 * =================================================================
 * CORE CONTRACT: UNIFIED COMPONENT STRUCTURE
 * =================================================================
 * This is the single source of truth for the structure of any
 * component within the page editor.
 */

// A strict list of all allowed component types.
export type ComponentType =
  | "Page"
  | "Container"
  | "TextContainer"
  | "TextSpan"
  | "RichText"
  | "Image"
  | "Video"
  | "Button"
  | "Input"
  | "Checkbox"
  | "Divider"
  | "Carousel"
  | "Form"
  // New components
  | "ImageGallery"
  | "Card"
  | "Spacer"
  | "Row"
  | "Accordion"
  | "Tabs"
  | "Heading"
  | "Link"
  // Section-level components (templates)
  | "Hero"
  | "Features"
  | "Testimonials"
  | "Pricing"
  | "FAQ"
  | "CTA"
  | "Team"
  | "Logos"
  | "Stats"
  | "Contact";

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
  | TextContainerProps
  | TextSpanProps
  | RichTextProps
  | ImageProps
  | VideoProps
  | ButtonProps
  | DividerProps
  | InputProps
  | CheckboxProps
  | CarouselProps
  | FormProps
  | PageProps
  // New component props
  | ImageGalleryProps
  | CardProps
  | SpacerProps
  | RowProps
  | AccordionProps
  | TabsProps
  | HeadingProps
  | LinkProps
  // Section props
  | HeroProps
  | FeaturesProps
  | TestimonialsProps
  | PricingProps
  | FAQProps
  | CTAProps
  | TeamProps
  | LogosProps
  | StatsProps
  | ContactProps;

// 0. Page Props
export type PageProps = {
  // Root page container - no special props needed
};

// 1. Container Props
export type ContainerProps = {
  /**
   * Layout direction - determines flex-direction
   * "row" = horizontal layout (flex-row)
   * "column" = vertical layout (flex-col)
   */
  layout?: "row" | "column";
  style?: {
    background?: string;
    padding?: string | number;
    radius?: string | number;
    border?: string;
    flexDirection?: "row" | "column"; // deprecated, use layout instead
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
    justifyContent?:
      | "flex-start"
      | "center"
      | "flex-end"
      | "space-between"
      | "space-around";
    gap?: string | number;
    width?: string;
    maxWidth?: string;
    minHeight?: string;
    flex?: string | number;
  };
};

// 2. TextContainer Props
export type TextContainerProps = {
  align?: "left" | "right" | "center" | "justify";
};

// 3. TextSpan Props
export type TextSpanProps = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  size?: number; // in pixels
  link?: string;
};

// 4. RichText Props
export type RichTextProps = {
  html: string;
  align?: "left" | "center" | "right";
};

// 5. Image Props
export type ImageProps = {
  src: string;
  alt: string;
  width?: string | number;
  maxWidth?: string | number;
  rounded?: string;
  shadow?: string;
  alignment?: "left" | "center" | "right";
};

// 6. Video Props
export type VideoProps = {
  youtubeId: string;
  autoplay?: boolean;
  controls?: boolean;
  ratio?: "16:9" | "4:3" | "1:1";
  alignment?: "left" | "center" | "right";
};

// 7. Button Props
export type ButtonProps = {
  text: string;
  href: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  radius?: string;
  iconBefore?: string; // Lucide icon name
  iconAfter?: string; // Lucide icon name
  hoverColor?: string;
  fontWeight?: string;
  padding?: string;
};

// 8. Divider Props
export type DividerProps = {
  thickness?: number;
  color?: string;
  spacing?: number;
};

// 9. Input Props (for Forms)
export type InputProps = {
  label: string;
  placeholder?: string;
  name: string; // for form submission
  required?: boolean;
};

// 10. Checkbox Props (for Forms)
export type CheckboxProps = {
  label: string;
  name: string;
  required?: boolean;
};

// 11. Carousel Props
export type CarouselProps = {
  // items are passed as children
};

// 12. Form Props
export type FormProps = {
  // children are the form fields (Input, Checkbox, etc.)
  // plus a submit Button.
};

/**
 * =================================================================
 * SECTION-LEVEL COMPONENT PROPS
 * =================================================================
 * These are higher-level components that represent entire sections.
 * They are rendered as Containers with specific children.
 */

// Hero Section Props
export type HeroProps = {
  headline: string;
  subheadline?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  alignment?: "left" | "center" | "right";
};

// Features Section Props
export type FeaturesProps = {
  headline?: string;
  subheadline?: string;
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  columns?: 2 | 3 | 4;
};

// Testimonials Section Props
export type TestimonialsProps = {
  headline?: string;
  testimonials: Array<{
    text: string;
    author: string;
    role?: string;
    company?: string;
    avatar?: string;
  }>;
};

// Pricing Section Props
export type PricingProps = {
  headline?: string;
  subheadline?: string;
  plans: Array<{
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    buttonText?: string;
    buttonLink?: string;
    highlighted?: boolean;
  }>;
};

// FAQ Section Props
export type FAQProps = {
  headline?: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
};

// CTA Section Props
export type CTAProps = {
  headline: string;
  subheadline?: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
};

/**
 * =================================================================
 * NEW COMPONENT PROPS
 * =================================================================
 */

// Image Gallery Props
export type ImageGalleryProps = {
  images: Array<{
    src: string;
    alt?: string;
    caption?: string;
  }>;
  columns?: 2 | 3 | 4;
  gap?: number;
  lightbox?: boolean;
  aspectRatio?: "square" | "landscape" | "portrait" | "auto";
  rounded?: string;
};

// Card Props
export type CardProps = {
  image?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  rounded?: string;
  padding?: string;
  imagePosition?: "top" | "left" | "right";
  imageAspectRatio?: "square" | "video" | "portrait";
};

// Spacer Props
export type SpacerProps = {
  height?: number;
  showLine?: boolean;
  lineColor?: string;
  lineWidth?: string;
  lineStyle?: "solid" | "dashed" | "dotted";
};

// Row Props (for columns)
export type RowProps = {
  columns?: 2 | 3 | 4;
  gap?: number;
  alignItems?: "start" | "center" | "end" | "stretch";
};

// Accordion Props
export type AccordionProps = {
  items: Array<{
    title: string;
    content: string;
  }>;
  allowMultiple?: boolean;
};

// Tabs Props
export type TabsProps = {
  tabs: Array<{
    label: string;
    content: string;
  }>;
};

// Heading Props
export type HeadingProps = {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: "left" | "center" | "right";
  color?: string;
};

// Link Props
export type LinkProps = {
  text: string;
  href: string;
  target?: "_blank" | "_self";
  color?: string;
  underline?: boolean;
};

/**
 * =================================================================
 * ADDITIONAL SECTION PROPS
 * =================================================================
 */

// Team Section Props
export type TeamProps = {
  headline?: string;
  members: Array<{
    name: string;
    role: string;
    image?: string;
    bio?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
    };
  }>;
};

// Logos Section Props
export type LogosProps = {
  headline?: string;
  logos: Array<{
    src: string;
    alt: string;
    link?: string;
  }>;
};

// Stats Section Props
export type StatsProps = {
  headline?: string;
  stats: Array<{
    value: string;
    label: string;
    prefix?: string;
    suffix?: string;
  }>;
};

// Contact Section Props
export type ContactProps = {
  headline?: string;
  subheadline?: string;
  email?: string;
  phone?: string;
  address?: string;
  showForm?: boolean;
};
