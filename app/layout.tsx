// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import type { ReactNode } from 'react'
import  Header from "./components/Header";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Islamic Republic Crimes Archive',
    description:
        'Archive of crimes of the Islamic Republic: killed warriors, daily daily-news, and documentation.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className} >

        {/* Global header */}
        <Header />
        <img
            src="https://media.licdn.com/dms/image/v2/D4E12AQGUGxtEzPkk6g/article-cover_image-shrink_720_1280/B4EZu4xfsmKQAM-/0/1768331543990?e=2147483647&v=beta&t=QzLvrN4Tg9-wJbxQLuaFyrBcPE1HX3M2mqw9eMIwbBY"
            alt="background"
            className="fixed inset-0 w-full h-full object-contain -z-10 blur-xs"
        />

        {/* Page content */}
        <main className="pt-4 md:pt-6">{children}</main>
        </body>
        </html>
    )
}
