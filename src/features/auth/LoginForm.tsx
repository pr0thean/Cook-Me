'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/app/actions/auth'
import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { useFieldErrors } from '@/hooks/useFieldErrors'
import type { SignInState } from '@/utils/form-validation'
import { ForgotPasswordDialog } from './ForgotPasswordDialog'
import { useRefreshViewer } from './viewer'

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter()
  const refreshViewer = useRefreshViewer()
  const [isForgotOpen, setIsForgotOpen] = useState(false)

  const [state, action, pending] = useActionState(
    async (prevState: SignInState, formData: FormData) => {
      const result = await signIn(prevState, formData)

      if (result?.redirectTo) {
        await refreshViewer()
        router.replace(result.redirectTo)
      }

      return result
    },
    undefined
  )

  const { fieldError, markEdited } = useFieldErrors(state)
  const isSigningIn = pending || Boolean(state?.redirectTo)

  return (
    <>
      <form action={action} noValidate className="space-y-6">
        {next && <input type="hidden" name="next" value={next} />}

        <div className="space-y-4">
          <TextInput
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            defaultValue={state?.values?.email}
            placeholder="Email address"
            error={fieldError('email')}
            onChange={markEdited('email')}
            variant="secondary"
          />

          <div className="space-y-1">
            <TextInput
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              error={fieldError('password')}
              onChange={markEdited('password')}
              variant="secondary"
            />

            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-blue-gray cursor-pointer text-sm underline hover:text-black"
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>

        <Button
          label={isSigningIn ? 'Signing in...' : 'Sign in'}
          type="submit"
          disabled={isSigningIn}
        />

        {state?.formError && (
          <p role="alert" className="text-sm text-red-800">
            {state.formError}
          </p>
        )}
      </form>

      <ForgotPasswordDialog open={isForgotOpen} onOpenChange={setIsForgotOpen} />
    </>
  )
}
