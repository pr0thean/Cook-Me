'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { UserIcon } from '@heroicons/react/24/outline'
import { DropdownMenu } from 'radix-ui'
import { signOut } from '@/app/actions/auth'
import { ACCOUNT_PATH, AUTH_PATH, authUrl, isProtectedPath } from '@/utils/auth-redirect'
import { useRefetchViewerOnNavigation, useRefreshViewer, useViewer } from './viewer'

const iconClass = 'hover:text-orange h-5 w-5 cursor-pointer sm:h-6 sm:w-6'
const itemClass =
  'flex cursor-pointer items-center justify-between gap-4 rounded-sm px-3 py-2 outline-none data-highlighted:bg-blue-gray'

/**
 * Header user icon: a sign-in link when signed out, otherwise a dropdown with the account links.
 * Admins get a dot on the icon while users are waiting for approval or there are new posts.
 */
export function UserMenu() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: viewer, isPending } = useViewer()
  const refreshViewer = useRefreshViewer()
  const [isSigningOut, startSignOut] = useTransition()

  useRefetchViewerOnNavigation()

  if (isPending || !viewer) {
    // Don't send the user back to /auth itself after signing in
    const next = pathname === AUTH_PATH ? undefined : pathname

    return (
      <Link href={authUrl(next)} aria-label="Sign in">
        <UserIcon className={iconClass} strokeWidth={2} />
      </Link>
    )
  }

  const isAdmin = viewer.role === 'ADMIN'
  const adminBadgeCount = isAdmin ? viewer.pendingUsersCount + viewer.newPostsCount : 0
  const hasAdminBadge = adminBadgeCount > 0
  const adminBadgeLabel = [
    viewer.pendingUsersCount > 0 && `${viewer.pendingUsersCount} users awaiting approval`,
    viewer.newPostsCount > 0 && `${viewer.newPostsCount} new comments`,
  ]
    .filter(Boolean)
    .join(', ')

  const handleSignOut = () =>
    startSignOut(async () => {
      await signOut()
      await refreshViewer()

      if (isProtectedPath(pathname)) router.push('/')
    })

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={hasAdminBadge ? `Account menu (${adminBadgeLabel})` : 'Account menu'}
        className="relative cursor-pointer outline-none"
      >
        <UserIcon className={iconClass} strokeWidth={2} />
        {hasAdminBadge && (
          <span className="bg-orange absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-black" />
        )}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={12}
          className="bg-blue-gray-dark border-blue-gray z-40 min-w-52 rounded-sm border p-1 text-white shadow-lg"
        >
          <DropdownMenu.Label className="px-3 py-2">
            <div className="truncate font-semibold">{viewer.name}</div>
            {viewer.status === 'PENDING' && (
              <div className="text-gray-light text-xs">Awaiting approval</div>
            )}
          </DropdownMenu.Label>

          <DropdownMenu.Separator className="bg-blue-gray my-1 h-px" />

          <DropdownMenu.Item asChild className={itemClass}>
            <Link href={ACCOUNT_PATH}>My account</Link>
          </DropdownMenu.Item>

          {isAdmin && (
            <DropdownMenu.Item asChild className={itemClass}>
              <Link href="/admin">
                Admin
                {hasAdminBadge && (
                  <span
                    className="bg-orange text-off-black rounded-full px-2 text-xs font-semibold"
                    aria-label={adminBadgeLabel}
                  >
                    {adminBadgeCount}
                  </span>
                )}
              </Link>
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Separator className="bg-blue-gray my-1 h-px" />

          <DropdownMenu.Item className={itemClass} disabled={isSigningOut} onSelect={handleSignOut}>
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
