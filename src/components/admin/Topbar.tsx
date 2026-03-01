"use client"

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SectionMeta {
  title: string
  subtitle: string
}

interface TopbarProps {
  onMenuClick?: () => void
}

function resolveSectionMeta(pathname: string): SectionMeta {
  if (pathname === '/admin') {
    return {
      title: 'Dashboard',
      subtitle: 'Genel performans, randevu ve ziyaret özeti',
    }
  }

  if (pathname.startsWith('/admin/products')) {
    return {
      title: 'Model Yönetimi',
      subtitle: 'Hizmet kartları, fiyatlar ve içerikler',
    }
  }

  if (pathname.startsWith('/admin/appointments')) {
    return {
      title: 'Randevular',
      subtitle: 'Gelen talepleri hızlıca yönetin',
    }
  }

  if (pathname.startsWith('/admin/filters')) {
    return {
      title: 'Filtre Yönetimi',
      subtitle: 'Koleksiyon, renk ve etiket seçenekleri',
    }
  }

  if (pathname.startsWith('/admin/pages')) {
    return {
      title: 'Sayfa Editörü',
      subtitle: 'Site içeriklerini tek ekrandan düzenleyin',
    }
  }

  if (pathname.startsWith('/admin/homepage')) {
    return {
      title: 'Ana Sayfa',
      subtitle: 'Ana sayfa metin ve bölüm ayarlarını düzenleyin',
    }
  }

  return {
    title: 'Yönetim Paneli',
    subtitle: 'Panel ayarları ve içerik yönetimi',
  }
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname()

  const sectionMeta = useMemo(() => resolveSectionMeta(pathname || '/admin'), [pathname])
  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    []
  )

  return (
    <header
      className="sticky top-0 z-40 border-b border-[#d8d0c3] bg-[#fffdf8]"
      style={{ backgroundColor: '#fffdf8', color: '#111319' }}
    >
      <div className="px-3 py-3 sm:px-4 md:px-6">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8d0c3] bg-[#ffffff] text-[#111319] md:hidden"
              aria-label="Menüyü aç"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6c7483]">Admin</p>
              <h1 className="mt-1 truncate text-lg font-semibold uppercase tracking-[0.06em] text-[#111319] sm:text-xl">
                {sectionMeta.title}
              </h1>
              <p className="mt-0.5 max-w-[13rem] text-xs font-medium text-[#5f6571] sm:max-w-none sm:text-sm">
                {sectionMeta.subtitle}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
            <div className="hidden rounded-lg border border-[#d8d0c3] bg-[#ffffff] px-2.5 py-1.5 text-[11px] font-semibold text-[#4b5565] md:block">
              {todayLabel}
            </div>

            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-[#111319] bg-transparent px-2.5 py-1.5 text-xs font-semibold text-[#111319] transition hover:bg-[#111319] hover:text-white sm:px-3 sm:text-sm"
              style={{ textTransform: 'none', letterSpacing: 'normal' }}
            >
              <span className="sm:hidden">Site</span>
              <span className="hidden sm:inline">Siteyi gör</span>
            </Link>

            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-full border border-[#be123c] bg-[#be123c] px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#9f1239] sm:px-3 sm:text-sm"
                style={{ backgroundColor: '#be123c', borderColor: '#9f1239', color: '#ffffff', opacity: 1 }}
              >
                <span>Çıkış yap</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
