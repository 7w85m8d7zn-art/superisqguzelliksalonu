'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/src/components/Header'
import { Footer } from '@/src/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream flex items-center justify-center pt-20 pb-20">
        <div className="text-center px-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-7xl font-serif font-bold mb-4">404</h1>
            <p className="text-2xl font-serif font-bold mb-4">Sayfa Bulunamadı</p>
            <p className="text-gray-600 text-lg mb-8">
              Aradığınız sayfa malesef mevcut değil. Koleksiyonumuza dönüp başka modelleri keşfedebilirsiniz.
            </p>
            <Link href="/koleksiyonlar">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
              >
                Koleksiyona Dön
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
