'use server'

import { requireAdmin } from '@/lib/auth'
import { prismaClient } from '@/lib/prismaClient'
import { uploadImage } from '@/lib/storage'
import { slugify } from '@/utils/slugify'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  await requireAdmin()

  try {
    const name = formData.get('name') as string
    const imageFile = formData.get('image') as File

    // Validate required fields
    if (!name) {
      return { success: false, error: 'Name is required' }
    }

    const slug = slugify(name)

    // Create category first
    const category = await prismaClient.category.create({
      data: {
        name,
        slug,
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

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/recipes')

    return { success: true, categoryId: category.id.toString() }
  } catch (error) {
    console.error('Error creating category:', error)
    return { success: false, error: 'Failed to create category' }
  }
}
