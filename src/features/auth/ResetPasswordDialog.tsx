'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { resetPassword } from '@/app/actions/auth'
import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { Dialog } from '@/components/molecules/Dialog'
import { useFieldErrors } from '@/hooks/useFieldErrors'
import type { ResetPasswordState } from '@/utils/form-validation'
import { useRefreshViewer } from './viewer'

/**
 * Opened automatically on `/auth?dialog=reset-password`, where the reset email link lands
 * (the user is signed in with a recovery session at this point).
 * @param closePath where to go if the user closes the dialog without saving
 */
export function ResetPasswordDialog({ closePath }: { closePath: string }) {
  const router = useRouter()
  const refreshViewer = useRefreshViewer()

  const [state, action, pending] = useActionState(
    async (prevState: ResetPasswordState, formData: FormData) => {
      const result = await resetPassword(prevState, formData)

      if (result?.redirectTo) {
        await refreshViewer()
        router.replace(result.redirectTo)
      }

      return result
    },
    undefined
  )

  const { fieldError, markEdited } = useFieldErrors(state)
  const isSaving = pending || Boolean(state?.redirectTo)

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.replace(closePath)
      }}
      title="Set a new password"
    >
      <form action={action} noValidate className="space-y-6">
        <div className="space-y-4">
          <TextInput
            name="password"
            label="New password"
            type="password"
            autoComplete="new-password"
            error={fieldError('password')}
            onChange={markEdited('password')}
            variant="secondary"
          />

          <TextInput
            name="confirmPassword"
            label="Repeat new password"
            type="password"
            autoComplete="new-password"
            error={fieldError('confirmPassword')}
            onChange={markEdited('confirmPassword')}
            variant="secondary"
          />
        </div>

        <Button
          label={isSaving ? 'Saving...' : 'Save password'}
          type="submit"
          disabled={isSaving}
        />

        {state?.formError && (
          <p role="alert" className="text-sm text-red-800">
            {state.formError}
          </p>
        )}
      </form>
    </Dialog>
  )
}
