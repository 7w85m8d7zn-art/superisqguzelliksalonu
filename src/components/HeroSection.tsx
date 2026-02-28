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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={heroImage}
        alt={heroData.hero_title || 'Su Perisi Güzellik Salonu'}
        fill
        priority
        sizes="100vw"
        quality={75}
        className="absolute inset-0 object-cover"
        style={{ filter: `brightness(${brightness})` }}
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-wide"
        >
          {heroData.hero_title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl mb-8 text-gray-200"
        >
          {heroData.hero_subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href={heroData.hero_cta_link || '/koleksiyonlar'}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-full text-center font-medium transition-all duration-300 cursor-pointer bg-white text-black hover:bg-rose hover:text-white w-full sm:w-auto font-semibold"
            >
              {heroData.hero_cta_text}
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}
