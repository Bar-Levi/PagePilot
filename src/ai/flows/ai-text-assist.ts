"use server";

import { getAI } from "@/ai/genkit";
import { z } from "genkit";

// ============================================================================
// Input/Output Schemas
// ============================================================================

const ImproveTextInputSchema = z.object({
  currentText: z.string().describe("The current text to improve"),
  instruction: z
    .string()
    .describe("Instruction for improvement (e.g., 'make shorter', 'more professional')"),
  businessContext: z
    .string()
    .optional()
    .describe("Business context for personalization"),
  targetAudience: z
    .string()
    .optional()
    .describe("Target audience for the text"),
});

export type ImproveTextInput = z.infer<typeof ImproveTextInputSchema>;

const ImproveTextOutputSchema = z.object({
  improvedText: z.string().describe("The improved text"),
  explanation: z.string().optional().describe("Brief explanation of changes"),
});

export type ImproveTextOutput = z.infer<typeof ImproveTextOutputSchema>;

// ============================================================================
// Predefined Improvement Instructions
// ============================================================================

export const IMPROVEMENT_INSTRUCTIONS = {
  shorter: "קצר את הטקסט תוך שמירה על המסר המרכזי",
  longer: "הרחב את הטקסט עם פרטים נוספים ודוגמאות",
  professional: "הפוך את הטקסט למקצועי ורשמי יותר",
  casual: "הפוך את הטקסט לידידותי ולא פורמלי",
  persuasive: "הפוך את הטקסט למשכנע יותר עם קריאה לפעולה",
  emotional: "הוסף אלמנטים רגשיים שיגעו בקהל",
  clear: "פשט את הטקסט והפוך אותו לברור יותר",
  seo: "מטב את הטקסט לקידום אורגני (SEO)",
  headline: "הפוך לכותרת קצרה וקליטה",
  cta: "הפוך לקריאה לפעולה משכנעת",
} as const;

export type ImprovementType = keyof typeof IMPROVEMENT_INSTRUCTIONS;

// ============================================================================
// Lazy Initialization
// ============================================================================

let improveTextPrompt: any = null;
let improveTextFlow: any = null;

const initializeAIComponents = async () => {
  const ai = await getAI();
  if (!ai || improveTextPrompt) return;

  improveTextPrompt = ai.definePrompt({
    name: "improveTextPrompt",
    input: { schema: ImproveTextInputSchema },
    output: { schema: ImproveTextOutputSchema },
    prompt: `You are an expert copywriter specializing in landing page content.

Your task is to improve the following text according to the instruction.

Current Text:
{{{currentText}}}

Instruction:
{{{instruction}}}

{{#if businessContext}}
Business Context (use this to make the text more specific and authentic):
{{{businessContext}}}
{{/if}}

{{#if targetAudience}}
Target Audience: {{{targetAudience}}}
{{/if}}

IMPORTANT:
- Output the improved text in Hebrew (עברית)
- Maintain the core message while applying the improvement
- If business context is provided, incorporate specific details from it
- Keep the text natural and engaging
- Do NOT include any HTML tags unless the original had them

Output ONLY valid JSON with "improvedText" and optionally "explanation".`,
  });

  improveTextFlow = ai.defineFlow(
    {
      name: "improveTextFlow",
      inputSchema: ImproveTextInputSchema,
      outputSchema: ImproveTextOutputSchema,
    },
    async (input: ImproveTextInput) => {
      const { output } = await improveTextPrompt(input);
      return output!;
    }
  );
};

// ============================================================================
// Exported Functions
// ============================================================================

export async function improveText(
  input: ImproveTextInput
): Promise<ImproveTextOutput> {
  await initializeAIComponents();

  if (!improveTextFlow) {
    throw new Error(
      "AI functionality is not available. Please set GEMINI_API_KEY or GOOGLE_API_KEY environment variable."
    );
  }

  return improveTextFlow(input);
}

/**
 * Quick improve with predefined instruction type
 */
export async function quickImprove(
  text: string,
  type: ImprovementType,
  businessContext?: string
): Promise<string> {
  const result = await improveText({
    currentText: text,
    instruction: IMPROVEMENT_INSTRUCTIONS[type],
    businessContext,
  });

  return result.improvedText;
}

/**
 * Generate multiple variations of text
 */
export async function generateVariations(
  text: string,
  count: number = 3,
  businessContext?: string
): Promise<string[]> {
  const variations: string[] = [];
  const types: ImprovementType[] = ["shorter", "persuasive", "emotional"];

  for (let i = 0; i < Math.min(count, types.length); i++) {
    try {
      const improved = await quickImprove(text, types[i], businessContext);
      variations.push(improved);
    } catch (error) {
      console.error(`Failed to generate variation ${i}:`, error);
    }
  }

  return variations;
}

