import type { Category, Recipe as PrismaRecipe, Tag } from '@/generated/prisma/client'

export type Recipe = PrismaRecipe & {
  tags?: Tag[]
  categories?: Category[]
}
