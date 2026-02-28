'use client'

import { motion } from 'framer-motion'
import { HomepageData } from '@/src/types'

interface WhyUsSectionProps {
  data: HomepageData
}

export function WhyUsSection({ data }: WhyUsSectionProps) {
  const features = [
    {
      icon: '💇‍♀️',
      title: data.why_us_item1_title || 'Uzman Ekip',
      description: data.why_us_item1_desc || 'Deneyimli kuaför ekibimizle kesim, fön, renklendirme ve bakımda profesyonel sonuçlar',
    },
    {
      icon: '🎨',
      title: data.why_us_item2_title || 'Renk & Balayage',
      description: data.why_us_item2_desc || 'Doğal geçişler, modern tonlar ve saç tipinize uygun tekniklerle kişiye özel renk uygulamaları',
    },
    {
      icon: '🧴',
      title: data.why_us_item3_title || 'Saç Bakım Protokolleri',
      description: data.why_us_item3_desc || 'Keratin, saç botoksu ve onarıcı bakımlarla sağlıklı, parlak ve güçlü saç görünümü',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {data.why_us_title || 'Neden Salonumuz?'}
          </h2>
          <p className="text-gray-600 text-lg">
            {data.why_us_subtitle || 'Binlerce müşteri bize güvendi'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-serif font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
