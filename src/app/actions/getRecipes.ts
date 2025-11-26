'use server'

import { Difficulty } from '@prisma/client'
import { prismaClient } from '@/lib/prismaClient'

interface GetRecipesParams {
  searchParams?: {
    search?: string
    difficulty?: string
    category?: string
    tag?: string
  }
  cursor?: number
  take?: number
}

export async function getRecipes(params?: GetRecipesParams) {
  console.log('getRecipes')
  const { searchParams, cursor, take } = params || {}
  const { search, difficulty, category, tag } = searchParams || {}

  const recipes = await prismaClient.recipe.findMany({
    ...(take && { take: take + 1 }), // Fetch one extra to check if there's more
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
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

  if (!take) {
    return {
      recipes,
      nextCursor: null,
    }
  }

  const hasMore = recipes.length > take
  const data = hasMore ? recipes.slice(0, -1) : recipes

  return {
    recipes: data,
    nextCursor: hasMore ? data[data.length - 1].id : null,
  }
}
