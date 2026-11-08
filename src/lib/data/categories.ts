import 'server-only'

import { prismaClient } from '@/lib/prismaClient'
import { recipeCardSelect } from './recipes'

export async function getCategories() {
  return prismaClient.category.findMany()
}

export async function getCategoryBySlug(slug: string) {
  return prismaClient.category.findUnique({
    where: { slug },
    include: {
      recipes: {
        select: recipeCardSelect,
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}
