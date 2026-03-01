import { NextResponse } from 'next/server'
import {
  buildDashboardSeries,
  getVisitorStats,
  listAppointments,
} from '@/src/lib/appointmentsStore'
import { readFallbackProductsData } from '@/src/lib/fallbackProductsStore'
import { isSupabaseConfigured, supabaseServer } from '@/src/lib/supabaseServer'
import type { Appointment } from '@/src/types'

export const dynamic = 'force-dynamic'

const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
}

export async function GET() {
  try {
    const fallbackVisitorStats = { totalVisitors: 0, dailyCounts: {} as Record<string, number> }

    let appointments: Appointment[] = []
    let visitorStats = fallbackVisitorStats
    let totalProducts = 0

    const [appointmentsResult, visitorStatsResult] = await Promise.allSettled([
      listAppointments(),
      getVisitorStats(),
    ])

    if (appointmentsResult.status === 'fulfilled') {
      appointments = appointmentsResult.value
    }

    if (visitorStatsResult.status === 'fulfilled') {
      visitorStats = visitorStatsResult.value
    }

    if (!isSupabaseConfigured) {
      const fallbackData = await readFallbackProductsData()
      totalProducts = fallbackData.products.length
    } else {
      try {
        const productCountResult = await supabaseServer
          .from('products')
          .select('id', { count: 'exact', head: true })

        if (!productCountResult.error) {
          totalProducts = productCountResult.count || 0
        } else {
          const fallbackData = await readFallbackProductsData()
          totalProducts = fallbackData.products.length
        }
      } catch {
        const fallbackData = await readFallbackProductsData()
        totalProducts = fallbackData.products.length
      }
    }

    const pendingAppointments = appointments.filter((item) => item.status === 'pending').length
    const approvedAppointments = appointments.filter((item) => item.status === 'approved').length
    const rejectedAppointments = appointments.filter((item) => item.status === 'rejected').length

    const series = buildDashboardSeries(appointments, visitorStats.dailyCounts, 7)

    return NextResponse.json(
      {
        summary: {
          totalProducts,
          totalVisitors: visitorStats.totalVisitors,
          totalAppointments: appointments.length,
          pendingAppointments,
          approvedAppointments,
          rejectedAppointments,
        },
        series,
      },
      { headers: noCacheHeaders }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'dashboard fetch failed'
    const fallbackAppointments: Appointment[] = []
    const fallbackVisitors: Record<string, number> = {}

    return NextResponse.json(
      {
        error: message,
        summary: {
          totalProducts: 0,
          totalVisitors: 0,
          totalAppointments: 0,
          pendingAppointments: 0,
          approvedAppointments: 0,
          rejectedAppointments: 0,
        },
        series: buildDashboardSeries(fallbackAppointments, fallbackVisitors, 7),
      },
      { headers: noCacheHeaders }
    )
  }
}
