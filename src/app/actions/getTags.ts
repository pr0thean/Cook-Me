'use server'

import { prismaClient } from '@/lib/prismaClient'

export async function getTags() {
  const tags = await prismaClient.tag.findMany()

  return tags
}
