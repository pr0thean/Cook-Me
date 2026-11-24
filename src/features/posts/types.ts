/** Limits shared by the composer (client) and the post actions (server) */
export const POST_CONTENT_MAX_LENGTH = 1000
export const POST_MAX_IMAGES = 3
export const POST_IMAGE_MAX_BYTES = 1024 * 1024
export const POST_IMAGE_TYPES = ['image/webp', 'image/jpeg'] as const
export const POSTS_PER_PAGE = 10

export type PostImageData = {
  id: number
  url: string
  width: number
  height: number
}

/** A post as the recipe page renders it. Dates are ISO strings so it's the same over JSON and RSC. */
export type PostData = {
  id: number
  content: string | null
  createdAt: string
  editedAt: string | null
  author: { id: number; name: string }
  images: PostImageData[]
}

export type PostsPage = {
  posts: PostData[]
  nextCursor: number | null
}

export type PostActionResult = { success: true } | { success: false; error: string }
