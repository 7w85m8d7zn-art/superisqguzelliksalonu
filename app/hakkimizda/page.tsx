export const revalidate = 300

import type { Metadata } from 'next'
import { AboutClient } from '@/src/components/AboutClient'
import { getAboutData, getContactNumbers } from '@/src/lib/fetchers'
import { toAbsoluteUrl, truncateText } from '@/src/lib/seo'

export const metadata: Metadata = {
  title: 'Kırşehir Hakkımızda',
  description:
    'Kırşehir Su Perisi Güzellik Salonu hakkında bilgi alın. Deneyimli ekibimiz ve profesyonel güzellik yaklaşımımızla hizmet veriyoruz.',
  alternates: {
    canonical: '/hakkimizda',
  },
  openGraph: {
    title: 'Kırşehir Su Perisi Güzellik Salonu Hakkımızda',
    description:
      'Kırşehirde profesyonel güzellik hizmeti sunan Su Perisi Güzellik Salonu hakkında detaylı bilgi.',
    url: toAbsoluteUrl('/hakkimizda'),
    type: 'website',
  },
}

export default async function AboutPage() {
  const [aboutData, contactNumbers] = await Promise.all([getAboutData(), getContactNumbers()])
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Su Perisi Güzellik Salonu Hakkımızda',
    description: truncateText(aboutData.subtitle || '', 220),
    url: toAbsoluteUrl('/hakkimizda'),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AboutClient about={aboutData} contactNumbers={contactNumbers} />
    </>
  )
}
