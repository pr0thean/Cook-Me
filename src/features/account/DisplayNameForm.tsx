'use client'

import { useActionState } from 'react'
import { updateDisplayName } from '@/app/actions/account'
import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { useRefreshViewer } from '@/features/auth/viewer'
import { useFieldErrors } from '@/hooks/useFieldErrors'
import { DISPLAY_NAME_MAX_LENGTH, type DisplayNameState } from '@/utils/form-validation'

export function DisplayNameForm({ currentName }: { currentName: string }) {
  const refreshViewer = useRefreshViewer()

  const [state, action, pending] = useActionState(
    async (prevState: DisplayNameState, formData: FormData) => {
      const result = await updateDisplayName(prevState, formData)

      // The header menu shows the name
      if (result?.success) await refreshViewer()

      return result
    },
    undefined
  )

  const { fieldError, markEdited } = useFieldErrors(state)

  return (
    <form action={action} noValidate className="space-y-3 sm:max-w-sm">
      <TextInput
        name="name"
        label="Display name (shown next to your posts)"
        autoComplete="nickname"
        maxLength={DISPLAY_NAME_MAX_LENGTH}
        defaultValue={state?.values?.name ?? currentName}
        error={fieldError('name')}
        onChange={markEdited('name')}
        variant="secondary"
      />

      <div className="flex items-center gap-4">
        <Button
          label={pending ? 'Saving...' : 'Save name'}
          type="submit"
          disabled={pending}
          className="w-auto"
        />

        {state?.success && (
          <span role="status" className="text-green text-sm">
            Saved
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
