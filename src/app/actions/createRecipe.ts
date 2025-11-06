'use server'

import { prismaClient } from '@lib/prismaClient'
import { uploadImage } from '@lib/storage'

export async function createRecipe(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const ingredients = formData.get('ingredients') as string
    const instruction = formData.get('instruction') as string
    const categoryId = formData.get('categoryId') as string
    const imageFile = formData.get('image') as File

    // Validate required fields
    if (!title) {
      return { success: false, error: 'Title is required' }
    }

    // Create recipe first
    const recipe = await prismaClient.recipe.create({
      data: {
        title,
        description: description || null,
        ingredients: ingredients || undefined,
        instruction: instruction || undefined,
        categoryId: categoryId ? BigInt(categoryId) : null,
      },
    })

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      const { url } = await uploadImage(imageFile, recipe.id.toString(), 'recipes-images')

      // Update recipe with image URL
      await prismaClient.recipe.update({
        where: { id: recipe.id },
        data: { imageUrl: url },
      })
    }

    // revalidatePath('/recipes')
    return { success: true, recipeId: recipe.id.toString() }
  } catch (error) {
    console.error('Error creating recipe:', error)
    return { success: false, error: 'Failed to create recipe' }
  }
}
