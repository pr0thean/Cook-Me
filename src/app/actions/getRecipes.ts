'use server'

import { prisma } from '@lib/prisma'

export async function getRecipes() {
  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
    },
  })

  return recipes
}
