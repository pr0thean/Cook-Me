import clsx from 'clsx'
import Link from 'next/link'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { UserActions } from '@/features/admin/components/UserActions'
import { requireAdmin } from '@/lib/auth'
import { countUsersByStatus, getUsersByStatus } from '@/lib/data/users'
import type { SearchParams } from '@/types/page-params'
import type { UserStatus } from '@/generated/prisma/client'

const TABS: { status: UserStatus; param: string; label: string }[] = [
  { status: 'PENDING', param: 'pending', label: 'Pending' },
  { status: 'APPROVED', param: 'approved', label: 'Approved' },
  { status: 'BANNED', param: 'banned', label: 'Banned' },
]

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' })

export default async function AdminUsersPage({ searchParams }: { searchParams: SearchParams }) {
  const { tab } = await searchParams
  const activeTab = TABS.find((t) => t.param === tab) ?? TABS[0]

  await requireAdmin(`/admin/users?tab=${activeTab.param}`)

  const [counts, users] = await Promise.all([
    countUsersByStatus(),
    getUsersByStatus(activeTab.status),
  ])

  return (
    <div className="space-y-4">
      <div role="tablist" className="border-blue-gray flex gap-6 border-b">
        {TABS.map(({ status, param, label }) => {
          const isActive = status === activeTab.status

          return (
            <Link
              key={status}
              href={`/admin/users?tab=${param}`}
              role="tab"
              aria-selected={isActive}
              className={clsx(
                '-mb-px flex items-center gap-2 border-b-2 px-1 pb-2 font-semibold',
                isActive ? 'border-orange text-orange' : 'hover:text-gray-light border-transparent'
              )}
            >
              {label}
              <span
                className={clsx(
                  'rounded-full px-2 text-xs',
                  status === 'PENDING' && counts.PENDING > 0
                    ? 'bg-orange text-off-black'
                    : 'bg-blue-gray-dark text-white'
                )}
              >
                {counts[status]}
              </span>
            </Link>
          )
        })}
      </div>

      {users.length === 0 ? (
        <p className="text-gray-light py-6">No {activeTab.label.toLowerCase()} users.</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-blue-gray-dark flex flex-col gap-3 rounded p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-gray-light text-sm break-all">{user.email}</span>
                  {user.role === 'ADMIN' && (
                    <span className="bg-yellow text-off-black rounded-sm px-1.5 text-xs font-semibold">
                      ADMIN
                    </span>
                  )}
                </div>

                <div className="text-gray-light flex flex-wrap gap-x-4 text-sm">
                  <span>Signed up {dateFormat.format(user.createdAt)}</span>
                  {user.emailConfirmed ? (
                    <span className="text-green flex items-center gap-1">
                      <CheckCircleIcon className="h-4 w-4" /> Email confirmed
                    </span>
                  ) : (
                    <span className="text-yellow flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" /> Email not confirmed
                    </span>
                  )}
                  {user.approvedAt && <span>Approved {dateFormat.format(user.approvedAt)}</span>}
                </div>

                {user.joinReason && (
                  <p className="border-blue-gray mt-2 border-l-2 pl-3 text-sm whitespace-pre-line italic">
                    {user.joinReason}
                  </p>
                )}
              </div>

              {user.role !== 'ADMIN' && (
                <UserActions
                  userId={user.id}
                  userName={user.name}
                  status={user.status}
                  emailConfirmed={user.emailConfirmed}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
