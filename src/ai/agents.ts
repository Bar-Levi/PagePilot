"use server";

import { getAI, FALLBACK_MODELS } from "@/ai/genkit";
import { z } from "genkit";
import type { BusinessInput } from "./types";
import type { DeepAnalysisOutput } from "./types";
import type { DocChunk } from "./rag";

async function executeWithFallback(
    ai: any,
    basePromptName: string,
    promptConfig: any,
    input: any
) {
    let lastError;

    for (const model of FALLBACK_MODELS) {
        try {
            console.log(`🤖 Executing ${basePromptName} with model: ${model}`);

            // Create a unique name for this model's prompt variant
            const specificPromptName = `${basePromptName}_${model.replace(/[^a-zA-Z0-9]/g, '_')}`;

            const promptFn = ai.definePrompt({
                ...promptConfig,
                name: specificPromptName,
                model: model,
            });

            const { output } = await promptFn(input);
            return output;
        } catch (error: any) {
            console.warn(`⚠️ Model ${model} failed for ${basePromptName}:`, error.message);
            lastError = error;

            // Delay before trying next model (4 seconds to handle rate limits)
            await new Promise(resolve => setTimeout(resolve, 4000));
        }
    }

    throw lastError || new Error(`All models failed for ${basePromptName}`);
}

// ============================================================================
// Deep Analysis Agent - Step 1
// ============================================================================

const DeepAnalysisOutputSchema = z.object({
    audienceAnalysis: z.object({
        demographics: z.string(),
        psychographics: z.string(),
        painPoints: z.array(z.string()),
        desires: z.array(z.string()),
        objections: z.array(z.string()),
        language: z.string(),
    }),
    problemSolutionFramework: z.object({
        coreProblem: z.string(),
        problemAmplification: z.string(),
        solution: z.string(),
        uniqueApproach: z.string(),
        transformation: z.string(),
    }),
    marketingStrategy: z.object({
        valueProposition: z.string(),
        primaryPromise: z.string(),
        emotionalTriggers: z.array(z.string()),
        persuasionTechniques: z.array(z.string()),
        tonality: z.string(),
        messagingAngle: z.string(),
    }),
    rawText: z.object({
        heroMessage: z.string(),
        problemNarrative: z.string(),
        solutionPresentation: z.string(),
        benefitsDescription: z.string(),
        socialProofContent: z.string(),
        offerDetails: z.string(),
        faqContent: z.string(),
        ctaMessages: z.array(z.string()),
        additionalContent: z.string(),
    }),
});

let deepAnalysisPrompt: any = null;

export async function runDeepAnalysisAgent({
    input,
    ragChunks,
}: {
    input: BusinessInput;
    ragChunks: DocChunk[];
}): Promise<DeepAnalysisOutput> {
    const ai = await getAI();
    if (!ai) {
        throw new Error("AI not available");
    }

    // Prepare RAG context
    const ragContext =
        ragChunks.length > 0
            ? ragChunks.map((chunk) => chunk.content).join("\n\n---\n\n")
            : "אין מידע נוסף זמין. השתמש רק במידע שסופק בקלט העסקי.";

    const output = await executeWithFallback(
        ai,
        "deepAnalysisPrompt",
        {
            input: {
                schema: z.object({
                    businessInput: z.any(),
                    ragContext: z.string(),
                }),
            },
            output: { schema: DeepAnalysisOutputSchema },
            prompt: `You are an expert marketing strategist and behavioral psychologist specializing in landing page optimization.

Your task is to perform a DEEP ANALYSIS of the business and create RAW TEXT content for a landing page.

# Business Information:
- Business Name: {{{businessInput.businessName}}}
- Business Type: {{{businessInput.businessType}}}
- Target Audience: {{{businessInput.audience}}}
- Main Goal: {{{businessInput.mainGoal}}}
- Desired Tone: {{{businessInput.tone}}}
- Known Pains: {{{businessInput.pains}}}
- Known Benefits: {{{businessInput.benefits}}}
{{#if businessInput.proofPoints}}
- Proof Points: {{{businessInput.proofPoints}}}
{{/if}}
{{#if businessInput.specialOffer}}
- Special Offer: {{{businessInput.specialOffer}}}
{{/if}}

# Business Context from Documents (RAG):
{{{ragContext}}}

---

# YOUR MISSION:

## Part 1: DEEP AUDIENCE ANALYSIS
Analyze the target audience from multiple angles:
- Demographics (age, location, profession, income level)
- Psychographics (values, beliefs, lifestyle, aspirations)
- Pain Points (go deep - what keeps them up at night?)
- Desires (what do they really want to achieve?)
- Objections (what might stop them from buying?)
- Language (how do they speak? what terminology resonates?)

## Part 2: PROBLEM-SOLUTION FRAMEWORK
Create a compelling narrative:
- Core Problem: What is THE main problem they face?
- Problem Amplification: Why is this problem urgent and important NOW?
- Solution: How does this business solve the problem?
- Unique Approach: What makes this solution different/better?
- Transformation: Paint the before → after picture

## Part 3: MARKETING STRATEGY
Apply behavioral economics and persuasion psychology:
- Value Proposition: Crystal clear value statement
- Primary Promise: The ONE main benefit/promise
- Emotional Triggers: Fear, desire, urgency, belonging, etc.
- Persuasion Techniques: Social proof, scarcity, authority, reciprocity, etc.
- Tonality: How should we speak to this audience?
- Messaging Angle: What's the best way to position this offer?

## Part 4: RAW TEXT GENERATION
Now, based on ALL the analysis above, generate the actual TEXT content:

**CRITICAL RULES:**
1. Write in HEBREW (עברית) - this is MANDATORY
2. Use ONLY information from the RAG context - DO NOT invent details
3. If information is missing, use placeholders like: [כאן יופיע תיאור המוצר]
4. Apply the marketing strategy and psychological insights
5. Match the desired tone and audience language
6. Make it compelling, persuasive, and conversion-focused
7. DO NOT structure into sections yet - just create raw text blocks

Generate:
- heroMessage: Powerful headline + subheadline for the hero section
- problemNarrative: Story/description of the problem (2-3 paragraphs)
- solutionPresentation: How the business solves it (2-3 paragraphs)
- benefitsDescription: Key benefits explained in detail
- socialProofContent: Testimonials, stats, case studies (use from RAG or create placeholders)
- offerDetails: What they get, pricing, guarantee, etc.
- faqContent: 5-7 common questions with answers
- ctaMessages: 3-5 different CTA button texts
- additionalContent: Any other relevant content

Remember: This is RAW TEXT - no HTML, no structure, just pure content that will be structured later.

Output ONLY valid JSON matching the schema.`,
        },
        {
            businessInput: input,
            ragContext,
        }
    );

    console.log("🧠 Deep Analysis Output:", JSON.stringify(output, null, 2));

    return output!;
}

// ============================================================================
// Structure Mapping Agent - Step 2
// ============================================================================

const SectionMappingSchema = z.object({
    id: z.string(),
    type: z.enum([
        "hero",
        "problem",
        "solution",
        "benefits",
        "features",
        "howItWorks",
        "socialProof",
        "testimonials",
        "stats",
        "offer",
        "pricing",
        "faq",
        "cta",
        "footer",
    ]),
    position: z.number(),
    componentType: z.string(),
    content: z.object({
        heading: z.string().optional(),
        subheading: z.string().optional(),
        body: z.string().optional(),
        bullets: z.array(z.string()).optional(),
        ctaText: z.string().optional(),
        ctaSecondaryText: z.string().optional(),
        items: z.array(z.any()).optional(),
        imagePrompt: z.string().optional(),
    }),
    layoutHint: z
        .object({
            variant: z.string().optional(),
            emphasis: z.enum(["high", "medium", "low"]).optional(),
            backgroundStyle: z.enum(["solid", "gradient", "image", "none"]).optional(),
            imagePosition: z.enum(["left", "right"]).optional(),
        })
        .optional(),
});

const StructuredSectionsOutputSchema = z.object({
    sections: z.array(SectionMappingSchema),
    pageFlow: z.string(),
});

let structureMappingPrompt: any = null;

export async function runStructureMappingAgent({
    input,
    deepAnalysis,
}: {
    input: BusinessInput;
    deepAnalysis: DeepAnalysisOutput;
}): Promise<any> {
    const ai = await getAI();
    if (!ai) {
        throw new Error("AI not available");
    }

    const output = await executeWithFallback(
        ai,
        "structureMappingPrompt",
        {
            input: {
                schema: z.object({
                    businessInput: z.any(),
                    deepAnalysis: z.any(),
                }),
            },
            output: { schema: StructuredSectionsOutputSchema },
            prompt: `You are an expert landing page architect and UX designer.

Your task is to take the RAW TEXT content and map it into a STRUCTURED LANDING PAGE with sections.

# Business Context:
- Business: {{{businessInput.businessName}}}
- Type: {{{businessInput.businessType}}}
- Goal: {{{businessInput.mainGoal}}}
- Audience: {{{businessInput.audience}}}

# Deep Analysis Results:
{{{json deepAnalysis}}}

---

# YOUR MISSION:

## Step 1: VISUALIZE THE PAGE
Imagine the complete landing page from top to bottom. Think about:
- What's the first thing visitors should see?
- How do we guide them through the journey?
- Where do we place social proof?
- When do we ask for the conversion?
- How do we handle objections?

## Step 2: DIVIDE INTO SECTIONS
Create a logical flow of sections from Hero to Footer.

Common patterns based on goal:
- **Leads**: Hero → Problem → Solution → Benefits → Social Proof → Lead Form → FAQ → CTA
- **Sales**: Hero → Problem → Solution → Features → Pricing → Social Proof → Offer → FAQ → CTA
- **Booking**: Hero → How It Works → Benefits → Social Proof → Booking CTA → FAQ
- **Newsletter**: Hero → Value Prop → Benefits → Social Proof → Subscribe → CTA

## Step 3: MAP CONTENT TO SECTIONS
For each section:
1. Assign a unique ID (e.g., "hero-1", "problem-1")
2. Choose the section type
3. Set the position (0 = top, incrementing)
4. Choose the right component type:
   - Hero: "HeroSection", "HeroCentered", "HeroWithImage"
   - Problem/Solution: "TextImageSection", "TwoColumnSection", "ImageText"
   - Benefits: "BenefitsGrid", "BenefitsList"
   - Features: "FeaturesGrid", "FeaturesList"
   - Social Proof: "TestimonialsCarousel", "TestimonialsGrid", "StatsSection"
   - FAQ: "FAQAccordion", "FAQList"
   - CTA: "CTASection", "CTABanner"
   - Offer: "PricingSection", "OfferSection"
   - Image+Text: "ImageText" (for sections with image and text side by side)
5. Extract the relevant content from rawText
6. Add layout hints (variant, emphasis, background style, imagePosition: "left" or "right")
7. Create image prompts if needed

## Step 4: ENSURE FLOW
Make sure the sections create a logical, persuasive flow that:
- Captures attention (Hero)
- Identifies with the problem
- Presents the solution
- Proves it works (social proof)
- Handles objections (FAQ)
- Drives action (CTA)

**CRITICAL RULES:**
1. Content must be in HEBREW (עברית)
2. Use ONLY content from the rawText - don't create new content
3. Each section should have clear, focused content
4. Don't repeat content across sections
5. Position numbers must be sequential (0, 1, 2, 3...)
6. Choose appropriate component types for each section
7. Add helpful image prompts for visual sections

Output ONLY valid JSON matching the schema.`,
        },
        {
            businessInput: input,
            deepAnalysis,
        }
    );

    console.log("🏗️ Structure Mapping Output:", JSON.stringify(output, null, 2));

    return output!;
}

// ============================================================================
// Color Palette Agent - Step 3
// ============================================================================

const ColorPaletteSchema = z.object({
    primary: z.object({
        main: z.string(),
        light: z.string(),
        dark: z.string(),
        contrast: z.string(),
    }),
    secondary: z.object({
        main: z.string(),
        light: z.string(),
        dark: z.string(),
        contrast: z.string(),
    }),
    accent: z.object({
        main: z.string(),
        light: z.string(),
        dark: z.string(),
        contrast: z.string(),
    }),
    neutral: z.object({
        white: z.string(),
        lightest: z.string(),
        light: z.string(),
        medium: z.string(),
        dark: z.string(),
        darkest: z.string(),
        black: z.string(),
    }),
    semantic: z.object({
        success: z.string(),
        warning: z.string(),
        error: z.string(),
        info: z.string(),
    }),
    background: z.object({
        default: z.string(),
        paper: z.string(),
        elevated: z.string(),
        accent: z.string(),
    }),
    text: z.object({
        primary: z.string(),
        secondary: z.string(),
        disabled: z.string(),
        inverse: z.string(),
    }),
    metadata: z.object({
        mood: z.string(),
        reasoning: z.string(),
    }),
});

let colorPalettePrompt: any = null;

export async function runColorPaletteAgent({
    input,
    deepAnalysis,
    structuredSections,
}: {
    input: BusinessInput;
    deepAnalysis: DeepAnalysisOutput;
    structuredSections: any;
}): Promise<any> {
    const ai = await getAI();
    if (!ai) {
        throw new Error("AI not available");
    }

    const output = await executeWithFallback(
        ai,
        "colorPalettePrompt",
        {
            input: {
                schema: z.object({
                    businessInput: z.any(),
                    deepAnalysis: z.any(),
                    structuredSections: z.any(),
                }),
            },
            output: { schema: ColorPaletteSchema },
            prompt: `You are an expert color psychologist and brand designer.

Your task is to create a COMPLETE COLOR PALETTE for the landing page that perfectly matches the business, audience, and emotional message.

# Business Context:
- Business: {{{businessInput.businessName}}}
- Type: {{{businessInput.businessType}}}
- Tone: {{{businessInput.tone}}}
- Audience: {{{businessInput.audience}}}

# Marketing Strategy:
- Emotional Triggers: {{{json deepAnalysis.marketingStrategy.emotionalTriggers}}}
- Tonality: {{{deepAnalysis.marketingStrategy.tonality}}}
- Messaging Angle: {{{deepAnalysis.marketingStrategy.messagingAngle}}}

# Audience Psychology:
- Psychographics: {{{deepAnalysis.audienceAnalysis.psychographics}}}
- Desires: {{{json deepAnalysis.audienceAnalysis.desires}}}

---

# YOUR MISSION:

## Step 1: UNDERSTAND COLOR PSYCHOLOGY
Consider:
- **Industry Standards**: What colors are common in this industry?
- **Audience Preferences**: What colors resonate with this demographic?
- **Emotional Goals**: What emotions do we want to evoke?
- **Cultural Context**: Hebrew/Israeli audience considerations
- **Conversion Optimization**: Colors that drive action

## Step 2: CHOOSE THE MOOD
Based on the business type and tone:
- **Professional/Corporate**: Blues, grays, navy (trust, stability)
- **Friendly/Approachable**: Warm colors, oranges, teals (warmth, energy)
- **Youthful/Playful**: Bright colors, purples, pinks (fun, creativity)
- **Luxury/Premium**: Deep colors, golds, blacks (sophistication, exclusivity)
- **Health/Wellness**: Greens, blues, earth tones (calm, natural)
- **Tech/Innovation**: Blues, purples, cyans (modern, cutting-edge)

## Step 3: CREATE THE PALETTE
Generate a complete, harmonious color palette with:

**Primary Colors** (brand identity):
- main: The core brand color (HEX format)
- light: 20-30% lighter variant
- dark: 20-30% darker variant
- contrast: Text color that works on primary background (ensure WCAG AA compliance)

**Secondary Colors** (supporting):
- Complementary or analogous to primary
- Used for secondary CTAs, highlights

**Accent Colors** (CTAs, important elements):
- High contrast, attention-grabbing
- Should stand out from primary/secondary
- Optimized for conversion (often orange, red, or bright green)

**Neutral Colors** (backgrounds, text):
- white: Pure white (#FFFFFF)
- lightest: Very light gray
- light: Light gray
- medium: Medium gray
- dark: Dark gray
- darkest: Very dark gray
- black: Pure black (#000000)

**Semantic Colors** (feedback):
- success: Green (#10B981 or similar)
- warning: Yellow/Orange (#F59E0B or similar)
- error: Red (#EF4444 or similar)
- info: Blue (#3B82F6 or similar)

**Background Colors**:
- default: Main page background
- paper: Card/section backgrounds
- elevated: Modals, dropdowns
- accent: Highlighted sections

**Text Colors**:
- primary: Main text (dark, high contrast)
- secondary: Less important text (medium contrast)
- disabled: Disabled state (low contrast)
- inverse: Text on dark backgrounds (light)

## Step 4: ENSURE ACCESSIBILITY
- All text colors must have sufficient contrast (WCAG AA: 4.5:1 for normal text, 3:1 for large text)
- CTA buttons must be highly visible
- Colors should work for colorblind users

## Step 5: ADD METADATA
- mood: Describe the overall mood (e.g., "energetic and trustworthy", "calm and professional")
- reasoning: Explain WHY you chose these colors (2-3 sentences)

**CRITICAL RULES:**
1. All colors must be in HEX format (#RRGGBB)
2. Ensure high contrast for accessibility
3. Create a cohesive, harmonious palette
4. Consider the emotional impact
5. Make CTAs stand out
6. Think about the Israeli/Hebrew market

Output ONLY valid JSON matching the schema.`,
        },
        {
            businessInput: input,
            deepAnalysis,
            structuredSections,
        }
    );

    console.log("🎨 Color Palette Output:", JSON.stringify(output, null, 2));

    return output!;
}
