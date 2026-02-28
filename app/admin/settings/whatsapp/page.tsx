import React from 'react'

export default function WhatsAppSettings() {
  return (
    <section className="max-w-3xl mx-auto">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">WhatsApp Ayarları</h2>
          <p className="text-sm text-gray-500">Müşterilerle hızlı iletişim için numara ve otomatik mesajı ayarlayın.</p>
        </div>
      </div>

      <form className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">WhatsApp Numarası</label>
          <input name="whatsapp" className="w-full border p-2 rounded" placeholder="+90 5xx xxx xx xx" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Otomatik Mesaj Şablonu</label>
          <textarea name="template" className="w-full border p-2 rounded" rows={4} placeholder="Merhaba, nasıl yardımcı olabilirim?" />
          <div className="text-xs text-gray-400 mt-1">{`Örnek değişken: {name} -> müşteri adı`}</div>
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row sm:items-center">
          <button type="button" className="px-4 py-2 border rounded">İptal</button>
          <button className="bg-black text-white px-4 py-2 rounded">Kaydet</button>
        </div>
      </form>
    </section>
  )
}
