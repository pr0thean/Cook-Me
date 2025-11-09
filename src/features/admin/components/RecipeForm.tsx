'use client'

import { createRecipe } from '@app/actions/createRecipe'
import { Category } from '@prisma/client'
import { useState } from 'react'

type Props = {
  categories: Category[]
}

export const RecipeForm = ({ categories }: Props) => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)

      selectedCategories.forEach((id) => {
        formData.append('categoryIds', id.toString())
      })

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

      <div>
        <p>Categories (select multiple)</p>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <label key={category.id}>
              <input
                type="checkbox"
                value={category.id}
                checked={selectedCategories.includes(category.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([...selectedCategories, category.id])
                  } else {
                    setSelectedCategories(selectedCategories.filter((id) => id !== category.id))
                  }
                }}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

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
