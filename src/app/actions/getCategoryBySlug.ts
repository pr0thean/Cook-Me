'use server'

import { prismaClient } from '@/lib/prismaClient'

export async function getCategoryBySlug(slug: string) {
  const category = await prismaClient.category.findUnique({
    where: { slug },
    include: {
      recipes: true,
    },
  })

  category?.recipes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return category
}
