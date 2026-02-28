'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { HomepageData } from '@/src/types'

interface ShowroomSectionProps {
  data: HomepageData
}

export function ShowroomSection({ data }: ShowroomSectionProps) {
  const showroomImage = data.showroom_image?.trim() || ''

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {showroomImage ? (
              <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={showroomImage}
                  alt={data.showroom_title || 'Salonumuzu Ziyaret Edin'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={70}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
                <span className="text-gray-400">Salon Görseli</span>
              </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-serif font-bold mb-6">
              {data.showroom_title || 'Salonumuzu Ziyaret Edin'}
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {data.showroom_description || 'Profesyonel saç kesimi, renklendirme, fön ve bakım hizmetlerimizi yakından deneyimlemek için salonumuzu ziyaret edin. Uzman ekibimiz saç analizi yaparak size en uygun stil ve bakım önerilerini sunar.'}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
