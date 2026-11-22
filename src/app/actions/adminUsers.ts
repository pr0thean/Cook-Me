'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { prismaClient } from '@/lib/prismaClient'
import { deleteUserAccount, isEmailConfirmed } from '@/lib/users'
import type { UserStatus } from '@/generated/prisma/client'

type Result = { success: true } | { success: false; error: string }

/**
 * Loads the target user and checks it's in one of the expected statuses.
 * Admin accounts are never managed here.
 */
async function getManagedUser(
  userId: number,
  expectedStatus: UserStatus | UserStatus[]
): Promise<{ user: { id: number; authId: string } } | { error: string }> {
  const allowedStatuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus]

  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { id: true, authId: true, role: true, status: true },
  })

  if (!user) return { error: 'User not found.' }
  if (user.role === 'ADMIN') return { error: 'Admin accounts cannot be managed here.' }
  if (!allowedStatuses.includes(user.status)) {
    return { error: 'This user has changed status. Refresh the page.' }
  }

  return { user }
}

/** Revalidates the users list and the admin layout (pending badge) */
function revalidateUsers() {
  revalidatePath('/admin', 'layout')
}

export async function approveUser(userId: number): Promise<Result> {
  await requireAdmin()

  const managed = await getManagedUser(userId, 'PENDING')
  if ('error' in managed) return { success: false, error: managed.error }
  const { user } = managed

  if (!(await isEmailConfirmed(user.authId))) {
    return { success: false, error: 'The user has not confirmed their email yet.' }
  }

  await prismaClient.user.update({
    where: { id: user.id },
    data: { status: 'APPROVED', approvedAt: new Date() },
  })

  revalidateUsers()
  return { success: true }
}

export async function banUser(userId: number): Promise<Result> {
  await requireAdmin()

  const managed = await getManagedUser(userId, 'APPROVED')
  if ('error' in managed) return { success: false, error: managed.error }
  const { user } = managed

  await prismaClient.user.update({ where: { id: user.id }, data: { status: 'BANNED' } })

  // TODO(Phase 2): revalidate every recipe the user posted on, plus Inspirations and the home page
  revalidateUsers()
  return { success: true }
}

export async function unbanUser(userId: number): Promise<Result> {
  await requireAdmin()

  const managed = await getManagedUser(userId, 'BANNED')
  if ('error' in managed) return { success: false, error: managed.error }
  const { user } = managed

  await prismaClient.user.update({ where: { id: user.id }, data: { status: 'APPROVED' } })

  // TODO(Phase 2): revalidate every recipe the user posted on, plus Inspirations and the home page
  revalidateUsers()
  return { success: true }
}

/**
 * Permanently deletes an account (auth user + DB row) and its content.
 * Used to reject a pending sign-up and to delete a banned user. Nothing is kept to block the email,
 * so the same person can create a new account later.
 */
export async function deleteUser(userId: number): Promise<Result> {
  await requireAdmin()

  const managed = await getManagedUser(userId, ['PENDING', 'BANNED'])
  if ('error' in managed) return { success: false, error: managed.error }
  const { user } = managed

  try {
    await deleteUserAccount(user)
  } catch (deleteError) {
    console.error('Delete failed:', deleteError)
    return { success: false, error: 'Could not delete the user.' }
  }

  revalidateUsers()
  return { success: true }
}
