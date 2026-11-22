'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/admin/recipes', label: 'Recipes' },
  { href: '/admin/users', label: 'Users' },
] as const

export function AdminNav({ pendingUsersCount }: { pendingUsersCount: number }) {
  const pathname = usePathname()

  return (
    <nav className="flex gap-2">
      {LINKS.map(({ href, label }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`)
        const badge = href === '/admin/users' ? pendingUsersCount : 0

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
            {badge > 0 && (
              <span
                className={clsx(
                  'rounded-full px-2 text-xs',
                  isActive ? 'bg-off-black text-white' : 'bg-orange text-off-black'
                )}
                aria-label={`${badge} pending`}
              >
                {badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
