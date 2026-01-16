// app/about-me/page.tsx
import Link from 'next/link'
import Image from 'next/image'

export default function AboutMePage() {
    return (
        <main className="max-w-3xl mx-auto p-4 space-y-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold">About me</h1>
                <p className="text-sm text-white">
                    Who I am and why I built this archive.
                </p>
            </header>

            <section className="space-y-3 text-sm md:text-base leading-relaxed text-white flex justify-center items-center gap-7">
                <div className="flex-1 backdrop-blur-2xl border-transparent rounded-3xl p-5 gap-3">
                <p>
                    {/* Replace this with your real story */}
                    I am Armin, a 25-year-old Iranian man who has been living in Iran for 24 years.
                    I am not a government, an organization, or a media company. I&apos;m an
                    individual who refuses to let these stories be erased. Every name,
                    every date, every event is a piece of evidence and a piece of memory.
                    I created this website to document the crimes of the Islamic Republic
                    and to preserve the memory of those who have been killed, silenced,
                    or disappeared. This project is not neutral: it stands with the people
                    of Iran and against oppression.
                    If you have corrections, new information, or you want to contribute,
                    you can reach me through this E-mail: iranrevolutionarchive2026@gmail.com
                </p>
                </div>
            </section>

            <p className="text-xs text-white">
                This page may be updated over time as my situation and the project
                evolve.
            </p>

            <p className="text-xs">
                <Link href="/" className="underline underline-offset-4 text-white">
                    ← Back to home
                </Link>
            </p>
        </main>
    )
}
