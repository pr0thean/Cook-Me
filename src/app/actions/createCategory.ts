'use server'

import { prismaClient } from '@lib/prismaClient'
import { uploadImage } from '@lib/storage'

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const imageFile = formData.get('image') as File

    // Validate required fields
    if (!name) {
      return { success: false, error: 'Title is required' }
    }

    // Create category first
    const category = await prismaClient.category.create({
      data: {
        name,
      },
    })

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      const { url } = await uploadImage(imageFile, category.id.toString(), 'categories-images')

      // Update category with image URL
      await prismaClient.category.update({
        where: { id: category.id },
        data: { imageUrl: url },
      })
    }

    // revalidatePath('/categories')
    return { success: true, categoryId: category.id.toString() }
  } catch (error) {
    console.error('Error creating category:', error)
    return { success: false, error: 'Failed to create category' }
  }
}
