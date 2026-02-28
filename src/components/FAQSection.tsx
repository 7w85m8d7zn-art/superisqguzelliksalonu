'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  id: number
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: 'Randevu iptali veya değişikliği nasıl yapılır?',
    answer: 'Randevunuzu WhatsApp veya telefon aracılığıyla en az 24 saat öncesinden değiştirebilir veya iptal edebilirsiniz. Son dakika değişiklikleri için lütfen bizimle iletişime geçin.'
  },
  {
    id: 2,
    question: 'Özel gün (nişan/düğün) için saç tasarımı ne kadar önceden ayarlanmalı?',
    answer: 'Özel gün hizmetleri için en az 2-3 hafta öncesinden randevu almanızı öneririz. Yoğun dönemlerde daha erken rezervasyon faydalı olur.'
  },
  {
    id: 3,
    question: 'Konsültasyon ve deneme uygulaması var mı?',
    answer: 'Evet, özel gün saç tasarımları için deneme seansı sunuyoruz. Deneme seansı randevusu ile stilistimizle birlikte en uygun görünümü planlayabilirsiniz.'
  },
  {
    id: 4,
    question: 'Saç bakım ve renklendirme sonrası bakım önerileri nelerdir?',
    answer: 'Profesyonel ürün kullanımı, düzenli bakım ve ısı koruyucu uygulamalarını öneriyoruz. Uzun süreli parlaklık için kuaförümüzün önerdiği bakım planını takip edin.'
  },
  {
    id: 5,
    question: 'Alterasyon / küçük düzeltmeler yapılır mı?',
    answer: 'Evet, kesim sonrası küçük düzeltmeler hizmetimize dahildir. Büyük değişiklikler için ek ücret uygulanabilir; detayları randevu sırasında görüşelim.'
  },
  {
    id: 6,
    question: 'Ödeme seçenekleri nelerdir?',
    answer: 'Kredi kartı, banka transferi ve nakit ödeme seçenekleri mevcuttur. Bazı özel hizmetler için ön ödeme talep edilebilir.'
  }
]

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-serif font-bold mb-6">Sık Sorulan Sorular</h2>
          <p className="text-gray-600 text-lg">
            Marlenqa Couture hakkında merak edilen soruların cevaplarını bulabilirsiniz.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-lg overflow-hidden border border-gray-200"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <motion.svg
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5 text-rose flex-shrink-0 ml-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="px-6 py-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
