'use client'

import { createRecipe } from '@/app/actions/createRecipe'
import { deleteCategory } from '@/app/actions/deleteCategory'
import { Button } from '@/components/atoms/Button'
import { FileInput } from '@/components/atoms/FileInput'
import { TextInput } from '@/components/atoms/TextInput'
import { TextEditor } from '@/components/molecules/text-editor/TextEditor'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Category, Difficulty, Tag } from '@prisma/client'
import { useRef, useState } from 'react'
import { Select } from '@/components/atoms/select/Select'

const difficultyOptions: { label: string; value: Difficulty }[] = [
  { label: 'Easy', value: Difficulty.EASY },
  { label: 'Medium', value: Difficulty.MEDIUM },
  { label: 'Hard', value: Difficulty.HARD },
]

type Props = {
  categories: Category[]
  tags: Tag[]
}

// TODO: implement react-hook-form
export const RecipeForm = ({ categories, tags }: Props) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)

      selectedCategories.forEach((id) => {
        formData.append('categoryIds', id.toString())
      })

      selectedTags.forEach((id) => {
        formData.append('tagIds', id.toString())
      })

      const result = await createRecipe(formData)

      if (result.success) {
        formRef.current?.reset()
        setSelectedCategories([])
        setSelectedTags([])
        setDifficulty(Difficulty.MEDIUM)
      } else {
        setError(result.error)
      }
    } catch (error) {
      console.error('Error creating recipe:', error)
      setError('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
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
          allowClear={false}
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
        <Button
          type="submit"
          label={isSubmitting ? 'Creating...' : 'Create Recipe'}
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <div className="rounded-md border border-red-500 bg-red-500/10 p-4">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
    </form>
  )
}
