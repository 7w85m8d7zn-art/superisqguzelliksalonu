export const revalidate = 300

import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { ProductDetailClient } from '@/src/components/ProductDetailClient'
import { getContactNumbers, getProducts } from '@/src/lib/fetchers'
import { Product } from '@/src/types'
import {
  CITY_DISPLAY_NAME,
  extractProductIdFromSeoSlug,
  toAbsoluteUrl,
  truncateText,
} from '@/src/lib/seo'

interface PageProps {
  params: Promise<{ slug: string }>
}

const findProductBySlug = (products: Product[], incomingSlug: string): Product | null => {
  const normalizedSlug = incomingSlug.trim().toLowerCase()
  if (!normalizedSlug) return null

  const extractedId = extractProductIdFromSeoSlug(normalizedSlug)

  return (
    products.find((product) => product.slug.trim().toLowerCase() === normalizedSlug) ||
    products.find((product) => product.id.trim().toLowerCase() === normalizedSlug) ||
    (extractedId
      ? products.find((product) => product.id.trim().toLowerCase() === extractedId)
      : null) ||
    null
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const products = await getProducts()
  const product = findProductBySlug(products, slug)

  if (!product) {
    return {
      title: 'Hizmet Bulunamadı | Su Perisi Güzellik Salonu',
      description: 'Aradığınız hizmet bulunamadı.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const serviceName = product.name || 'Güzellik Hizmeti'
  const title = `${CITY_DISPLAY_NAME} ${serviceName} | Su Perisi Güzellik Salonu`
  const description = truncateText(
    product.description || `${CITY_DISPLAY_NAME} bölgesinde profesyonel ${serviceName.toLowerCase()} hizmeti.`,
    158
  )
  const canonicalPath = `/urun/${product.slug}`
  const primaryImage = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : ''

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    keywords: [
      `${CITY_DISPLAY_NAME} ${serviceName}`,
      `${CITY_DISPLAY_NAME} güzellik salonu`,
      `${CITY_DISPLAY_NAME} randevu`,
      'su perisi güzellik salonu',
    ],
    openGraph: {
      title,
      description,
      url: toAbsoluteUrl(canonicalPath),
      type: 'article',
      locale: 'tr_TR',
      siteName: 'Su Perisi Güzellik Salonu',
      images: primaryImage
        ? [
            {
              url: toAbsoluteUrl(primaryImage),
              alt: `${CITY_DISPLAY_NAME} ${serviceName}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: primaryImage ? [toAbsoluteUrl(primaryImage)] : undefined,
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [products, contactNumbers] = await Promise.all([getProducts(), getContactNumbers()])

  const product = findProductBySlug(products, slug)

  if (!product) {
    notFound()
  }

  if (product.slug !== slug) {
    permanentRedirect(`/urun/${product.slug}`)
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${CITY_DISPLAY_NAME} ${product.name}`,
    description: truncateText(product.description || `${CITY_DISPLAY_NAME} bölgesinde güzellik hizmeti`, 250),
    areaServed: {
      '@type': 'City',
      name: CITY_DISPLAY_NAME,
    },
    provider: {
      '@type': 'BeautySalon',
      name: 'Su Perisi Güzellik Salonu',
      url: toAbsoluteUrl('/'),
      telephone: contactNumbers.phone,
    },
    url: toAbsoluteUrl(`/urun/${product.slug}`),
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
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: toAbsoluteUrl(`/urun/${product.slug}`),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient product={product} allProducts={products} contactNumbers={contactNumbers} />
    </>
  )
}
