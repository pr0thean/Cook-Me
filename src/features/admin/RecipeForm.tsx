'use client'

import { createRecipe } from '@app/actions/createRecipe'

type Props = {
  categories: {
    name: string
    id: bigint
    imageUrl: string | null
  }[]
}

export const RecipeForm = ({ categories }: Props) => {
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      await createRecipe(formData)
    } catch (error) {}
  }

  return (
    <form onSubmit={handleUpload} className="space-y-2">
      <input
        name="title"
        placeholder="Enter title..."
        className="block w-full rounded-[4px] border border-gray bg-black/80 px-8 py-2 text-white outline-0"
      />

      <input
        name="description"
        placeholder="Enter description..."
        className="block w-full rounded-[4px] border border-gray bg-black/80 px-8 py-2 text-white outline-0"
      />

      <textarea
        name="ingredients"
        placeholder="Enter ingredients..."
        className="block w-full rounded-[4px] border border-gray bg-black/80 px-8 py-2 text-white outline-0"
        rows={4}
      />

      <textarea
        name="instruction"
        placeholder="Enter instruction..."
        className="block w-full rounded-[4px] border border-gray bg-black/80 px-8 py-2 text-white outline-0"
        rows={4}
      />

      <select
        name="categoryId"
        className="block w-full rounded-[4px] border border-gray bg-black/80 px-8 py-2 text-white outline-0"
      >
        <option value="">Select category</option>

        {categories.map((category) => (
          <option key={category.id.toString()} value={category.id.toString()}>
            {category.name}
          </option>
        ))}
      </select>

      <input type="file" name="image" accept="image/*" className="block w-full text-white" />

      <button
        type="submit"
        className="disabled:bg-gray-400 rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Create Recipe
      </button>
    </form>
  )
}
