import type { PostImageData } from '@/features/posts/types'

export const INSPIRATIONS_PER_PAGE = 24
export const HOME_COMMUNITY_PHOTOS = 6

/** One photo on the Inspirations wall, with what the viewer shows about its post */
export type InspirationPhoto = PostImageData & {
  /** The post's date (ISO string) */
  createdAt: string
  postId: number
  content: string | null
  author: { id: number; name: string }
  recipe: { slug: string; title: string }
}

export type InspirationsPage = {
  photos: InspirationPhoto[]
  nextCursor: number | null
}

/** Where a photo's post lives: its recipe page, scrolled to the post */
export function postHref(photo: Pick<InspirationPhoto, 'postId' | 'recipe'>) {
  return `/recipes/${photo.recipe.slug}#post-${photo.postId}`
}
