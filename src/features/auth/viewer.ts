'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Role, UserStatus } from '@/generated/prisma/client'
import { useIsHydrated } from '@/hooks/useIsHydrated'

export type Viewer = {
  /** DB user id, to tell which posts are the viewer's own */
  id: number
  name: string
  role: Role
  status: UserStatus
  /** Admins only (0 for everyone else) */
  pendingUsersCount: number
  /** Admins only: posts by others since the admin last opened `/admin/posts` */
  newPostsCount: number
} | null

export const VIEWER_QUERY_KEY = ['viewer'] as const

async function fetchViewer(): Promise<Viewer> {
  const response = await fetch('/api/me', { cache: 'no-store' })

  if (!response.ok) throw new Error(`Failed to load the current user (${response.status})`)

  const { viewer } = (await response.json()) as { viewer: Viewer }

  return viewer
}

/**
 * The signed-in user (or `null`), read from `/api/me`.
 * Reports "still loading" until the component has hydrated: the server never knows the viewer, and
 * parts of a streamed page can hydrate after `/api/me` has already answered, so using the cached
 * viewer straight away would make the first client render differ from the server HTML.
 */
export function useViewer() {
  const isHydrated = useIsHydrated()
  const query = useQuery({
    queryKey: VIEWER_QUERY_KEY,
    queryFn: fetchViewer,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true, // picks up approval, ban or a sign-out in another tab
  })

  return {
    data: isHydrated ? query.data : undefined,
    isPending: !isHydrated || query.isPending,
  }
}

/**
 * Re-fetches the viewer on client-side navigation if the cached copy is stale (older than
 * `staleTime`), so changes made elsewhere (an admin approving or banning the user) show up
 * without a full reload. Call once, from a component that's always mounted (the header).
 */
export function useRefetchViewerOnNavigation() {
  const pathname = usePathname()
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.refetchQueries(
      { queryKey: VIEWER_QUERY_KEY, stale: true },
      { cancelRefetch: false } // don't restart a request that's already running (e.g. the first load)
    )
  }, [pathname, queryClient])
}

/** Returns a function that re-fetches the viewer; call it after anything that changes the session */
export function useRefreshViewer() {
  const queryClient = useQueryClient()

  return () => queryClient.invalidateQueries({ queryKey: VIEWER_QUERY_KEY })
}
