'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { HomepageData } from '@/src/types'

export function HeroSection({ hero }: { hero?: HomepageData }) {
  const heroData = hero || {
    hero_title: 'Profesyonel Kadın Kuaför & Stil Hizmetleri',
    hero_subtitle: 'Kesim, renklendirme ve özel gün saç tasarımlarında uzman ekibimizle tanışın',
    hero_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=2000',
    hero_cta_text: 'Hizmetleri Gör',
    hero_cta_link: '/koleksiyonlar',
    hero_brightness: 0.5,
  }

  const brightness = heroData.hero_brightness ?? 0.5
  const heroImage = heroData.hero_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=2000'

  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden pb-16 pt-32 md:min-h-screen md:pb-20">
      <Image
        src={heroImage}
        alt={heroData.hero_title || 'Su Perisi Güzellik Salonu'}
        fill
        priority
        sizes="100vw"
        quality={78}
        className="absolute inset-0 object-cover"
        style={{ filter: `brightness(${brightness})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/65" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.12),transparent_36%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_40%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
            Su Perisi Güzellik Salonu
          </p>

          <h1 className="text-4xl font-serif font-semibold uppercase leading-[1.02] tracking-[0.04em] text-white sm:text-5xl md:text-6xl xl:text-[4.35rem]">
            {heroData.hero_title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {heroData.hero_subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={heroData.hero_cta_link || '/koleksiyonlar'}
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#101217] transition hover:bg-[#ebebeb]"
            >
              {heroData.hero_cta_text}
            </Link>

            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center rounded-full border border-white/70 bg-transparent px-7 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-white hover:text-[#101217]"
            >
              Randevu Oluştur
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
