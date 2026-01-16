// app/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

// Helper to calculate day difference between two dates
function daysBetween(from: Date, to: Date) {
    const msPerDay = 1000 * 60 * 60 * 24
    const diffMs = to.getTime() - from.getTime()
    return Math.floor(diffMs / msPerDay)
}

export default async function HomePage() {
    // Load data in parallel
    const [latestWarriors, latestNews, latestCrimeNews, warriorCount] =
        await Promise.all([
            prisma.person.findMany({ orderBy: { date: 'desc' }, take: 5 }),
            prisma.news.findMany({ orderBy: { date: 'desc' }, take: 5 }),
            prisma.news.findMany({
                where: { isCrime: true },
                orderBy: { date: 'desc' },
                take: 5,
            }),
            prisma.person.count(),
        ])

    // Dates from environment variables
    const today = new Date()

    const revolutionStartStr = process.env.REVOLUTION_START_DATE
    const shutdownStartStr = process.env.INTERNET_SHUTDOWN_START_DATE

    const revolutionStart = revolutionStartStr
        ? new Date(revolutionStartStr)
        : null
    const shutdownStart = shutdownStartStr ? new Date(shutdownStartStr) : null

    const daysSinceRevolution =
        revolutionStart !== null ? daysBetween(revolutionStart, today) : null
    const daysSinceShutdown =
        shutdownStart !== null ? daysBetween(shutdownStart, today) : null

    return (
        <main className="max-w-5xl mx-auto p-4 space-y-10">
            {/* Hero / Title */}
            <section className="space-y-4 flex flex-col items-center">
                <h1 className="text-3xl md:text-4xl font-bold">
                    Archive of Crimes of the <strong className="text-red-700">Islamic Republic</strong> and the <strong className="text-green-400">Iranian people</strong> Revolution against dictatorship.
                </h1>
                <p className="text-sm md:text-base text-white font-bold leading-relaxed">
                    This website documents the people killed, daily events about the current revolution, and systematic
                    crimes committed by the Islamic Republic: shootings, executions,
                    internet shutdowns, and other abuses. It is a living archive to
                    remember the victims and preserve evidence.
                </p>

                <div className="flex flex-wrap gap-3 text-sm">
                    <Link
                        href="/after-revolution"
                        className="border rounded-full px-3 py-1 bg-green-600"
                    >
                        After revolution →
                    </Link>

                    <Link
                        href="/daily-news"
                        className="border-white rounded-full px-3 py-1 bg-white text-black"
                    >
                        Daily news →
                    </Link>
                    <Link
                        href="/archive"
                        className="border-white rounded-full px-3 py-1 bg-white text-black"
                    >
                        Full archive →
                    </Link>
                    <Link
                        href="/warriors"
                        className="border rounded-full px-3 py-1 bg-red-700"
                    >
                        View all warriors →
                    </Link>

                </div>
            </section>

            {/* Counters */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-xl p-4 space-y-1 backdrop-blur hover:scale-105 transition-transform">
                    <Link href="https://en.wikipedia.org/wiki/2025%E2%80%932026_Iranian_protests">
                    <h2 className="font-semibold text-sm text-white">
                        Days since revolution started
                    </h2>
                    <p className="text-3xl font-bold">
                        {daysSinceRevolution !== null ? daysSinceRevolution : '—'}
                    </p>
                    {revolutionStartStr && (
                        <><p className="text-xs text-white">
                            Since {revolutionStartStr}
                        </p><p className="text-xs text-white">
                            {daysSinceRevolution !== null ? daysSinceRevolution : '—'} days ago Iranian people started raising their voices against the Islamic Republic.
                        </p></>
                    )}
                    </Link>
                </div>

                <div className="border rounded-xl p-4 space-y-1 backdrop-blur hover:scale-105 transition-transform">
                    <Link href="https://irinter.net/?utm_source=chatgpt.com">
                    <h2 className="font-semibold text-sm text-white">
                        Days since internet shutdown
                    </h2>
                    <p className="text-3xl font-bold">
                        {daysSinceShutdown !== null ? daysSinceShutdown : '—'}
                    </p>
                    {shutdownStartStr && (
                        <><p className="text-xs text-white">Since {shutdownStartStr}</p><p
                            className="text-xs text-white">
                            Since {daysSinceShutdown !== null ? daysSinceShutdown : '—'} days ago, there is no connection to any form of communication inside Iran.
                        </p></>
                    )}
                </Link>
                </div>

                <div className="border rounded-xl p-4 space-y-1 backdrop-blur hover:scale-105 transition-transform">
                    <Link href="https://www.iranintl.com/en/202601130145">
                    <h2 className="font-semibold text-sm text-white">
                        People killed by the Islamic Republic
                    </h2>
                    <p className="text-3xl font-bold text-white"><strong className="text-red-700">+12,000</strong> innocent <strong className="text-red-700">iranian individuals</strong></p>
                    <p className="text-xs text-white">
                        This number is official and these young unarmed people have been killed only in two days.
                    </p>
                    </Link>
                </div>
            </section>

            {/* Recently documented warriors */}
            <section className="mt-10 space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-semibold">
                        Recently documented warriors (innocent people who got brutally killed by Islamic Republic)
                    </h2>
                    <Link
                        href="/warriors"
                        className="text-xs text-gray-200 underline underline-offset-4"
                    >
                        View all
                    </Link>
                </div>

                {latestWarriors.length === 0 ? (
                    <p className="text-sm text-gray-300">
                        No warriors added yet. Use the admin panel to start the archive.
                    </p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {latestWarriors.map((w) => (
                            <li
                                key={w.id}
                                className="border border-white/40 rounded-3xl p-3 bg-white/5 backdrop-blur flex flex-col gap-3"
                            >
                                {/* Image on top if present */}

                                    <div className="rounded-2xl overflow-hidden">
                                        <img
                                            src={w.picture ? w.picture : 'https://voiceofrestart.com/persian/wp-content/uploads/sites/2/2022/11/Iran-map-and-blood-768x432.jpg'}
                                            alt={`${w.name} ${w.lastName}`}
                                            className="w-full aspect-[4/3] object-cover"
                                        />
                                    </div>

                                {/* Text block – card height is AUTO, will grow with content */}
                                <div className="flex-1 flex flex-col gap-1">
                                    <h3 className="text-base font-semibold leading-snug break-words">
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


            {/* Latest daily news */}
            <section className="mt-10 space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Latest daily news</h2>
                    <Link
                        href="/daily-news"
                        className="text-xs text-white underline underline-offset-4"
                    >
                        View all
                    </Link>
                </div>

                {latestNews.length === 0 ? (
                    <p className="text-sm text-white">
                        No news added yet. Use the admin panel to add daily updates.
                    </p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {latestNews.map((n) => (
                            <li
                                key={n.id}
                                className="border border-white/40 rounded-3xl p-3 bg-white/5 backdrop-blur flex flex-col gap-2"
                            >
                                <Link
                                    href={`/daily-news/${n.id}`}
                                    className="block border border-white/40 rounded-3xl p-3 text-sm space-y-1 bg-white/5 backdrop-blur hover:bg-white/10 transition"
                                >
                                {/* Optional picture on top */}
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
                                    <h3 className="text-base font-semibold leading-snug break-words">
                                        {n.title}
                                    </h3>
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


            {/* Latest archive entries */}
            <section className="mt-10 space-y-3 mb-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Recent archive entries</h2>
                    <Link
                        href="/archive"
                        className="text-xs text-white underline underline-offset-4"
                    >
                        View all
                    </Link>
                </div>

                {latestCrimeNews.length === 0 ? (
                    <p className="text-sm text-white">
                        No archive entries yet. Mark news as crimes in the admin panel.
                    </p>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {latestCrimeNews.map((item) => (
                            <li key={item.id} className="border border-white/40 rounded-3xl p-3 bg-white/5 backdrop-blur flex flex-col gap-2">
                                <Link
                                    href={`/archive/${item.id}`}
                                    className="block border border-white/40 rounded-3xl p-3 text-sm space-y-1 bg-white/5 backdrop-blur hover:bg-white/10 transition"
                                >
                                    {item.picture && (
                                        <div className="rounded-2xl overflow-hidden">
                                            <img
                                                src={item.picture}
                                                alt={item.title}
                                                className="w-full aspect-[4/3] object-cover"
                                            />
                                        </div>
                                    )}
                                    <p className="font-semibold mb-1">{item.title}</p>
                                    <p className="text-xs text-white mb-1">
                                        {item.date.toISOString().slice(0, 10)}
                                    </p>
                                    <p className="text-xs text-white line-clamp-2">
                                        {item.description}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

        </main>
    )
}
