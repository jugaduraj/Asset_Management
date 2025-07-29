'use server';

/**
 * @fileOverview A flow to suggest asset categories based on asset details.
 *
 * - suggestAssetCategory - A function that suggests asset categories.
 * - SuggestAssetCategoryInput - The input type for the suggestAssetCategory function.
 * - SuggestAssetCategoryOutput - The return type for the suggestAssetCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAssetCategoryInputSchema = z.object({
  assetDetails: z
    .string()
    .describe('Detailed information about the asset, including model, serial number, purchase date, and license information.'),
});
export type SuggestAssetCategoryInput = z.infer<typeof SuggestAssetCategoryInputSchema>;

const SuggestAssetCategoryOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe('An array of suggested asset categories, such as server, workstation, or license.'),
});
export type SuggestAssetCategoryOutput = z.infer<typeof SuggestAssetCategoryOutputSchema>;

export async function suggestAssetCategory(input: SuggestAssetCategoryInput): Promise<SuggestAssetCategoryOutput> {
  return suggestAssetCategoryFlow(input);
}

const suggestAssetCategoryPrompt = ai.definePrompt({
  name: 'suggestAssetCategoryPrompt',
  input: {schema: SuggestAssetCategoryInputSchema},
  output: {schema: SuggestAssetCategoryOutputSchema},
  prompt: `You are an expert IT asset management assistant. Based on the asset details provided, suggest possible asset categories. Respond with a JSON array of strings.

Asset Details: {{{assetDetails}}}`,
});

const suggestAssetCategoryFlow = ai.defineFlow(
  {
    name: 'suggestAssetCategoryFlow',
    inputSchema: SuggestAssetCategoryInputSchema,
    outputSchema: SuggestAssetCategoryOutputSchema,
  },
  async input => {
    const {output} = await suggestAssetCategoryPrompt(input);
    return output!;
  }
);
