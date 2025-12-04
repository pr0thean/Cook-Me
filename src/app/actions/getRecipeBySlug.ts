'use server'

import { prismaClient } from '@/lib/prismaClient'

export async function getRecipeBySlug(slug: string) {
  const recipe = await prismaClient.recipe.findUnique({
    where: { slug },
    include: {
      tags: true,
    },
  })

  return recipe
}
