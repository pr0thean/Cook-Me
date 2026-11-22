import { getCurrentUser } from '@/lib/auth'
import { countPendingUsers } from '@/lib/data/users'
import type { Viewer } from '@/features/auth/viewer'

/**
 * The signed-in user as the header (and other client UI) sees them.
 * Read on the client so pages can stay static: nothing per-user is rendered into cached HTML.
 */
export async function GET() {
  const user = await getCurrentUser()

  const viewer: Viewer = user && {
    name: user.name,
    role: user.role,
    status: user.status,
    pendingUsersCount: user.role === 'ADMIN' ? await countPendingUsers() : 0,
  }

  return Response.json({ viewer }, { headers: { 'Cache-Control': 'private, no-store' } })
}
