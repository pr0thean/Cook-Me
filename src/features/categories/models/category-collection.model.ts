import { z } from 'zod'
import { assetSchema } from '@typings/models/asset.model'

export const categoryCollectionSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  image: assetSchema.optional(),
})

export type CategoryCollectionType = z.infer<typeof categoryCollectionSchema>
