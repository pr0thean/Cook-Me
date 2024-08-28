import { z } from 'zod'

export const buttonSchema = z.object({
  __typename: z.literal('Button'),
  label: z.string(),
  link: z.string(),
})

export type ButtonType = z.infer<typeof buttonSchema>
