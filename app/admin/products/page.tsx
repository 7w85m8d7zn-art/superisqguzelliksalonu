'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Product {
  id: string
  title: string
  name?: string
  price_from?: string
  priceFrom?: number
  images?: string[]
  category?: string
  featured?: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const DELETED_PRODUCTS_KEY = 'deleted_product_ids'

  // Silinmiş Model ID'lerini al
  function getDeletedIds(): string[] {
    const stored = localStorage.getItem(DELETED_PRODUCTS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  // Silinmiş Model ID'si ekle
  function addDeletedId(id: string) {
    const deleted = getDeletedIds()
    if (!deleted.includes(id)) {
      deleted.push(id)
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(deleted))
    }
  }

  async function fetchProducts() {
    setLoading(true)
    try {
      const res = await fetch('/api/products', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      })
      const data = await res.json()
      
      if (!Array.isArray(data)) {
        console.warn('Unexpected /api/products response:', data)
        setProducts([])
      } else {
        setProducts(data)
      }
    } catch (e) {
      console.error('Modeli çekerken hata:', e)
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu Model silmek istediğinize emin misiniz?')) return

    setDeleteLoading(id)
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        // Sadece UI'dan kaldır, sayfayı yenileyince tekrar gelir (local Model için)
        setProducts(prev => prev.filter(p => p.id !== id))
      } else {
        const errorData = await res.json()
        console.error('Delete error:', errorData)
        alert('Model silinirken bir hata oluştu: ' + (errorData?.error || 'Bilinmeyen hata'))
      }
    } catch (e) {
      console.error('Delete error:', e)
      alert('Model silinirken bir hata oluştu.')
    }
    setDeleteLoading(null)
  }

  const filtered = products.filter((p) =>
    (p.title || p.name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="admin-page-title">Model</h1>
            <p className="admin-page-subtitle mt-1">Tüm Modellerinizi yönetin, düzenleyin veya silin</p>
          </div>
          <Link
            href="/admin/products/new"
            className="admin-btn-primary inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Model
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-5">
        <div className="max-w-2xl rounded-xl border border-slate-300 bg-white shadow-sm">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Model ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-0 bg-transparent p-0 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-12 text-center"
        >
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz Model yok
          </h3>
          <p className="text-gray-500 mb-6">
            İlk Modelnüzü eklemek için "Yeni Model" butonuna tıklayın
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Model Ekle
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {filtered.map((p) => {
              const previewImage = p.images?.find((image) => typeof image === 'string' && image.trim().length > 0)
              const hasLegacyInlineImages = (p.images || []).some((image) => image.trim().startsWith('data:image/'))

              return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
              >
                {/* Image */}
                <div className="relative aspect-square bg-slate-100 overflow-hidden border-b border-slate-200 p-2 flex items-center justify-center">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt={p.title || p.name}
                      className="max-w-full max-h-full h-auto w-auto rounded-md object-contain group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {p.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                      Öne Çıkan
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  {p.category && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                      {p.category}
                    </div>
                  )}

                  {hasLegacyInlineImages && (
                    <div className="absolute bottom-3 left-3 rounded bg-amber-500 px-2 py-1 text-[10px] font-semibold text-amber-950">
                      Eski Gorsel
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-black/65 via-black/20 to-transparent p-3 opacity-100 transition-opacity sm:items-center sm:gap-3 sm:bg-black/50 sm:p-0 sm:opacity-0 sm:group-hover:opacity-100">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-100"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleteLoading === p.id}
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleteLoading === p.id ? (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      Sil
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
                    {p.title || p.name || 'İsimsiz Model'}
                  </h3>
                  <p className="mt-0.5 text-base font-bold text-gray-900">
                    ₺{Number(p.price_from || p.priceFrom || 0).toLocaleString('tr-TR')}
                  </p>
                </div>
              </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Stats Footer */}
      {!loading && filtered.length > 0 && (
        <div className="mt-5 flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Toplam <span className="font-semibold text-gray-900">{filtered.length}</span> Model gösteriliyor
          </p>
          {search && (
            <p>
              "<span className="font-semibold">{search}</span>" için arama sonuçları
            </p>
          )}
        </div>
      )}
    </section>
  )
}
