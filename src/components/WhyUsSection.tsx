'use client'

import { motion } from 'framer-motion'
import { HomepageData } from '@/src/types'

interface WhyUsSectionProps {
  data: HomepageData
}

export function WhyUsSection({ data }: WhyUsSectionProps) {
  const features = [
    {
      icon: '01',
      title: data.why_us_item1_title || 'Uzman Ekip',
      description: data.why_us_item1_desc || 'Deneyimli kuaför ekibimizle kesim, fön, renklendirme ve bakımda profesyonel sonuçlar',
    },
    {
      icon: '02',
      title: data.why_us_item2_title || 'Renk & Balayage',
      description: data.why_us_item2_desc || 'Doğal geçişler, modern tonlar ve saç tipinize uygun tekniklerle kişiye özel renk uygulamaları',
    },
    {
      icon: '03',
      title: data.why_us_item3_title || 'Saç Bakım Protokolleri',
      description: data.why_us_item3_desc || 'Keratin, saç botoksu ve onarıcı bakımlarla sağlıklı, parlak ve güçlü saç görünümü',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-[#15181f] py-16 text-white sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0,transparent_44%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_38%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 max-w-3xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/65">Neden Biz?</p>
          <h2 className="text-3xl font-serif font-semibold uppercase tracking-[0.04em] md:text-5xl">
            {data.why_us_title || 'Neden Salonumuz?'}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
            {data.why_us_subtitle || 'Binlerce müşteri bize güvendi'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{feature.icon}</p>
              <h3 className="mt-4 text-2xl font-serif font-semibold uppercase tracking-[0.03em]">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/72">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
