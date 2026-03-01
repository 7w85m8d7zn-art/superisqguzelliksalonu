'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { StickyButtons } from '@/src/components/StickyButtons'
import { PageHero } from '@/src/components/PageHero'
import { ContactNumbers, Product } from '@/src/types'

interface ProductDetailClientProps {
  product: Product
  allProducts: Product[]
  contactNumbers: ContactNumbers
}

export function ProductDetailClient({ product, allProducts, contactNumbers }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  const whatsappMessage = encodeURIComponent(
    `Merhaba, ${product.name} hakkında bilgi almak istiyorum. Hizmet süresi, fiyat ve randevu için yardımcı olur musunuz?`
  )

  const whatsappNumber = (contactNumbers.whatsapp_number || '').replace(/\D/g, '') || '905435167011'
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  const images = (product.images || []).filter((image) => typeof image === 'string' && image.trim().length > 0)
  const mainImage = images[selectedImage] || null

  const getFirstValidImage = (productImages: string[] | undefined) => {
    if (!Array.isArray(productImages)) return null
    const first = productImages.find((image) => typeof image === 'string' && image.trim().length > 0)
    return first || null
  }

  const serviceDetails =
    Array.isArray(product.service_details) && product.service_details.length > 0
      ? product.service_details
      : [
          `${product.category === 'kiralama' ? 'Kiralama hizmetine konu olan' : 'Özel olarak tasarlanan'} premium kalite ve profesyonel uygulama`,
          'Ölçü alımı ve danışmanlık hizmetleri sunulur',
          'Ücretsiz alterasyon (değişiklik) yapılır',
          'Deneme randevusu için showroom ziyareti önerilir',
        ]

  return (
    <>
      <main className="min-h-screen bg-[#f2f1ef] pb-20">
        <PageHero title={product.name || product.title || 'Model'} subtitle={(product.description || '').slice(0, 130)} />

        <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#d8d8d6] bg-white p-4 shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
              <div className="relative mb-4 h-96 overflow-hidden rounded-2xl border border-[#e3e3e0] bg-[#f4f4f2] p-2 md:h-[520px]">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={76}
                    className="rounded-xl object-contain p-2"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500">Görsel Yok</div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 overflow-hidden rounded-xl border transition-all ${
                      selectedImage === index
                        ? 'border-[#111319] ring-2 ring-[#111319]'
                        : 'border-[#d5d7db] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      sizes="96px"
                      quality={62}
                      className="bg-[#f4f4f2] object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-[#d8d8d6] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.08)] md:p-8">
                <div className="mb-5 flex flex-wrap gap-2">
                  {(product.tags || []).map((tag) => (
                    <span key={tag} className="rounded-full border border-[#d0d3d8] bg-[#f5f6f8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#232b39]">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-3xl font-serif font-semibold text-[#12151b]">₺{product.priceFrom.toLocaleString('tr-TR')}</p>

                <div className="mt-6 rounded-2xl border border-[#e2e2df] bg-[#f7f6f4] p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#2f3949]">Hizmet Detayları</h3>
                  <ul className="space-y-2 text-sm text-[#5f6670]">
                    {serviceDetails.map((detail, index) => (
                      <li key={`${product.id}-detail-${index}`} className="flex items-start gap-2">
                        <span>✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-[#111319] bg-[#111319] px-6 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-white transition hover:bg-transparent hover:text-[#111319]"
                >
                  WhatsApp&apos;tan Bilgi Al
                </motion.a>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="mb-6 text-3xl font-serif font-semibold uppercase tracking-[0.04em] text-[#12151b]">Diğer Modeller</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {allProducts
                .filter((p) => p.id !== product.id && p.category === product.category)
                .slice(0, 4)
                .map((relatedProduct) => {
                  const relatedImage = getFirstValidImage(relatedProduct.images)

                  return (
                    <motion.div
                      key={relatedProduct.id}
                      initial={false}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <Link href={`/urun/${relatedProduct.slug}`} className="group block">
                        <article className="overflow-hidden rounded-2xl border border-[#d8d8d6] bg-white p-3 shadow-[0_10px_26px_rgba(0,0,0,0.08)] transition group-hover:-translate-y-1">
                          <div className="relative mb-3 h-64 overflow-hidden rounded-xl border border-[#e3e3e0] bg-[#f4f4f2] p-2">
                            {relatedImage ? (
                              <Image
                                src={relatedImage}
                                alt={relatedProduct.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                quality={65}
                                className="rounded-md object-contain p-2"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-500">Görsel Yok</div>
                            )}
                          </div>
                          <h3 className="text-sm font-serif font-semibold uppercase tracking-[0.03em] text-[#161a22] transition group-hover:text-[#323c4b]">
                            {relatedProduct.name}
                          </h3>
                          <p className="mt-1 text-sm text-[#3f4857]">₺{relatedProduct.priceFrom.toLocaleString('tr-TR')}</p>
                        </article>
                      </Link>
                    </motion.div>
                  )
                })}
            </div>
          </div>
        </div>
      </main>
      <StickyButtons contactNumbers={contactNumbers} />
    </>
  )
}
