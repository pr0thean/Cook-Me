import { prismaClient } from '@/lib/prismaClient'

// Called by Vercel Cron (see vercel.json) so the Supabase free tier
// doesn't pause the project after 7 days without database activity
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  await prismaClient.recipe.findFirst({ select: { id: true } })

  return Response.json({ ok: true })
}
