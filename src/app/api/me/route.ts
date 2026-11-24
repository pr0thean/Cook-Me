import { getCurrentUser } from '@/lib/auth'
import { countPendingUsers } from '@/lib/data/users'
import { countNewPosts } from '@/lib/data/posts'
import type { Viewer } from '@/features/auth/viewer'

/**
 * The signed-in user as the header (and other client UI) sees them.
 * Read on the client so pages can stay static: nothing per-user is rendered into cached HTML.
 */
export async function GET() {
  const user = await getCurrentUser()

  const isAdmin = user?.role === 'ADMIN'

  const [pendingUsersCount, newPostsCount] =
    user && isAdmin ? await Promise.all([countPendingUsers(), countNewPosts(user)]) : [0, 0]

  const viewer: Viewer = user && {
    id: user.id,
    name: user.name,
    role: user.role,
    status: user.status,
    pendingUsersCount,
    newPostsCount,
  }

  return Response.json({ viewer }, { headers: { 'Cache-Control': 'private, no-store' } })
}
