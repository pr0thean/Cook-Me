'use server'

import { prismaClient } from '@lib/prismaClient'

export async function getRecipeBySlug(slug: string) {
  console.log(slug)
  const categories = await prismaClient.recipe.findUnique({
    where: { slug },
  })

  return categories
}
