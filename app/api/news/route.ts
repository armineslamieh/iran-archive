// app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAuthorized(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return false
    const token = authHeader.replace('Bearer ', '')
    return token === process.env.ADMIN_PASSWORD
}

// GET /api/news – list all news
export async function GET() {
    const all = await prisma.news.findMany({
        orderBy: { date: 'desc' },
    })
    return NextResponse.json(all)
}

// POST /api/news – create news
export async function POST(req: NextRequest) {
    if (!isAuthorized(req)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { title, description, picture, date, isCrime } = body

    if (!title || !description || !date) {
        return new NextResponse('Missing required fields', { status: 400 })
    }

    const created = await prisma.news.create({
        data: {
            title,
            description,
            picture: picture || null,
            date: new Date(date),
            isCrime: !!isCrime,
        },
    })

    return NextResponse.json(created)
}
