// app/warriors/page.tsx
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function WarriorsPage() {
    const warriors = await prisma.person.findMany({
        orderBy: { date: 'desc' },
    })

    return (
        <main className="max-w-4xl mx-auto p-4 space-y-6">
            <header className="flex items-center justify-between flex-col backdrop-blur-2xl border-transparent rounded-2xl p-5 gap-3">
                <h1 className="text-3xl font-bold text-red-700">Warriors of the Revolution</h1>
                <p>This is the list of innocent Iranian people who were brutally killed by the Islamic Republic. They were completely unarmed, and they just wanted to reach the basic human rights that have been stolen by the Islamic Republic from the Iranian people,
                    but they are answering them with <strong className="text-red-700 font-bold text-xl">Bullets.</strong></p>
                <Link
                    href="/"
                    className="text-sm underline underline-offset-4 text-white"
                >
                    ← Back to home
                </Link>
            </header>

            {/* Warriors Grid */}
            <section className="mt-6">
                {warriors.length === 0 ? (
                    <p className="text-white text-sm">
                        No warriors have been added yet.
                    </p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {warriors.map((w) => (
                            <li
                                key={w.id}
                                className="border border-white/40 rounded-3xl p-4 bg-white/5 backdrop-blur flex flex-col gap-3"
                            >
                                {/* Optional image */}

                                    <div className="rounded-2xl overflow-hidden">
                                        <img
                                            src={w.picture ? w.picture : 'https://voiceofrestart.com/persian/wp-content/uploads/sites/2/2022/11/Iran-map-and-blood-768x432.jpg'}
                                            alt={`${w.name} ${w.lastName}`}
                                            className="w-full aspect-[4/3] object-cover"
                                        />
                                    </div>


                                {/* Text content */}
                                <div className="flex-1 flex flex-col gap-1">
                                    <h3 className="text-lg font-semibold leading-snug break-words">
                                        {w.name} {w.lastName}
                                    </h3>
                                    <p className="text-sm">
                                        <span className="font-medium">Age:</span> {w.age ?? 'Unknown'}
                                        <span className="mx-1">|</span>
                                        <span className="font-medium">Date:</span>{' '}
                                        {w.date.toISOString().slice(0, 10)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    )
}

