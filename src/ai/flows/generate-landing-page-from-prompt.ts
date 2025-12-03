"use server";

import { getAI } from "@/ai/genkit";
import { z } from "genkit";

// ============================================================================
// Input/Output Schemas
// ============================================================================

const GenerateLandingPageInputSchema = z.object({
  businessDescription: z.string().describe("Description of the business."),
  targetAudience: z.string().describe("Target audience for the landing page."),
  tone: z
    .string()
    .describe("Desired tone of the landing page (e.g., professional, playful)."),
  businessContext: z
    .string()
    .optional()
    .describe("Additional business context from documents/files for RAG."),
});

export type GenerateLandingPageInput = z.infer<typeof GenerateLandingPageInputSchema>;

const SectionSchema = z.object({
  type: z.string().describe("Section type: hero, text-image, testimonials, faq, pricing, video, cta"),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  body: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  imageUrl: z.string().optional(),
  items: z.array(z.any()).optional(),
});

const GenerateLandingPageOutputSchema = z.object({
  title: z.string().describe("Page title"),
  sections: z.array(SectionSchema).describe("Array of page sections"),
});

export type GenerateLandingPageOutput = z.infer<typeof GenerateLandingPageOutputSchema>;

// ============================================================================
// Lazy Initialization
// ============================================================================

let prompt: any = null;
let generateLandingPageFlow: any = null;

const initializeAIComponents = async () => {
  const ai = await getAI();
  if (!ai || prompt) return;

  prompt = ai.definePrompt({
    name: "generateLandingPagePrompt",
    input: { schema: GenerateLandingPageInputSchema },
    output: { schema: GenerateLandingPageOutputSchema },
    prompt: `You are an expert landing page generator that creates compelling, conversion-focused landing pages.

You will receive:
- Business Description: {{{businessDescription}}}
- Target Audience: {{{targetAudience}}}
- Tone: {{{tone}}}
{{#if businessContext}}

IMPORTANT - Business Context (RAG):
The following is detailed information about the business extracted from their documents. Use this information to create HIGHLY SPECIFIC and PERSONALIZED content:

{{{businessContext}}}

CRITICAL INSTRUCTIONS:
- Extract and use specific product names, services, and pricing from the context
- Reference actual details, features, and benefits mentioned in the documents
- Use the exact terminology and brand voice found in the business context
- Create messaging that feels authentic to this specific business
- If specific products/services are mentioned, feature them prominently
- Match the business's actual offerings - do NOT make up generic content
{{/if}}

Generate a complete landing page structure with the following sections:

1. **Hero Section** (type: "hero")
   - Compelling headline that captures the unique value proposition
   - Subheadline that expands on the benefit
   - Clear call-to-action button

2. **Features/Benefits Section** (type: "text-image")
   - Highlight 3-4 key features or benefits
   - Each with a title and description

3. **Social Proof Section** (type: "testimonials")
   - 2-3 customer testimonials (can be placeholder if no real ones provided)
   - Include name and role/company

4. **FAQ Section** (type: "faq")
   - 3-5 common questions and answers

5. **CTA Section** (type: "cta")
   - Strong closing headline
   - Final call-to-action

Output ONLY valid JSON. No markdown, no explanations.
The content should be in Hebrew (עברית).`,
  });

  generateLandingPageFlow = ai.defineFlow(
    {
      name: "generateLandingPageFlow",
      inputSchema: GenerateLandingPageInputSchema,
      outputSchema: GenerateLandingPageOutputSchema,
    },
    async (input: GenerateLandingPageInput) => {
      const { output } = await prompt(input);
      return output!;
    }
  );
};

// ============================================================================
// Exported Function
// ============================================================================

export async function generateLandingPage(
  input: GenerateLandingPageInput
): Promise<GenerateLandingPageOutput> {
  await initializeAIComponents();

  if (!generateLandingPageFlow) {
    throw new Error(
      "AI functionality is not available. Please set GEMINI_API_KEY or GOOGLE_API_KEY environment variable."
    );
  }

  return generateLandingPageFlow(input);
}

// ============================================================================
// Convert AI Output to PageComponent Structure
// ============================================================================

export function convertToPageComponents(output: GenerateLandingPageOutput): any {
  const components: any[] = [];

  for (const section of output.sections) {
    switch (section.type) {
      case "hero":
        components.push({
          id: `hero-${Date.now()}`,
          type: "Container",
          props: {
            style: {
              padding: "96px 32px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 24,
            },
          },
          children: [
            {
              id: `hero-title-${Date.now()}`,
              type: "RichText",
              props: {
                html: `<span style="font-size: 48px; font-weight: 700; color: white;">${section.headline || ""}</span>`,
                align: "center",
              },
            },
            {
              id: `hero-subtitle-${Date.now()}`,
              type: "RichText",
              props: {
                html: `<span style="font-size: 20px; color: rgba(255,255,255,0.9);">${section.subheadline || ""}</span>`,
                align: "center",
              },
            },
            {
              id: `hero-cta-${Date.now()}`,
              type: "Button",
              props: {
                text: section.buttonText || "התחל עכשיו",
                href: section.buttonLink || "#",
                variant: "default",
                size: "lg",
              },
            },
          ],
        });
        break;

      case "text-image":
        components.push({
          id: `features-${Date.now()}`,
          type: "Container",
          props: {
            style: {
              padding: "64px 32px",
              background: "#ffffff",
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
                html: `<span style="font-size: 36px; font-weight: 700;">${section.headline || "למה לבחור בנו?"}</span>`,
                align: "center",
              },
            },
            {
              id: `features-body-${Date.now()}`,
              type: "RichText",
              props: {
                html: `<span style="font-size: 18px; color: #64748b;">${section.body || ""}</span>`,
                align: "center",
              },
            },
          ],
        });
        break;

      case "testimonials":
        components.push({
          id: `testimonials-${Date.now()}`,
          type: "Container",
          props: {
            style: {
              padding: "64px 32px",
              background: "#f8fafc",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
            },
          },
          children: [
            {
              id: `testimonials-title-${Date.now()}`,
              type: "RichText",
              props: {
                html: `<span style="font-size: 36px; font-weight: 700;">${section.headline || "מה הלקוחות אומרים"}</span>`,
                align: "center",
              },
            },
            ...(section.items || []).map((item: any, index: number) => ({
              id: `testimonial-${index}-${Date.now()}`,
              type: "Container",
              props: {
                style: {
                  padding: "24px",
                  background: "#ffffff",
                  radius: "12px",
                  maxWidth: "500px",
                },
              },
              children: [
                {
                  id: `testimonial-text-${index}-${Date.now()}`,
                  type: "RichText",
                  props: {
                    html: `<span style="font-size: 16px; font-style: italic;">"${item.text || ""}"</span>`,
                    align: "center",
                  },
                },
                {
                  id: `testimonial-author-${index}-${Date.now()}`,
                  type: "RichText",
                  props: {
                    html: `<span style="font-size: 14px; color: #64748b;">— ${item.author || ""}</span>`,
                    align: "center",
                  },
                },
              ],
            })),
          ],
        });
        break;

      case "faq":
        components.push({
          id: `faq-${Date.now()}`,
          type: "Container",
          props: {
            style: {
              padding: "64px 32px",
              background: "#ffffff",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
            },
          },
          children: [
            {
              id: `faq-title-${Date.now()}`,
              type: "RichText",
              props: {
                html: `<span style="font-size: 36px; font-weight: 700;">${section.headline || "שאלות נפוצות"}</span>`,
                align: "center",
              },
            },
            ...(section.items || []).map((item: any, index: number) => ({
              id: `faq-item-${index}-${Date.now()}`,
              type: "Container",
              props: {
                style: {
                  padding: "16px",
                  flexDirection: "column",
                  gap: 8,
                  maxWidth: "700px",
                  width: "100%",
                },
              },
              children: [
                {
                  id: `faq-q-${index}-${Date.now()}`,
                  type: "RichText",
                  props: {
                    html: `<span style="font-size: 18px; font-weight: 600;">${item.question || ""}</span>`,
                    align: "right",
                  },
                },
                {
                  id: `faq-a-${index}-${Date.now()}`,
                  type: "RichText",
                  props: {
                    html: `<span style="font-size: 16px; color: #64748b;">${item.answer || ""}</span>`,
                    align: "right",
                  },
                },
              ],
            })),
          ],
        });
        break;

      case "cta":
        components.push({
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
                html: `<span style="font-size: 32px; font-weight: 700; color: white;">${section.headline || "מוכנים להתחיל?"}</span>`,
                align: "center",
              },
            },
            {
              id: `cta-button-${Date.now()}`,
              type: "Button",
              props: {
                text: section.buttonText || "צור קשר",
                href: section.buttonLink || "#",
                variant: "default",
                size: "lg",
              },
            },
          ],
        });
        break;
    }
  }

  return {
    id: "page-root",
    type: "Page",
    props: {},
    children: components,
  };
}
