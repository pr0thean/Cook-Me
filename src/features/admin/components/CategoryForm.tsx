'use client'

import { createCategory } from '@/app/actions/createCategory'
import { Button } from '@/components/atoms/Button'
import { FileInput } from '@/components/atoms/FileInput'
import { TextInput } from '@/components/atoms/TextInput'

export const CategoryForm = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      await createCategory(formData)
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <TextInput name="name" label="Name" placeholder="Enter name..." />

      <FileInput name="image" accept="image/*" />

      <div className="mt-5">
        <Button type="submit" label="Create Category" />
      </div>
    </form>
  )
}
