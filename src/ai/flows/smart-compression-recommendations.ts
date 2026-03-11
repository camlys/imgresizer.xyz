'use server';
/**
 * @fileOverview An AI agent that analyzes an image and suggests optimal compression settings.
 *
 * - smartCompressionRecommendations - A function that handles the image compression recommendation process.
 * - SmartCompressionRecommendationsInput - The input type for the smartCompressionRecommendations function.
 * - SmartCompressionRecommendationsOutput - The return type for the smartCompressionRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartCompressionRecommendationsInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo or image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SmartCompressionRecommendationsInput = z.infer<
  typeof SmartCompressionRecommendationsInputSchema
>;

const SmartCompressionRecommendationsOutputSchema = z.object({
  compressionPercentage: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'Suggested quality level for compression (0-100, where 100 is highest quality/least compression).'
    ),
  suggestedFormat: z
    .enum(['JPEG', 'PNG', 'WEBP'])
    .describe('The recommended image format for optimal compression.'),
  rationale: z
    .string()
    .describe(
      'A detailed explanation for the suggested compression settings, balancing file size and visual quality.'
    ),
});
export type SmartCompressionRecommendationsOutput = z.infer<
  typeof SmartCompressionRecommendationsOutputSchema
>;

export async function smartCompressionRecommendations(
  input: SmartCompressionRecommendationsInput
): Promise<SmartCompressionRecommendationsOutput> {
  return smartCompressionRecommendationsFlow(input);
}

const smartCompressionPrompt = ai.definePrompt({
  name: 'smartCompressionPrompt',
  input: {schema: SmartCompressionRecommendationsInputSchema},
  output: {schema: SmartCompressionRecommendationsOutputSchema},
  prompt: `You are an expert image compression algorithm. Analyze the provided image and recommend optimal compression settings to balance file size reduction with visual quality preservation.
Consider the image's content type (e.g., photography, illustration, text), complexity, and color palette.
Provide a 'compressionPercentage' (0-100, where 100 is highest quality, 0 is maximum compression), a 'suggestedFormat' (e.g., 'JPEG', 'PNG', 'WEBP'), and a detailed 'rationale' for your recommendations.

Image: {{media url=imageDataUri}}`,
});

const smartCompressionRecommendationsFlow = ai.defineFlow(
  {
    name: 'smartCompressionRecommendationsFlow',
    inputSchema: SmartCompressionRecommendationsInputSchema,
    outputSchema: SmartCompressionRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await smartCompressionPrompt(input);
    return output!;
  }
);
