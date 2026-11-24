import type { NextRequest } from 'next/server'
import { getRecipePosts } from '@/lib/data/posts'

/**
 * "Load more" for the posts under a recipe: `?recipeId=1&cursor=<last post id>`.
 * The first page is rendered into the (static) recipe page; this serves the rest, always fresh.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const recipeId = Number(params.get('recipeId'))
  const cursor = Number(params.get('cursor')) || undefined

  if (!Number.isInteger(recipeId) || recipeId <= 0) {
    return Response.json({ error: 'recipeId is required' }, { status: 400 })
  }

  const page = await getRecipePosts(recipeId, { cursor })

  return Response.json(page, { headers: { 'Cache-Control': 'no-store' } })
}
