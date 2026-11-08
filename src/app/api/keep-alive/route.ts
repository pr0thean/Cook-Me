import { createClient } from '@supabase/supabase-js'
import { prismaClient } from '@/lib/prismaClient'

// Called by Vercel Cron (see vercel.json) so the Supabase free tier
// doesn't pause the project after 7 days of inactivity.
// Hits the DB both directly (Prisma via the pooler) and through the Supabase
// API gateway (PostgREST), since only the latter may count as project activity.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    console.error('[keep-alive] unauthorized request (is CRON_SECRET set for this deployment?)')
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const [prismaResult, supabaseResult] = await Promise.allSettled([
    prismaClient.recipe.findFirst({ select: { id: true } }),
    supabase
      .from('recipes')
      .select('id')
      .limit(1)
      .then(({ error }) => {
        if (error) throw error
      }),
  ])

  const result = {
    prisma: prismaResult.status === 'fulfilled' ? 'ok' : String(prismaResult.reason),
    supabase:
      supabaseResult.status === 'fulfilled'
        ? 'ok'
        : String(supabaseResult.reason?.message ?? supabaseResult.reason),
  }
  const ok = result.prisma === 'ok' && result.supabase === 'ok'

  if (!ok) console.error('[keep-alive] failed', result)

  return Response.json({ ok, ...result }, { status: ok ? 200 : 500 })
}
