import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AdminNav } from '@/features/admin/components/AdminNav'
import { requireAdmin } from '@/lib/auth'
import { countPendingUsers } from '@/lib/data/users'

export const metadata: Metadata = {
  title: 'Admin | Cook Me',
}

/**
 * Shared admin shell. Pages still call `requireAdmin` themselves: a layout doesn't re-render on
 * navigation between its pages, so it can't be the only guard.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin('/admin')

  const pendingUsersCount = await countPendingUsers()

  return (
    <div className="mt-10 space-y-6 px-4 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Admin</h1>

        <AdminNav pendingUsersCount={pendingUsersCount} />
      </div>

      {children}
    </div>
  )
}
