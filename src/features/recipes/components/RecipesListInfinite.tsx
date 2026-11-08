'use client'

import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { RecipeCard } from './RecipeCard'
import type { RecipesPage } from '@/lib/data/recipes'
import { Spinner } from '@/components/atoms/Spinner'
import { useInfiniteQuery } from '@tanstack/react-query'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'

const RECIPES_PER_PAGE = 10

async function fetchRecipesPage(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value))
  }

  const res = await fetch(`/api/recipes?${query}`)
  if (!res.ok) {
    throw new Error(`Failed to load recipes (${res.status})`)
  }

  return (await res.json()) as RecipesPage
}

export const RecipesListInfinite = () => {
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || undefined
  const difficulty = searchParams.get('difficulty') || undefined
  const category = searchParams.get('category') || undefined
  const tag = searchParams.get('tag') || undefined

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useInfiniteQuery({
      queryKey: ['recipes', { search, difficulty, category, tag }],
      queryFn: ({ pageParam }) =>
        fetchRecipesPage({
          search,
          difficulty,
          category,
          tag,
          cursor: pageParam,
          take: RECIPES_PER_PAGE,
        }),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    })

  const recipes = data?.pages.flatMap((page) => page.recipes) ?? []

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage,
    onLoadMore: loadMore,
    disabled: isError,
    rootMargin: '0px 0px 400px 0px',
  })

  if (isLoading) {
    return <SkeletonLoader type="recipes-list" />
  }

  if (isError) {
    return <div className="text-center text-red-500">Error loading recipes: {error?.message}</div>
  }

  if (recipes.length === 0) {
    return <div className="text-yellow text-center">No recipes found</div>
  }

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

      {!hasNextPage && !isFetchingNextPage && recipes.length > 0 && (
        <p className="mt-8 text-center text-gray-500">You&apos;ve reached the end!</p>
      )}
    </div>
  )
}
