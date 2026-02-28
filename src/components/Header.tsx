'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

import { Settings } from '@/src/types'

export function Header({ settings }: { settings?: Settings }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Use passed settings or default to initial state if not provided
  const headerData = settings?.header || {
    header_logo_text: 'Su Perisi Güzellik Salonu',
    header_menu_anasayfa: 'Ana Sayfa',
    header_menu_koleksiyon: 'Koleksiyon',
    header_menu_hakkimizda: 'Hakkımızda',
    header_menu_iletisim: 'İletişim',
  }

  // Mobile menu body scroll lock
  useEffect(() => {
    if (!isMenuOpen) return
    const prevBodyOverflow = document.body.style.overflow
    const prevBodyOverflowX = document.body.style.overflowX
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevHtmlOverflowX = document.documentElement.style.overflowX

    document.body.style.overflow = 'hidden'
    document.body.style.overflowX = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.overflowX = 'hidden'

    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.body.style.overflowX = prevBodyOverflowX
      document.documentElement.style.overflow = prevHtmlOverflow
      document.documentElement.style.overflowX = prevHtmlOverflowX
    }
  }, [isMenuOpen])

  return (
    <>
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-serif font-bold tracking-wide"
              onClick={() => setIsMenuOpen(false)}
            >
              {headerData.header_logo_text}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm hover:text-rose transition-colors">
                {headerData.header_menu_anasayfa}
              </Link>
              <Link href="/koleksiyonlar" className="text-sm hover:text-rose transition-colors">
                {headerData.header_menu_koleksiyon}
              </Link>
              <Link href="/hakkimizda" className="text-sm hover:text-rose transition-colors">
                {headerData.header_menu_hakkimizda}
              </Link>
              <Link href="/iletisim" className="text-sm hover:text-rose transition-colors">
                {headerData.header_menu_iletisim}
              </Link>
            </nav>

            {/* Right actions (mobile + desktop) */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Yönetici Girişi
              </Link>

              {/* Hamburger (mobile) */}
              <motion.button
                type="button"
                aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((v) => !v)}
                whileTap={{ scale: 0.95 }}
                className="md:hidden inline-flex items-center justify-center rounded-md border border-gray-200 bg-white/70 backdrop-blur px-3 py-2"
              >
                {isMenuOpen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 7h16M4 12h16M4 17h16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed left-0 top-0 w-screen h-screen z-[55] bg-black/55 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            <div className="fixed left-0 top-0 w-screen h-screen z-[60] md:hidden flex items-start justify-center pt-28 pointer-events-none">
              <motion.div
                className="w-[92vw] max-w-[380px] bg-white shadow-2xl rounded-2xl overflow-hidden pointer-events-auto -translate-y-8"
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.18 }}
              >
                <div className="flex flex-col max-h-[70vh]">
                  <div className="h-20 px-5 flex items-center justify-between border-b border-gray-100">
                    <span className="text-base font-medium">Menü</span>
                    <button
                      type="button"
                      aria-label="Menüyü kapat"
                      onClick={() => setIsMenuOpen(false)}
                      className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M6 6l12 12M18 6L6 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="px-5 py-5 overflow-y-auto bg-white max-h-[calc(70vh-5rem)]">
                    <nav className="flex flex-col">
                      <Link
                        href="/"
                        className="text-lg font-medium py-2.5 border-b border-gray-100 hover:text-rose transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {headerData.header_menu_anasayfa}
                      </Link>
                      <Link
                        href="/koleksiyonlar"
                        className="text-lg font-medium py-2.5 border-b border-gray-100 hover:text-rose transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {headerData.header_menu_koleksiyon}
                      </Link>
                      <Link
                        href="/hakkimizda"
                        className="text-lg font-medium py-2.5 border-b border-gray-100 hover:text-rose transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {headerData.header_menu_hakkimizda}
                      </Link>
                      <Link
                        href="/iletisim"
                        className="text-lg font-medium py-2.5 border-b border-gray-100 hover:text-rose transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {headerData.header_menu_iletisim}
                      </Link>
                      <Link
                        href="/login"
                        className="text-lg font-medium py-2.5 border-b border-gray-100 hover:text-rose transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Yönetici Girişi
                      </Link>
                    </nav>

                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </>
  )

}
