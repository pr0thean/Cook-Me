import 'server-only'
import { prismaClient } from '@/lib/prismaClient'
import { adminClient } from '@/lib/supabase/adminClient'
import type { UserStatus } from '@/generated/prisma/client'

export type AdminUserRow = {
  id: number
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  status: UserStatus
  createdAt: Date
  approvedAt: Date | null
  joinReason: string | null
  emailConfirmed: boolean
}

export function countPendingUsers() {
  return prismaClient.user.count({ where: { status: 'PENDING' } })
}

/** Number of users per status, for the admin tabs */
export async function countUsersByStatus(): Promise<Record<UserStatus, number>> {
  const groups = await prismaClient.user.groupBy({ by: ['status'], _count: true })
  const counts: Record<UserStatus, number> = { PENDING: 0, APPROVED: 0, BANNED: 0 }

  for (const group of groups) counts[group.status] = group._count

  return counts
}

/**
 * Auth user ids whose email is confirmed. Pages through the Supabase admin API once instead of
 * one request per user; fine for the number of accounts this site will have.
 */
async function getConfirmedAuthIds() {
  const supabase = adminClient()
  const confirmed = new Set<string>()
  const perPage = 1000

  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })

    if (error) throw new Error(`Failed to list auth users: ${error.message}`)

    for (const user of data.users) {
      if (user.email_confirmed_at) confirmed.add(user.id)
    }

    if (data.users.length < perPage) break
  }

  return confirmed
}

export async function getUsersByStatus(status: UserStatus): Promise<AdminUserRow[]> {
  const [users, confirmedIds] = await Promise.all([
    prismaClient.user.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        authId: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        approvedAt: true,
        joinReason: true,
      },
    }),
    getConfirmedAuthIds(),
  ])

  return users.map(({ authId, ...user }) => ({
    ...user,
    emailConfirmed: confirmedIds.has(authId),
  }))
}
