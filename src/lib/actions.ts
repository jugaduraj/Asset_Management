'use server';

import { suggestAssetCategory, SuggestAssetCategoryInput } from '@/ai/flows/suggest-asset-category';

export async function suggestCategoryAction(
  input: SuggestAssetCategoryInput
): Promise<string[]> {
  try {
    const result = await suggestAssetCategory(input);
    return result.categories;
  } catch (error) {
    console.error('Error suggesting asset category:', error);
    // In a real app, you might want to throw a more specific error
    // or return a structured error response.
    return [];
  }
}
