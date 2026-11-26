import 'server-only'

import type { Prisma } from '@/generated/prisma/client'
import { prismaClient } from '@/lib/prismaClient'
import { getImageUrl } from '@/lib/storage'
import { POSTS_PER_PAGE, type PostData, type PostsPage } from '@/features/posts/types'
import {
  INSPIRATIONS_PER_PAGE,
  type InspirationPhoto,
  type InspirationsPage,
} from '@/features/inspirations/types'

/**
 * The one visibility rule for public post feeds: not hidden by the admin, and the author is approved
 * (posts by banned users disappear, and come back on unban).
 */
export const visiblePostWhere = {
  hidden: false,
  user: { status: 'APPROVED' },
} satisfies Prisma.PostWhereInput

const imageSelect = {
  id: true,
  path: true,
  width: true,
  height: true,
} satisfies Prisma.PostImageSelect

const postSelect = {
  id: true,
  content: true,
  createdAt: true,
  editedAt: true,
  user: { select: { id: true, name: true } },
  images: { select: imageSelect, orderBy: { position: 'asc' } },
} satisfies Prisma.PostSelect

type PostRow = Prisma.PostGetPayload<{ select: typeof postSelect }>
type ImageRow = Prisma.PostImageGetPayload<{ select: typeof imageSelect }>

function toImageData({ id, path, width, height }: ImageRow) {
  return { id, url: getImageUrl(path, 'post-images'), width, height }
}

function toPostData(post: PostRow): PostData {
  return {
    id: post.id,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    editedAt: post.editedAt?.toISOString() ?? null,
    author: post.user,
    images: post.images.map(toImageData),
  }
}

/** Visible posts under a recipe, newest first, one page at a time (`cursor` = last post id seen) */
export async function getRecipePosts(
  recipeId: number,
  { cursor, take = POSTS_PER_PAGE }: { cursor?: number; take?: number } = {}
): Promise<PostsPage> {
  const rows = await prismaClient.post.findMany({
    where: { recipeId, ...visiblePostWhere },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: take + 1, // one extra to know whether there's another page
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    select: postSelect,
  })

  const hasMore = rows.length > take
  const posts = (hasMore ? rows.slice(0, take) : rows).map(toPostData)

  return { posts, nextCursor: hasMore ? posts[posts.length - 1].id : null }
}

/**
 * Photos from visible posts across all recipes, newest post first (a post's photos stay in order),
 * one page at a time (`cursor` = last photo id seen). Feeds `/inspirations` and the home page strip.
 */
export async function getInspirationPhotos({
  cursor,
  take = INSPIRATIONS_PER_PAGE,
}: { cursor?: number; take?: number } = {}): Promise<InspirationsPage> {
  const rows = await prismaClient.postImage.findMany({
    where: { post: visiblePostWhere },
    orderBy: [{ createdAt: 'desc' }, { postId: 'desc' }, { position: 'asc' }],
    take: take + 1, // one extra to know whether there's another page
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    select: {
      ...imageSelect,
      createdAt: true,
      post: { select: { id: true, content: true, user: { select: { id: true, name: true } } } },
      recipe: { select: { slug: true, title: true } },
    },
  })

  const hasMore = rows.length > take
  const photos = (hasMore ? rows.slice(0, take) : rows).map((row): InspirationPhoto => ({
    ...toImageData(row),
    createdAt: row.createdAt.toISOString(),
    postId: row.post.id,
    content: row.post.content,
    author: row.post.user,
    recipe: row.recipe,
  }))

  return { photos, nextCursor: hasMore ? photos[photos.length - 1].id : null }
}

export function countRecipePosts(recipeId: number) {
  return prismaClient.post.count({ where: { recipeId, ...visiblePostWhere } })
}

/** Posts created since the admin last opened `/admin/posts`, not counting their own */
export function countNewPosts(admin: { id: number; lastSeenPostsAt: Date | null }) {
  return prismaClient.post.count({
    where: {
      userId: { not: admin.id },
      ...(admin.lastSeenPostsAt && { createdAt: { gt: admin.lastSeenPostsAt } }),
    },
  })
}

export const ADMIN_POSTS_PER_PAGE = 25

export type AdminPostFilters = {
  hiddenOnly?: boolean
  recipeId?: number
  userId?: number
  /** Show posts older than this post id (pagination) */
  before?: number
}

/** All posts for `/admin/posts` (hidden ones and those by banned users included), newest first */
export async function getAdminPosts({ hiddenOnly, recipeId, userId, before }: AdminPostFilters) {
  const rows = await prismaClient.post.findMany({
    where: {
      ...(hiddenOnly && { hidden: true }),
      ...(recipeId && { recipeId }),
      ...(userId && { userId }),
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: ADMIN_POSTS_PER_PAGE + 1,
    ...(before && { cursor: { id: before }, skip: 1 }),
    select: {
      id: true,
      content: true,
      createdAt: true,
      editedAt: true,
      hidden: true,
      user: { select: { id: true, name: true, status: true, role: true } },
      recipe: { select: { id: true, slug: true, title: true } },
      images: { select: imageSelect, orderBy: { position: 'asc' } },
    },
  })

  const hasMore = rows.length > ADMIN_POSTS_PER_PAGE
  const posts = (hasMore ? rows.slice(0, ADMIN_POSTS_PER_PAGE) : rows).map((post) => ({
    ...post,
    images: post.images.map(toImageData),
  }))

  return { posts, nextCursor: hasMore ? posts[posts.length - 1].id : null }
}

export type AdminPost = Awaited<ReturnType<typeof getAdminPosts>>['posts'][number]
