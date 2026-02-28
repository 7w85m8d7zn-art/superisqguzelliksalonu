'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function AboutSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
           <h2 className="text-5xl font-serif font-bold mb-6">Hakkımızda</h2>
           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
             Kadın Kuaför salonumuz, modern kesim ve özel saç uygulamalarıyla kişiye özel hizmet sunar.
           </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/women-salon.svg"
                alt="Salonumuz"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-gray-600 leading-relaxed text-lg">
              2010 yılında kurulan salonumuz, saç kesimi, renklendirme ve özel gün saç tasarımlarında uzman bir ekibe sahiptir.
            </p>
            
            <p className="text-gray-600 leading-relaxed text-lg">
              Deneyimli kuaförlerimiz ve stil danışmanlarımız, her misafir için kişiye özel çözümler sunar. Modern tekniklerle geleneksel özen bir arada.
            </p>

            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-4">
                <span className="text-2C3E50 text-2xl">✓</span>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Kaliteli Ürün & Uygulama</h4>
                  <p className="text-gray-600">Profesyonel ürünler ve özenli uygulamalar</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2C3E50 text-2xl">✓</span>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Özel Tasarım Hizmeti</h4>
                  <p className="text-gray-600">Hayalinizdeki saç modelini birlikte tasarlayabiliriz</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2C3E50 text-2xl">✓</span>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Profesyonel Danışmanlık</h4>
                  <p className="text-gray-600">Deneyimli kuaförlerimiz size rehberlik edecek</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
