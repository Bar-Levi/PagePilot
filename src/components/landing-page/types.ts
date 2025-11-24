export type Cta = {
  text: string;
  href: string;
};

export type Image = {
  src: string;
  alt: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  avatar: Image;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type PricingPlan = {
  name: string;
  price: string;
  frequency: string;
  features: string[];
  cta: Cta;
  isFeatured?: boolean;
};

export type HeroSectionData = {
  type: "hero";
  headline: string;
  subheadline: string;
  cta: Cta;
  image: Image;
};

export type TextImageSectionData = {
  type: "text-image";
  headline: string;
  text: string;
  image: Image;
  imagePosition: "left" | "right";
};

export type TestimonialsSectionData = {
  type: "testimonials";
  headline: string;
  testimonials: Testimonial[];
};

export type FaqSectionData = {
  type: "faq";
  headline: string;
  questions: FaqItem[];
};

export type PricingSectionData = {
  type: "pricing";
  headline: string;
  plans: PricingPlan[];
};

export type VideoSectionData = {
  type: "video";
  headline: string;
  youtubeId: string;
};

export type CtaSectionData = {
  type: "cta";
  headline: string;
  subheadline: string;
  cta: Cta;
};

export type Section =
  | HeroSectionData
  | TextImageSectionData
  | TestimonialsSectionData
  | FaqSectionData
  | PricingSectionData
  | VideoSectionData
  | CtaSectionData;

export type PageData = {
  pageStructure: Section[];
};
