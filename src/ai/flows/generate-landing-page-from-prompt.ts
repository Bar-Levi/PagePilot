'use server';
/**
 * @fileOverview Generates a landing page JSON structure based on user input.
 *
 * - generateLandingPage - A function that generates a landing page.
 * - GenerateLandingPageInput - The input type for the generateLandingPage function.
 * - GenerateLandingPageOutput - The return type for the generateLandingPage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLandingPageInputSchema = z.object({
  businessDescription: z.string().describe('Description of the business.'),
  targetAudience: z.string().describe('Target audience for the landing page.'),
  tone: z.string().describe('Desired tone of the landing page (e.g., professional, playful).'),
  designSystem: z
    .string()
    .optional()
    .describe('The design system to apply (Tailwind CSS classes).'),
});
export type GenerateLandingPageInput = z.infer<typeof GenerateLandingPageInputSchema>;

const GenerateLandingPageOutputSchema = z.object({
  pageStructure: z.string().describe('JSON structure of the landing page.'),
});
export type GenerateLandingPageOutput = z.infer<typeof GenerateLandingPageOutputSchema>;

export async function generateLandingPage(input: GenerateLandingPageInput): Promise<GenerateLandingPageOutput> {
  return generateLandingPageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLandingPagePrompt',
  input: {schema: GenerateLandingPageInputSchema},
  output: {schema: GenerateLandingPageOutputSchema},
  prompt: `You are an expert landing page generator that outputs a JSON page structure based on user input.

You will receive a business description, target audience, and desired tone.

Based on this information, create a comprehensive landing page JSON structure that is mobile-friendly and optimized for conversion.

Business Description: {{{businessDescription}}}
Target Audience: {{{targetAudience}}}
Tone: {{{tone}}}

Ensure the JSON structure includes the following components:
- Hero section with a compelling headline and call-to-action.
- Value proposition section highlighting the key benefits.
- Testimonials section to build trust and credibility.
- FAQ section to address common questions.
- Pricing section to showcase different plans.
- Video embed section to provide a visual overview.
- Call-to-action section at the bottom to drive conversions.

Output ONLY valid JSON. Do NOT include any other text or markdown.
`,
});

const generateLandingPageFlow = ai.defineFlow(
  {
    name: 'generateLandingPageFlow',
    inputSchema: GenerateLandingPageInputSchema,
    outputSchema: GenerateLandingPageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
