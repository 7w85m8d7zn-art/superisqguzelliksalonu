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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="px-3 py-3 sm:px-4 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 md:hidden"
              aria-label="Menüyü aç"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Admin</p>
              <h1 className="admin-page-title mt-1 truncate">{sectionMeta.title}</h1>
              <p className="admin-page-subtitle mt-0.5 max-w-[13rem] sm:max-w-none">{sectionMeta.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <div className="hidden rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 md:block">
              {todayLabel}
            </div>

            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="admin-btn-outline inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-3 sm:text-sm"
            >
              <span className="sm:hidden">Site</span>
              <span className="hidden sm:inline">Siteyi Gör</span>
            </Link>

            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="admin-btn-danger inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-colors sm:px-3 sm:text-sm"
                style={{ backgroundColor: '#ff0000', color: '#ffffff', borderColor: '#ff0000' }}
              >
                <span className="sm:hidden">Çıkış</span>
                <span className="hidden sm:inline">Çıkış Yap</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
