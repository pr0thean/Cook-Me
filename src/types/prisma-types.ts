import { Category, Recipe as PrismaRecipe, Tag } from '@prisma/client'

export type Recipe = PrismaRecipe & {
  tags?: Tag[]
  categories?: Category[]
}
