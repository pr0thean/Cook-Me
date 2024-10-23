import { z } from 'zod'

export const levelSchema = z.enum(['Average', 'Easy', 'Hard'])

export type LevelType = z.infer<typeof levelSchema>
