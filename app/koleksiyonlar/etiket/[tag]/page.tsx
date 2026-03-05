export const revalidate = 300

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { KoleksiyonClient } from '@/src/components/KoleksiyonClient'
import { getContactNumbers, getProducts } from '@/src/lib/fetchers'
import { CITY_DISPLAY_NAME, slugifySegment, toAbsoluteUrl, truncateText } from '@/src/lib/seo'

interface PageProps {
  params: Promise<{ tag: string }>
}

const resolveTagLabel = (tagSlug: string, availableTags: string[]): string | null => {
  const normalizedSlug = tagSlug.trim().toLowerCase()
  if (!normalizedSlug) return null

  return availableTags.find((tag) => slugifySegment(tag) === normalizedSlug) || null
}

export async function generateStaticParams() {
  const products = await getProducts().catch(() => [])
  const tagSlugs = Array.from(
    new Set(
      products
        .flatMap((product) => product.tags || [])
        .map((tag) => slugifySegment(tag))
        .filter((tagSlug) => tagSlug.length > 0)
    )
  )

  return tagSlugs.map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  const products = await getProducts()
  const allTags = Array.from(
    new Set(
      products
        .flatMap((product) => product.tags || [])
        .map((tagLabel) => tagLabel.trim())
        .filter((tagLabel) => tagLabel.length > 0)
    )
  )

  const tagLabel = resolveTagLabel(tag, allTags)

  if (!tagLabel) {
    return {
      title: 'Hizmet Etiketi Bulunamadı | Su Perisi Güzellik Salonu',
      description: 'Aradığınız hizmet etiketi bulunamadı.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = `${CITY_DISPLAY_NAME} ${tagLabel} Hizmeti | Su Perisi Güzellik Salonu`
  const description = truncateText(
    `${CITY_DISPLAY_NAME} ${tagLabel} hizmetleri, detaylı açıklamalar ve online randevu için koleksiyon sayfamızı inceleyin.`,
    158
  )
  const canonicalPath = `/koleksiyonlar/etiket/${tag}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    keywords: [
      `${CITY_DISPLAY_NAME} ${tagLabel}`,
      `${CITY_DISPLAY_NAME} güzellik salonu`,
      `${tagLabel} randevu`,
    ],
    openGraph: {
      title,
      description,
      url: toAbsoluteUrl(canonicalPath),
      type: 'website',
    },
  }
}

export default async function TagCollectionPage({ params }: PageProps) {
  const { tag } = await params
  const [products, contactNumbers] = await Promise.all([getProducts(), getContactNumbers()])

  const allTags = Array.from(
    new Set(
      products
        .flatMap((product) => product.tags || [])
        .map((tagLabel) => tagLabel.trim())
        .filter((tagLabel) => tagLabel.length > 0)
    )
  )

  const tagLabel = resolveTagLabel(tag, allTags)
  if (!tagLabel) {
    notFound()
  }

  const filteredProducts = products.filter((product) => (product.tags || []).includes(tagLabel))
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${CITY_DISPLAY_NAME} ${tagLabel} Hizmetleri`,
    itemListElement: filteredProducts.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: toAbsoluteUrl(`/urun/${product.slug}`),
      name: product.name,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <KoleksiyonClient
        initialProducts={products}
        contactNumbers={contactNumbers}
        initialSelectedTags={[tagLabel]}
        pageTitle={`${CITY_DISPLAY_NAME} ${tagLabel}`}
        pageSubtitle={`${CITY_DISPLAY_NAME} bölgesinde ${tagLabel.toLowerCase()} hizmeti arayanlar için seçili koleksiyon.`}
      />
    </>
  )
}
