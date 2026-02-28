import { NextRequest, NextResponse } from 'next/server'
import {
  createAppointment,
  deleteAppointmentById,
  listAppointments,
  updateAppointmentStatus,
} from '@/src/lib/appointmentsStore'
import type { AppointmentSource, AppointmentStatus } from '@/src/types'

export const dynamic = 'force-dynamic'

const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
}

const isAppointmentStatus = (value: string): value is AppointmentStatus => {
  return value === 'pending' || value === 'approved' || value === 'rejected'
}

const isAppointmentSource = (value: string): value is AppointmentSource => {
  return value === 'contact_form' || value === 'appointment_modal'
}

const toOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limitParam = Number.parseInt(searchParams.get('limit') || '', 10)

    const appointments = await listAppointments()
    const filtered = isAppointmentStatus(status || '')
      ? appointments.filter((item) => item.status === status)
      : appointments

    const sliced =
      Number.isFinite(limitParam) && limitParam > 0
        ? filtered.slice(0, limitParam)
        : filtered

    return NextResponse.json(sliced, { headers: noCacheHeaders })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'appointments fetch failed'
    return NextResponse.json({ error: message }, { status: 500, headers: noCacheHeaders })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>

    const sourceRaw = toOptionalString(body.source)
    const source: AppointmentSource =
      sourceRaw && isAppointmentSource(sourceRaw) ? sourceRaw : 'contact_form'

    const appointment = await createAppointment({
      name: toOptionalString(body.name) || '',
      email: toOptionalString(body.email),
      phone: toOptionalString(body.phone) || '',
      subject: toOptionalString(body.subject),
      message: toOptionalString(body.message),
      preferred_date: toOptionalString(body.preferred_date),
      preferred_time: toOptionalString(body.preferred_time),
      source,
    })

    return NextResponse.json(appointment, { status: 201, headers: noCacheHeaders })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'appointment create failed'
    const isValidation = message.includes('required')
    return NextResponse.json(
      { error: message },
      { status: isValidation ? 400 : 500, headers: noCacheHeaders }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>
    const id = toOptionalString(body.id)
    const status = toOptionalString(body.status)

    if (!id || !status || !isAppointmentStatus(status)) {
      return NextResponse.json(
        { error: 'id and valid status are required' },
        { status: 400, headers: noCacheHeaders }
      )
    }

    const updated = await updateAppointmentStatus(id, status)
    if (!updated) {
      return NextResponse.json({ error: 'appointment not found' }, { status: 404, headers: noCacheHeaders })
    }

    return NextResponse.json(updated, { headers: noCacheHeaders })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'appointment update failed'
    return NextResponse.json({ error: message }, { status: 500, headers: noCacheHeaders })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const idFromQuery = toOptionalString(searchParams.get('id'))
    let id = idFromQuery

    if (!id) {
      const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
      id = toOptionalString(body?.id)
    }

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400, headers: noCacheHeaders }
      )
    }

    const deleted = await deleteAppointmentById(id)
    if (!deleted) {
      return NextResponse.json(
        { error: 'appointment not found' },
        { status: 404, headers: noCacheHeaders }
      )
    }

    return NextResponse.json(deleted, { headers: noCacheHeaders })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'appointment delete failed'
    return NextResponse.json({ error: message }, { status: 500, headers: noCacheHeaders })
  }
}
