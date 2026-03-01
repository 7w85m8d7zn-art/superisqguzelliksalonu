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
    <div className="flex min-h-screen bg-[#f4f1eb]" style={{ backgroundColor: '#f4f1eb' }}>
      <div className="relative hidden w-64 border-r border-[#d8d0c3] bg-[#fffdf8] md:block">
        <Sidebar className="sticky top-0 h-screen w-full border-r-0" />
      </div>

      <div
        className={`fixed inset-0 z-[80] md:hidden ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <button
          type="button"
          aria-label="Menüyü kapat"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/70 transition-opacity ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 w-[82vw] max-w-xs transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar
            className="h-full w-full min-h-full rounded-r-2xl border-r border-[#d8d0c3] shadow-2xl"
            onNavigate={() => setIsMobileMenuOpen(false)}
          />
        </div>
      </div>

      <div className="relative flex min-h-screen flex-1 flex-col bg-[#f4f1eb] text-[#111319]" style={{ color: '#111319' }}>
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto px-2.5 py-3 md:px-5 md:py-5">
          <div
            className="rounded-xl border border-[#d8d0c3] bg-[#fffdf8] p-2.5 text-[#111319] shadow-[0_18px_36px_-28px_rgba(0,0,0,0.35)] sm:p-3 md:rounded-2xl md:p-4"
            style={{ backgroundColor: '#fffdf8', color: '#111319' }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
