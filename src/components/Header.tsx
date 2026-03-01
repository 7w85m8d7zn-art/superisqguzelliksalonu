'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

import { Settings } from '@/src/types'

const HEADER_HEIGHT = 84

const resolveHeaderText = (value: unknown, fallback: string) => {
  if (typeof value !== 'string') return fallback
  const cleaned = value.replace(/[\u200B-\u200D\uFEFF]/g, '').trim()
  return cleaned || fallback
}

export function Header({ settings }: { settings?: Settings }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const headerData = {
    header_logo_text: resolveHeaderText(settings?.header?.header_logo_text, 'Su Perisi Güzellik Salonu'),
    header_menu_anasayfa: resolveHeaderText(settings?.header?.header_menu_anasayfa, 'Ana Sayfa'),
    header_menu_koleksiyon: resolveHeaderText(settings?.header?.header_menu_koleksiyon, 'Koleksiyon'),
    header_menu_hakkimizda: resolveHeaderText(settings?.header?.header_menu_hakkimizda, 'Hakkımızda'),
    header_menu_iletisim: resolveHeaderText(settings?.header?.header_menu_iletisim, 'Randevu Oluştur'),
  }

  const links = [
    { href: '/', label: headerData.header_menu_anasayfa },
    { href: '/koleksiyonlar', label: headerData.header_menu_koleksiyon },
    { href: '/hakkimizda', label: headerData.header_menu_hakkimizda },
    { href: '/iletisim', label: headerData.header_menu_iletisim },
  ]

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

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[2147483647] border-b border-[#1f2735] bg-[#0b0f15] text-white shadow-[0_12px_34px_rgba(0,0,0,0.48)]"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#0b0f15',
          color: '#ffffff',
          opacity: 1,
          visibility: 'visible',
          zIndex: 2147483647,
          mixBlendMode: 'normal',
          transform: 'translateZ(0)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[#0b0f15]" />

        <div className="relative z-10 mx-auto flex h-[84px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="group inline-flex items-center gap-3"
            aria-label="Ana sayfaya git"
          >
            <span
              className="text-lg font-serif uppercase leading-none tracking-[0.08em] sm:text-2xl md:text-[1.7rem]"
              style={{ color: '#ffffff' }}
            >
              {headerData.header_logo_text}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-white lg:flex" style={{ color: '#ffffff' }}>
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[0.98rem] font-semibold uppercase tracking-[0.11em] transition-colors ${
                    active ? 'text-white' : 'text-white hover:text-white'
                  }`}
                  style={{ color: '#ffffff', opacity: active ? 1 : 0.95 }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border border-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:border-white hover:bg-white hover:text-[#0e1014] lg:inline-flex"
              style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.55)' }}
            >
              Yönetim
            </Link>

            <button
              type="button"
              aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
            >
              {isMenuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[140] bg-black/65 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              className="fixed inset-x-0 z-[150] mx-4 rounded-3xl border border-white/15 bg-[#111319] p-6 text-white shadow-2xl lg:hidden"
              style={{ top: HEADER_HEIGHT }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="flex flex-col">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                  className="border-b border-white/10 py-3 text-lg font-semibold uppercase tracking-[0.08em] text-white transition hover:text-white"
                  style={{ color: '#ffffff', opacity: 0.9 }}
                >
                  {link.label}
                </Link>
                ))}
                <Link
                  href="/login"
                  className="border-b border-white/10 py-3 text-lg font-semibold uppercase tracking-[0.08em] text-white transition hover:text-white"
                  style={{ color: '#ffffff', opacity: 0.9 }}
                >
                  Yönetim
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
