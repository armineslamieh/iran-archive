// lib/prisma.ts
import { PrismaClient } from '@/prisma/generated/prisma/client/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

function createPrismaClient() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })
    const adapter = new PrismaPg(pool)

    return new PrismaClient({
        adapter,
        log: ['error', 'warn'],
    })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
