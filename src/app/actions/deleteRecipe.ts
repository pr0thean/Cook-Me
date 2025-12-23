'use server'

import { requireAdmin } from '@/lib/auth'
import { prismaClient } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'

export async function deleteRecipe(recipeId: number) {
  await requireAdmin()

  try {
    await prismaClient.recipe.delete({
      where: { id: recipeId },
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/recipes')

    return { success: true }
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return { success: false, error: 'Failed to delete recipe' }
  }
}
