// app/archive/page.tsx
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ArchivePage() {
    const items = await prisma.news.findMany({
        where: { isCrime: true },
        orderBy: { date: 'desc' },
    })


    return (
        <main className="max-w-5xl mx-auto p-4 space-y-8">
            {/* Header section */}
            <section className="max-w-3xl mx-auto text-center space-y-4 bg-white/10 backdrop-blur p-6 rounded-3xl border border-white/30">
                <h1 className="text-3xl font-bold text-red-600">
                    Archive of Crimes
                </h1>

                <p className="text-sm md:text-base text-gray-100 leading-relaxed">
                    This archive documents crimes committed by the Islamic Republic:
                    killings, executions, mass arrests, torture, censorship, internet
                    shutdowns, and other human rights violations.
                </p>

                <Link
                    href="/"
                    className="inline-block text-sm text-white underline underline-offset-4"
                >
                    ← Back to home
                </Link>
            </section>

            {/* Archive grid */}
            <section className="mt-4">
                {items.length === 0 ? (
                    <p className="text-sm text-gray-100">
                        No archive entries yet. Use the admin panel to add records.
                    </p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                className="border border-white/40 rounded-3xl p-4 bg-white/5 backdrop-blur flex flex-col gap-3"
                            >
                                <Link
                                    href={`/archive/${item.id}`}
                                    className="block border border-white/40 rounded-3xl p-3 text-sm space-y-1 bg-white/5 backdrop-blur hover:bg-white/10 transition"
                                >
                                {/* Optional image */}
                                {item.picture && (
                                    <div className="rounded-2xl overflow-hidden">
                                        <img
                                            src={item.picture}
                                            alt={item.title}
                                            className="w-full aspect-[4/3] object-cover"
                                        />
                                    </div>
                                )}

                                {/* Text content */}
                                <div className="flex-1 flex flex-col gap-1">
                                    <h2 className="text-base font-semibold leading-snug break-words">
                                        {item.title}
                                    </h2>

                                    <p className="text-xs text-gray-200">
                                        {item.date.toISOString().slice(0, 10)}
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
