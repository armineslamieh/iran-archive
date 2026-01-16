// app/daily-news/page.tsx
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DailyNewsPage() {
    const news = await prisma.news.findMany({
        orderBy: { date: 'desc' },
    })

    return (
        <main className="max-w-5xl mx-auto p-4 space-y-8">
            {/* Header box */}
            <section className="max-w-3xl mx-auto text-center space-y-4 bg-white/10 backdrop-blur p-6 rounded-3xl border border-white/30">
                <h1 className="text-3xl font-bold text-red-600">Daily News</h1>

                <p className="text-sm md:text-base text-gray-100 leading-relaxed">
                    Here you can see the most important daily news about the crimes and
                    events connected to the Islamic Republic: protests, arrests, trials,
                    executions, internet blackouts, and other updates.
                </p>

                <Link
                    href="/"
                    className="inline-block text-sm text-white underline underline-offset-4"
                >
                    ← Back to home
                </Link>
            </section>

            {/* News grid */}
            <section className="mt-4">
                {news.length === 0 ? (
                    <p className="text-sm text-gray-100">
                        No news added yet. Use the admin panel to add daily updates.
                    </p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((n) => (
                            <li
                                key={n.id}
                                className="border border-white/40 rounded-3xl p-4 bg-white/5 backdrop-blur flex flex-col gap-3"
                            >
                                <Link
                                    href={`/daily-news/${n.id}`}
                                    className="block border border-white/40 rounded-3xl p-3 text-sm space-y-1 bg-white/5 backdrop-blur hover:bg-white/10 transition"
                                >
                                {/* Optional image on top */}
                                {n.picture && (
                                    <div className="rounded-2xl overflow-hidden">
                                        <img
                                            src={n.picture}
                                            alt={n.title}
                                            className="w-full aspect-[4/3] object-cover"
                                        />
                                    </div>
                                )}

                                <div className="flex-1 flex flex-col gap-1">
                                    <h2 className="text-base font-semibold leading-snug break-words">
                                        {n.title}
                                    </h2>

                                    <p className="text-xs text-gray-200">
                                        {n.date.toISOString().slice(0, 10)}
                                    </p>

                                </div>
                                    </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    )
}
