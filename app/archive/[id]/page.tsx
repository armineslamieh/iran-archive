// app/archive/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type RouteParams = { id: string }

export default async function ArchiveDetailPage({
                                                    params,
                                                }: {
    params: RouteParams | Promise<RouteParams>
}) {
    // Next 16: params can be a Promise, normalize it
    const resolved = await Promise.resolve(params)
    const idNum = Number(resolved.id)

    if (!resolved.id || Number.isNaN(idNum)) {
        notFound()
    }

    const item = await prisma.news.findFirst({
        where: { id: idNum, isCrime: true },
    })


    if (!item) {
        notFound()
    }

    return (
        <main className="max-w-3xl mx-auto p-4 space-y-6">
            <header className="space-y-2">
                <Link
                    href="/archive"
                    className="text-sm underline underline-offset-4 text-gray-200"
                >
                    ← Back to archive
                </Link>

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{item.title}</h1>
                    <p className="text-xs text-gray-200 mt-1">
                        {item.createdAt.toISOString().slice(0, 10)}
                    </p>
                </div>
            </header>

            {item.picture && (
                <div className="rounded-3xl overflow-hidden border border-white/40 bg-white/5 backdrop-blur">
                    <img
                        src={item.picture}
                        alt={item.title}
                        className="w-full max-h-[420px] object-cover"
                    />
                </div>
            )}

            <section className="border border-white/40 rounded-3xl p-4 bg-black/30 backdrop-blur">
                <p className="text-sm leading-relaxed whitespace-pre-line">
                    {item.description}
                </p>
            </section>
        </main>
    )
}
