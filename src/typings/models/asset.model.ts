import { z } from 'zod'

export const assetSchema = z.object({
  url: z.string(),
  title: z.string(),
})

export type AssetType = z.infer<typeof assetSchema>
