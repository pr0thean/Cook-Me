import type { Metadata } from 'next'
import Link from 'next/link'
import { EmailLinkForm } from '@/features/auth/EmailLinkForm'
import { AUTH_PATH, isEmailLinkType } from '@/utils/auth-redirect'
import type { SearchParams } from '@/types/page-params'

export const metadata: Metadata = {
  title: 'Confirm | Cook Me',
  robots: { index: false },
}

/**
 * Landing page for links in Supabase emails (sign-up confirmation and password reset).
 * It doesn't use the token on load: email scanners open links before the user sees the email,
 * so the token is only used when the user presses the button.
 */
export default async function ConfirmEmailLinkPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { token_hash: tokenHash, type } = await searchParams
  const isRecovery = type === 'recovery'

  return (
    <div className="flex min-h-screen items-center justify-center py-10">
      <div className="mx-4 w-full space-y-6 rounded-xl bg-white p-6 text-center text-black shadow-md sm:p-10 md:max-w-md">
        {tokenHash && isEmailLinkType(type) ? (
          <>
            <div>
              <h2 className="text-3xl font-bold">
                {isRecovery ? 'Reset your password' : 'Confirm your email'}
              </h2>
              <p className="text-blue-gray mt-2 text-sm">
                {isRecovery
                  ? 'Continue to choose a new password.'
                  : 'One click and your account is ready for approval.'}
              </p>
            </div>

            <EmailLinkForm tokenHash={tokenHash} type={type} />
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold">Invalid link</h2>
            <p className="text-blue-gray-dark">
              This link is incomplete. Open it again from your email, or{' '}
              <Link href={AUTH_PATH} className="underline">
                go to sign in
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </div>
  )
}
