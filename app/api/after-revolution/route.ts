// app/api/after-revolution/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAuthorized(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return false
    const token = authHeader.replace('Bearer ', '')
    return token === process.env.ADMIN_PASSWORD
}

// GET /api/after-revolution -> get site info
export async function GET() {
    const info = await prisma.siteInfo.findUnique({
        where: { id: 1 },
    })

    return NextResponse.json(info)
}

// PUT /api/after-revolution -> update/create site info (admin only)
export async function PUT(req: NextRequest) {
    if (!isAuthorized(req)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const {
        leaderName,
        leaderDescription,
        afterRevolutionPlan,
        aboutWebsite,
        newGovernmentInformation,
    } = body

    const updated = await prisma.siteInfo.upsert({
        where: { id: 1 },
        update: {
            leaderName,
            leaderDescription,
            afterRevolutionPlan,
            aboutWebsite,
            newGovernmentInformation,
        },
        create: {
            id: 1,
            leaderName,
            leaderDescription,
            afterRevolutionPlan,
            aboutWebsite,
            newGovernmentInformation,
        },
    })

    return NextResponse.json(updated)
}
