'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/src/types'

interface FeaturedGridProps {
  products: Product[]
  title?: string
  subtitle?: string
}

export function FeaturedGrid({
  products,
  title = 'Öne Çıkan Hizmetler',
  subtitle = 'Kentpark çizgisini modern bir yorumla birleştiren popüler işlemler',
}: FeaturedGridProps) {
  const displayProducts = products

  const getFirstValidImage = (images: string[] | undefined) => {
    if (!Array.isArray(images)) return null
    const first = images.find((image) => typeof image === 'string' && image.trim().length > 0)
    return first || null
  }

  return (
    <section className="bg-[#f2f1ef] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 rounded-3xl border border-white bg-white p-7 shadow-[0_18px_60px_rgba(0,0,0,0.08)] md:mb-14 md:p-10"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#6b6f78]">Hizmetlerimiz</p>
          <h2 className="text-3xl font-serif font-semibold uppercase tracking-[0.04em] text-[#0f1115] md:text-5xl">{title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#656a73] md:text-base">{subtitle}</p>
        </motion.div>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {displayProducts.slice(0, 6).map((product, index) => {
              const previewImage = getFirstValidImage(product.images)

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                >
                  <Link href={`/urun/${product.slug}`} className="group block">
                    <article className="overflow-hidden rounded-3xl border border-[#d8d8d6] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_44px_rgba(0,0,0,0.12)]">
                      <div className="relative h-80 border-b border-[#ecebe9] bg-[#f6f6f4] p-3">
                        {previewImage ? (
                          <Image
                            src={previewImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            quality={72}
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">Görsel Yok</div>
                        )}

                        <span className="absolute left-4 top-4 rounded-full bg-[#111319]/88 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white">
                          {product.tags && product.tags.length ? product.tags[0] : 'Hizmet'}
                        </span>
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-serif font-semibold uppercase tracking-[0.03em] text-[#12151b] transition-colors group-hover:text-[#303641]">
                          {product.name || product.title || 'Hizmet'}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#6a6f77]">
                          {(product.description || '').substring(0, 88)}...
                        </p>

                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.14em] text-[#8b9097]">Başlangıç</p>
                            <p className="text-2xl font-serif font-semibold text-[#111319]">
                              ₺{(product.priceFrom ?? product.price_from ?? 0).toLocaleString('tr-TR')}
                            </p>
                          </div>
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1d222c] text-sm font-semibold text-[#1d222c] transition group-hover:bg-[#1d222c] group-hover:text-white">
                            →
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#c9cbc9] bg-white px-5 py-12 text-center">
            <p className="text-gray-600">Henüz öne çıkan hizmet seçilmedi.</p>
            <p className="mt-2 text-sm text-gray-500">Admin panelinden hizmet seçerek bu bölümü doldurabilirsiniz.</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/koleksiyonlar"
            className="inline-flex items-center justify-center rounded-full border border-[#1d222c] px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#1d222c] transition hover:bg-[#1d222c] hover:text-white"
          >
            Tüm Koleksiyonu Gör
          </Link>
        </div>
      </div>
    </section>
  )
}
