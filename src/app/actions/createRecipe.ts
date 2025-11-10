'use server'

import { requireAdmin } from '@lib/auth'
import { prismaClient } from '@lib/prismaClient'
import { uploadImage } from '@lib/storage'
import { slugify } from '@utils/slugify'
import { revalidatePath } from 'next/cache'

export async function createRecipe(formData: FormData) {
  await requireAdmin()

  try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const ingredients = formData.get('ingredients') as string
    const instruction = formData.get('instruction') as string
    const categoryIds = formData.getAll('categoryIds') as string[]
    const imageFile = formData.get('image') as File

    // Validate required fields
    if (!title) {
      return { success: false, error: 'Title is required' }
    }

    const slug = slugify(title)

    // Create recipe first
    const recipe = await prismaClient.recipe.create({
      data: {
        title,
        slug,
        description: description || null,
        ingredients: ingredients || undefined,
        instruction: instruction || undefined,
        categories: {
          connect: categoryIds.map((id) => ({ id: parseInt(id) })),
        },
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

    revalidatePath('/admin')
    revalidatePath('/recipes')

    return { success: true, recipeId: recipe.id.toString() }
  } catch (error) {
    console.error('Error creating recipe:', error)
    return { success: false, error: 'Failed to create recipe' }
  }
}
