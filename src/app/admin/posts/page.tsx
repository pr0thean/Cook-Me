import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AdminPostActions, MarkPostsSeen } from '@/features/admin/components/AdminPostActions'
import { requireAdmin } from '@/lib/auth'
import { getAdminPosts, type AdminPostFilters } from '@/lib/data/posts'
import { prismaClient } from '@/lib/prismaClient'
import type { SearchParams } from '@/types/page-params'
import type { UserStatus } from '@/generated/prisma/client'

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' })

const SNIPPET_LENGTH = 200

const STATUS_BADGE: Partial<Record<UserStatus, { label: string; className: string }>> = {
  PENDING: { label: 'PENDING', className: 'bg-yellow text-off-black' },
  BANNED: { label: 'BANNED', className: 'bg-red-700 text-white' },
}

type Query = { filter?: string; recipe?: string; user?: string; before?: string }

function positiveInt(value: string | undefined) {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : undefined
}

/** Builds a `/admin/posts` link, keeping the current filters unless overridden (`undefined` clears one) */
function postsUrl(current: Query, changes: Query) {
  const params = new URLSearchParams()
  const merged = { ...current, before: undefined, ...changes }

  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value)
  }

  const query = params.toString()
  return query ? `/admin/posts?${query}` : '/admin/posts'
}

export default async function AdminPostsPage({ searchParams }: { searchParams: SearchParams }) {
  const { filter, recipe, user, before } = await searchParams
  const query: Query = { filter, recipe, user, before }

  const admin = await requireAdmin(postsUrl(query, { before }))

  const filters: AdminPostFilters = {
    hiddenOnly: filter === 'hidden',
    recipeId: positiveInt(recipe),
    userId: positiveInt(user),
    before: positiveInt(before),
  }

  const [{ posts, nextCursor }, filterRecipe, filterUser] = await Promise.all([
    getAdminPosts(filters),
    filters.recipeId
      ? prismaClient.recipe.findUnique({ where: { id: filters.recipeId }, select: { title: true } })
      : null,
    filters.userId
      ? prismaClient.user.findUnique({ where: { id: filters.userId }, select: { name: true } })
      : null,
  ])

  // Read before <MarkPostsSeen> updates it, to highlight what's new on this visit
  const lastSeen = admin.lastSeenPostsAt

  const tabs = [
    { label: 'All', active: !filters.hiddenOnly, href: postsUrl(query, { filter: undefined }) },
    { label: 'Hidden', active: filters.hiddenOnly, href: postsUrl(query, { filter: 'hidden' }) },
  ]

  return (
    <div className="space-y-4">
      <MarkPostsSeen />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" className="border-blue-gray flex gap-6 border-b">
          {tabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              role="tab"
              aria-selected={tab.active}
              className={clsx(
                '-mb-px border-b-2 px-1 pb-2 font-semibold',
                tab.active
                  ? 'border-orange text-orange'
                  : 'hover:text-gray-light border-transparent'
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {filters.recipeId && (
            <Link
              href={postsUrl(query, { recipe: undefined })}
              className="bg-blue-gray-dark hover:bg-blue-gray flex items-center gap-1 rounded-full px-3 py-1"
            >
              Recipe: {filterRecipe?.title ?? `#${filters.recipeId}`}
              <XMarkIcon className="h-4 w-4" aria-label="Clear recipe filter" />
            </Link>
          )}
          {filters.userId && (
            <Link
              href={postsUrl(query, { user: undefined })}
              className="bg-blue-gray-dark hover:bg-blue-gray flex items-center gap-1 rounded-full px-3 py-1"
            >
              User: {filterUser?.name ?? `#${filters.userId}`}
              <XMarkIcon className="h-4 w-4" aria-label="Clear user filter" />
            </Link>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-light py-6">No comments.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => {
            const isNew = post.user.id !== admin.id && (!lastSeen || post.createdAt > lastSeen)
            const statusBadge = STATUS_BADGE[post.user.status]
            const snippet =
              post.content && post.content.length > SNIPPET_LENGTH
                ? `${post.content.slice(0, SNIPPET_LENGTH)}…`
                : post.content

            return (
              <li
                key={post.id}
                className={clsx(
                  'bg-blue-gray-dark flex flex-col gap-3 rounded p-4 sm:flex-row sm:items-start sm:justify-between',
                  post.hidden && 'opacity-60'
                )}
              >
                <div className="flex min-w-0 gap-3">
                  {post.images[0] ? (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
                      <Image
                        src={post.images[0].url}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      {post.images.length > 1 && (
                        <span className="absolute right-0.5 bottom-0.5 rounded bg-black/70 px-1 text-xs">
                          +{post.images.length - 1}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="bg-blue-gray h-16 w-16 shrink-0 rounded" />
                  )}

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <Link
                        href={postsUrl(query, { user: String(post.user.id) })}
                        className="font-semibold hover:underline"
                        title="Show only this user's comments"
                      >
                        {post.user.name}
                      </Link>
                      {statusBadge && (
                        <span
                          className={clsx(
                            'rounded-sm px-1.5 text-xs font-semibold',
                            statusBadge.className
                          )}
                        >
                          {statusBadge.label}
                        </span>
                      )}
                      {post.hidden && (
                        <span className="text-gray-light flex items-center gap-1 text-xs">
                          <EyeSlashIcon className="h-4 w-4" /> Hidden
                        </span>
                      )}
                      {isNew && (
                        <span className="bg-orange text-off-black rounded-sm px-1.5 text-xs font-semibold">
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="text-gray-light flex flex-wrap gap-x-3 text-sm">
                      <Link
                        href={`/recipes/${post.recipe.slug}#post-${post.id}`}
                        className="hover:text-white hover:underline"
                      >
                        {post.recipe.title}
                      </Link>
                      <Link
                        href={postsUrl(query, { recipe: String(post.recipe.id) })}
                        className="hover:text-white hover:underline"
                      >
                        (filter)
                      </Link>
                      <span>{dateFormat.format(post.createdAt)}</span>
                      {post.editedAt && <span>edited</span>}
                    </div>

                    {snippet && (
                      <p className="text-sm wrap-break-word whitespace-pre-line">{snippet}</p>
                    )}
                  </div>
                </div>

                <AdminPostActions
                  postId={post.id}
                  hidden={post.hidden}
                  author={{
                    id: post.user.id,
                    name: post.user.name,
                    canBan: post.user.role !== 'ADMIN' && post.user.status === 'APPROVED',
                  }}
                />
              </li>
            )
          })}
        </ul>
      )}

      {nextCursor && (
        <div className="flex justify-center">
          <Link
            href={postsUrl(query, { before: String(nextCursor) })}
            className="bg-blue-gray-dark hover:bg-blue-gray rounded-sm px-4 py-2 font-semibold"
          >
            Older posts →
          </Link>
        </div>
      )}
    </div>
  )
}
