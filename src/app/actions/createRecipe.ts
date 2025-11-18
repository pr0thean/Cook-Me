'use server'

import { requireAdmin } from 'lib/auth'
import { prismaClient } from 'lib/prismaClient'
import { uploadImage } from 'lib/storage'
import { slugify } from 'utils/slugify'
import { revalidatePath } from 'next/cache'
import { Difficulty } from '@prisma/client'

type CreateRecipeResult = { success: true } | { success: false; error: string }

export async function createRecipe(formData: FormData): Promise<CreateRecipeResult> {
  try {
    await requireAdmin()
  } catch (error) {
    console.error('Authorization error:', error)
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const ingredientsRaw = formData.get('ingredients') as string
    const instructionRaw = formData.get('instruction') as string
    const difficulty = formData.get('difficulty') as string
    const time = formData.get('time') as string
    const categoryIds = formData.getAll('categoryIds') as string[]
    const tagIds = formData.getAll('tagIds') as string[]
    const imageFile = formData.get('image') as File

    // Validate required fields
    if (!title) {
      return { success: false, error: 'Title is required' }
    }

    const slug = slugify(title)

    let ingredients, instruction

    try {
      ingredients = JSON.parse(ingredientsRaw)
      instruction = JSON.parse(instructionRaw)
    } catch (error) {
      console.error('Parsing json error:', error)
      return { success: false, error: 'Invalid content format' }
    }

    // Create recipe first
    const recipe = await prismaClient.recipe.create({
      data: {
        title,
        slug,
        description: description,
        ingredients: ingredients,
        instruction: instruction,
        time: parseInt(time),
        difficulty: difficulty as Difficulty,
        tags: {
          connect: tagIds.map((id) => ({ id: parseInt(id) })),
        },
        categories: {
          connect: categoryIds.map((id) => ({ id: parseInt(id) })),
        },
      },
    })

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      try {
        const { url } = await uploadImage(imageFile, recipe.id.toString(), 'recipes-images')

        // Update recipe with image URL
        await prismaClient.recipe.update({
          where: { id: recipe.id },
          data: { imageUrl: url },
        })
      } catch (error) {
        console.error('Error uploading image:', error)
        return { success: false, error: 'Error uploading image' }
      }
    }

    revalidatePath('/admin')
    revalidatePath('/recipes')

    return { success: true }
  } catch (error) {
    console.error('Error creating recipe:', error)
    return { success: false, error: 'Failed to create recipe' }
  }
}
