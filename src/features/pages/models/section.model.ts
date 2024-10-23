import { z } from 'zod'
import { buttonSchema } from '@typings/models/button.model'
import { textBlockSchema } from '@typings/models/text-block.model'

export const sectionSchema = z.discriminatedUnion('__typename', [
  buttonSchema,
  textBlockSchema,
  // Add other section schemas here as they are defined
])

export type SectionType = z.infer<typeof sectionSchema>
