'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { StickyButtons } from '@/src/components/StickyButtons'
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

  const whatsappNumber = (contactNumbers.whatsapp_number || '').replace(/\D/g, '') || '905306249382'
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
      <main className="min-h-screen bg-cream pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image */}
              <div className="relative h-96 md:h-[520px] overflow-hidden rounded-2xl mb-4 bg-slate-100 border border-slate-200 p-2">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={75}
                    className="rounded-xl object-contain p-2"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-sm">Gorsel Yok</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-xl overflow-hidden border transition-all ${
                      selectedImage === index
                        ? 'ring-2 ring-slate-900 border-slate-900'
                        : 'border-slate-300 opacity-70 hover:opacity-100 hover:border-slate-500'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      sizes="96px"
                      quality={60}
                      className="bg-slate-100 object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col"
            >
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight">
                  {product.name || product.title || 'Model'}
                </h1>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(product.tags || []).map((tag) => (
                  <span key={tag} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>


              {/* Service Details */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-white/70 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Hizmet Detayları</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {serviceDetails.map((detail, index) => (
                    <li key={`${product.id}-detail-${index}`} className="flex items-start gap-2">
                      <span>✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <motion.a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.921 1.226-1.129 1.48-.215.255-.42.27-.715.09-.295-.189-1.243-.459-2.37-1.475-.874-.778-1.464-1.742-1.635-2.038-.16-.296-.017-.458.12-.606.123-.122.294-.314.442-.471.149-.157.198-.256.297-.416.1-.162.049-.305-.024-.429-.073-.123-.67-1.616-.92-2.206-.247-.609-.5-.52-.67-.529-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.634.803 5.11 2.323 7.177l-2.422 8.842 9.072-2.382a9.861 9.861 0 004.773 1.216h.005c5.396 0 9.747-4.363 9.747-9.798 0-2.64-.806-5.117-2.327-7.184-.529-.822-1.223-1.55-2.062-2.152-.838-.602-1.817-.972-2.8-1.069-.973-.093-1.951.023-2.868.326-.917.303-1.755.81-2.363 1.468-.608.658-1.014 1.438-1.178 2.27-.164.832-.057 1.719.311 2.472z" />
                    </svg>
                    WhatsApp&apos;tan Sor
                  </motion.a>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Related Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-serif font-bold mb-8">Diğer Modeller</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allProducts
                .filter(p => p.id !== product.id && p.category === product.category)
                .slice(0, 4)
                .map((relatedProduct) => {
                  const relatedImage = getFirstValidImage(relatedProduct.images)

                  return (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <Link href={`/urun/${relatedProduct.slug}`} className="group cursor-pointer">
                      <div className="relative h-64 overflow-hidden rounded-lg mb-3 bg-slate-100 border border-slate-200 p-2">
                        {relatedImage ? (
                          <Image
                            src={relatedImage}
                            alt={relatedProduct.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            quality={65}
                            className="rounded-md object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-sm">Gorsel Yok</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-serif font-bold text-sm group-hover:text-rose transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-rose text-sm">₺{relatedProduct.priceFrom.toLocaleString('tr-TR')}</p>
                    </Link>
                  </motion.div>
                  )
                })}
            </div>
          </motion.div>
        </div>
      </main>
      <StickyButtons contactNumbers={contactNumbers} />
    </>
  )
}
