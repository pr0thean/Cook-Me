import { z } from 'zod'
import { assetSchema } from '@typings/models/asset.model'
import { tagSchema } from '@features/recipes/models/tag.model'

export const recipeCollectionSchema = z.object({
  name: z.string(),
  slug: z.string(),
  time: z.number().optional().nullable(),
  level: z.enum(['Average', 'Easy', 'Hard']).optional().nullable(),
  image: assetSchema.optional(),
  tags: z.array(tagSchema).optional(),
})

export type RecipeCollectionType = z.infer<typeof recipeCollectionSchema>
