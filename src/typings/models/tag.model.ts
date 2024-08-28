import { z } from 'zod'

export const tagSchema = z.object({
  name: z.string(),
})

export type TagType = z.infer<typeof tagSchema>
