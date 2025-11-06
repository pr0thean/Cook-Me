'use server'

import { prismaClient } from '@lib/prismaClient'

export async function getRecipes() {
  const recipes = await prismaClient.recipe.findMany({
    include: {
      category: true,
    },
  })

  return recipes
}
