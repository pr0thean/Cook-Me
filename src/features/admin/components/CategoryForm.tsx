'use client'

import { createCategory } from '@app/actions/createCategory'
import { Button } from '@components/atoms/button'
import { FileInput } from '@components/atoms/FileInput'
import { TextInput } from '@components/atoms/TextInput'

export const CategoryForm = () => {
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      await createCategory(formData)
    } catch (error) {}
  }

  return (
    <form onSubmit={handleUpload} className="space-y-2">
      <TextInput name="name" label="Name" placeholder="Enter name..." />

      <FileInput name="image" accept="image/*" />

      <Button type="submit" label="Create Category" />
    </form>
  )
}
