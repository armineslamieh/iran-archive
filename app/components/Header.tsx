"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="border-b bg-black/80 top-0 z-10 backdrop-blur-sm text-white w-full">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                <Image src="/iran-revolution.jpeg"
                       alt="Logo" width={100} height={100}
                className="rounded-3xl"/>
                <Link href="/" className="font-semibold text-sm md:text-base text-white">
                    REVOLUTION OF IRAN 2026
                </Link>
            </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex gap-7 text-xs md:text-sm text-white">
                    <Link href="/warriors">Warriors</Link>
                    <Link href="/daily-news">Daily news</Link>
                    <Link href="/archive">Archive</Link>
                    <Link href="/after-revolution">After revolution</Link>
                    <Link href="/about-me">About me</Link>
                </nav>

                {/* Mobile menu toggle */}
                <button
                    className="md:hidden flex flex-col gap-1"
                    onClick={() => setOpen(!open)}
                >
                    <span className="block w-6 h-0.5 bg-white" />
                    <span className="block w-6 h-0.5 bg-white" />
                    <span className="block w-6 h-0.5 bg-white" />
                </button>
            </div>

            {/* Mobile dropdown menu */}
            {open && (
                <div className="md:hidden flex flex-col gap-4 bg-black/90 px-4 py-3 text-sm animate-slideDown">
                    <Link href="/warriors">Warriors</Link>
                    <Link href="/daily-news">Daily news</Link>
                    <Link href="/archive">Archive</Link>
                    <Link href="/after-revolution">After revolution</Link>
                    <Link href="/about-me">About me</Link>
                </div>
            )}
        </header>
    );
}
