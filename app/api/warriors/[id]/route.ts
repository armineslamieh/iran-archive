// app/api/warriors/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAuthorized(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return false
    const token = authHeader.replace('Bearer ', '')
    return token === process.env.ADMIN_PASSWORD
}

// UPDATE warrior (PUT /api/warriors/:id)
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
    if (!isAuthorized(req)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id: idStr } = await params          // ✅ await the params
    const id = Number(idStr)

    try {
        const body = await req.json()
        const { name, lastName, age, picture, date } = body

        if (!name || !lastName || !date) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        const updated = await prisma.person.update({
            where: { id }, // Int ID
            data: {
                name,
                lastName,
                age: age ?? null,
                picture: picture || null,
                date: new Date(date),
            },
        })

        return NextResponse.json(updated)
    } catch (err: any) {
        console.error('Error updating warrior', err)
        return new NextResponse(
            `Failed to update warrior: ${err?.message ?? err}`,
            { status: 500 }
        )
    }
}

// DELETE warrior (DELETE /api/warriors/:id)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
    if (!isAuthorized(req)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id: idStr } = await params          // ✅ await the params
    const id = Number(idStr)

    try {
        await prisma.person.delete({
            where: { id },
        })

        return new NextResponse(null, { status: 204 })
    } catch (err: any) {
        console.error('Error deleting warrior', err)

        // If the record doesn't exist (P2025), treat it as success
        if (err?.code === 'P2025') {
            return new NextResponse(null, { status: 204 })
        }

        return new NextResponse(
            `Failed to delete warrior: ${err?.message ?? err}`,
            { status: 500 }
        )
    }
}
