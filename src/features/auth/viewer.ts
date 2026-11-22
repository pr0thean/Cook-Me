'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Role, UserStatus } from '@/generated/prisma/client'

export type Viewer = {
  name: string
  role: Role
  status: UserStatus
  /** Admins only (0 for everyone else) */
  pendingUsersCount: number
} | null

export const VIEWER_QUERY_KEY = ['viewer'] as const

async function fetchViewer(): Promise<Viewer> {
  const response = await fetch('/api/me', { cache: 'no-store' })

  if (!response.ok) throw new Error(`Failed to load the current user (${response.status})`)

  const { viewer } = (await response.json()) as { viewer: Viewer }

  return viewer
}

/** The signed-in user (or `null`), read from `/api/me` */
export function useViewer() {
  return useQuery({
    queryKey: VIEWER_QUERY_KEY,
    queryFn: fetchViewer,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true, // picks up approval, ban or a sign-out in another tab
  })
}

/** Returns a function that re-fetches the viewer; call it after anything that changes the session */
export function useRefreshViewer() {
  const queryClient = useQueryClient()

  return () => queryClient.invalidateQueries({ queryKey: VIEWER_QUERY_KEY })
}
