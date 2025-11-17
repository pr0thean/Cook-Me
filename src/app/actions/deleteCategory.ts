'use server'

import { requireAdmin } from 'lib/auth'
import { prismaClient } from 'lib/prismaClient'
import { revalidatePath } from 'next/cache'

export async function deleteCategory(categoryId: number) {
  await requireAdmin()

  try {
    await prismaClient.category.delete({
      where: { id: categoryId },
    })

    revalidatePath('/admin')
    revalidatePath('/recipes')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}
