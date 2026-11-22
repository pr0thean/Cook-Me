'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { signUp } from '@/app/actions/auth'
import { Button } from '@/components/atoms/Button'
import { TextArea } from '@/components/atoms/TextArea'
import { TextInput } from '@/components/atoms/TextInput'
import { useFieldErrors } from '@/hooks/useFieldErrors'
import {
  DISPLAY_NAME_MAX_LENGTH,
  JOIN_REASON_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/utils/form-validation'

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, undefined)
  const { fieldError, markEdited } = useFieldErrors(state)

  if (state?.checkEmail) {
    return (
      <div role="status" className="space-y-4">
        <EnvelopeIcon className="text-orange mx-auto h-12 w-12" />
        <h3 className="text-xl font-semibold">Check your email</h3>
        <p className="text-blue-gray-dark">
          We sent a confirmation link to <strong>{state.checkEmail}</strong>. Click it to activate
          your account.
        </p>
        <p className="text-blue-gray text-sm">
          After confirming, your account waits for a quick manual approval before you can post.
        </p>
      </div>
    )
  }

  const consentError = fieldError('consent')

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
          label={`Password (at least ${PASSWORD_MIN_LENGTH} characters)`}
          type="password"
          autoComplete="new-password"
          placeholder="Password"
          error={fieldError('password')}
          onChange={markEdited('password')}
          variant="secondary"
        />

        <TextInput
          name="name"
          label="Display name (shown next to your posts)"
          autoComplete="nickname"
          maxLength={DISPLAY_NAME_MAX_LENGTH}
          defaultValue={state?.values?.name}
          placeholder="e.g. Anna K."
          error={fieldError('name')}
          onChange={markEdited('name')}
          variant="secondary"
        />

        <TextArea
          name="joinReason"
          label="Why do you want to join? (optional)"
          rows={3}
          maxLength={JOIN_REASON_MAX_LENGTH}
          defaultValue={state?.values?.joinReason}
          placeholder="A sentence helps us approve real people faster."
          error={fieldError('joinReason')}
          onChange={markEdited('joinReason')}
        />

        <div className="space-y-1 text-left">
          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="consent"
              className="accent-orange mt-0.5 h-4 w-4 shrink-0 cursor-pointer"
              aria-invalid={consentError ? 'true' : 'false'}
              aria-describedby={consentError ? 'consent-error' : undefined}
              onChange={markEdited('consent')}
            />
            <span>
              I agree to the{' '}
              <Link href="/privacy" target="_blank" className="underline">
                privacy policy
              </Link>
              . I understand that photos and text I post are public.
            </span>
          </label>

          {consentError && (
            <span id="consent-error" role="alert" className="text-sm text-red-700">
              {consentError}
            </span>
          )}
        </div>
      </div>

      <Button
        label={pending ? 'Creating account...' : 'Create account'}
        type="submit"
        disabled={pending}
      />

      {state?.formError && (
        <p role="alert" className="text-sm text-red-800">
          {state.formError}
        </p>
      )}
    </form>
  )
}
