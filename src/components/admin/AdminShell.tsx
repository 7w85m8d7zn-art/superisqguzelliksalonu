'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface AdminShellProps {
  children: ReactNode
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileMenuOpen])

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden border-r border-slate-200 bg-white md:block">
        <Sidebar />
      </div>

      <div
        className={`fixed inset-0 z-50 md:hidden ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <button
          type="button"
          aria-label="Menüyü kapat"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-slate-900/45 transition-opacity ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 w-[82vw] max-w-xs transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar
            className="h-full w-full min-h-full rounded-r-2xl border-r border-slate-200 shadow-2xl"
            onNavigate={() => setIsMobileMenuOpen(false)}
          />
        </div>
      </div>

      <div className="relative flex min-h-screen flex-1 flex-col bg-[radial-gradient(circle_at_20%_0%,rgba(15,23,42,0.06),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto px-2.5 py-3 md:px-6 md:py-5">
          <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.35)] sm:p-3 md:rounded-2xl md:p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
