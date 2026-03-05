const DEFAULT_SITE_URL = 'https://www.superisiguzelliksalonu.com'

const TURKISH_CHAR_MAP: Record<string, string> = {
  'ç': 'c',
  'ğ': 'g',
  'ı': 'i',
  'ö': 'o',
  'ş': 's',
  'ü': 'u',
}

const normalizeSiteUrl = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) return DEFAULT_SITE_URL
  return trimmed.replace(/\/+$/, '')
}

const normalizedPublicSiteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL)

export const SITE_URL = normalizedPublicSiteUrl
export const BRAND_NAME = 'Su Perisi Güzellik Salonu'
export const CITY_DISPLAY_NAME = 'Kırşehir'
export const CITY_SLUG = 'kirsehir'

export const slugifySegment = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[çğıöşü]/g, (char) => TURKISH_CHAR_MAP[char] || char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

export const truncateText = (value: string, maxLength: number): string => {
  const normalized = value.trim().replace(/\s+/g, ' ')
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trim()}…`
}

export const toAbsoluteUrl = (path: string): string => {
  if (!path) return SITE_URL
  if (/^https?:\/\//i.test(path)) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalizedPath}`
}

export const buildProductSeoSlug = (productName: string, productId: string): string => {
  const base = slugifySegment(productName) || 'hizmet'
  const cityAwareBase = base.startsWith(`${CITY_SLUG}-`) ? base : `${CITY_SLUG}-${base}`
  const safeProductId = String(productId || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .trim()

  if (!safeProductId) return cityAwareBase
  return `${cityAwareBase}-${safeProductId}`
}

export const extractProductIdFromSeoSlug = (slug: string): string | null => {
  const normalized = String(slug || '').toLowerCase()
  const uuidMatch = normalized.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/)
  return uuidMatch?.[1] || null
}
