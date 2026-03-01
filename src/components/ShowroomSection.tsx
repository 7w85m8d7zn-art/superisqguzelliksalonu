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
    <section className="bg-[#efeeea] py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-stretch lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-3xl border border-[#d6d7d5] bg-[#d8dad9]"
        >
          {showroomImage ? (
            <div className="relative h-[340px] w-full lg:h-full lg:min-h-[420px]">
              <Image
                src={showroomImage}
                alt={data.showroom_title || 'Salonumuzu Ziyaret Edin'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={72}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-[340px] w-full items-center justify-center text-sm text-gray-600 lg:h-full lg:min-h-[420px]">
              Salon Görseli
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="flex flex-col justify-between rounded-3xl border border-[#d6d7d5] bg-white p-7 md:p-10"
        >
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#6f7580]">Salon Deneyimi</p>
            <h2 className="text-3xl font-serif font-semibold uppercase tracking-[0.04em] text-[#111319] md:text-5xl">
              {data.showroom_title || 'Salonumuzu Ziyaret Edin'}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#5f6670] md:text-base">
              {data.showroom_description ||
                'Profesyonel saç kesimi, renklendirme, fön ve bakım hizmetlerimizi yakından deneyimlemek için salonumuzu ziyaret edin. Uzman ekibimiz saç analizi yaparak size en uygun stil ve bakım önerilerini sunar.'}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#dfdfdc] bg-[#f5f4f2] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#767b84]">Ortam</p>
              <p className="mt-2 text-lg font-serif uppercase tracking-[0.03em] text-[#111319]">Hijyenik</p>
            </div>
            <div className="rounded-2xl border border-[#dfdfdc] bg-[#f5f4f2] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#767b84]">Yaklaşım</p>
              <p className="mt-2 text-lg font-serif uppercase tracking-[0.03em] text-[#111319]">Kişisel</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
