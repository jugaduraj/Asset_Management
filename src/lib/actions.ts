// src/lib/actions.ts
'use server';

import { suggestAssetTags } from '../ai/flows/suggest-asset-tags';
import { z } from 'zod';

const SuggestTagsActionInput = z.object({
  assetDataUri: z.string().refine(val => val.startsWith('data:image/'), {
    message: 'Asset must be an image data URI.',
  }),
});

export async function suggestAssetTagsAction(formData: FormData) {
  const input = SuggestTagsActionInput.safeParse({ assetDataUri: formData.get('assetDataUri') });
  
  if (!input.success) {
    return { success: false, error: 'Invalid input.' };
  }

  try {
    const result = await suggestAssetTags({ assetDataUri: input.data.assetDataUri });
    return { success: true, tags: result.tags };
  } catch (error) {
    console.error('Error suggesting tags:', error);
    return { success: false, error: 'Failed to suggest tags due to a server error.' };
  }
}
