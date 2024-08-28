import { z } from 'zod'
import { buttonSchema } from '@typings/models/button.model'

export const sectionSchema = z.discriminatedUnion('__typename', [
  buttonSchema,
  // Add other section schemas here as they are defined
])

export type SectionType = z.infer<typeof sectionSchema>
