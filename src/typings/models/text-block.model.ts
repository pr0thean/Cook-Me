import { z } from 'zod'

export const textBlockSchema = z.object({
  __typename: z.literal('TextBlock'),
  heading: z.string().optional(),
  content: z.object({
    __typename: z.literal('TextBlockContent'),
    json: z.any(),
  }),
})

export type TextBlockType = z.infer<typeof textBlockSchema>
