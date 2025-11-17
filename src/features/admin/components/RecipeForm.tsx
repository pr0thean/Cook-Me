'use client'

import { createRecipe } from 'app/actions/createRecipe'
import { deleteCategory } from 'app/actions/deleteCategory'
import { Button } from 'components/atoms/button'
import { FileInput } from 'components/atoms/FileInput'
import { TextInput } from 'components/atoms/TextInput'
import { TextEditor } from 'components/molecules/text-editor/TextEditor'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Category, Difficulty, Tag } from '@prisma/client'
import { useState } from 'react'
import { Select } from 'components/atoms/select/Select'

const difficultyOptions: { label: string; value: Difficulty }[] = [
  { label: 'Easy', value: Difficulty.EASY },
  { label: 'Medium', value: Difficulty.MEDIUM },
  { label: 'Hard', value: Difficulty.HARD },
]

type Props = {
  categories: Category[]
  tags: Tag[]
}

export const RecipeForm = ({ categories, tags }: Props) => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <TextInput name="title" label="Title" placeholder="Enter title..." />

      <TextInput name="description" label="Description" placeholder="Enter description..." />

      <TextEditor name="ingredients" label="Ingredients" />

      <TextEditor name="instruction" label="Instruction" />

      <div className="flex items-center gap-2">
        <Select
          name="difficulty"
          items={difficultyOptions}
          label="Difficulty"
          onValueChange={setDifficulty}
          value={difficulty}
        />
        {/* Hidden input to include difficulty in FormData */}
        <input type="hidden" name="difficulty" value={difficulty} />

        <TextInput
          name="time"
          label="Time (in minutes)"
          type="number"
          placeholder="Enter time..."
        />
      </div>

      <div>
        <h2 className="mb-2 text-lg">Select category</h2>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-1">
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
              <TrashIcon
                className="h-4 w-4 cursor-pointer text-red-500"
                onClick={() => deleteCategory(category.id)}
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-lg">Select tag</h2>

        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-1">
              <input
                type="checkbox"
                value={tag.id}
                checked={selectedTags.includes(tag.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTags([...selectedTags, tag.id])
                  } else {
                    setSelectedTags(selectedTags.filter((id) => id !== tag.id))
                  }
                }}
              />
              {tag.name}
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
