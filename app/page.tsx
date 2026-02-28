export const revalidate = 300

import { HeroSection } from '@/src/components/HeroSection'
import { FeaturedGrid } from '@/src/components/FeaturedGrid'
import { WhyUsSection } from '@/src/components/WhyUsSection'
import { ShowroomSection } from '@/src/components/ShowroomSection'
import { StickyButtons } from '@/src/components/StickyButtons'
import { getContactNumbers, getHomepageData, getProducts } from '@/src/lib/fetchers'

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

  return (
    <>
      <main>
        <HeroSection hero={homepageData} />
        <FeaturedGrid products={featuredProducts} />
        <WhyUsSection data={homepageData} />
        <ShowroomSection data={homepageData} />
      </main>
      <StickyButtons contactNumbers={contactNumbers} />
    </>
  )
}
