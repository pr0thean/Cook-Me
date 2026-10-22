'use client'

import { useActionState, useState } from 'react'
import { signIn } from '@/app/actions/signIn'
import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import type { SignInState } from '@/utils/form-validation'

type Field = 'email' | 'password'

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined)
  // Remembers which submit result each field was edited after, so its error hides until the next submit
  const [editedAfter, setEditedAfter] = useState<Partial<Record<Field, SignInState>>>({})

  const fieldError = (field: Field) =>
    editedAfter[field] === state ? undefined : state?.fieldErrors?.[field]?.[0]

  const markEdited = (field: Field) => () => setEditedAfter((prev) => ({ ...prev, [field]: state }))

  return (
    <form action={action} noValidate className="space-y-6">
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
      </div>

      <Button label={pending ? 'Signing in...' : 'Sign in'} type="submit" disabled={pending} />

      {state?.formError && (
        <p role="alert" className="text-sm text-red-800">
          {state.formError}
        </p>
      )}
    </form>
  )
}
