import type { MetadataRoute } from 'next'
import { getProducts } from '@/src/lib/fetchers'
import { SITE_URL, slugifySegment } from '@/src/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/koleksiyonlar`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/hakkimizda`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/iletisim`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  const products = await getProducts().catch(() => [])

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/urun/${product.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const uniqueTagSlugs = Array.from(
    new Set(
      products
        .flatMap((product) => product.tags || [])
        .map((tag) => slugifySegment(tag))
        .filter((tagSlug) => tagSlug.length > 0)
    )
  )

  const tagPages: MetadataRoute.Sitemap = uniqueTagSlugs.map((tagSlug) => ({
    url: `${SITE_URL}/koleksiyonlar/etiket/${tagSlug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...tagPages, ...productPages]
}
