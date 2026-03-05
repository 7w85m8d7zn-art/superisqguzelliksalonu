export const revalidate = 300

import type { Metadata } from 'next'
import { HeroSection } from '@/src/components/HeroSection'
import { FeaturedGrid } from '@/src/components/FeaturedGrid'
import { WhyUsSection } from '@/src/components/WhyUsSection'
import { ShowroomSection } from '@/src/components/ShowroomSection'
import { BookingStripSection } from '@/src/components/BookingStripSection'
import { StickyButtons } from '@/src/components/StickyButtons'
import { getContactNumbers, getHomepageData, getProducts } from '@/src/lib/fetchers'
import { toAbsoluteUrl } from '@/src/lib/seo'

export const metadata: Metadata = {
  title: 'Kırşehir Güzellik Salonu Hizmetleri',
  description:
    'Kırşehir Su Perisi Güzellik Salonu: cilt bakımı, kalıcı makyaj, kirpik, tırnak ve profesyonel güzellik hizmetleri.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kırşehir Su Perisi Güzellik Salonu',
    description:
      'Kırşehirde randevu ile profesyonel güzellik hizmetleri. Cilt bakımı, kalıcı makyaj, kirpik, manikür, pedikür ve daha fazlası.',
    url: toAbsoluteUrl('/'),
    type: 'website',
  },
}

export default async function Home() {
  const homepageBuffer = getHomepageData()
  const productsBuffer = getProducts()
  const contactNumbersBuffer = getContactNumbers()
  const [homepageData, products, contactNumbers] = await Promise.all([
    homepageBuffer,
    productsBuffer,
    contactNumbersBuffer,
  ])

  const featuredIds = homepageData.featured_products || []
  const featuredProducts = products.filter(p => featuredIds.includes(p.id) || p.featured)
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
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main>
        <HeroSection hero={homepageData} />
        <FeaturedGrid products={featuredProducts} />
        <BookingStripSection data={homepageData} />
        <WhyUsSection data={homepageData} />
        <ShowroomSection data={homepageData} />
      </main>
      <StickyButtons contactNumbers={contactNumbers} />
    </>
  )
}
