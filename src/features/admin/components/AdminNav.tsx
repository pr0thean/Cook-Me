'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useViewer } from '@/features/auth/viewer'

const LINKS = [
  { href: '/admin/recipes', label: 'Recipes' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/posts', label: 'Comments' },
] as const

type Props = {
  pendingUsersCount: number
  /** Rendered by the layout; the live value from the viewer takes over once it's loaded */
  newPostsCount: number
}

export function AdminNav({ pendingUsersCount, newPostsCount: initialNewPostsCount }: Props) {
  const pathname = usePathname()
  const { data: viewer } = useViewer()

  // The layout isn't re-rendered on navigation between admin pages, so after `/admin/posts` marks
  // posts as seen, only the (refreshed) viewer knows the badge is gone
  const newPostsCount = viewer?.newPostsCount ?? initialNewPostsCount

  const badges: Record<string, { count: number; label: string }> = {
    '/admin/users': { count: pendingUsersCount, label: 'pending' },
    '/admin/posts': { count: newPostsCount, label: 'new' },
  }

  return (
    <nav className="flex gap-2">
      {LINKS.map(({ href, label }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`)
        const badge = badges[href]

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(
              'flex items-center gap-2 rounded-sm px-4 py-2 font-semibold',
              isActive ? 'bg-orange text-off-black' : 'bg-blue-gray-dark hover:bg-blue-gray'
            )}
          >
            {label}
            {badge && badge.count > 0 && (
              <span
                className={clsx(
                  'rounded-full px-2 text-xs',
                  isActive ? 'bg-off-black text-white' : 'bg-orange text-off-black'
                )}
                aria-label={`${badge.count} ${badge.label}`}
              >
                {badge.count}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
