'use server'

import { redirect } from 'next/navigation'
import { serverClient } from '@/lib/supabase/serverClient'
import { AUTH_PATH } from '@/utils/auth-redirect'

export async function signOut() {
  const supabase = await serverClient()

  await supabase.auth.signOut()

  redirect(AUTH_PATH)
}
