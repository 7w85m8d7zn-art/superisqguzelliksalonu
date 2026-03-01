import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import {
  FallbackProductRow,
  readFallbackProductsData,
  writeFallbackProductsData,
} from '../../../src/lib/fallbackProductsStore'
import { isSupabaseConfigured, supabaseServer } from '../../../src/lib/supabaseServer'

const PRODUCT_SERVICE_DETAILS_KEY = 'product_service_details'

const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
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

const normalizeImageUrl = (rawUrl: string): string => {
  let normalized = rawUrl.trim()
  if (!normalized) return ''

  normalized = normalized.replace(/^[;,]+/, '')
  if (!normalized) return ''

  const lower = normalized.toLowerCase()
  if (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('data:') ||
    lower.startsWith('blob:')
  ) {
    return normalized
  }

  if (normalized.startsWith('/products/')) return `/uploads${normalized}`
  if (normalized.startsWith('products/')) return `/uploads/${normalized}`
  if (normalized.startsWith('uploads/')) return `/${normalized}`
  if (!normalized.startsWith('/')) return `/${normalized}`

  return normalized
}

const sanitizeImageList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []

  return Array.from(new Set(
    value
    .map((item) => (typeof item === 'string' ? normalizeImageUrl(item) : ''))
    .filter((item) => item.length > 0)
  ))
}

const sanitizeServiceDetails = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0)
}

const sanitizeProductPayload = <T extends Record<string, unknown>>(product: T): T => {
  if (!product || typeof product !== 'object') return product

  const payload = {
    ...product,
    images: sanitizeImageList(product.images),
  } as Record<string, unknown>

  // service_details is persisted in settings table map keyed by product id.
  delete payload.service_details

  return payload as T
}

const revalidateProductRelatedPaths = (slugOrId?: string) => {
  try {
    revalidatePath('/')
    revalidatePath('/koleksiyonlar')
    revalidatePath('/admin/products')
    if (slugOrId) {
      revalidatePath(`/urun/${slugOrId}`)
    }
  } catch (error) {
    console.warn('Product path revalidation failed:', error)
  }
}

async function getLatestSettingValueByKey(key: string): Promise<unknown | null> {
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

async function getProductServiceDetailsMap(): Promise<Record<string, string[]>> {
  if (!isSupabaseConfigured) {
    const fallbackData = await readFallbackProductsData()
    return { ...fallbackData.serviceDetailsMap }
  }

  const value = await getLatestSettingValueByKey(PRODUCT_SERVICE_DETAILS_KEY)
  const parsed = parseJsonLike<Record<string, unknown>>(value, {})

  if (!isObjectRecord(parsed)) return {}

  return Object.entries(parsed).reduce<Record<string, string[]>>((acc, [productId, details]) => {
    const normalizedDetails = sanitizeServiceDetails(details)
    if (productId && normalizedDetails.length > 0) {
      acc[productId] = normalizedDetails
    }
    return acc
  }, {})
}

async function persistProductServiceDetails(productId: string, details: string[]): Promise<void> {
  if (!productId) return

  if (!isSupabaseConfigured) {
    const fallbackData = await readFallbackProductsData()
    if (details.length > 0) {
      fallbackData.serviceDetailsMap[productId] = details
    } else {
      delete fallbackData.serviceDetailsMap[productId]
    }
    await writeFallbackProductsData(fallbackData)
    return
  }

  const detailsMap = await getProductServiceDetailsMap()

  if (details.length > 0) {
    detailsMap[productId] = details
  } else {
    delete detailsMap[productId]
  }

  await persistSetting(PRODUCT_SERVICE_DETAILS_KEY, detailsMap)
}

async function buildFallbackProductsResponse() {
  const fallbackData = await readFallbackProductsData()

  return fallbackData.products.map((productRow) => {
    const normalized = sanitizeProductPayload(productRow)
    const title = typeof productRow.title === 'string' ? productRow.title : ''
    const productId = typeof productRow.id === 'string' ? productRow.id : ''

    return {
      ...normalized,
      name: title || (typeof productRow.name === 'string' ? productRow.name : ''),
      service_details: productId ? fallbackData.serviceDetailsMap[productId] || [] : [],
    }
  })
}

export async function GET() {
  try {
    if (!isSupabaseConfigured) {
      const fallbackProducts = await buildFallbackProductsResponse()
      return NextResponse.json(fallbackProducts, { headers: noCacheHeaders })
    }

    const { data: supabaseData, error } = await supabaseServer
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Supabase products fetch failed:', error.message)
      const fallbackProducts = await buildFallbackProductsResponse().catch(() => [])
      return NextResponse.json(fallbackProducts, { headers: noCacheHeaders })
    }

    const serviceDetailsMap = await getProductServiceDetailsMap().catch((err: unknown) => {
      console.warn('Service details map fetch failed:', err)
      return {}
    })

    const products = (supabaseData || []).map((productRow) => {
      const normalized = sanitizeProductPayload(productRow)
      const title = typeof productRow.title === 'string' ? productRow.title : ''

      return {
        ...normalized,
        name: title || (typeof productRow.name === 'string' ? productRow.name : ''),
        service_details: serviceDetailsMap[productRow.id] || [],
      }
    })

    return NextResponse.json(products, { headers: noCacheHeaders })
  } catch (error) {
    console.warn('Products route GET failed, using fallback:', error)
    const fallbackProducts = await buildFallbackProductsResponse().catch(() => [])
    return NextResponse.json(fallbackProducts, { headers: noCacheHeaders })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>
    const serviceDetails = sanitizeServiceDetails(body.service_details)
    const payload = sanitizeProductPayload(body)

    if (!isSupabaseConfigured) {
      const fallbackData = await readFallbackProductsData()
      const id = crypto.randomUUID()
      const now = new Date().toISOString()
      const created = sanitizeProductPayload({
        ...payload,
        id,
        slug: typeof payload.slug === 'string' ? payload.slug : id,
        created_at: now,
        updated_at: now,
      }) as FallbackProductRow

      fallbackData.products.unshift(created)
      if (serviceDetails.length > 0) {
        fallbackData.serviceDetailsMap[id] = serviceDetails
      } else {
        delete fallbackData.serviceDetailsMap[id]
      }
      await writeFallbackProductsData(fallbackData)
      revalidateProductRelatedPaths(typeof created.slug === 'string' ? created.slug : created.id)

      return NextResponse.json(
        {
          ...created,
          name:
            (typeof created.title === 'string' && created.title) ||
            (typeof created.name === 'string' ? created.name : ''),
          service_details: serviceDetails,
        },
        { status: 201 }
      )
    }

    const { data, error } = await supabaseServer.from('products').insert([payload]).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (data?.id) {
      await persistProductServiceDetails(data.id, serviceDetails)
    }
    revalidateProductRelatedPaths(typeof data?.slug === 'string' ? data.slug : data?.id)

    return NextResponse.json({ ...data, service_details: serviceDetails }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>
    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const serviceDetails = sanitizeServiceDetails(body.service_details)
    const rest = sanitizeProductPayload(body)
    delete rest.id

    if (!isSupabaseConfigured) {
      const fallbackData = await readFallbackProductsData()
      const index = fallbackData.products.findIndex((product) => product.id === id)
      if (index < 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      const current = fallbackData.products[index]
      const updated = sanitizeProductPayload({
        ...current,
        ...rest,
        id,
        updated_at: new Date().toISOString(),
      }) as FallbackProductRow

      fallbackData.products[index] = updated
      if (serviceDetails.length > 0) {
        fallbackData.serviceDetailsMap[id] = serviceDetails
      } else {
        delete fallbackData.serviceDetailsMap[id]
      }
      await writeFallbackProductsData(fallbackData)
      const revalidateSlug =
        (typeof updated.slug === 'string' && updated.slug) ||
        (typeof current.slug === 'string' && current.slug) ||
        id
      revalidateProductRelatedPaths(revalidateSlug)

      return NextResponse.json({
        ...updated,
        name:
          (typeof updated.title === 'string' && updated.title) ||
          (typeof updated.name === 'string' ? updated.name : ''),
        service_details: serviceDetails,
      })
    }

    const { data, error } = await supabaseServer.from('products').update(rest).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await persistProductServiceDetails(id, serviceDetails)
    const revalidateSlug = (typeof data?.slug === 'string' && data.slug) || id
    revalidateProductRelatedPaths(revalidateSlug)

    return NextResponse.json({ ...data, service_details: serviceDetails })
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    if (!isSupabaseConfigured) {
      const fallbackData = await readFallbackProductsData()
      const index = fallbackData.products.findIndex((product) => product.id === id)
      if (index < 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      const deleted = fallbackData.products[index]
      fallbackData.products.splice(index, 1)
      delete fallbackData.serviceDetailsMap[id]
      await writeFallbackProductsData(fallbackData)
      const revalidateSlug =
        (deleted && typeof deleted.slug === 'string' && deleted.slug) ||
        (deleted && typeof deleted.id === 'string' && deleted.id) ||
        id
      revalidateProductRelatedPaths(revalidateSlug)
      return NextResponse.json({ success: true })
    }

    const { error } = await supabaseServer.from('products').delete().eq('id', id)
    if (error) {
      console.warn('Supabase delete failed:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await persistProductServiceDetails(id, [])
    revalidateProductRelatedPaths(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
