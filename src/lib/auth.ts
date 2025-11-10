import { redirect } from 'next/navigation'
import { serverClient } from './supabase/serverClient'
import { prismaClient } from './prismaClient'

export async function getCurrentUser() {
  const supabase = await serverClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user with role from your database
  const dbUser = await prismaClient.user.findUnique({
    where: { email: user.email! },
  })

  return dbUser
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

export async function requireAdmin() {
  const user = await requireAuth()

  if (user.role !== 'ADMIN') {
    redirect('/login')
  }

  return user
}
