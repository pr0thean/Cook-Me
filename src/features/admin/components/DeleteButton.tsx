'use client'
import { deleteRecipe } from '@app/actions/deleteRecipe'
import { TrashIcon } from '@heroicons/react/24/outline'

export const DeleteButton = ({ recipeId }: { recipeId: number }) => {
  return (
    <button onClick={() => deleteRecipe(recipeId)}>
      <TrashIcon className="h-6 w-6 cursor-pointer text-red-600" />
    </button>
  )
}
