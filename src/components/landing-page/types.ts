

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
  | "TextContainer"
  | "TextSpan"
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
  | TextContainerProps
  | TextSpanProps
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


// 4. Image Props
export type ImageProps = {
  src: string;
  alt: string;
  width?: string | number;
  maxWidth?: string | number;
  rounded?: string;
  shadow?: string;
  alignment?: "left" | "center" | "right";
};

// 5. Video Props
export type VideoProps = {
  youtubeId: string;
  autoplay?: boolean;
  controls?: boolean;
  ratio?: "16:9" | "4:3" | "1:1";
  alignment?: "left" | "center" | "right";
};

// 6. Button Props
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

// 7. Divider Props
export type DividerProps = {
  thickness?: number;
  color?: string;
  spacing?: number;
};

// 8. Input Props (for Forms)
export type InputProps = {
    label: string;
    placeholder?: string;
    name: string; // for form submission
    required?: boolean;
};

// 9. Checkbox Props (for Forms)
export type CheckboxProps = {
    label: string;
    name: string;
    required?: boolean;
};

// 10. Carousel Props
export type CarouselProps = {
    // items are passed as children
};

// 11. Form Props
export type FormProps = {
    // children are the form fields (Input, Checkbox, etc.)
    // plus a submit Button.
};
