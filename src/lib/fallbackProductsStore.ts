import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { products as localProducts } from '@/src/data/products'

export type FallbackProductRow = Record<string, unknown> & { id: string }

export interface FallbackProductsData {
  products: FallbackProductRow[]
  serviceDetailsMap: Record<string, string[]>
}

const STORE_FILE_PATH = join(process.cwd(), '.data', 'products-fallback.json')

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const sanitizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0)
}

const buildInitialData = (): FallbackProductsData => {
  const now = new Date().toISOString()
  const products = localProducts.map<FallbackProductRow>((product) => ({
    id: product.id,
    slug: product.slug,
    title: product.name,
    name: product.name,
    description: product.description,
    price_from: product.priceFrom,
    images: Array.isArray(product.images) ? [...product.images] : [],
    colors: Array.isArray(product.colors) ? [...product.colors] : [],
    sizes: Array.isArray(product.sizes) ? [...product.sizes] : [],
    tags: Array.isArray(product.tags) ? [...product.tags] : [],
    category: product.category,
    featured: Boolean(product.featured),
    created_at: now,
    updated_at: now,
  }))

  return {
    products,
    serviceDetailsMap: {},
  }
}

const normalizeFallbackData = (value: unknown): FallbackProductsData => {
  if (!isRecord(value)) return buildInitialData()

  const rawProducts = Array.isArray(value.products) ? value.products : []
  const products = rawProducts
    .filter((product): product is Record<string, unknown> => isRecord(product))
    .map<FallbackProductRow>((product) => ({
      ...product,
      id: typeof product.id === 'string' && product.id.trim().length > 0 ? product.id : crypto.randomUUID(),
    }))

  const rawServiceDetailsMap = isRecord(value.serviceDetailsMap) ? value.serviceDetailsMap : {}
  const serviceDetailsMap = Object.entries(rawServiceDetailsMap).reduce<Record<string, string[]>>(
    (acc, [productId, details]) => {
      const normalizedDetails = sanitizeStringArray(details)
      if (productId && normalizedDetails.length > 0) {
        acc[productId] = normalizedDetails
      }
      return acc
    },
    {}
  )

  return { products, serviceDetailsMap }
}

const ensureStoreFile = async (): Promise<void> => {
  await mkdir(dirname(STORE_FILE_PATH), { recursive: true })

  try {
    await readFile(STORE_FILE_PATH, 'utf8')
  } catch (error) {
    const errorCode =
      typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: unknown }).code)
        : ''

    if (errorCode !== 'ENOENT') {
      throw error
    }

    await writeFile(STORE_FILE_PATH, JSON.stringify(buildInitialData(), null, 2), 'utf8')
  }
}

export async function readFallbackProductsData(): Promise<FallbackProductsData> {
  await ensureStoreFile()

  try {
    const raw = await readFile(STORE_FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    return normalizeFallbackData(parsed)
  } catch (error) {
    console.warn('Fallback product store read failed, resetting store:', error)
    const initialData = buildInitialData()
    await writeFile(STORE_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf8')
    return initialData
  }
}

export async function writeFallbackProductsData(nextData: FallbackProductsData): Promise<void> {
  await ensureStoreFile()
  const normalizedData = normalizeFallbackData(nextData)
  await writeFile(STORE_FILE_PATH, JSON.stringify(normalizedData, null, 2), 'utf8')
}
