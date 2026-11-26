'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import type { InspirationsPage } from './types'

async function fetchInspirationsPage(cursor: number | undefined): Promise<InspirationsPage> {
  const query = new URLSearchParams()
  if (cursor) query.set('cursor', String(cursor))

  const response = await fetch(`/api/inspirations?${query}`, { cache: 'no-store' })

  if (!response.ok) throw new Error(`Failed to load photos (${response.status})`)

  return (await response.json()) as InspirationsPage
}

/** The Inspirations photo feed. Starts from the first page rendered on the server; the rest comes from `/api/inspirations`. */
export function useInspirations(firstPage: InspirationsPage) {
  return useInfiniteQuery({
    queryKey: ['inspirations'],
    queryFn: ({ pageParam }) => fetchInspirationsPage(pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialData: { pages: [firstPage], pageParams: [undefined] },
    staleTime: 60 * 1000,
  })
}
