'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { prismaClient } from '@/lib/prismaClient'
import { revalidatePostPages } from '@/lib/posts'
import type { PostActionResult } from '@/features/posts/types'

/** Hides a post from everyone (author included), or shows it again */
export async function setPostHidden(postId: number, hidden: boolean): Promise<PostActionResult> {
  await requireAdmin()

  const post = await prismaClient.post
    .update({
      where: { id: postId },
      data: { hidden },
      select: { recipe: { select: { slug: true } } },
    })
    .catch(() => null)

  if (!post) return { success: false, error: 'This comment no longer exists. Refresh the page.' }

  revalidatePostPages([post.recipe.slug])
  revalidatePath('/admin/posts')

  return { success: true }
}

/** Clears the "new posts" badge. Called when the admin opens `/admin/posts`. */
export async function markPostsSeen() {
  const admin = await requireAdmin()

  await prismaClient.user.update({
    where: { id: admin.id },
    data: { lastSeenPostsAt: new Date() },
  })
}
