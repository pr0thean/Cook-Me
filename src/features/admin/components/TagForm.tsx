'use client'

import { createTag } from 'app/actions/createTag'
import { Button } from 'components/atoms/button'
import { TextInput } from 'components/atoms/TextInput'

export const TagForm = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      await createTag(formData)
    } catch (error) {
      console.error('Error creating tag:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <TextInput name="name" label="Name" placeholder="Enter name..." />

      <div className="mt-5">
        <Button type="submit" label="Create Tag" />
      </div>
    </form>
  )
}
