// app/after-revolution/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AfterRevolutionPage() {

    return (
        <main className="max-w-4xl mx-auto p-4 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">After the Revolution</h1>
                <Link
                    href="/"
                    className="text-sm underline underline-offset-4 text-white"
                >
                    ← Back to home
                </Link>
            </header>
            <p className="text-sm text-white"> Here is the official Website where you can read all the plans about after the revolution of Iran.</p>
            <iframe
                src="https://fund.nufdiran.org/projects/ipp/"
                style={{ width: '100%', height: 500, border: '1px solid #ccc' }}
                loading="lazy"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />

            <p className="text-xs text-white border-t pt-3 mt-4">
                This page is maintained by the archive administrators. Content may be
                updated as plans evolve.
            </p>
        </main>
    )
}
