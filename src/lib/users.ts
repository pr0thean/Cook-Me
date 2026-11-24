import 'server-only'
import { headers } from 'next/headers'
import { adminClient } from './supabase/adminClient'
import { prismaClient } from './prismaClient'
import {
  deletePostImageFiles,
  getPostImagePaths,
  getRecipeSlugsPostedOnBy,
  revalidatePostPages,
} from './posts'

/**
 * URL that Supabase email links (sign-up confirmation, password reset) point back to.
 * Built from the request origin so links work both locally and in production; the URL must be in
 * Supabase's redirect allow-list, and the email templates use it as `{{ .RedirectTo }}`.
 */
export async function authConfirmUrl() {
  const headerList = await headers()
  const origin =
    headerList.get('origin') ??
    `${headerList.get('x-forwarded-proto') ?? 'https'}://${headerList.get('host')}`

  return `${origin}/auth/confirm`
}

/**
 * Permanently removes an account: the Supabase auth user first (so a failure leaves everything intact),
 * then the DB row, which cascades to the user's posts, and finally the post images in storage.
 * Revalidates the recipe pages the user posted on.
 */
export async function deleteUserAccount(user: { id: number; authId: string }) {
  // Read before the cascade removes the rows
  const [imagePaths, recipeSlugs] = await Promise.all([
    getPostImagePaths({ post: { userId: user.id } }),
    getRecipeSlugsPostedOnBy(user.id),
  ])

  const { error } = await adminClient().auth.admin.deleteUser(user.authId)

  // Already gone from auth (e.g. deleted in the dashboard): still remove the DB row
  if (error && error.status !== 404) {
    throw new Error(`Failed to delete auth user: ${error.message}`)
  }

  await prismaClient.user.delete({ where: { id: user.id } })

  await deletePostImageFiles(imagePaths)
  revalidatePostPages(recipeSlugs)
}

/** Whether the user clicked the confirmation link in their sign-up email */
export async function isEmailConfirmed(authId: string) {
  const { data, error } = await adminClient().auth.admin.getUserById(authId)

  if (error) throw new Error(`Failed to load auth user: ${error.message}`)

  return Boolean(data.user.email_confirmed_at)
}
