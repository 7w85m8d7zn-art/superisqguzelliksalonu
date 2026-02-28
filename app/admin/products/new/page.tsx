'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUploader from '@/src/components/admin/ImageUploader'

interface Filter {
  id: string
  name: string
  type: 'category' | 'color' | 'size' | 'price' | 'tag'
  values: string[]
  active: boolean
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    price_from: '',
    description: '',
    service_details: '',
    category: '',
    colors: [] as string[],
    tags: [] as string[],
    images: [''],
    featured: false,
  })

  // Filtreleri localStorage'dan çek
  useEffect(() => {
    const stored = localStorage.getItem('product_filters')
    if (stored) {
      try {
        const parsed: Filter[] = JSON.parse(stored)
        
        // Kategorileri al
        const categoryFilter = parsed.find(f => f.type === 'category' && f.active)
        if (categoryFilter) {
          setCategories(categoryFilter.values)
        } else {
          // Varsayılan kategoriler
          setCategories(['Özel Dikim', 'Kiralama', 'Hazır Giyim', 'Aksesuar'])
        }
        
        // Renkleri al
        const colorFilter = parsed.find(f => f.type === 'color' && f.active)
        if (colorFilter) {
          setColors(colorFilter.values)
        } else {
          // Varsayılan renkler
          setColors(['Beyaz', 'Krem', 'Pudra', 'Gümüş', 'Peach', 'Altın'])
        }
        
        // Etiketleri al
        const tagFilters = parsed.filter(f => f.type === 'tag' && f.active)
        const allTags = tagFilters.flatMap(f => f.values)
        setTags(allTags.length > 0 ? allTags : ['Topuz', 'Kesim', 'Dalga', 'Düzleştirme', 'Renklendirme', 'Özel Gün', 'Günlük', 'Bukle', 'Bohem', 'Bakım', 'Özel'])
      } catch (e) {
        console.error('Filtre parse hatası:', e)
      }
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const sanitizedImages = formData.images
      .map((image) => image.trim())
      .filter((image) => image.length > 0)

    const serviceDetails = formData.service_details
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: sanitizedImages,
          service_details: serviceDetails,
          price_from: parseFloat(formData.price_from) || 0,
        }),
      })

      if (res.ok) {
        setShowPopup(true)
        setTimeout(() => {
          setShowPopup(false)
          router.push('/admin/products')
        }, 5000)
      } else {
        alert('Model eklenirken bir hata oluştu.')
      }
    } catch (error) {
      console.error('Model ekleme hatası:', error)
      alert('Model eklenirken bir hata oluştu.')
    }
    setLoading(false)
  }

  function addImageField() {
    setFormData({ ...formData, images: [...formData.images, ''] })
  }

  function removeImageField(index: number) {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  function updateImageField(index: number, value: string) {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData({ ...formData, images: newImages })
  }

  function appendUploadedImages(previews: string[]) {
    setFormData((prev) => {
      const existing = prev.images.map((image) => image.trim()).filter((image) => image.length > 0)
      const merged = Array.from(new Set([...existing, ...previews]))
      return {
        ...prev,
        images: merged.length > 0 ? merged : [''],
      }
    })
  }

  return (
    <section className="mx-auto max-w-4xl">
      {/* Popup Notification */}
      {showPopup && (
        <div className="fixed left-3 right-3 top-4 z-50 rounded-lg bg-green-500 px-6 py-4 text-white shadow-lg sm:left-auto sm:right-4">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-semibold">Model başarıyla eklendi!</p>
              <p className="text-sm opacity-90">5 saniye içinde yönlendiriliyorsunuz...</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/admin/products" className="hover:text-gray-900">
            Model
          </Link>
          <span>/</span>
          <span>Yeni Model</span>
        </div>
        <h1 className="admin-page-title">Yeni Model Ekle</h1>
        <p className="admin-page-subtitle mt-1">Yeni bir Model eklemek için aşağıdaki formu doldurun</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Model Adı */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-black focus:ring-2 focus:ring-black"
              placeholder="Model adını girin"
            />
          </div>

          {/* Fiyat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlangıç Fiyatı (₺) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price_from}
              onChange={(e) => setFormData({ ...formData, price_from: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-black focus:ring-2 focus:ring-black"
              placeholder="0.00"
            />
          </div>

          {/* Açıklama */}
          <div className="md:col-span-2">
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-black focus:ring-2 focus:ring-black"
              placeholder="Model hakkında detaylı bilgi girin"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hizmet Detayları (Her satıra bir detay)
            </label>
            <textarea
              rows={5}
              value={formData.service_details}
              onChange={(e) => setFormData({ ...formData, service_details: e.target.value })}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-black focus:ring-2 focus:ring-black"
              placeholder={`Premium kalite ve profesyonel uygulama\nÖlçü alımı ve danışmanlık hizmetleri sunulur\nÜcretsiz alterasyon yapılır`}
            />
          </div>

          {/* Öne Çıkan */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-sm font-medium text-gray-700">
                Bu Modeli öne çıkar (Ana sayfada göster)
              </span>
            </label>
          </div>
        </div>

        {/* Görseller */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Model Görselleri
          </label>
          <ImageUploader onPreviews={appendUploadedImages} />
          <p className="mt-2 text-xs text-slate-500">
            Yüklenen görseller URL listesine otomatik eklenir.
          </p>
          {formData.images.map((image, index) => (
            <div key={index} className="mb-3 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={image}
                onChange={(e) => updateImageField(index, e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-black focus:ring-2 focus:ring-black"
                placeholder={`Görsel URL ${index + 1}`}
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50 sm:self-start"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Görsel Ekle
          </button>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-end">
          <Link
            href="/admin/products"
            className="rounded-lg border border-gray-300 px-4 py-2 text-center text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="admin-btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ekleniyor...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Modeli Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  )
}
