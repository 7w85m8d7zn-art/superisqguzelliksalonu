'use client'

import { useEffect, useState } from 'react'

interface PageSettings {
  about_title?: string
  about_content?: string
  contact_email?: string
  contact_phone?: string
  contact_whatsapp?: string
  [key: string]: any
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PageSettings>({})
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'about' | 'contact' | 'general'>('about')

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function saveSetting(key: string, value: string) {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      fetchSettings()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <section className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Site Ayarları</h2>
        <p className="text-sm text-gray-500">Sayfaları ve genel ayarları yönetin.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b pb-1">
        {(['about', 'contact', 'general'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 whitespace-nowrap px-4 py-2 font-medium ${tab === t ? 'border-b-2 border-black' : 'text-gray-600'}`}
          >
            {t === 'about' ? 'Hakkımızda' : t === 'contact' ? 'İletişim' : 'Genel'}
          </button>
        ))}
      </div>

      {/* About Tab */}
      {tab === 'about' && (
        <div className="bg-white p-6 rounded-lg border space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Başlık</label>
            <input
              type="text"
              value={settings.about_title || ''}
              onChange={(e) => setSettings({ ...settings, about_title: e.target.value })}
              onBlur={(e) => saveSetting('about_title', e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Hakkımızda"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">İçerik</label>
            <textarea
              value={settings.about_content || ''}
              onChange={(e) => setSettings({ ...settings, about_content: e.target.value })}
              onBlur={(e) => saveSetting('about_content', e.target.value)}
              className="w-full border p-2 rounded"
              rows={6}
              placeholder="Hakkımızda sayfası içeriği..."
            />
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {tab === 'contact' && (
        <div className="bg-white p-6 rounded-lg border space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">E-posta</label>
            <input
              type="email"
              value={settings.contact_email || ''}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              onBlur={(e) => saveSetting('contact_email', e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="info@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input
              type="tel"
              value={settings.contact_phone || ''}
              onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
              onBlur={(e) => saveSetting('contact_phone', e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="+90 555 123 4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp</label>
            <input
              type="tel"
              value={settings.contact_whatsapp || ''}
              onChange={(e) => setSettings({ ...settings, contact_whatsapp: e.target.value })}
              onBlur={(e) => saveSetting('contact_whatsapp', e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="+90 555 123 4567"
            />
          </div>
        </div>
      )}

      {/* General Tab */}
      {tab === 'general' && (
        <div className="bg-white p-6 rounded-lg border space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Site Başlığı</label>
            <input
              type="text"
              value={settings.site_title || ''}
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              onBlur={(e) => saveSetting('site_title', e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Su Perisi Güzellik Salonu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Site Açıklaması</label>
            <textarea
              value={settings.site_description || ''}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              onBlur={(e) => saveSetting('site_description', e.target.value)}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>
        </div>
      )}
    </section>
  )
}
