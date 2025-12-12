/**
 * AI System Types
 * 
 * This file contains all type definitions for the AI landing page generation system.
 */

// ============================================================================
// Input Types (Shared)
// ============================================================================

export interface BusinessInput {
  businessName: string;
  businessType: string; // e.g., coaching, clinic, ecom, SaaS, etc.
  audience: string; // target audience description
  mainGoal: "leads" | "sales" | "booking" | "newsletter";
  tone: "professional" | "friendly" | "youthful" | "luxury";
  pains: string[]; // main pains of the audience
  benefits: string[]; // main benefits / promises
  proofPoints?: string[]; // testimonials, stats, case studies
  specialOffer?: string; // optional offer or promotion
  docsRefId?: string; // link to uploaded docs / PDF id
}

// ============================================================================
// Deep Analysis Output (Stage 1)
// ============================================================================

export interface DeepAnalysisOutput {
  // Target Audience Analysis
  audienceAnalysis: {
    demographics: string; // age, location, profession, etc.
    psychographics: string; // values, interests, lifestyle
    painPoints: string[]; // detailed pain points
    desires: string[]; // what they want to achieve
    objections: string[]; // potential objections to overcome
    language: string; // how they speak, terminology they use
  };

  // Problem-Solution Framework
  problemSolutionFramework: {
    coreProblem: string; // the main problem
    problemAmplification: string; // why it's urgent/important
    solution: string; // how the business solves it
    uniqueApproach: string; // what makes this solution different
    transformation: string; // before → after state
  };

  // Marketing Strategy
  marketingStrategy: {
    valueProposition: string; // core value prop
    primaryPromise: string; // main promise/benefit
    emotionalTriggers: string[]; // fear, desire, urgency, etc.
    persuasionTechniques: string[]; // social proof, scarcity, authority, etc.
    tonality: string; // professional, friendly, authoritative, etc.
    messagingAngle: string; // how to position the offer
  };

  // Raw Text Content (unstructured)
  rawText: {
    heroMessage: string; // main headline + subheadline
    problemNarrative: string; // story about the problem
    solutionPresentation: string; // how we solve it
    benefitsDescription: string; // key benefits explained
    socialProofContent: string; // testimonials, stats, case studies
    offerDetails: string; // what they get, pricing, guarantee
    faqContent: string; // common questions and answers
    ctaMessages: string[]; // various CTA options
    additionalContent: string; // any other relevant content
  };
}

// ============================================================================
// Structure & Sections Output (Stage 2)
// ============================================================================

// Missing data alert for incomplete sections
export interface MissingDataAlert {
  field: string;           // e.g., "image", "testimonials", "faqItems"
  message: string;         // Human-readable message
  severity: "warning" | "critical"; // Warning = can publish, Critical = blocks publish
}

export interface SectionMapping {
  id: string; // unique section id
  type: SectionType;
  position: number; // order in the page (0 = top)
  componentType: string; // which component to use (e.g., "HeroSection", "TextImageSection")
  content: {
    heading?: string;
    subheading?: string;
    body?: string;
    bullets?: string[];
    ctaText?: string;
    ctaSecondaryText?: string;
    items?: any[]; // for lists, testimonials, FAQ, etc.
    imagePrompt?: string; // description for image generation
  };
  layoutHint?: {
    variant?: string; // "centered", "two-column", "cards", etc.
    emphasis?: "high" | "medium" | "low";
    backgroundStyle?: "solid" | "gradient" | "image" | "accent" | "none";
    imagePosition?: "left" | "right"; // For image+text sections
  };
  // Missing data tracking for publish validation
  missingData?: MissingDataAlert[];
}

export type SectionType =
  | "hero"
  | "problem"
  | "solution"
  | "benefits"
  | "features"
  | "howItWorks"
  | "socialProof"
  | "testimonials"
  | "stats"
  | "offer"
  | "pricing"
  | "faq"
  | "cta"
  | "footer"
  // Professional landing page section types
  | "authority"
  | "disqualification"
  | "valueStack"
  | "guarantee"
  | "painPoints"
  | "roadmap";

export interface StructuredSectionsOutput {
  sections: SectionMapping[];
  pageFlow: string; // description of the overall page flow
}

// ============================================================================
// Color Palette Output (Stage 3)
// ============================================================================

export interface ColorPalette {
  // Primary Colors
  primary: {
    main: string; // main brand color
    light: string; // lighter variant
    dark: string; // darker variant
    contrast: string; // text color on primary background
  };

  // Secondary Colors
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };

  // Accent Colors
  accent: {
    main: string; // for CTAs, highlights
    light: string;
    dark: string;
    contrast: string;
  };

  // Neutral Colors
  neutral: {
    white: string;
    lightest: string;
    light: string;
    medium: string;
    dark: string;
    darkest: string;
    black: string;
  };

  // Semantic Colors
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };

  // Background Colors
  background: {
    default: string; // main background
    paper: string; // cards, sections
    elevated: string; // modals, dropdowns
    accent: string; // highlighted sections
  };

  // Text Colors
  text: {
    primary: string; // main text
    secondary: string; // less important text
    disabled: string; // disabled state
    inverse: string; // text on dark backgrounds
  };

  // Metadata
  metadata: {
    mood: string; // e.g., "energetic", "calm", "professional"
    reasoning: string; // why these colors were chosen
  };
}

// ============================================================================
// Final Page Output (Stage 4)
// ============================================================================

export interface PageWithColors {
  page: any; // PageComponent from existing types
  colorPalette: ColorPalette;
  analytics: {
    recommendedEvents: Array<{
      name: string;
      description: string;
      trigger: string;
    }>;
    notesForUser: string;
  };
}

// ============================================================================
// Complete Flow Output
// ============================================================================

export interface LandingPageFlowOutput {
  deepAnalysis: DeepAnalysisOutput;
  structuredSections: StructuredSectionsOutput;
  colorPalette: ColorPalette;
  finalPage: PageWithColors;
}
