'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Filter {
  id: string
  name: string
  type: 'category' | 'color' | 'size' | 'price' | 'tag'
  values: string[]
  active: boolean
}

const STORAGE_KEY = 'product_filters'

const defaultFilters: Filter[] = [
  { id: '1', name: 'Koleksiyon', type: 'category', values: ['Kiralama', 'Özel Dikim', 'Hazır Giyim', 'Aksesuar'], active: true },
  { id: '2', name: 'Renk', type: 'color', values: ['Beyaz', 'Krem', 'Pudra', 'Gümüş', 'Peach', 'Altın'], active: true },
]

export default function FiltersPage() {
  const [filters, setFilters] = useState<Filter[]>(defaultFilters)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFilter, setEditingFilter] = useState<Filter | null>(null)
  const [newFilterValue, setNewFilterValue] = useState('')
  const [formData, setFormData] = useState<Partial<Filter>>({
    name: '',
    type: 'color',
    values: [],
    active: true,
  })

  // localStorage'dan filtreleri çek
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setFilters(parsed)
      } catch (e) {
        console.error('Filtre parse hatası:', e)
      }
    }
    setLoading(false)
  }, [])

  // Filtreleri localStorage'a kaydet
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
    }
  }, [filters, loading])

  function handleAddFilter() {
    setEditingFilter(null)
    setFormData({ name: '', type: 'category', values: [], active: true })
    setNewFilterValue('')
    setShowModal(true)
  }

  function handleEditFilter(filter: Filter) {
    setEditingFilter(filter)
    setFormData({ ...filter })
    setNewFilterValue('')
    setShowModal(true)
  }

  function handleDeleteFilter(id: string) {
    if (!confirm('Bu filtreyi silmek istediğinize emin misiniz?')) return
    setFilters(filters.filter(f => f.id !== id))
  }

  function handleAddValue() {
    if (!newFilterValue.trim()) return
    setFormData({
      ...formData,
      values: [...(formData.values || []), newFilterValue.trim()],
    })
    setNewFilterValue('')
  }

  function handleRemoveValue(index: number) {
    setFormData({
      ...formData,
      values: formData.values?.filter((_, i) => i !== index) || [],
    })
  }

  function handleSaveFilter() {
    const cleanedValues = (formData.values || [])
      .map((value) => value.trim())
      .filter(Boolean)

    if (!formData.name?.trim() || !cleanedValues.length) {
      alert('Filtre adı ve en az bir değer girilmelidir.')
      return
    }

    if (editingFilter) {
      // Güncelle
      setFilters(filters.map(f => 
        f.id === editingFilter.id 
          ? {
              ...f,
              ...formData,
              name: formData.name?.trim() || f.name,
              values: cleanedValues,
              active: formData.active ?? true,
            } as Filter
          : f
      ))
    } else {
      // Yeni ekle
      const newFilter: Filter = {
        id: Date.now().toString(),
        name: formData.name?.trim() || '',
        type: formData.type as Filter['type'],
        values: cleanedValues,
        active: formData.active ?? true,
      }
      setFilters([...filters, newFilter])
    }
    setShowModal(false)
  }

  function toggleFilterActive(id: string) {
    setFilters(filters.map(f => 
      f.id === id ? { ...f, active: !f.active } : f
    ))
  }

  const filterTypeLabels: Record<string, string> = {
    category: 'Koleksiyon',
    color: 'Renk',
    tag: 'Etiket',
  }

  return (
    <section className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="admin-page-title">Filtre Yönetimi</h1>
            <p className="admin-page-subtitle mt-1">Model filtrelerini görüntüleyin, ekleyin, düzenleyin veya silin</p>
          </div>
          <button
            onClick={handleAddFilter}
            className="admin-btn-primary inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Filtre
          </button>
        </div>
      </div>

      {/* Filters List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : filters.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-12 text-center"
        >
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz filtre yok</h3>
          <p className="text-gray-500 mb-6">İlk filtreizi eklemek için "Yeni Filtre" butonuna tıklayın</p>
          <button
            onClick={handleAddFilter}
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Filtre Ekle
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filters.map((filter) => (
              <motion.div
                key={filter.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {filter.name}
                    </h3>
                    <span className="mt-1 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {filterTypeLabels[filter.type]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFilterActive(filter.id)}
                      className={`relative h-6 w-10 rounded-full transition-colors ${filter.active ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${filter.active ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="mb-2 text-xs font-semibold text-gray-500">Değerler:</p>
                  <div className="flex flex-wrap gap-2">
                    {filter.values.map((value, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t pt-3">
                  <button
                    onClick={() => handleEditFilter(filter)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeleteFilter(filter.id)}
                    className="inline-flex items-center justify-center rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
                <div className="p-5">
                  <h2 className="mb-3 text-lg font-bold text-gray-900">
                    {editingFilter ? 'Filtreyi Düzenle' : 'Yeni Filtre Ekle'}
                  </h2>

                  <div className="space-y-4">
                    {/* Filtre Adı */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filtre Adı
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black"
                        placeholder="örn: Renk, Etiket"
                      />
                    </div>

                    {/* Filtre Tipi */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filtre Tipi
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as Filter['type'] })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black"
                      >
                      <option value="category">Koleksiyon</option>
                        <option value="color">Renk</option>
                        <option value="tag">Etiket</option>
                      </select>
                    </div>

                    {/* Filtre Değerleri */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filtre Değerleri
                      </label>
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          value={newFilterValue}
                          onChange={(e) => setNewFilterValue(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddValue())}
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black"
                          placeholder="Yeni değer ekle..."
                        />
                        <button
                          type="button"
                          onClick={handleAddValue}
                          className="admin-btn-primary rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:min-w-[88px]"
                        >
                          Ekle
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.values?.map((value, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm"
                          >
                            {value}
                            <button
                              type="button"
                              onClick={() => handleRemoveValue(idx)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Aktif/Pasif */}
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.active}
                          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                          className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Filtreyi aktif olarak kullan
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      İptal
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveFilter}
                      className="admin-btn-primary rounded-lg px-4 py-2 text-xs font-semibold transition-colors"
                    >
                      {editingFilter ? 'Güncelle' : 'Ekle'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
