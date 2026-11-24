'use client'

import { Spinner } from '@/components/atoms/Spinner'
import { useViewer } from '@/features/auth/viewer'
import type { PostsPage } from '../types'
import { useRecipePosts, useRefreshPosts } from '../usePosts'
import { PostCard } from './PostCard'

type Props = {
  recipeId: number
  firstPage: PostsPage
}

/** Posts under a recipe, newest first, 10 at a time with "Load more" */
export function PostList({ recipeId, firstPage }: Props) {
  const { data: viewer } = useViewer()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } = useRecipePosts(
    recipeId,
    firstPage
  )
  const refreshPosts = useRefreshPosts(recipeId)

  const posts = data.pages.flatMap((page) => page.posts)

  if (posts.length === 0) {
    return <p className="text-blue-gray">No comments yet. Be the first to share how it went!</p>
  }

  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} viewer={viewer} onChanged={refreshPosts} />
      ))}

      {isError && <p className="text-sm text-red-700">Could not load more comments.</p>}

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="border-gray hover:bg-gray-lighter flex cursor-pointer items-center gap-2 rounded-sm border px-5 py-2 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage && <Spinner />}
            {isFetchingNextPage ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  )
}
