'use client'

import type { PostsPage } from '../types'
import { PostComposer } from './PostComposer'
import { PostList } from './PostList'

type Props = {
  recipeId: number
  recipeSlug: string
  count: number
  firstPage: PostsPage
}

export function PostsSection({ recipeId, recipeSlug, count, firstPage }: Props) {
  return (
    <section id="posts" className="space-y-5">
      <h2 className="text-2xl font-semibold">
        Comments <span className="text-blue-gray">({count})</span>
      </h2>

      <PostComposer recipeId={recipeId} recipeSlug={recipeSlug} />

      <PostList recipeId={recipeId} firstPage={firstPage} />
    </section>
  )
}
