'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import ImageUploader from '@/src/components/admin/ImageUploader'

interface Filter {
  id: string
  name: string
  type: 'category' | 'color' | 'size' | 'price' | 'tag'
  values: string[]
  active: boolean
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  const hasLegacyInlineImages = formData.images.some((image) => image.trim().startsWith('data:image/'))

  // Filtreleri ve Model, çek
  useEffect(() => {
    const stored = localStorage.getItem('product_filters')
    if (stored) {
      try {
        const parsed: Filter[] = JSON.parse(stored)
        const categoryFilter = parsed.find(f => f.type === 'category' && f.active)
        setCategories(categoryFilter?.values || ['Topuz', 'Özel Gün', 'Kesim', 'Günlük', 'Bukle', 'Renklendirme', 'Dalga', 'Bahem', 'Düzleştirme', 'Bakım', 'Özel'])
        
        const colorFilter = parsed.find(f => f.type === 'color' && f.active)
        setColors(colorFilter?.values || ['Beyaz', 'Krem', 'Pudra', 'Gümüş', 'Peach', 'Altın'])
        
        const tagFilters = parsed.filter(f => f.type === 'tag' && f.active)
        setTags(tagFilters.flatMap(f => f.values))
      } catch (e) {
        console.error(e)
      }
    }

    // Model, çek
    fetchProduct()
  }, [productId])

  async function fetchProduct() {
    try {
      const res = await fetch('/api/products')
      const products = await res.json()
      const product = products.find((p: any) => p.id === productId)
      
      if (product) {
        setFormData({
          title: product.title || product.name || '',
          price_from: (product.price_from || product.priceFrom || 0).toString(),
          description: product.description || '',
          service_details: Array.isArray(product.service_details) ? product.service_details.join('\n') : '',
          category: product.category || '',
          colors: product.colors || [],
          tags: product.tags || [],
          images: product.images?.length ? product.images : [''],
          featured: product.featured || false,
        })
      }
    } catch (e) {
      console.error('Model çekme hatası:', e)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const serviceDetails = formData.service_details
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    // Form verilerini hazırla
    const submitData = {
      id: productId,
      title: formData.title,
      price_from: parseFloat(formData.price_from) || 0,
      description: formData.description,
      service_details: serviceDetails,
      category: formData.category,
      colors: formData.colors,
      tags: formData.tags,
      images: formData.images.filter(img => img.trim() !== ''),
      featured: formData.featured,
    }

    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      if (res.ok) {
        setShowPopup(true)
        setTimeout(() => {
          setShowPopup(false)
          router.push('/admin/products')
        }, 3000)
      } else {
        const errorData = await res.json().catch(() => null)
        console.error('API hatası:', errorData)
        alert('Model güncellenirken bir hata oluştu: ' + (errorData?.error || 'Bilinmeyen hata'))
      }
    } catch (error) {
      console.error('Model güncelleme hatası:', error)
      alert('Model güncellenirken bir hata oluştu.')
    }
    setSaving(false)
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

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </section>
    )
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
              <p className="font-semibold">Model başarıyla güncellendi!</p>
              <p className="text-sm opacity-90">3 saniye içinde yönlendiriliyorsunuz...</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/admin/products" className="hover:text-gray-900">Model</Link>
          <span>/</span>
          <span>Model, Düzenle</span>
        </div>
        <h1 className="admin-page-title">Model, Düzenle</h1>
        <p className="admin-page-subtitle mt-1">Model bilgilerini güncellemek için aşağıdaki formu düzenleyin</p>
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

          {/* Koleksiyon Filtreleri */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    const newCategory = formData.category === category ? '' : category
                    setFormData({ ...formData, category: newCategory })
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    formData.category === category
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Renk Seçimi */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Renkler</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    const newColors = formData.colors.includes(color)
                      ? formData.colors.filter(c => c !== color)
                      : [...formData.colors, color]
                    setFormData({ ...formData, colors: newColors })
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    formData.colors.includes(color)
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Açıklama */}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Hizmet Detayları (Her satıra bir detay)</label>
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
              <span className="text-sm font-medium text-gray-700">Bu Model, öne çıkar (Ana sayfada göster)</span>
            </label>
          </div>
        </div>

        {/* Görseller */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Model Görselleri</label>
          {hasLegacyInlineImages && (
            <p className="mb-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
              Bu modelde eski tip dusuk kaliteli inline (base64) gorseller var. Net goruntu icin yeni gorsel yukleyip eski URL satirlarini silin.
            </p>
          )}
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
          <Link href="/admin/products" className="rounded-lg border border-gray-300 px-4 py-2 text-center text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50">
            İptal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="admin-btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kaydediliyor...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Değişiklikleri Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  )
}
