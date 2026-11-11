import { cache } from 'react'
import { redirect } from 'next/navigation'
import { serverClient } from './supabase/serverClient'
import { prismaClient } from './prismaClient'
import { authUrl } from '@/utils/auth-redirect'

export const getCurrentUser = cache(async () => {
  const supabase = await serverClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  return prismaClient.user.findUnique({
    where: { authId: user.id },
  })
})

/**
 * @param next path to return to after signing in (e.g. the current page)
 */
export async function requireAuth(next?: string) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authUrl(next))
  }

  return user
}

/**
 * @param next path to return to after signing in (e.g. the current page)
 */
export async function requireAdmin(next?: string) {
  const user = await requireAuth(next)

  // Signed in but not an admin: sending them to /auth would bounce them straight back
  if (user.role !== 'ADMIN') {
    redirect('/')
  }

  return user
}
