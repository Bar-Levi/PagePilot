'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting AI-powered copywriting improvements.
 *
 * The flow analyzes the user's landing page content (titles, CTAs, value propositions, and benefit statements)
 * and suggests improvements based on successful landing pages in similar industries.
 *
 * - suggestAICopywritingImprovements - The main function to trigger the flow.
 * - SuggestAICopywritingImprovementsInput - The input type for the function.
 * - SuggestAICopywritingImprovementsOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const SuggestAICopywritingImprovementsInputSchema = z.object({
  businessType: z.string().describe('The type of business or industry.'),
  targetAudience: z.string().describe('The target audience for the landing page.'),
  currentTitle: z.string().describe('The current title of the landing page.'),
  currentCTA: z.string().describe('The current call to action on the landing page.'),
  currentValueProposition: z.string().describe('The current value proposition of the landing page.'),
  currentBenefitStatements: z.string().describe('The current benefit statements of the landing page.'),
});
export type SuggestAICopywritingImprovementsInput = z.infer<
  typeof SuggestAICopywritingImprovementsInputSchema
>;

// Define the output schema
const SuggestAICopywritingImprovementsOutputSchema = z.object({
  improvedTitle: z.string().describe('An improved title for the landing page.'),
  improvedCTA: z.string().describe('An improved call to action for the landing page.'),
  improvedValueProposition: z
    .string()
    .describe('An improved value proposition for the landing page.'),
  improvedBenefitStatements: z
    .string()
    .describe('Improved benefit statements for the landing page.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggestions, referencing successful landing pages in similar industries.'
    ),
});
export type SuggestAICopywritingImprovementsOutput = z.infer<
  typeof SuggestAICopywritingImprovementsOutputSchema
>;

// Exported function to trigger the flow
export async function suggestAICopywritingImprovements(
  input: SuggestAICopywritingImprovementsInput
): Promise<SuggestAICopywritingImprovementsOutput> {
  return suggestAICopywritingImprovementsFlow(input);
}

// Define the prompt
const suggestAICopywritingImprovementsPrompt = ai.definePrompt({
  name: 'suggestAICopywritingImprovementsPrompt',
  input: {schema: SuggestAICopywritingImprovementsInputSchema},
  output: {schema: SuggestAICopywritingImprovementsOutputSchema},
  prompt: `You are an AI expert in copywriting, specializing in landing page optimization.

  Based on successful landing pages in similar industries, suggest improvements to the following elements of the landing page:
  - Title: {{{currentTitle}}}
  - Call to Action: {{{currentCTA}}}
  - Value Proposition: {{{currentValueProposition}}}
  - Benefit Statements: {{{currentBenefitStatements}}}

  The business type is: {{{businessType}}}
  The target audience is: {{{targetAudience}}}

  Provide improved versions of each element, along with a brief explanation of why the suggested changes are expected to improve performance, referencing examples from successful landing pages in similar industries.

  Ensure the suggestions are tailored to the specified business type and target audience.
  `,
});

// Define the flow
const suggestAICopywritingImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestAICopywritingImprovementsFlow',
    inputSchema: SuggestAICopywritingImprovementsInputSchema,
    outputSchema: SuggestAICopywritingImprovementsOutputSchema,
  },
  async input => {
    const {output} = await suggestAICopywritingImprovementsPrompt(input);
    return output!;
  }
);
