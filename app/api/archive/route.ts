// app/api/archive/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAuthorized(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return false
    const token = authHeader.replace('Bearer ', '')
    return token === process.env.ADMIN_PASSWORD
}

// GET /api/archive -> list all archive items
export async function GET() {
    const items = await prisma.archive.findMany({
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
}

// POST /api/archive -> create archive item (admin only)
export async function POST(req: NextRequest) {
    if (!isAuthorized(req)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { title, description, picture } = body

    if (!title || !description) {
        return new NextResponse('Missing required fields', { status: 400 })
    }

    const created = await prisma.archive.create({
        data: {
            title,
            description,
            picture: picture || null,
        },
    })

    return NextResponse.json(created, { status: 201 })
}
