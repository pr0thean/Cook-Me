import type { EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { serverClient } from '@/lib/supabase/serverClient'
import { ACCOUNT_PATH, AUTH_PATH } from '@/utils/auth-redirect'

const SUPPORTED_TYPES: EmailOtpType[] = ['email', 'signup', 'recovery']

/**
 * Landing route for links in Supabase emails (sign-up confirmation and password reset).
 * Exchanges `token_hash` for a session, then:
 * - recovery → the auth page with the set-new-password dialog open
 * - sign-up confirmation → the account page, where the user sees they're awaiting approval
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const tokenHash = params.get('token_hash')
  const type = params.get('type') as EmailOtpType | null

  if (tokenHash && type && SUPPORTED_TYPES.includes(type)) {
    const supabase = await serverClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })

    if (!error) {
      redirect(
        type === 'recovery' ? `${AUTH_PATH}?dialog=reset-password` : `${ACCOUNT_PATH}?confirmed=1`
      )
    }

    console.warn('Email link verification failed:', error.code ?? error.message)
  }

  redirect(`${AUTH_PATH}?error=invalid-link`)
}
