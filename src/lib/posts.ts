import 'server-only'

import { revalidatePath } from 'next/cache'
import type { Prisma } from '@/generated/prisma/client'
import { prismaClient } from './prismaClient'
import { deleteFiles } from './storage'

/**
 * Refreshes every cached page that shows posts: the given recipe pages, plus the home page and
 * Inspirations (both show community photos).
 */
export function revalidatePostPages(recipeSlugs: Iterable<string>) {
  for (const slug of new Set(recipeSlugs)) {
    revalidatePath(`/recipes/${slug}`)
  }

  revalidatePath('/')
  revalidatePath('/inspirations')
}

/** Slugs of the recipes a user has posted on (to revalidate them after a ban, rename, …) */
export async function getRecipeSlugsPostedOnBy(userId: number) {
  const recipes = await prismaClient.recipe.findMany({
    where: { posts: { some: { userId } } },
    select: { slug: true },
  })

  return recipes.map((recipe) => recipe.slug)
}

/** Storage paths of every image of the matching posts. Read them before deleting the rows. */
export async function getPostImagePaths(where: Prisma.PostImageWhereInput) {
  const images = await prismaClient.postImage.findMany({ where, select: { path: true } })

  return images.map((image) => image.path)
}

/**
 * Removes post images from storage after their rows are gone. Failures are only logged: the content
 * is already deleted, and a stray file is better than failing the whole operation.
 */
export async function deletePostImageFiles(paths: string[]) {
  try {
    await deleteFiles(paths, 'post-images')
  } catch (error) {
    console.error('Failed to delete post images from storage:', paths, error)
  }
}
