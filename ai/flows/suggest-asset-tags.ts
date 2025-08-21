'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting tags for assets based on visual analysis.
 *
 * - suggestAssetTags - A function that takes an asset (image) as input and returns suggested tags.
 * - SuggestAssetTagsInput - The input type for the suggestAssetTags function.
 * - SuggestAssetTagsOutput - The return type for the suggestAssetTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAssetTagsInputSchema = z.object({
  assetDataUri: z
    .string()
    .describe(
      "The asset (image) to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestAssetTagsInput = z.infer<typeof SuggestAssetTagsInputSchema>;

const SuggestAssetTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('Suggested tags for the asset.'),
});
export type SuggestAssetTagsOutput = z.infer<typeof SuggestAssetTagsOutputSchema>;

export async function suggestAssetTags(input: SuggestAssetTagsInput): Promise<SuggestAssetTagsOutput> {
  return suggestAssetTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAssetTagsPrompt',
  input: {schema: SuggestAssetTagsInputSchema},
  output: {schema: SuggestAssetTagsOutputSchema},
  prompt: `You are an expert in image analysis and tagging.

  Given the following asset, suggest relevant tags that can be used to categorize it.
  Return only an array of strings.

  Asset: {{media url=assetDataUri}}
  `,
});

const suggestAssetTagsFlow = ai.defineFlow(
  {
    name: 'suggestAssetTagsFlow',
    inputSchema: SuggestAssetTagsInputSchema,
    outputSchema: SuggestAssetTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
