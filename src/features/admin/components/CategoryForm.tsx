'use client'

import { createCategory } from '@app/actions/createCategory'

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
      <input
        name="name"
        placeholder="Enter name..."
        className="block w-full rounded-[4px] border border-gray bg-black/80 px-8 py-2 text-white outline-0"
      />

      <input type="file" name="image" accept="image/*" className="block w-full text-white" />

      <button
        type="submit"
        className="disabled:bg-gray-400 rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Create Category
      </button>
    </form>
  )
}
