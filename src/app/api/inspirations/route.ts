import type { NextRequest } from 'next/server'
import { getInspirationPhotos } from '@/lib/data/posts'

/**
 * Infinite scroll for `/inspirations`: `?cursor=<last photo id>`.
 * The first page is rendered into the (static) page; this serves the rest, always fresh.
 */
export async function GET(request: NextRequest) {
  const cursor = Number(request.nextUrl.searchParams.get('cursor')) || undefined

  const page = await getInspirationPhotos({ cursor })

  return Response.json(page, { headers: { 'Cache-Control': 'no-store' } })
}
