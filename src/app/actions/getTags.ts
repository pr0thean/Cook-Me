'use server'

import { prismaClient } from '@/lib/prismaClient'

export async function getTags() {
  console.log('getTags')
  const tags = await prismaClient.tag.findMany()

  return tags
}
