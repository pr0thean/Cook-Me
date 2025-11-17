'use server'

import { prismaClient } from 'lib/prismaClient'

export async function getCategories() {
  const categories = await prismaClient.category.findMany()

  return categories
}
