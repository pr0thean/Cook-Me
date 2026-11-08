import type { NextRequest } from 'next/server'
import { getRecipes } from '@/lib/data/recipes'

const DEFAULT_TAKE = 10

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const cursor = Number(params.get('cursor')) || undefined
  const take = Number(params.get('take')) || DEFAULT_TAKE

  const page = await getRecipes({
    filters: {
      search: params.get('search') || undefined,
      difficulty: params.get('difficulty') || undefined,
      category: params.get('category') || undefined,
      tag: params.get('tag') || undefined,
    },
    cursor,
    take,
  })

  return Response.json(page)
}
