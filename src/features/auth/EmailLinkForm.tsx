'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { verifyEmailLink, type EmailLinkState } from '@/app/actions/auth'
import { Button } from '@/components/atoms/Button'
import { AUTH_PATH, type EmailLinkType } from '@/utils/auth-redirect'
import { useRefreshViewer } from './viewer'

type Props = {
  tokenHash: string
  type: EmailLinkType
}

/** The button on `/auth/confirm` that uses the email link's token and signs the user in */
export function EmailLinkForm({ tokenHash, type }: Props) {
  const router = useRouter()
  const refreshViewer = useRefreshViewer()

  const [state, action, pending] = useActionState(
    async (prevState: EmailLinkState, formData: FormData) => {
      const result = await verifyEmailLink(prevState, formData)

      if (result?.redirectTo) {
        // The user is now signed in: update the header before leaving
        await refreshViewer()
        router.replace(result.redirectTo)
      }

      return result
    },
    undefined
  )

  const isWorking = pending || Boolean(state?.redirectTo)
  const label = type === 'recovery' ? 'Continue' : 'Confirm my email'

  if (state?.error) {
    return (
      <div className="space-y-4">
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
        <p className="text-blue-gray-dark text-sm">
          {type === 'recovery' ? (
            <>
              Request a new link with &quot;Forgot password?&quot; on the{' '}
              <Link href={AUTH_PATH} className="underline">
                sign-in page
              </Link>
              .
            </>
          ) : (
            <>
              If you already confirmed, just{' '}
              <Link href={AUTH_PATH} className="underline">
                sign in
              </Link>
              .
            </>
          )}
        </p>
      </div>
    )
  }

  return (
    <form action={action}>
      <input type="hidden" name="token_hash" value={tokenHash} />
      <input type="hidden" name="type" value={type} />

      <Button label={isWorking ? 'Please wait...' : label} type="submit" disabled={isWorking} />
    </form>
  )
}
