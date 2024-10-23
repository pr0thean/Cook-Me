import { z } from 'zod'
import { assetSchema } from '@typings/models/asset.model'
import { levelSchema } from '@features/recipes/models/level.model'
import { tagSchema } from '@features/recipes/models/tag.model'

export const recipeSchema = z.object({
  name: z.string(),
  slug: z.string(),
  ingredients: z.object({
    json: z.any(),
  }),
  instruction: z.object({
    json: z.any(),
  }),
  time: z.number().optional().nullable(),
  level: levelSchema.optional().nullable(),
  image: assetSchema.optional(),
  tags: z.array(tagSchema).optional(),
})

export type RecipeType = z.infer<typeof recipeSchema>
