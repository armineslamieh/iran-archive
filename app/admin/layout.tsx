// app/admin/layout.tsx
import type { ReactNode } from 'react'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="max-w-5xl mx-auto p-4 space-y-4">
            <header className="flex items-center justify-between border-b pb-3 mb-2">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <nav className="space-x-4 text-sm">
                    <Link href="/admin/warriors">Warriors</Link>
                    <Link href="/admin/news">News</Link>
                    <Link href="/">Public site</Link>
                </nav>
            </header>
            {children}
        </div>
    )
}
