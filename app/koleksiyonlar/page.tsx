export const revalidate = 300

import type { Metadata } from 'next'
import { KoleksiyonClient } from '@/src/components/KoleksiyonClient'
import { getContactNumbers, getProducts } from '@/src/lib/fetchers'
import { toAbsoluteUrl, truncateText } from '@/src/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const products = await getProducts()
  const tagKeywords = Array.from(
    new Set(
      products
        .flatMap((product) => product.tags || [])
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .slice(0, 12)
    )
  )

  const localizedTitle = 'Kırşehir Güzellik Hizmetleri ve Koleksiyonlar'
  const description = truncateText(
    'Kırşehir Su Perisi Güzellik Salonu koleksiyonları: cilt bakımı, kalıcı makyaj, kirpik, tırnak, manikür, pedikür ve daha fazlası.',
    158
  )

  return {
    title: localizedTitle,
    description,
    alternates: {
      canonical: '/koleksiyonlar',
    },
    keywords: [
      'kirsehir guzellik salonu hizmetleri',
      'kirsehir cilt bakimi',
      ...tagKeywords.map((tag) => `kirsehir ${tag.toLowerCase()}`),
    ],
    openGraph: {
      title: localizedTitle,
      description,
      url: toAbsoluteUrl('/koleksiyonlar'),
      type: 'website',
    },
  }
}

export default async function KoleksiyonPage() {
  const [products, contactNumbers] = await Promise.all([getProducts(), getContactNumbers()])
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kırşehir Güzellik Hizmetleri',
    itemListElement: products.slice(0, 50).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: toAbsoluteUrl(`/urun/${product.slug}`),
      name: product.name,
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ana Sayfa',
        item: toAbsoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Koleksiyonlar',
        item: toAbsoluteUrl('/koleksiyonlar'),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <KoleksiyonClient initialProducts={products} contactNumbers={contactNumbers} />
    </>
  )
}
