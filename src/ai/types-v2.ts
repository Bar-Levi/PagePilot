/**
 * New Flow Types - V2 Architecture
 * 
 * Flow:
 * 1. Deep Analysis & Raw Text Generation
 * 2. Structure & Sections Mapping
 * 3. Color Palette Generation
 * 4. Final Page JSON Builder
 */

import type { BusinessInput } from "./types";

// ============================================================================
// Step 1: Deep Analysis & Raw Text Generation
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
// Step 2: Structure & Sections Mapping
// ============================================================================

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
    | "footer";

export interface StructuredSectionsOutput {
    sections: SectionMapping[];
    pageFlow: string; // description of the overall page flow
}

// ============================================================================
// Step 3: Color Palette Generation
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
// Step 4: Final Page JSON (uses existing PageComponent type)
// ============================================================================

// We'll use the existing PageComponent from @/components/landing-page/types
// But we'll add color information to it

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

export interface LandingPageFlowV2Output {
    deepAnalysis: DeepAnalysisOutput;
    structuredSections: StructuredSectionsOutput;
    colorPalette: ColorPalette;
    finalPage: PageWithColors;
}
