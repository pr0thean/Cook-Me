'use client'
import { deleteRecipe } from 'app/actions/deleteRecipe'
import { getRecipes } from 'app/actions/getRecipes'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Recipe } from '@prisma/client'
import Image from 'next/image'
import { useState } from 'react'

export const RecipesList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes()
      setRecipes(data)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteRecipe(id)

      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id))
    } catch (error) {
      console.error('Error deleting recipe:', error)
    }
  }

  if (recipes.length === 0) {
    return (
      <button
        onClick={fetchRecipes}
        className="bg-blue-gray-dark cursor-pointer rounded px-4 py-2 text-white"
      >
        Fetch Recipes
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="border-gray bg-blue-gray-dark flex justify-between rounded p-2"
        >
          <div className="flex items-center gap-3">
            {recipe.imageUrl && (
              <div className="relative h-7 w-7">
                <Image src={recipe.imageUrl} fill alt="recipe image" className="object-cover" />
              </div>
            )}
            <span>{recipe.title}</span>
          </div>

          <button onClick={() => handleDelete(recipe.id)}>
            <TrashIcon className="h-6 w-6 cursor-pointer text-red-600" />
          </button>
        </div>
      ))}
    </div>
  )
}
