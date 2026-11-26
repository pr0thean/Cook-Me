'use client'

import { useEffect, useRef } from 'react'
import { Spinner } from '@/components/atoms/Spinner'
import { useViewer } from '@/features/auth/viewer'
import type { PostsPage } from '../types'
import { useRecipePosts, useRefreshPosts } from '../usePosts'
import { PostCard } from './PostCard'

/** How many pages a `#post-{id}` link may load to reach an older post */
const MAX_PAGES_FOR_LINKED_POST = 10

/** The post id in a `#post-{id}` URL hash, if any */
function linkedPostId() {
  const match = /^#post-(\d+)$/.exec(window.location.hash)

  return match ? Number(match[1]) : null
}

/**
 * Scrolls to an element and keeps it there while the layout above it settles (the recipe text is
 * rendered client-side and pushes the comments down), for a few seconds or until the user takes over.
 */
function scrollIntoViewWhenSettled(element: HTMLElement, maxMs = 3000) {
  const userEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
  const start = performance.now()
  let lastTop: number | undefined
  let stopped = false

  const stop = () => {
    stopped = true
    userEvents.forEach((type) => window.removeEventListener(type, stop))
  }
  userEvents.forEach((type) => window.addEventListener(type, stop, { passive: true }))

  const tick = () => {
    if (stopped || !element.isConnected || performance.now() - start > maxMs) return stop()

    const top = element.getBoundingClientRect().top + window.scrollY
    if (top !== lastTop) {
      lastTop = top
      element.scrollIntoView()
    }
    requestAnimationFrame(tick)
  }

  tick()
}

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

  // A `#post-{id}` link (e.g. from Inspirations) can point past the first page: load more pages
  // until the post shows up, then scroll to it. `undefined` = hash not read yet, `null` = done.
  const linkedPostRef = useRef<number | null | undefined>(undefined)

  useEffect(() => {
    if (linkedPostRef.current === undefined) linkedPostRef.current = linkedPostId()

    const target = linkedPostRef.current
    if (target === null) return

    const isLoaded = data.pages.some((page) => page.posts.some((post) => post.id === target))

    if (isLoaded) {
      linkedPostRef.current = null
      // Even on the first page: after a client-side navigation the page streams in behind
      // loading.tsx (the post didn't exist yet when Next.js tried to scroll to the hash), and the
      // recipe text above renders late either way
      const element = document.getElementById(`post-${target}`)
      if (element) scrollIntoViewWhenSettled(element)
    } else if (!hasNextPage || isError || data.pages.length >= MAX_PAGES_FOR_LINKED_POST) {
      linkedPostRef.current = null // hidden, deleted or too old: the link lands on the section
    } else if (!isFetchingNextPage) {
      fetchNextPage()
    }
  }, [data.pages, hasNextPage, isError, isFetchingNextPage, fetchNextPage])

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
