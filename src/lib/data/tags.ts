import 'server-only'

import { prismaClient } from '@/lib/prismaClient'

export async function getTags() {
  return prismaClient.tag.findMany()
}
