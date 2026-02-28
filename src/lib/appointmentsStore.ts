import { isSupabaseConfigured, supabaseServer } from './supabaseServer'
import { getFallbackSettingValueByKey, upsertFallbackSetting } from './fallbackSettingsStore'
import type {
  Appointment,
  AppointmentSource,
  AppointmentStatus,
  DashboardSeriesPoint,
} from '@/src/types'

const APPOINTMENTS_KEY = 'appointments_data'
const VISITOR_TOTAL_KEY = 'visitor_count'
const VISITOR_DAILY_KEY = 'visitor_daily_counts'
const VISITOR_HISTORY_DAYS = 120

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const cleanString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const parseJsonLike = <T>(value: unknown, fallback: T): T => {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return fallback
    }
  }
  return value as T
}

async function getLatestSettingValueByKey(key: string): Promise<unknown | null> {
  if (!isSupabaseConfigured) {
    return await getFallbackSettingValueByKey(key)
  }

  const { data, error } = await supabaseServer
    .from('settings')
    .select('value')
    .eq('key', key)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data?.value ?? null
}

async function persistSetting(key: string, value: unknown): Promise<void> {
  if (!isSupabaseConfigured) {
    await upsertFallbackSetting(key, value)
    return
  }

  const payload = {
    value,
    updated_at: new Date().toISOString(),
  }

  const { data: updatedRows, error: updateError } = await supabaseServer
    .from('settings')
    .update(payload)
    .eq('key', key)
    .select('id')

  if (updateError) throw updateError

  if (!updatedRows || updatedRows.length === 0) {
    const { error: insertError } = await supabaseServer
      .from('settings')
      .insert({ key, ...payload })
      .select('id')
      .single()

    if (insertError) throw insertError
  }
}

const normalizeStatus = (value: unknown): AppointmentStatus => {
  const normalized = cleanString(value)
  if (normalized === 'approved' || normalized === 'rejected' || normalized === 'pending') {
    return normalized
  }
  return 'pending'
}

const normalizeSource = (value: unknown): AppointmentSource => {
  return cleanString(value) === 'appointment_modal' ? 'appointment_modal' : 'contact_form'
}

const normalizeAppointment = (value: unknown): Appointment | null => {
  if (!isRecord(value)) return null

  const name = cleanString(value.name)
  const phone = cleanString(value.phone)
  if (!name || !phone) return null

  const createdAt = cleanString(value.created_at) || new Date().toISOString()

  return {
    id: cleanString(value.id) || crypto.randomUUID(),
    name,
    phone,
    email: cleanString(value.email),
    subject: cleanString(value.subject),
    message: cleanString(value.message),
    preferred_date: cleanString(value.preferred_date),
    preferred_time: cleanString(value.preferred_time),
    source: normalizeSource(value.source),
    status: normalizeStatus(value.status),
    created_at: createdAt,
    updated_at: cleanString(value.updated_at) || createdAt,
  }
}

export interface CreateAppointmentInput {
  name: string
  email?: string
  phone: string
  subject?: string
  message?: string
  preferred_date?: string
  preferred_time?: string
  source?: AppointmentSource
}

export async function listAppointments(): Promise<Appointment[]> {
  const rawValue = await getLatestSettingValueByKey(APPOINTMENTS_KEY)
  const parsedValue = parseJsonLike<unknown[]>(rawValue, [])

  if (!Array.isArray(parsedValue)) return []

  return parsedValue
    .map(normalizeAppointment)
    .filter((appointment): appointment is Appointment => Boolean(appointment))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
  const name = cleanString(input.name)
  const phone = cleanString(input.phone)
  if (!name || !phone) {
    throw new Error('name and phone are required')
  }

  const now = new Date().toISOString()
  const appointment: Appointment = {
    id: crypto.randomUUID(),
    name,
    phone,
    email: cleanString(input.email),
    subject: cleanString(input.subject),
    message: cleanString(input.message),
    preferred_date: cleanString(input.preferred_date),
    preferred_time: cleanString(input.preferred_time),
    source: input.source === 'appointment_modal' ? 'appointment_modal' : 'contact_form',
    status: 'pending',
    created_at: now,
    updated_at: now,
  }

  const currentAppointments = await listAppointments()
  const nextAppointments = [appointment, ...currentAppointments]
  await persistSetting(APPOINTMENTS_KEY, nextAppointments)

  return appointment
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<Appointment | null> {
  const normalizedId = cleanString(id)
  if (!normalizedId) return null

  const currentAppointments = await listAppointments()
  const index = currentAppointments.findIndex((appointment) => appointment.id === normalizedId)
  if (index < 0) return null

  const updatedAppointment: Appointment = {
    ...currentAppointments[index],
    status,
    updated_at: new Date().toISOString(),
  }

  const nextAppointments = [...currentAppointments]
  nextAppointments[index] = updatedAppointment

  await persistSetting(APPOINTMENTS_KEY, nextAppointments)
  return updatedAppointment
}

export async function deleteAppointmentById(id: string): Promise<Appointment | null> {
  const normalizedId = cleanString(id)
  if (!normalizedId) return null

  const currentAppointments = await listAppointments()
  const appointmentToDelete = currentAppointments.find((appointment) => appointment.id === normalizedId)
  if (!appointmentToDelete) return null

  const nextAppointments = currentAppointments.filter((appointment) => appointment.id !== normalizedId)
  await persistSetting(APPOINTMENTS_KEY, nextAppointments)

  return appointmentToDelete
}

const pruneDailyCounts = (counts: Record<string, number>): Record<string, number> => {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - VISITOR_HISTORY_DAYS)
  const cutoffKey = cutoff.toISOString().slice(0, 10)

  return Object.fromEntries(
    Object.entries(counts).filter(([dateKey]) => dateKey >= cutoffKey)
  )
}

const parseVisitorDailyCounts = (value: unknown): Record<string, number> => {
  const parsed = parseJsonLike<Record<string, unknown>>(value, {})
  if (!isRecord(parsed)) return {}

  const normalized = Object.entries(parsed).reduce<Record<string, number>>((acc, [dateKey, count]) => {
    const parsedCount = Number.parseInt(String(count), 10)
    if (Number.isFinite(parsedCount) && parsedCount >= 0) {
      acc[dateKey] = parsedCount
    }
    return acc
  }, {})

  return pruneDailyCounts(normalized)
}

export async function getVisitorStats(): Promise<{
  totalVisitors: number
  dailyCounts: Record<string, number>
}> {
  const [totalRaw, dailyRaw] = await Promise.all([
    getLatestSettingValueByKey(VISITOR_TOTAL_KEY),
    getLatestSettingValueByKey(VISITOR_DAILY_KEY),
  ])

  const totalVisitors = Number.parseInt(String(totalRaw || '0'), 10) || 0
  const dailyCounts = parseVisitorDailyCounts(dailyRaw)

  return { totalVisitors, dailyCounts }
}

export async function incrementVisitorStats(now = new Date()): Promise<{
  totalVisitors: number
  dailyCounts: Record<string, number>
}> {
  const { totalVisitors, dailyCounts } = await getVisitorStats()
  const todayKey = now.toISOString().slice(0, 10)

  const nextDailyCounts = pruneDailyCounts({
    ...dailyCounts,
    [todayKey]: (dailyCounts[todayKey] || 0) + 1,
  })

  const nextTotal = totalVisitors + 1

  await Promise.all([
    persistSetting(VISITOR_TOTAL_KEY, String(nextTotal)),
    persistSetting(VISITOR_DAILY_KEY, nextDailyCounts),
  ])

  return {
    totalVisitors: nextTotal,
    dailyCounts: nextDailyCounts,
  }
}

export function buildDashboardSeries(
  appointments: Appointment[],
  visitorDailyCounts: Record<string, number>,
  days = 7
): DashboardSeriesPoint[] {
  const normalizedDays = Number.isFinite(days) && days > 0 ? Math.floor(days) : 7

  const appointmentCountsByDate = appointments.reduce((acc: Record<string, number>, item) => {
    const dateKey = (item.created_at || '').slice(0, 10)
    if (!dateKey) return acc
    acc[dateKey] = (acc[dateKey] || 0) + 1
    return acc
  }, {})

  return Array.from({ length: normalizedDays }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (normalizedDays - 1 - index))
    const dateKey = date.toISOString().slice(0, 10)

    return {
      date: dateKey,
      label: date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
      appointments: appointmentCountsByDate[dateKey] || 0,
      visitors: visitorDailyCounts[dateKey] || 0,
    }
  })
}
