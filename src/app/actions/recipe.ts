'use server'

import { requireAdmin } from '@/lib/auth'
import { prismaClient } from '@/lib/prismaClient'
import { uploadImage } from '@/lib/storage'
import { slugify } from '@/utils/slugify'
import { revalidatePath } from 'next/cache'
import { Difficulty } from '@/generated/prisma/client'
import { getRecipes } from '@/lib/data/recipes'
import { deletePostImageFiles, getPostImagePaths, revalidatePostPages } from '@/lib/posts'

type CreateRecipeResult = { success: true } | { success: false; error: string }

export async function createRecipe(formData: FormData): Promise<CreateRecipeResult> {
  await requireAdmin()

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

    revalidatePath('/')
    revalidatePath('/admin/recipes')
    revalidatePath('/recipes')

    return { success: true }
  } catch (error) {
    console.error('Error creating recipe:', error)
    return { success: false, error: 'Failed to create recipe' }
  }
}

export async function deleteRecipe(recipeId: number) {
  await requireAdmin()

  try {
    // Read before the cascade removes the rows
    const postImagePaths = await getPostImagePaths({ recipeId })

    const recipe = await prismaClient.recipe.delete({
      where: { id: recipeId },
      select: { slug: true },
    })

    await deletePostImageFiles(postImagePaths)

    revalidatePostPages([recipe.slug])
    revalidatePath('/admin/recipes')
    revalidatePath('/recipes')

    return { success: true }
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return { success: false, error: 'Failed to delete recipe' }
  }
}

// TODO: temporary — remove with the admin page redesign (fetch on the server instead)
export async function getAdminRecipes() {
  await requireAdmin()

  return getRecipes()
}
