import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Service-role client: bypasses RLS and storage policies.
// Server-only. Use it only after checking the user's role/status in app code.
export function adminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
