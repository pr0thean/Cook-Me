'use client'

import { useState } from 'react'

type StateWithFieldErrors<Field extends string> =
  { fieldErrors?: Partial<Record<Field, string[]>> } | undefined

/**
 * Field errors from a `useActionState` result that disappear once the user edits the field,
 * and come back only after the next submit.
 */
export function useFieldErrors<Field extends string>(state: StateWithFieldErrors<Field>) {
  // Remembers which submit result each field was edited after
  const [editedAfter, setEditedAfter] = useState<Partial<Record<Field, unknown>>>({})

  const fieldError = (field: Field) =>
    editedAfter[field] === state ? undefined : state?.fieldErrors?.[field]?.[0]

  const markEdited = (field: Field) => () => setEditedAfter((prev) => ({ ...prev, [field]: state }))

  return { fieldError, markEdited }
}
