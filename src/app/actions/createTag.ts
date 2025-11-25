'use server'

import { requireAdmin } from '@/lib/auth'
import { prismaClient } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'

export async function createTag(formData: FormData) {
  await requireAdmin()

  try {
    const name = formData.get('name') as string

    // Validate required fields
    if (!name) {
      return { success: false, error: 'Name is required' }
    }

    const tag = await prismaClient.tag.create({
      data: {
        name,
      },
    })

    revalidatePath('/admin')
    revalidatePath('/recipes')

    return { success: true, categoryId: tag.id.toString() }
  } catch (error) {
    console.error('Error creating tag:', error)
    return { success: false, error: 'Failed to create tag' }
  }
}
