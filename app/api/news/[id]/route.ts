// app/api/news/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAuthorized(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return false
    const token = authHeader.replace('Bearer ', '')
    return token === process.env.ADMIN_PASSWORD
}

// UPDATE news (PUT /api/news/:id)
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!isAuthorized(req)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id: idStr } = await params
    const id = Number(idStr)

    try {
        const body = await req.json()
        const { title, description, picture, date, isCrime } = body

        if (!title || !description || !date) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        const updated = await prisma.news.update({
            where: { id },
            data: {
                title,
                description,
                picture: picture || null,
                date: new Date(date),
                isCrime: !!isCrime,
            },
        })

        return NextResponse.json(updated)
    } catch (err: any) {
        console.error('Error updating news', err)
        return new NextResponse(
            `Failed to update news: ${err?.message ?? err}`,
            { status: 500 }
        )
    }
}

// DELETE stays as we already wrote earlier
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!isAuthorized(req)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id: idStr } = await params
    const id = Number(idStr)

    try {
        await prisma.news.delete({
            where: { id },
        })

        return new NextResponse(null, { status: 204 })
    } catch (err: any) {
        console.error('Error deleting news', err)

        if (err?.code === 'P2025') {
            return new NextResponse(null, { status: 204 })
        }

        return new NextResponse(
            `Failed to delete news: ${err?.message ?? err}`,
            { status: 500 }
        )
    }
}
