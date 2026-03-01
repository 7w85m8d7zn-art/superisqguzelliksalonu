import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, supabaseServer } from '../../../src/lib/supabaseServer'
import { incrementVisitorStats } from '@/src/lib/appointmentsStore'
import {
  getFallbackSettingValueByKey,
  getFallbackSettingsMap,
  upsertFallbackSetting,
} from '@/src/lib/fallbackSettingsStore'

const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
}

function parseIfJson(value: unknown) {
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

async function getLatestSettingValueByKey(key: string) {
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

  if (error) {
    throw error
  }

  return data?.value ?? null
}

async function persistSetting(key: string, value: unknown) {
  if (!isSupabaseConfigured) {
    return await upsertFallbackSetting(key, value)
  }

  const payload = {
    value,
    updated_at: new Date().toISOString(),
  }

  // 1) Update all existing rows with same key.
  const { data: updatedRows, error: updateError } = await supabaseServer
    .from('settings')
    .update(payload)
    .eq('key', key)
    .select()

  if (updateError) {
    throw updateError
  }

  // 2) If key does not exist, insert new row.
  if (!updatedRows || updatedRows.length === 0) {
    const { data: insertedRow, error: insertError } = await supabaseServer
      .from('settings')
      .insert({
        key,
        ...payload,
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    return insertedRow
  }

  return updatedRows[0]
}

const asErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof Error && err.message) return err.message
  return fallback
}

async function persistSettingWithFallback(key: string, value: unknown) {
  try {
    return await persistSetting(key, value)
  } catch (err) {
    console.warn('persistSetting failed, writing to fallback store:', err)
    return await upsertFallbackSetting(key, value)
  }
}

export async function GET() {
  try {
    const localSettingsMap = await getFallbackSettingsMap()
    if (!isSupabaseConfigured) {
      return NextResponse.json(localSettingsMap, { headers: noCacheHeaders })
    }

    const { data, error } = await supabaseServer
      .from('settings')
      .select('key, value, updated_at')
      .order('updated_at', { ascending: false })

    if (error) {
      console.warn('Supabase settings GET failed, using fallback:', error.message)
      return NextResponse.json(
        { ...localSettingsMap, __warning: error.message },
        { headers: noCacheHeaders }
      )
    }

    // For duplicate keys, keep the newest row only.
    const map = (data || []).reduce((acc: Record<string, unknown>, row: any) => {
      if (!(row.key in acc)) {
        acc[row.key] = row.value
      }
      return acc
    }, {})

    return NextResponse.json(map, { headers: noCacheHeaders })
  } catch (err: unknown) {
    console.warn('Settings GET failed, returning fallback data:', err)
    const localSettingsMap = await getFallbackSettingsMap().catch(() => ({}))
    return NextResponse.json(
      { ...localSettingsMap, __warning: asErrorMessage(err, 'settings fetch failed') },
      { headers: noCacheHeaders }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { key, value } = body

    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400, headers: noCacheHeaders })
    }

    const incomingValue = parseIfJson(value)
    let finalValue: unknown = incomingValue

    // For object payloads, merge non-empty fields with latest existing object.
    if (
      incomingValue &&
      typeof incomingValue === 'object' &&
      !Array.isArray(incomingValue)
    ) {
      const existingValue = parseIfJson(await getLatestSettingValueByKey(key))
      const existingObj =
        existingValue && typeof existingValue === 'object' && !Array.isArray(existingValue)
          ? existingValue
          : {}

      const filteredIncoming = Object.fromEntries(
        Object.entries(incomingValue).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      )

      finalValue = { ...existingObj, ...filteredIncoming }
    }

    const saved = await persistSettingWithFallback(key, finalValue)
    return NextResponse.json({ success: true, data: saved }, { headers: noCacheHeaders })
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: asErrorMessage(err, 'Unknown error'),
      },
      { status: 500, headers: noCacheHeaders }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { key, value } = body
    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400, headers: noCacheHeaders })
    }

    const saved = await persistSettingWithFallback(key, parseIfJson(value))
    return NextResponse.json(saved, { headers: noCacheHeaders })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: asErrorMessage(err, 'Update failed') },
      { status: 500, headers: noCacheHeaders }
    )
  }
}

// Ziyaretçi sayısını artıran özel endpoint
export async function PATCH() {
  try {
    const { totalVisitors } = await incrementVisitorStats()
    return NextResponse.json({ visitor_count: totalVisitors }, { headers: noCacheHeaders })
  } catch (err: unknown) {
    return NextResponse.json(
      { visitor_count: 1, warning: asErrorMessage(err, 'Server error') },
      { headers: noCacheHeaders }
    )
  }
}
