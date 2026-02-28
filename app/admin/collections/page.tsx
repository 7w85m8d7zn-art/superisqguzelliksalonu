'use client'

import { useEffect, useState } from 'react'

interface Collection {
  id: string
  title: string
  slug?: string
  description?: string
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', slug: '', description: '' })

  useEffect(() => {
    fetchCollections()
  }, [])

  async function fetchCollections() {
    setLoading(true)
    try {
      const res = await fetch('/api/collections')
      const data = await res.json()
      if (!Array.isArray(data)) {
        console.warn('Unexpected /api/collections response:', data)
        setCollections([])
      } else {
        setCollections(data)
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function handleSave() {
    if (!form.title) {
      alert('Başlık gerekli')
      return
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const payload = editingId ? { id: editingId, ...form } : form
      const res = await fetch('/api/collections', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setForm({ title: '', slug: '', description: '' })
        setEditingId(null)
        fetchCollections()
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Silmek istediğinize emin misiniz?')) return

    try {
      const res = await fetch(`/api/collections?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchCollections()
      }
    } catch (e) {
      console.error(e)
    }
  }

  function handleEdit(col: Collection) {
    setEditingId(col.id)
    setForm({ title: col.title, slug: col.slug || '', description: col.description || '' })
  }

  return (
    <section className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Koleksiyonlar</h2>
        <p className="text-sm text-gray-500">Koleksiyonları yönetin — düzenle, sil veya yeni ekleyin.</p>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h3 className="text-lg font-semibold">{editingId ? 'Düzenle' : 'Yeni Koleksiyon'}</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Başlık</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Açıklama</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border p-2 rounded"
            rows={3}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={handleSave}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {editingId ? 'Güncelle' : 'Ekle'}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null)
                setForm({ title: '', slug: '', description: '' })
              }}
              className="border px-4 py-2 rounded hover:bg-gray-100"
            >
              İptal
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Yükleniyor...</div>
        ) : collections.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">Henüz koleksiyon yok.</div>
        ) : (
          <>
            <div className="md:hidden divide-y">
              {collections.map((col) => (
                <div key={col.id} className="p-4 space-y-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Başlık</p>
                    <p className="text-sm font-semibold text-gray-900">{col.title}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Slug</p>
                    <p className="text-sm text-gray-700">{col.slug || '-'}</p>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button onClick={() => handleEdit(col)} className="text-sm font-semibold text-blue-600 hover:underline">
                      Düzenle
                    </button>
                    <button onClick={() => handleDelete(col.id)} className="text-sm font-semibold text-red-600 hover:underline">
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Başlık</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Slug</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((col) => (
                    <tr key={col.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{col.title}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{col.slug}</td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(col)} className="text-blue-600 hover:underline">
                            Düzenle
                          </button>
                          <button onClick={() => handleDelete(col.id)} className="text-red-600 hover:underline">
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
