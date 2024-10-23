import { z } from 'zod'
import { heroSchema } from '@features/pages/models/hero.model'
import { sectionSchema } from '@features/pages/models/section.model'

export const pageSchema = z.object({
  slug: z.string(),
  hero: heroSchema,
  sectionsCollection: z.object({
    items: z.array(sectionSchema).optional(),
  }),
})

export type PageType = z.infer<typeof pageSchema>
