import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

// Reuse one client across hot reloads in dev, so each reload doesn't open a new connection pool
const globalForPrisma = globalThis as unknown as {
  prismaClient: PrismaClient | undefined
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export const prismaClient = globalForPrisma.prismaClient ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaClient = prismaClient
