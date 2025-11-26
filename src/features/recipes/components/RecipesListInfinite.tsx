'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { RecipeCard } from './RecipeCard'
import { getRecipes } from '@/app/actions/getRecipes'
import { Recipe } from '@/types/prisma-types'
import { Spinner } from '@/components/atoms/Spinner'

interface RecipesListInfiniteProps {
  initialRecipes: Recipe[]
  initialCursor: number | null
}

const RECIPES_PER_PAGE = 10

export const RecipesListInfinite = ({
  initialRecipes,
  initialCursor,
}: RecipesListInfiniteProps) => {
  const searchParams = useSearchParams()

  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [cursor, setCursor] = useState<number | null>(initialCursor)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasNextPage = cursor !== null

  // Reset when filters change
  useEffect(() => {
    setRecipes(initialRecipes)
    setCursor(initialCursor)
    setError(null)
  }, [initialRecipes, initialCursor])

  const loadMore = useCallback(async () => {
    if (!cursor) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await getRecipes({
        searchParams: {
          search: searchParams.get('search') || undefined,
          difficulty: searchParams.get('difficulty') || undefined,
          category: searchParams.get('category') || undefined,
          tag: searchParams.get('tag') || undefined,
        },
        cursor,
        take: RECIPES_PER_PAGE,
      })

      setRecipes((prev) => [...prev, ...result.recipes])
      setCursor(result.nextCursor)
    } catch (err) {
      console.error('Error loading more recipes:', err)
      setError('Error loading more recipes')
    } finally {
      setIsLoading(false)
    }
  }, [cursor, searchParams])

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage,
    onLoadMore: loadMore,
    disabled: Boolean(error),
    rootMargin: '0px 0px 400px 0px',
  })

  return (
    <div>
      <ul className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:gap-6 md:px-6">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard data={recipe} />
          </li>
        ))}
      </ul>

      {/* Sentry element for infinite scroll */}
      {(hasNextPage || isLoading) && (
        <div ref={sentryRef} className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <Spinner />
            <span>Loading more recipes...</span>
          </div>
        </div>
      )}

      {error && <div className="mt-8 text-center text-red-500">{error}</div>}

      {!hasNextPage && !isLoading && recipes.length > 0 && (
        <p className="mt-8 text-center text-gray-500">You&apos;ve reached the end!</p>
      )}
    </div>
  )
}
