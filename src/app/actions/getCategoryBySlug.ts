'use server'

import { prismaClient } from 'lib/prismaClient'

export async function getCategoryBySlug(slug: string) {
  const categories = await prismaClient.category.findUnique({
    where: { slug },
    include: {
      recipes: true,
    },
  })

  return categories
}
