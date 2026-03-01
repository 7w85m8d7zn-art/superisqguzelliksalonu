import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { products as localProducts } from '@/src/data/products'

export type FallbackProductRow = Record<string, unknown> & { id: string }

export interface FallbackProductsData {
  products: FallbackProductRow[]
  serviceDetailsMap: Record<string, string[]>
}

const STORE_FILE_PATH = join(process.cwd(), '.data', 'products-fallback.json')
const FILE_SYSTEM_READ_ONLY_CODES = new Set(['EROFS', 'EACCES', 'EPERM', 'ENOENT', 'ENOTDIR'])
let useInMemoryStoreOnly = false
let inMemoryStore: FallbackProductsData = { products: [], serviceDetailsMap: {} }

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

const getErrorCode = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as { code?: unknown }).code || '')
  }
  return ''
}

const markReadOnlyStore = (error: unknown) => {
  const code = getErrorCode(error)
  if (FILE_SYSTEM_READ_ONLY_CODES.has(code)) {
    useInMemoryStoreOnly = true
    console.warn('Fallback product store switched to in-memory mode:', code)
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
  if (useInMemoryStoreOnly) return

  await mkdir(dirname(STORE_FILE_PATH), { recursive: true })

  try {
    await readFile(STORE_FILE_PATH, 'utf8')
  } catch (error) {
    const errorCode = getErrorCode(error)

    if (errorCode !== 'ENOENT') {
      markReadOnlyStore(error)
      if (useInMemoryStoreOnly) return
      throw error
    }

    try {
      await writeFile(STORE_FILE_PATH, JSON.stringify(buildInitialData(), null, 2), 'utf8')
    } catch (writeError) {
      markReadOnlyStore(writeError)
      if (!useInMemoryStoreOnly) throw writeError
    }
  }
}

export async function readFallbackProductsData(): Promise<FallbackProductsData> {
  try {
    await ensureStoreFile()
  } catch (error) {
    markReadOnlyStore(error)
    if (useInMemoryStoreOnly) {
      const normalized = normalizeFallbackData(inMemoryStore)
      if (!normalized.products.length) {
        const initialData = buildInitialData()
        inMemoryStore = initialData
        return initialData
      }
      return normalized
    }
    throw error
  }

  if (useInMemoryStoreOnly) {
    const normalized = normalizeFallbackData(inMemoryStore)
    if (!normalized.products.length) {
      const initialData = buildInitialData()
      inMemoryStore = initialData
      return initialData
    }
    return normalized
  }

  try {
    const raw = await readFile(STORE_FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    const normalized = normalizeFallbackData(parsed)
    inMemoryStore = normalized
    return normalized
  } catch (error) {
    console.warn('Fallback product store read failed, resetting store:', error)
    const initialData = buildInitialData()
    inMemoryStore = initialData
    try {
      await writeFile(STORE_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf8')
    } catch (writeError) {
      markReadOnlyStore(writeError)
    }
    return initialData
  }
}

export async function writeFallbackProductsData(nextData: FallbackProductsData): Promise<void> {
  const normalizedData = normalizeFallbackData(nextData)
  inMemoryStore = normalizedData

  try {
    await ensureStoreFile()
  } catch (error) {
    markReadOnlyStore(error)
    if (useInMemoryStoreOnly) return
    throw error
  }

  if (useInMemoryStoreOnly) return

  try {
    await writeFile(STORE_FILE_PATH, JSON.stringify(normalizedData, null, 2), 'utf8')
  } catch (error) {
    markReadOnlyStore(error)
    if (!useInMemoryStoreOnly) throw error
  }
}
