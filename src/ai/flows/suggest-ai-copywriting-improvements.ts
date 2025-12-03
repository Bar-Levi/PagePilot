"use server";

import { getAI } from "@/ai/genkit";
import { z } from "genkit";

// Simple approach - just check for API key availability
const hasApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

let aiInstance: any = null;

const getAIInstance = async () => {
  if (!hasApiKey) return null;
  if (aiInstance) return aiInstance;

  try {
    const { getAI } = await import("@/ai/genkit");
    aiInstance = await getAI();
    return aiInstance;
  } catch (error) {
    console.error("Failed to get AI instance:", error);
    return null;
  }
};

// Define the input schema
const SuggestAICopywritingImprovementsInputSchema = z.object({
  businessType: z.string().describe("The type of business or industry."),
  targetAudience: z
    .string()
    .describe("The target audience for the landing page."),
  currentTitle: z.string().describe("The current title of the landing page."),
  currentCTA: z
    .string()
    .describe("The current call to action on the landing page."),
  currentValueProposition: z
    .string()
    .describe("The current value proposition of the landing page."),
  currentBenefitStatements: z
    .string()
    .describe("The current benefit statements of the landing page."),
});
export type SuggestAICopywritingImprovementsInput = z.infer<
  typeof SuggestAICopywritingImprovementsInputSchema
>;

// Define the output schema
const SuggestAICopywritingImprovementsOutputSchema = z.object({
  improvedTitle: z.string().describe("An improved title for the landing page."),
  improvedCTA: z
    .string()
    .describe("An improved call to action for the landing page."),
  improvedValueProposition: z
    .string()
    .describe("An improved value proposition for the landing page."),
  improvedBenefitStatements: z
    .string()
    .describe("Improved benefit statements for the landing page."),
  reasoning: z
    .string()
    .describe(
      "The reasoning behind the suggestions, referencing successful landing pages in similar industries."
    ),
});
export type SuggestAICopywritingImprovementsOutput = z.infer<
  typeof SuggestAICopywritingImprovementsOutputSchema
>;

// Define AI components with lazy initialization
let suggestAICopywritingImprovementsPrompt: any = null;
let suggestAICopywritingImprovementsFlow: any = null;

const initializeAIComponents = async () => {
  const ai = await getAI();
  if (!ai || suggestAICopywritingImprovementsPrompt) return;

  suggestAICopywritingImprovementsPrompt = ai.definePrompt({
    name: "suggestAICopywritingImprovementsPrompt",
    input: { schema: SuggestAICopywritingImprovementsInputSchema },
    output: { schema: SuggestAICopywritingImprovementsOutputSchema },
    prompt: `You are an AI expert in copywriting, specializing in landing page optimization.\n\n    Based on successful landing pages in similar industries, suggest improvements to the following elements of the landing page:\n    - Title: {{{currentTitle}}}\n    - Call to Action: {{{currentCTA}}}\n    - Value Proposition: {{{currentValueProposition}}}\n    - Benefit Statements: {{{currentBenefitStatements}}}\n\n    The business type is: {{{businessType}}}\n    The target audience is: {{{targetAudience}}}\n\n    Provide improved versions of each element, along with a brief explanation of why the suggested changes are expected to improve performance, referencing examples from successful landing pages in similar industries.\n\n    Ensure the suggestions are tailored to the specified business type and target audience.\n    `,
  });

  suggestAICopywritingImprovementsFlow = ai.defineFlow(
    {
      name: "suggestAICopywritingImprovementsFlow",
      inputSchema: SuggestAICopywritingImprovementsInputSchema,
      outputSchema: SuggestAICopywritingImprovementsOutputSchema,
    },
    async (input: SuggestAICopywritingImprovementsInput) => {
      const { output } = await suggestAICopywritingImprovementsPrompt(input);
      return output!;
    }
  );
};

// Exported function to trigger the flow
export async function suggestAICopywritingImprovements(
  input: SuggestAICopywritingImprovementsInput
): Promise<SuggestAICopywritingImprovementsOutput> {
  await initializeAIComponents();

  if (!suggestAICopywritingImprovementsFlow) {
    throw new Error(
      "AI functionality is not available. Please set GEMINI_API_KEY or GOOGLE_API_KEY environment variable."
    );
  }
  return suggestAICopywritingImprovementsFlow(input);
}
