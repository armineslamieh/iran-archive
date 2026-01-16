// app/daily-news/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {promises} from "node:dns";

type PageProps = {
    params: Promise<{ id: string }>  // /daily-news/123 -> { id: "123" }
}

export default async function DailyNewsDetailPage({ params }: PageProps) {
    const id = Number((await params).id)

    const news = await prisma.news.findUnique({
        where: { id },
    })

    if (!news) {
        return (
            <main className="max-w-3xl mx-auto p-4 space-y-4">
                <Link
                    href="/daily-news"
                    className="text-sm underline underline-offset-4 text-gray-200"
                >
                    ← Back to daily news
                </Link>
                <p className="text-sm text-gray-300 mt-4">News item not found.</p>
            </main>
        )
    }

    return (
        <main className="max-w-3xl mx-auto p-4 space-y-6">
            <header className="space-y-2">
                <Link
                    href="/daily-news"
                    className="text-sm underline underline-offset-4 text-gray-200"
                >
                    ← Back to daily news
                </Link>

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{news.title}</h1>
                    <p className="text-xs text-gray-200 mt-1">
                        {news.date.toISOString().slice(0, 10)}
                    </p>
                </div>
            </header>

            {news.picture && (
                <div className="rounded-3xl overflow-hidden border border-white/40 bg-white/5 backdrop-blur">
                    <img
                        src={news.picture}
                        alt={news.title}
                        className="w-full max-h-[420px] object-cover"
                    />
                </div>
            )}

            <section className="border border-white/40 rounded-3xl p-4 bg-black/30 backdrop-blur">
                <p className="text-sm leading-relaxed whitespace-pre-line">
                    {news.description}
                </p>
            </section>
        </main>
    )
}
