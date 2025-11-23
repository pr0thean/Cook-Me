'use server'

import { Difficulty } from '@prisma/client'
import { prismaClient } from 'lib/prismaClient'

interface GetRecipesParams {
  search?: string
  difficulty?: string
  category?: string
  tag?: string
}

export async function getRecipes(params?: GetRecipesParams) {
  const { search, difficulty, category, tag } = params || {}

  const recipes = await prismaClient.recipe.findMany({
    where: {
      ...(search && {
        title: { contains: search, mode: 'insensitive' },
      }),

      ...(difficulty && {
        difficulty: difficulty.toUpperCase() as Difficulty,
      }),

      ...(category && {
        categories: {
          some: {
            name: { equals: category, mode: 'insensitive' },
          },
        },
      }),

      ...(tag && {
        tags: {
          some: {
            name: { equals: tag, mode: 'insensitive' },
          },
        },
      }),
    },

    include: {
      tags: true,
    },

    orderBy: {
      createdAt: 'desc',
    },
  })

  return recipes
}
