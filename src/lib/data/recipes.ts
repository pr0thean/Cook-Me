import 'server-only'

import { Difficulty, Prisma } from '@/generated/prisma/client'
import { prismaClient } from '@/lib/prismaClient'

// Only the fields RecipeCard renders; keeps list payloads small and free of Dates
export const recipeCardSelect = {
  id: true,
  slug: true,
  title: true,
  imageUrl: true,
  difficulty: true,
  time: true,
  tags: { select: { name: true } },
} satisfies Prisma.RecipeSelect

export type RecipeCardData = Prisma.RecipeGetPayload<{ select: typeof recipeCardSelect }>

export interface RecipeFilters {
  search?: string
  difficulty?: string
  category?: string
  tag?: string
}

interface GetRecipesParams {
  filters?: RecipeFilters
  cursor?: number
  take?: number
}

export async function getRecipes(params?: GetRecipesParams) {
  const { filters, cursor, take } = params || {}
  const { search, difficulty, category, tag } = filters || {}

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

    select: recipeCardSelect,

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

export type RecipesPage = Awaited<ReturnType<typeof getRecipes>>

export async function getRecipeSlugs() {
  return prismaClient.recipe.findMany({ select: { slug: true } })
}

export async function getRecipeBySlug(slug: string) {
  return prismaClient.recipe.findUnique({
    where: { slug },
    include: {
      tags: true,
    },
  })
}
