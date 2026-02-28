'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Appointment, AppointmentStatus } from '@/src/types'

const statusLabels: Record<AppointmentStatus, string> = {
  pending: 'Beklemede',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
}

const statusClasses: Record<AppointmentStatus, string> = {
  pending: 'border-amber-300 bg-amber-100 text-amber-800',
  approved: 'border-emerald-300 bg-emerald-100 text-emerald-800',
  rejected: 'border-rose-300 bg-rose-100 text-rose-800',
}

export default function AdminAppointmentsPage() {
  const searchParams = useSearchParams()
  const statusParam = searchParams.get('status')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | AppointmentStatus>('all')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const fetchAppointments = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true)
      const response = await fetch('/api/appointments?limit=500', { cache: 'no-store' })
      const data = await response.json()
      setAppointments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Randevu listesi alınamadı:', error)
      setAppointments([])
    } finally {
      if (showLoader) setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments(true)

    const interval = setInterval(() => fetchAppointments(false), 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (statusParam === 'pending' || statusParam === 'approved' || statusParam === 'rejected' || statusParam === 'all') {
      setActiveFilter(statusParam)
    }
  }, [statusParam])

  const summary = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter((item) => item.status === 'pending').length,
      approved: appointments.filter((item) => item.status === 'approved').length,
      rejected: appointments.filter((item) => item.status === 'rejected').length,
    }
  }, [appointments])

  const filteredAppointments = useMemo(() => {
    if (activeFilter === 'all') return appointments
    return appointments.filter((item) => item.status === activeFilter)
  }, [appointments, activeFilter])

  const formatPreferredDate = (preferredDate?: string, preferredTime?: string) => {
    if (!preferredDate) return '-'
    const parsedDate = new Date(preferredDate)
    const normalizedDate = Number.isNaN(parsedDate.getTime())
      ? preferredDate
      : parsedDate.toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })

    return preferredTime ? `${normalizedDate} ${preferredTime}` : normalizedDate
  }

  const formatSubmittedDate = (value?: string) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    setActionLoadingId(id)
    try {
      const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Randevu durumu güncellenemedi.')
      }

      setAppointments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status, updated_at: new Date().toISOString() } : item))
      )
    } catch (error) {
      console.error(error)
      alert('Randevu durumu güncellenemedi.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const deleteAppointment = async (id: string) => {
    if (!confirm('Bu randevu kaydını kalıcı olarak silmek istediğinize emin misiniz?')) return

    setActionLoadingId(id)
    try {
      const response = await fetch(`/api/appointments?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Randevu silinemedi.')
      }

      setAppointments((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error(error)
      alert('Randevu silinemedi.')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="admin-page-title">Randevular</h2>
        <p className="admin-page-subtitle mt-1.5">İletişim formu ve randevu modalından gelen talepler burada görünür.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="admin-metric-label">Toplam Talep</div>
          <div className="admin-metric-value mt-1 text-slate-900">{summary.total}</div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="admin-metric-label text-amber-700">Bekleyen</div>
          <div className="admin-metric-value mt-1 text-amber-800">{summary.pending}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="admin-metric-label text-emerald-700">Onaylanan</div>
          <div className="admin-metric-value mt-1 text-emerald-800">{summary.approved}</div>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="admin-metric-label text-rose-700">Reddedilen</div>
          <div className="admin-metric-value mt-1 text-rose-800">{summary.rejected}</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-2">
        <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:w-auto ${
              activeFilter === filter
                ? 'admin-btn-primary'
                : 'admin-btn-outline'
            }`}
          >
            {filter === 'all' ? 'Tüm Kayıtlar' : statusLabels[filter]}
          </button>
        ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">Yükleniyor...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">Bu filtrede randevu kaydı bulunmuyor.</div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="p-5 md:p-6">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xl font-bold text-slate-900 md:text-2xl">{appointment.name}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-600">
                      {appointment.phone}
                      {appointment.email ? ` • ${appointment.email}` : ''}
                    </div>
                  </div>
                  <span className={`rounded-full border px-3 py-1.5 text-sm font-bold ${statusClasses[appointment.status]}`}>
                    {statusLabels[appointment.status]}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm font-semibold text-slate-600 md:grid-cols-3">
                  <div>
                    <span className="font-bold text-slate-900">Kaynak:</span>{' '}
                    {appointment.source === 'appointment_modal' ? 'Randevu Modalı' : 'İletişim Formu'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Talep Tarihi:</span>{' '}
                    {formatPreferredDate(appointment.preferred_date, appointment.preferred_time)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Gönderim Tarihi:</span>{' '}
                    {formatSubmittedDate(appointment.created_at)}
                  </div>
                </div>

                {(appointment.subject || appointment.message) && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    {appointment.subject ? <div className="mb-1 font-bold">Konu: {appointment.subject}</div> : null}
                    {appointment.message ? <div>{appointment.message}</div> : null}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => updateStatus(appointment.id, 'approved')}
                    disabled={actionLoadingId === appointment.id || appointment.status === 'approved'}
                    className="admin-btn-success w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    style={{ backgroundColor: '#059669', color: '#ffffff', borderColor: '#047857' }}
                  >
                    Onayla
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(appointment.id, 'rejected')}
                    disabled={actionLoadingId === appointment.id || appointment.status === 'rejected'}
                    className="admin-btn-danger w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    style={{ backgroundColor: '#be123c', color: '#ffffff', borderColor: '#9f1239' }}
                  >
                    Reddet
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAppointment(appointment.id)}
                    disabled={actionLoadingId === appointment.id}
                    className="admin-btn-danger w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    style={{ backgroundColor: '#dc2626', color: '#ffffff', borderColor: '#b91c1c' }}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
