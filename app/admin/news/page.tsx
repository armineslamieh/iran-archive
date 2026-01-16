// app/admin/news/page.tsx
'use client'

import { useEffect, useState } from 'react'

const todayString = new Date().toISOString().slice(0, 10)

type NewsItem = {
    id: number
    title: string
    description: string
    picture: string | null
    date: string // ISO string from API
    isCrime: boolean
}

export default function AdminNewsPage() {
    const [news, setNews] = useState<NewsItem[]>([])
    const [adminToken, setAdminToken] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null)
    const [form, setForm] = useState({
        title: '',
        description: '',
        picture: '',
        date: todayString,
        isCrime: false,
    })
    const [loading, setLoading] = useState(false)

    // Load existing news
    useEffect(() => {
        fetch('/api/news')
            .then((res) => res.json())
            .then(setNews)
            .catch((err) => console.error(err))
    }, [])

    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            picture: '',
            date: todayString,
            isCrime: false,
        })
        setEditingId(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const payload = {
            title: form.title,
            description: form.description,
            picture: form.picture || null,
            date: form.date,
            isCrime: form.isCrime,
        }

        try {
            const url =
                editingId === null ? '/api/news' : `/api/news/${editingId}`

            const method = editingId === null ? 'POST' : 'PUT'

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const text = await res.text()
                alert(`Error: ${res.status} – ${text}`)
                return
            }

            const returned: NewsItem = await res.json()

            if (editingId === null) {
                setNews((prev) => [returned, ...prev])
            } else {
                setNews((prev) =>
                    prev.map((n) => (n.id === returned.id ? returned : n))
                )
            }

            resetForm()
        } catch (err) {
            console.error(err)
            alert('Unexpected error')
        } finally {
            setLoading(false)
        }
    }

    const handleEditClick = (n: NewsItem) => {
        setEditingId(n.id)
        setForm({
            title: n.title,
            description: n.description,
            picture: n.picture ?? '',
            date: n.date.slice(0, 10),
            isCrime: n.isCrime,
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = async (id: number) => {
        if (!confirm('Are you sure you want to delete this news item?')) return

        try {
            const res = await fetch(`/api/news/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            })

            if (!res.ok && res.status !== 204) {
                const text = await res.text()
                alert(`Error: ${res.status} – ${text}`)
                return
            }

            setNews((prev) => prev.filter((n) => n.id !== id))

            if (editingId === id) {
                resetForm()
            }
        } catch (err) {
            console.error(err)
            alert('Unexpected error while deleting')
        }
    }

    return (
        <main className="space-y-6">
            <h2 className="text-xl font-semibold">Manage Daily News</h2>

            {/* Admin password */}
            <section className="border rounded-xl p-4 space-y-4 backdrop-blur-2xl">
                <h3 className="font-semibold">
                    {editingId === null ? 'Add news' : 'Edit news'}
                </h3>

                <div className="space-y-1">
                    <label className="text-sm">Admin password:</label>
                    <input
                        type="password"
                        className="border rounded px-2 py-1 w-full max-w-xs ml-5"
                        value={adminToken}
                        onChange={(e) => setAdminToken(e.target.value)}
                        placeholder="ADMIN_PASSWORD"
                    />
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="grid gap-3 md:grid-cols-2 items-start"
                >
                    <div className="md:col-span-2">
                        <label className="block text-sm mb-1">Title</label>
                        <input
                            className="border rounded px-2 py-1 w-full"
                            value={form.title}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, title: e.target.value }))
                            }
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm mb-1">Description</label>
                        <textarea
                            className="border rounded px-2 py-1 w-full h-32 resize-vertical"
                            value={form.description}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, description: e.target.value }))
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Picture URL</label>
                        <input
                            className="border rounded px-2 py-1 w-full"
                            value={form.picture}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, picture: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">
                            Date (YYYY-MM-DD)
                        </label>
                        <input
                            type="text"
                            className="border rounded px-2 py-1 w-full"
                            value={form.date}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, date: e.target.value }))
                            }
                            placeholder="2022-09-16"
                            required
                        />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3">
                        <label className="inline-flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={form.isCrime}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, isCrime: e.target.checked }))
                                }
                                className="h-4 w-4"
                            />
                            <span>This news describes a crime and should appear in the archive</span>
                        </label>
                    </div>


                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <button
                            type="submit"
                            className="border rounded px-3 py-2 bg-green-500 hover:bg-green-600 text-white"
                            disabled={loading}
                        >
                            {loading
                                ? editingId === null
                                    ? 'Saving…'
                                    : 'Updating…'
                                : editingId === null
                                    ? 'Save news'
                                    : 'Update news'}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-sm underline underline-offset-4"
                            >
                                Cancel edit
                            </button>
                        )}
                    </div>
                </form>
            </section>

            {/* Existing news */}
            <section className="border rounded-xl p-4 backdrop-blur-2xl space-y-3">
                <h3 className="font-semibold mb-2">Existing news</h3>
                {news.length === 0 ? (
                    <p className="text-sm text-gray-500">No news items yet.</p>
                ) : (
                    <div className="max-h-[32rem] overflow-auto pr-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {news.map((n) => (
                                <article
                                    key={n.id}
                                    className="border border-white/40 rounded-3xl p-3 bg-white/5 backdrop-blur flex flex-col gap-2"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold leading-snug break-words">
                                            {n.title}
                                        </h4>
                                        <p className="text-[10px] text-gray-200 whitespace-nowrap">
                                            {n.date.slice(0, 10)}
                                        </p>
                                    </div>

                                    {n.picture && (
                                        <div className="rounded-2xl overflow-hidden">
                                            <img
                                                src={n.picture}
                                                alt={n.title}
                                                className="w-full aspect-[4/3] object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => handleEditClick(n)}
                                            className="text-xs px-3 py-1 rounded-full border border-yellow-400 text-yellow-200 hover:bg-yellow-400/10"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteClick(n.id)}
                                            className="text-xs px-3 py-1 rounded-full border border-red-500 text-red-300 hover:bg-red-500/10"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}
