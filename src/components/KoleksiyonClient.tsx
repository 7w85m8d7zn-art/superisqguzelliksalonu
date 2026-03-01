'use client'

import { useState, useMemo, useEffect, type Dispatch, type SetStateAction } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { StickyButtons } from '@/src/components/StickyButtons'
import { PageHero } from '@/src/components/PageHero'
import { ContactNumbers, Product } from '@/src/types'

type SortOption = 'featured' | 'price-low' | 'price-high' | 'newest'

interface Filter {
    id: string
    name: string
    type: 'category' | 'color' | 'size' | 'price' | 'tag'
    values: string[]
    active: boolean
}

interface KoleksiyonClientProps {
    initialProducts: Product[]
    contactNumbers: ContactNumbers
}

export function KoleksiyonClient({ initialProducts, contactNumbers }: KoleksiyonClientProps) {
    const products = initialProducts
    const [search, setSearch] = useState('')
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [sortBy, setSortBy] = useState<SortOption>('featured')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [customFilters, setCustomFilters] = useState<Filter[]>([])

    const getFirstValidImage = (images: string[] | undefined) => {
        if (!Array.isArray(images)) return null
        const first = images.find((image) => typeof image === 'string' && image.trim().length > 0)
        return first || null
    }

    const normalizeText = (value: string) =>
        value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '')

    const categoryAliases: Record<string, string> = {
        kiralama: 'Kiralama',
        ozeldikim: 'Ozel Dikim',
        hazirgiyim: 'Hazir Giyim',
        aksesuar: 'Aksesuar',
    }

    const formatCategoryLabel = (value: string) => {
        const trimmed = (value || '').trim()
        if (!trimmed) return ''

        const normalized = normalizeText(trimmed)
        if (categoryAliases[normalized]) {
            return categoryAliases[normalized]
        }

        return trimmed
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
    }

    const mergeUniqueValues = (values: string[]) => {
        const unique = new Map<string, string>()

        values.forEach((item) => {
            const value = String(item || '').trim()
            if (!value) return
            const key = normalizeText(value)
            if (!key || unique.has(key)) return
            unique.set(key, value)
        })

        return Array.from(unique.values())
    }

    const isValueSelected = (selectedValues: string[], value: string) => {
        const key = normalizeText(value)
        if (!key) return false
        return selectedValues.some((item) => normalizeText(item) === key)
    }

    const toggleSelectedValue = (
        value: string,
        setSelectedValues: Dispatch<SetStateAction<string[]>>
    ) => {
        const key = normalizeText(value)
        if (!key) return

        setSelectedValues((prev) => {
            if (prev.some((item) => normalizeText(item) === key)) {
                return prev.filter((item) => normalizeText(item) !== key)
            }
            return [...prev, value]
        })
    }

    // localStorage'dan ozel filtreleri cek
    useEffect(() => {
        const stored = localStorage.getItem('product_filters')
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) {
                    const normalizedFilters = parsed
                        .filter((f: Filter) => f && f.active)
                        .map((f: Filter) => ({
                            ...f,
                            values: Array.isArray(f.values) ? f.values : [],
                        }))
                    setCustomFilters(normalizedFilters)
                }
            } catch (e) {
                console.error(e)
            }
        }
    }, [])

    const allCategories = useMemo(() => {
        const productCategoryValues = products.map((product) => formatCategoryLabel(product.category || ''))
        const customCategoryValues = customFilters
            .filter((f) => f.type === 'category')
            .flatMap((f) => f.values.map((value) => formatCategoryLabel(value)))

        return mergeUniqueValues([...productCategoryValues, ...customCategoryValues])
    }, [products, customFilters])

    const allColors = useMemo(() => {
        const productColors = products.flatMap((p) => p.colors || [])
        const customColorValues = customFilters
            .filter((f) => f.type === 'color')
            .flatMap((f) => f.values)

        return mergeUniqueValues([...productColors, ...customColorValues])
    }, [products, customFilters])

    const allTags = useMemo(() => {
        const productTags = products.flatMap((p) => p.tags || [])
        const customTagValues = customFilters
            .filter((f) => f.type === 'tag')
            .flatMap((f) => f.values)

        return mergeUniqueValues([...productTags, ...customTagValues])
    }, [products, customFilters])

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        const result = products.filter((product) => {
            const productCategoryKey = normalizeText(formatCategoryLabel(product.category || ''))
            const productRawCategoryKey = normalizeText(product.category || '')
            const productColorKeys = new Set((product.colors || []).map((color) => normalizeText(color)))
            const productTagKeys = new Set((product.tags || []).map((tag) => normalizeText(tag)))

            const matchesSearch =
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase())
            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.some((category) => {
                    const key = normalizeText(category)
                    return key === productCategoryKey || key === productRawCategoryKey
                })
            const matchesColor =
                selectedColors.length === 0 ||
                selectedColors.some((color) => productColorKeys.has(normalizeText(color)))
            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.some((tag) => productTagKeys.has(normalizeText(tag)))

            return matchesSearch && matchesCategory && matchesColor && matchesTags
        })

        // Sort
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.priceFrom - b.priceFrom)
                break
            case 'price-high':
                result.sort((a, b) => b.priceFrom - a.priceFrom)
                break
            case 'newest':
                result.reverse() // Assuming initial order is relatively new or fetch order
                break
            case 'featured':
            default:
                // featured logic could be sorting by featured flag
                result.sort((a, b) => (Number(b.featured) - Number(a.featured)))
                break
        }

        return result
    }, [products, search, selectedCategories, selectedColors, selectedTags, sortBy])

    useEffect(() => {
        if (!isFilterOpen) return

        const prevBodyOverflow = document.body.style.overflow
        const prevHtmlOverflow = document.documentElement.style.overflow
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = prevBodyOverflow
            document.documentElement.style.overflow = prevHtmlOverflow
        }
    }, [isFilterOpen])

    const activeFilterCount =
        (search ? 1 : 0) +
        selectedCategories.length +
        selectedColors.length +
        selectedTags.length

    const clearFilters = () => {
        setSearch('')
        setSelectedCategories([])
        setSelectedColors([])
        setSelectedTags([])
    }

    const FiltersContent = (
        <div className="space-y-6">
            {/* Search */}
            <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5b6472]">Ara</label>
                <input
                    type="text"
                    placeholder="Ürün adı..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-[#cfd2d7] bg-[#f8f7f5] px-4 py-2.5 outline-none transition focus:border-[#111319] focus:bg-white"
                />
            </div>

            {/* Category Filter */}
            {allCategories.length > 0 && (
                <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5b6472]">Koleksiyon</label>
                    <div className="space-y-2">
                        {allCategories.map((category) => (
                            <label key={category} className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isValueSelected(selectedCategories, category)}
                                    onChange={() => toggleSelectedValue(category, setSelectedCategories)}
                                    className="h-4 w-4 text-[#111319]"
                                />
                                <span className="ml-3 text-sm">{category}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Color Filter */}
            {allColors.length > 0 && (
                <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5b6472]">Renk</label>
                    <div className="space-y-2">
                        {allColors.map((color) => (
                            <label key={color} className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isValueSelected(selectedColors, color)}
                                    onChange={() => toggleSelectedValue(color, setSelectedColors)}
                                    className="h-4 w-4 text-[#111319]"
                                />
                                <span className="ml-3 text-sm">{color}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Tags Filter */}
            {allTags.length > 0 && (
                <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.12em] text-[#5b6472]">Etiket</label>
                    <div className="space-y-2">
                        {allTags.map((tag) => (
                            <label key={tag} className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isValueSelected(selectedTags, tag)}
                                    onChange={() => toggleSelectedValue(tag, setSelectedTags)}
                                    className="h-4 w-4 text-[#111319]"
                                />
                                <span className="ml-3 text-sm">{tag}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Clear Filters */}
            <button
                onClick={clearFilters}
                className="w-full rounded-full border border-[#d4d7dc] px-4 py-2 text-center text-sm font-medium text-[#3e4756] transition-colors hover:border-[#111319] hover:text-[#1f2735]"
            >
                Filtreleri Temizle
            </button>
        </div>
    )

    return (
        <>
            <main className="min-h-screen bg-[#f2f1ef] pb-20">
                <PageHero
                    title="Koleksiyonlar"
                    subtitle="Stiliniz ve ihtiyacınız için hazırlanan hizmetleri filtreleyerek hızlıca keşfedin."
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        {/* Sidebar - Filters */}
                        <div className="lg:col-span-1 hidden lg:block">
                            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-3xl border border-[#d8d8d6] bg-white p-6 shadow-[0_12px_26px_rgba(0,0,0,0.06)]">
                                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#212a38]">Filtrele</p>
                                {FiltersContent}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Mobile Toolbar (Filter + Sort) */}
                            <div className="mb-6 flex items-center gap-3 lg:hidden">
                                <button
                                    type="button"
                                    onClick={() => setIsFilterOpen(true)}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#111319] bg-[#111319] px-4 py-2 text-sm font-medium text-white"
                                >
                                    Filtrele
                                    {activeFilterCount > 0 && (
                                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-2 text-xs font-semibold text-[#111319]">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="flex-1 rounded-full border border-[#cfd2d7] bg-white px-4 py-2 text-sm outline-none focus:border-[#111319]"
                                >
                                    <option value="featured">Öne Çıkanlar</option>
                                    <option value="price-low">En Ucuz</option>
                                    <option value="price-high">En Pahalı</option>
                                    <option value="newest">En Yeni</option>
                                </select>
                            </div>

                            {/* Desktop Sort */}
                            <div className="mb-8 hidden rounded-2xl border border-[#d8d8d6] bg-white px-4 py-3 lg:flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#596270]">Sırala:</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        className="rounded-full border border-[#cfd2d7] bg-white px-4 py-2 outline-none focus:border-[#111319]"
                                    >
                                        <option value="featured">Öne Çıkanlar</option>
                                        <option value="price-low">En Ucuz</option>
                                        <option value="price-high">En Pahalı</option>
                                        <option value="newest">En Yeni</option>
                                    </select>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {products.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-gray-600 text-lg">Henüz model eklenmemiş.</p>
                                </div>
                            ) : filteredProducts.length === 0 && (
                                search ||
                                selectedCategories.length > 0 ||
                                selectedColors.length > 0 ||
                                selectedTags.length > 0
                            ) ? (
                                <div className="text-center py-20">
                                    <p className="text-gray-600 text-lg">Arama kriterlerinize uygun model bulunamadı.</p>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 rounded-full border border-[#111319] bg-[#111319] px-6 py-2 text-white transition-colors hover:bg-transparent hover:text-[#111319]"
                                    >
                                        Filtreleri Temizle
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 md:gap-8">
                                    {filteredProducts.map((product, index) => {
                                        const previewImage = getFirstValidImage(product.images)

                                        return (
                                        <motion.div
                                            key={product.id}
                                            initial={false}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6, delay: index * 0.05 }}
                                        >
                                            <Link href={`/urun/${product.slug}`} className="group block">
                                                <article className="cursor-pointer overflow-hidden rounded-3xl border border-[#d8d8d6] bg-white p-3 shadow-[0_10px_28px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_42px_rgba(0,0,0,0.12)]">
                                                    <div className="relative mb-4 flex h-80 items-center justify-center overflow-hidden rounded-2xl border border-[#d8d8d6] bg-[#f5f5f3] p-2">
                                                        {previewImage ? (
                                                            <Image
                                                                src={previewImage}
                                                                alt={product.name}
                                                                fill
                                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                                quality={70}
                                                                className="rounded-md object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <span className="text-sm">Gorsel Yok</span>
                                                            </div>
                                                        )}
                                                        {/* Tags / Etiketler */}
                                                        <div className="absolute top-4 right-4 flex flex-col gap-1">
                                                            {product.tags && product.tags.map((tag, i) => (
                                                                <span key={i} className="rounded-full bg-[#111319]/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <h3 className="mb-2 text-xl font-serif font-semibold uppercase tracking-[0.03em] text-[#12151b] transition-colors group-hover:text-[#323c4b]">
                                                        {product.name}
                                                    </h3>
                                                    <p className="mb-4 text-sm text-[#656b74]">
                                                        {(product.description || '').substring(0, 75)}...
                                                    </p>

                                                    {/* Colors */}
                                                    <div className="flex gap-2 mb-4">
                                                        {product.colors.map((color) => (
                                                            <div key={color} className="flex items-center gap-1">
                                                                <div
                                                                    className="w-4 h-4 rounded-full border border-gray-300"
                                                                    style={{
                                                                        backgroundColor:
                                                                            color === 'Beyaz' ? '#FFFFFF' :
                                                                                color === 'Krem' ? '#FFF8E7' :
                                                                                    color === 'Pudra' ? '#F8DDD8' :
                                                                                        color === 'Gümüş' ? '#D3D3D3' :
                                                                                            color === 'Peach' ? '#FDBCB4' :
                                                                                                color === 'Altın' ? '#FFD700' : '#E0E0E0'
                                                                    }}
                                                                    title={color}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-end justify-between">
                                                        <div>
                                                            <p className="text-gray-500 text-sm">Başlangıç fiyatı</p>
                                                            <p className="text-2xl font-serif font-semibold text-[#12151b]">₺{product.priceFrom.toLocaleString('tr-TR')}</p>
                                                        </div>
                                                        <motion.span
                                                            whileHover={{ scale: 1.08 }}
                                                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1d222c] text-[#1d222c] transition group-hover:bg-[#1d222c] group-hover:text-white"
                                                        >
                                                            →
                                                        </motion.span>
                                                    </div>
                                                </article>
                                            </Link>
                                        </motion.div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <>
                                <motion.div
                                    className="fixed left-0 top-0 w-screen h-screen z-[70] bg-black/50 lg:hidden"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsFilterOpen(false)}
                                />

                                <motion.div
                                    className="fixed bottom-0 left-0 right-0 z-[80] rounded-t-3xl border border-[#d9dad8] bg-white shadow-2xl lg:hidden"
                                    initial={{ y: 32, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 32, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="px-5 pt-5 pb-6 max-h-[80vh] overflow-y-auto">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-semibold">Filtreler</h2>
                                            <button
                                                type="button"
                                                onClick={() => setIsFilterOpen(false)}
                                                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-3 py-2"
                                                aria-label="Filtreleri kapat"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <path
                                                        d="M6 6l12 12M18 6L6 18"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        {FiltersContent}

                                        <div className="mt-6 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    clearFilters()
                                                }}
                                                className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium"
                                            >
                                                Temizle
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsFilterOpen(false)}
                                                className="flex-1 rounded-full bg-[#111319] px-4 py-3 text-sm font-medium text-white"
                                            >
                                                Uygula
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            <StickyButtons contactNumbers={contactNumbers} />
        </>
    )
}
