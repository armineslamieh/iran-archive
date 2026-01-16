// app/api/warriors/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAuthorized(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return false
    const token = authHeader.replace('Bearer ', '')
    return token === process.env.ADMIN_PASSWORD
}

// GET /api/warriors  -> list all warriors
export async function GET() {
    const warriors = await prisma.person.findMany({
        orderBy: { date: 'desc' },
    })

    return NextResponse.json(warriors)
}

// POST /api/warriors -> create new warrior
export async function POST(req: NextRequest) {
    if (!isAuthorized(req)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name, lastName, age, picture, date } = body

    if (!name || !lastName || !date) {
        return new NextResponse('Missing required fields', { status: 400 })
    }

    const created = await prisma.person.create({
        data: {
            name,
            lastName,
            age: age ?? null,
            picture: picture || null,
            date: new Date(date),
        },
    })

    return NextResponse.json(created)
}
