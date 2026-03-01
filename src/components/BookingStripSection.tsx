'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { HomepageData } from '@/src/types'

interface BookingStripSectionProps {
  data: HomepageData
}

export function BookingStripSection({ data }: BookingStripSectionProps) {
  const backgroundImage = data.cta_band_image?.trim() || ''

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#1f2126] py-16 text-white sm:py-20">
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={data.cta_band_title || 'Randevu Bölümü'}
          fill
          sizes="100vw"
          quality={70}
          className="object-cover"
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#111317]/90 via-[#111317]/75 to-[#111317]/92" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(255,255,255,0.08),transparent_35%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-end lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.26em] text-white/65">Kentpark ruhunda modern randevu deneyimi</p>
          <h2 className="text-4xl font-serif font-semibold uppercase tracking-[0.04em] md:text-5xl">
            {data.cta_band_title || 'Randevunuzu Kolayca Oluşturun'}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
            {data.cta_band_description || 'WhatsApp veya telefon üzerinden hızlı randevu talebi bırakın, ekibimiz en kısa sürede size dönüş yapsın.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="w-full sm:w-auto"
        >
          <Link
            href={data.cta_band_button_link || '/iletisim'}
            className="inline-flex w-full items-center justify-center rounded-full border border-white/70 bg-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#101215] transition hover:bg-transparent hover:text-white sm:w-auto"
          >
            {data.cta_band_button_text || 'Randevu Al'}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
