import 'server-only'

import { prismaClient } from '@/lib/prismaClient'
import { recipeCardSelect } from './recipes'

export async function getStatisticsData() {
  const [recentRecipes, categoryStats, totalRecipes, totalCategories] = await Promise.all([
    // Get 4 most recent recipes
    prismaClient.recipe.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
      select: recipeCardSelect,
    }),

    // Get most popular category (category with most recipes)
    prismaClient.category.findMany({
      include: {
        _count: {
          select: {
            recipes: true,
          },
        },
      },
      orderBy: {
        recipes: {
          _count: 'desc',
        },
      },
      take: 1,
    }),

    // Get total counts for statistics
    prismaClient.recipe.count(),
    prismaClient.category.count(),
  ])

  const mostPopularCategory = categoryStats[0] || null

  return {
    recentRecipes,
    mostPopularCategory: mostPopularCategory ? mostPopularCategory.name : null,
    stats: {
      totalRecipes,
      totalCategories,
      mostPopularCategoryRecipeCount: mostPopularCategory?._count.recipes || 0,
    },
  }
}
