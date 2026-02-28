"use client"

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardResponse {
  summary?: {
    pendingAppointments?: number
  }
}

interface NavItem {
  href: string
  label: string
  icon: ReactNode
}

interface SidebarProps {
  className?: string
  onNavigate?: () => void
}

const navItems: NavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z" />
      </svg>
    ),
  },
  {
    href: '/admin/products',
    label: 'Modeller',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7l8-4 8 4-8 4-8-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7v10l8 4 8-4V7" />
      </svg>
    ),
  },
  {
    href: '/admin/filters',
    label: 'Filtreler',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5h16l-6 7v6l-4 2v-8L4 5z" />
      </svg>
    ),
  },
  {
    href: '/admin/appointments',
    label: 'Randevular',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="5" width="16" height="15" rx="2" strokeWidth={1.8} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 3v4M16 3v4M4 10h16" />
      </svg>
    ),
  },
  {
    href: '/admin/pages',
    label: 'Sayfa Editörü',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 3h8l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 3v5h5M9 13h6M9 17h6" />
      </svg>
    ),
  },
]

export default function Sidebar({ className = '', onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const [pendingAppointments, setPendingAppointments] = useState(0)

  useEffect(() => {
    let isMounted = true

    const fetchPendingCount = async () => {
      try {
        const response = await fetch('/api/dashboard', { cache: 'no-store' })
        if (!response.ok) return
        const data: DashboardResponse = await response.json()
        if (!isMounted) return
        setPendingAppointments(Number(data?.summary?.pendingAppointments) || 0)
      } catch {
        if (isMounted) setPendingAppointments(0)
      }
    }

    fetchPendingCount()
    const interval = setInterval(fetchPendingCount, 30000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const pendingBadgeText = pendingAppointments > 99 ? '99+' : pendingAppointments.toString()
  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href))

  return (
    <aside
      className={`flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-3 text-slate-700 md:w-64 md:p-4 ${className}`}
    >
      <Link
        href="/admin"
        onClick={onNavigate}
        className="mb-6 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5"
      >
        <div>
          <p className="text-sm font-semibold text-slate-900">Su Perisi</p>
          <p className="text-[11px] font-medium text-slate-500">Yönetim Paneli</p>
        </div>
      </Link>

      <nav className="flex-1">
        <ul className="space-y-1.5">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive(item.href)
                    ? 'bg-slate-100 text-slate-950 ring-1 ring-slate-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{item.icon}</span>
                <span className="admin-nav-label">{item.label}</span>

                {item.href === '/admin/appointments' && pendingAppointments > 0 && (
                  <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[10px] font-bold text-white">
                    {pendingBadgeText}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {pendingAppointments > 0 && (
        <Link
          href="/admin/appointments?status=pending"
          onClick={onNavigate}
          className="mb-3 inline-flex items-center justify-between gap-2 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
        >
          <span>Bekleyen Talepler</span>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[10px] font-bold text-white">
            {pendingBadgeText}
          </span>
        </Link>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center text-[10px] font-semibold text-slate-500 md:text-[11px]">
        v1.0
      </div>
    </aside>
  )
}
