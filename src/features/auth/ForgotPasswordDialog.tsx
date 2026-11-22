'use client'

import { useActionState } from 'react'
import { requestPasswordReset } from '@/app/actions/auth'
import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { Dialog } from '@/components/molecules/Dialog'
import { useFieldErrors } from '@/hooks/useFieldErrors'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ForgotPasswordDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Reset password"
      description="Enter your email and we'll send you a link to set a new password."
    >
      {/* Rendered only while open, so the form starts fresh every time */}
      <ForgotPasswordForm onDone={() => onOpenChange(false)} />
    </Dialog>
  )
}

function ForgotPasswordForm({ onDone }: { onDone: () => void }) {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined)
  const { fieldError, markEdited } = useFieldErrors(state)

  if (state?.sent) {
    return (
      <div className="space-y-6">
        <p role="status">
          If an account exists for <strong>{state.values?.email}</strong>, a reset link is on its
          way. Check your inbox (and spam folder).
        </p>

        <Button label="Close" type="button" onClick={onDone} />
      </div>
    )
  }

  return (
    <form action={action} noValidate className="space-y-6">
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

      <Button label={pending ? 'Sending...' : 'Send reset link'} type="submit" disabled={pending} />

      {state?.formError && (
        <p role="alert" className="text-sm text-red-800">
          {state.formError}
        </p>
      )}
    </form>
  )
}
