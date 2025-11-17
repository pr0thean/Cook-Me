'use server'

import { prismaClient } from 'lib/prismaClient'

export async function getRecipesByCategory(categorySlug: string) {
  const recipes = await prismaClient.recipe.findMany({
    where: {
      categories: {
        some: {
          slug: categorySlug,
        },
      },
    },
    include: {
      categories: true,
    },
  })

  return recipes
}
