'use client'

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import type { PostsPage } from './types'

export const postsQueryKey = (recipeId: number) => ['posts', recipeId] as const

async function fetchPostsPage(recipeId: number, cursor: number | undefined): Promise<PostsPage> {
  const query = new URLSearchParams({ recipeId: String(recipeId) })
  if (cursor) query.set('cursor', String(cursor))

  const response = await fetch(`/api/posts?${query}`, { cache: 'no-store' })

  if (!response.ok) throw new Error(`Failed to load posts (${response.status})`)

  return (await response.json()) as PostsPage
}

/**
 * Posts under a recipe. Starts from the first page rendered on the server; "Load more" pages come
 * from `/api/posts`. After a change, `useRefreshPosts` re-fetches every loaded page from the start.
 */
export function useRecipePosts(recipeId: number, firstPage: PostsPage) {
  return useInfiniteQuery({
    queryKey: postsQueryKey(recipeId),
    queryFn: ({ pageParam }) => fetchPostsPage(recipeId, pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialData: { pages: [firstPage], pageParams: [undefined] },
    staleTime: 60 * 1000,
  })
}

/** Returns a function that reloads the posts list; call it after creating, editing or deleting a post */
export function useRefreshPosts(recipeId: number) {
  const queryClient = useQueryClient()

  return () => queryClient.invalidateQueries({ queryKey: postsQueryKey(recipeId) })
}
