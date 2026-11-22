'use client'

import { useActionState } from 'react'
import { changePassword } from '@/app/actions/account'
import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { useFieldErrors } from '@/hooks/useFieldErrors'
import { PASSWORD_MIN_LENGTH } from '@/utils/form-validation'

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined)
  const { fieldError, markEdited } = useFieldErrors(state)

  return (
    <form action={action} noValidate className="space-y-3 sm:max-w-sm">
      <TextInput
        name="currentPassword"
        label="Current password"
        type="password"
        autoComplete="current-password"
        error={fieldError('currentPassword')}
        onChange={markEdited('currentPassword')}
        variant="secondary"
      />

      <TextInput
        name="password"
        label={`New password (at least ${PASSWORD_MIN_LENGTH} characters)`}
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

      <div className="flex items-center gap-4">
        <Button
          label={pending ? 'Saving...' : 'Change password'}
          type="submit"
          disabled={pending}
          className="w-auto"
        />

        {state?.success && (
          <span role="status" className="text-green text-sm">
            Password changed
          </span>
        )}
      </div>

      {state?.formError && (
        <p role="alert" className="text-sm text-red-800">
          {state.formError}
        </p>
      )}
    </form>
  )
}
