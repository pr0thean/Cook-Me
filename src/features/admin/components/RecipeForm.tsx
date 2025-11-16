'use client'

import { createRecipe } from '@app/actions/createRecipe'
import { Button } from '@components/atoms/button'
import { FileInput } from '@components/atoms/FileInput'
import { TextInput } from '@components/atoms/TextInput'
import { TextEditor } from '@components/molecules/text-editor/TextEditor'
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
    } catch (error) {
      console.error('Error creating recipe:', error)
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-3">
      <TextInput name="title" label="Title" placeholder="Enter title..." />

      <TextInput name="description" label="Description" placeholder="Enter description..." />

      <TextEditor name="ingredients" label="Ingredients" />

      <TextEditor name="instruction" label="Instruction" />

      <div>
        <h2 className="mb-2 text-lg">Select category</h2>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <label key={category.id} className="flex gap-1">
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

      <FileInput name="image" accept="image/*" />

      <div className="mt-5">
        <Button type="submit" label="Create Recipe" />
      </div>
    </form>
  )
}
