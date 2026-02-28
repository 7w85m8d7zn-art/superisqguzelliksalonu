'use client'

import { useEffect, useState } from 'react'

export default function HomepageEditor() {
  const [form, setForm] = useState({ hero_title: '', hero_subtitle: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchHomepage()
  }, [])

  async function fetchHomepage() {
    setLoading(true)
    try {
      const res = await fetch('/api/homepage')
      const data = await res.json()
      setForm(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function handleSave() {
    try {
      const res = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        alert('Kaydedildi!')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <section className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Ana Sayfa İçeriği</h2>
        <p className="text-sm text-gray-500">Hero metni ve diğer ana sayfa öğelerini yönetin.</p>
      </div>

      <div className="bg-white p-6 rounded-lg border space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hero Başlığı</label>
          <input
            type="text"
            value={form.hero_title || ''}
            onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
            className="w-full border p-2 rounded"
            placeholder="Örn: Hayalinizdeki Gelinliği Keşfedin"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hero Alt Başlığı</label>
          <textarea
            value={form.hero_subtitle || ''}
            onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
            className="w-full border p-2 rounded"
            rows={3}
            placeholder="Açıklayıcı metin..."
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50 sm:w-auto"
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </section>
  )
}
