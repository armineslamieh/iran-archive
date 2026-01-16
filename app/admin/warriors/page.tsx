// app/admin/warriors/page.tsx
'use client'

import { useEffect, useState } from 'react'

const todayString = new Date().toISOString().slice(0, 10)

type Warrior = {
    id: number
    name: string
    lastName: string
    age: number | null
    picture: string | null
    date: string
}

export default function AdminWarriorsPage() {
    const [warriors, setWarriors] = useState<Warrior[]>([])
    const [adminToken, setAdminToken] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null)
    const [form, setForm] = useState({
        name: '',
        lastName: '',
        age: '',
        picture: '',
        date: todayString,
    })
    const [loading, setLoading] = useState(false)

    // Load existing warriors from the API
    useEffect(() => {
        fetch('/api/warriors')
            .then((res) => res.json())
            .then(setWarriors)
            .catch((err) => console.error(err))
    }, [])

    const resetForm = () => {
        setForm({
            name: '',
            lastName: '',
            age: '',
            picture: '',
            date: todayString,
        })
        setEditingId(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const payload = {
            name: form.name,
            lastName: form.lastName,
            age: form.age ? Number(form.age) : null,
            picture: form.picture || null,
            date: form.date,
        }

        try {
            const url =
                editingId === null
                    ? '/api/warriors'
                    : `/api/warriors/${editingId}`

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

            const returned: Warrior = await res.json()

            if (editingId === null) {
                // created
                setWarriors((prev) => [returned, ...prev])
            } else {
                // updated
                setWarriors((prev) =>
                    prev.map((w) => (w.id === returned.id ? returned : w))
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

    const handleEditClick = (w: Warrior) => {
        setEditingId(w.id)
        setForm({
            name: w.name,
            lastName: w.lastName,
            age: w.age != null ? String(w.age) : '',
            picture: w.picture ?? '',
            date: w.date.slice(0, 10),
        })
        // scroll to top of page where the form is
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = async (id: number) => {
        if (!confirm('Are you sure you want to delete this warrior?')) return

        try {
            const res = await fetch(`/api/warriors/${id}`, {
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

            setWarriors((prev) => prev.filter((w) => w.id !== id))

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
            <h2 className="text-xl font-semibold">Manage Warriors</h2>

            {/* Admin password */}
            <section className="border rounded-xl p-4 space-y-4 backdrop-blur-2xl">
                <h3 className="font-semibold">
                    {editingId === null ? 'Add new warrior' : 'Edit warrior'}
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
                    className="grid gap-3 md:grid-cols-2 items-end"
                >
                    <div>
                        <label className="block text-sm mb-1">Name</label>
                        <input
                            className="border rounded px-2 py-1 w-full"
                            value={form.name}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, name: e.target.value }))
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Last name</label>
                        <input
                            className="border rounded px-2 py-1 w-full"
                            value={form.lastName}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, lastName: e.target.value }))
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Age</label>
                        <input
                            type="number"
                            className="border rounded px-2 py-1 w-full"
                            value={form.age}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, age: e.target.value }))
                            }
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
                                    ? 'Save warrior'
                                    : 'Update warrior'}
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

            {/* Existing warriors */}
            <section className="border rounded-xl p-4 backdrop-blur-2xl">
                <h3 className="font-semibold mb-2">Existing warriors</h3>
                {warriors.length === 0 ? (
                    <p className="text-sm text-gray-500">No warriors yet.</p>
                ) : (
                    <ul className="space-y-2 max-h-96 overflow-auto text-sm">
                        {warriors.map((w) => (
                            <li
                                key={w.id}
                                className="border rounded p-2 flex justify-between items-center gap-2"
                            >
                                <div>
                                    <p className="font-medium">
                                        {w.name} {w.lastName}
                                    </p>
                                    <p className="text-xs text-gray-300">
                                        Age: {w.age ?? 'N/A'} | Date: {w.date.slice(0, 10)}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleEditClick(w)}
                                        className="text-xs px-2 py-1 rounded border border-yellow-400 text-yellow-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteClick(w.id)}
                                        className="text-xs px-2 py-1 rounded border border-red-500 text-red-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    )
}
