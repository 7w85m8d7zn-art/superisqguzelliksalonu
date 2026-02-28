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

export function FeaturedGrid({ products, title = 'Öne Çıkan Modeller', subtitle = 'Salonumuzu öne çıkan saç hizmetlerinden seçmeler' }: FeaturedGridProps) {
  // Use passed products directly
  const displayProducts = products

  const getFirstValidImage = (images: string[] | undefined) => {
    if (!Array.isArray(images)) return null
    const first = images.find((image) => typeof image === 'string' && image.trim().length > 0)
    return first || null
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {title}
          </h2>
          <p className="text-gray-600 text-lg">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.length > 0 ? (
            displayProducts.slice(0, 6).map((product, index) => {
              const previewImage = getFirstValidImage(product.images)

              return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/urun/${product.slug}`}>
                  <div className="group cursor-pointer">
                    {/* Image Container */}
                    <div className="relative h-96 overflow-hidden rounded-lg mb-4 bg-slate-100 border border-slate-200 p-2 flex items-center justify-center">
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
                      {/* Tag Overlay */}
                      <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-xs font-semibold">
                        {product.tags && product.tags.length ? product.tags[0] : 'Hizmet'}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-serif font-bold mb-2 text-gray-900 group-hover:text-rose transition-colors">
                      {product.name || product.title || 'Model'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {(product.description || '').substring(0, 60)}...
                    </p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Başlangıç fiyatı</p>
                        <p className="text-2xl font-serif font-bold">
                          ₺{(product.priceFrom ?? product.price_from ?? 0).toLocaleString('tr-TR')}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center"
                      >
                        →
                      </motion.button>
                    </div>
                  </div>
                </Link>
              </motion.div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 text-lg">Henüz öne çıkan hizmet seçilmedi.</p>
              <p className="text-gray-400 text-sm mt-2">Admin panelinden hizmet seçerek bu bölümü doldurabilirsiniz.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/koleksiyonlar">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full bg-transparent border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-colors"
            >
              Tüm Koleksiyonu Gör
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  )
}
