import { z } from 'zod'
import { assetSchema } from '@typings/models/asset.model'

export const heroSchema = z.object({
  heading: z.string(),
  image: assetSchema.optional(),
})

export type HeroType = z.infer<typeof heroSchema>
