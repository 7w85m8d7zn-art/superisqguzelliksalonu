'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import StatCard from '../../src/components/admin/StatCard'

interface DashboardSummary {
  totalProducts: number
  totalVisitors: number
  totalAppointments: number
  pendingAppointments: number
  approvedAppointments: number
  rejectedAppointments: number
}

interface DashboardResponse {
  summary?: DashboardSummary
}

const defaultSummary: DashboardSummary = {
  totalProducts: 0,
  totalVisitors: 0,
  totalAppointments: 0,
  pendingAppointments: 0,
  approvedAppointments: 0,
  rejectedAppointments: 0,
}

export default function AdminHome() {
  const [summary, setSummary] = useState<DashboardSummary>(defaultSummary)

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard', { cache: 'no-store' })
      const data = (await response.json()) as DashboardResponse
      setSummary(data?.summary || defaultSummary)
    } catch (error) {
      console.error('Dashboard veri çekme hatası:', error)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const statItems = [
    { label: 'Bekleyen Randevular', value: summary.pendingAppointments.toString(), color: 'rose' as const },
    { label: 'Onaylanan Randevular', value: summary.approvedAppointments.toString(), color: 'teal' as const },
    { label: 'Toplam Randevu', value: summary.totalAppointments.toString(), color: 'purple' as const },
    { label: 'Toplam Ziyaretçi', value: summary.totalVisitors.toString(), color: 'blue' as const },
  ]

  return (
    <section className="mx-auto max-w-6xl space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="admin-page-title">Dashboard</h2>
            <p className="admin-page-subtitle mt-1">Güncel randevu ve ziyaret özetini buradan takip edin.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/appointments"
              className="admin-btn-outline inline-flex w-full items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold sm:w-auto"
            >
              Randevular
            </Link>
            <Link
              href="/admin/appointments?status=pending"
              className="admin-btn-danger inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold sm:w-auto"
              style={{ backgroundColor: '#dc2626', borderColor: '#b91c1c', color: '#ffffff' }}
            >
              Bekleyenler
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-rose-700">
                {summary.pendingAppointments > 99 ? '99+' : summary.pendingAppointments}
              </span>
            </Link>
            <Link
              href="/admin/products/new"
              className="admin-btn-primary inline-flex w-full items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold sm:w-auto"
            >
              Yeni Model Ekle
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} color={item.color} />
        ))}
      </div>
    </section>
  )
}
