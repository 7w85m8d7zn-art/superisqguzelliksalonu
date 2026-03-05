export const revalidate = 300

import type { Metadata } from 'next'
import { ContactClient } from '@/src/components/ContactClient'
import { getContactData, getContactNumbers } from '@/src/lib/fetchers'
import { toAbsoluteUrl, truncateText } from '@/src/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const contactData = await getContactData()
  const title = 'Kırşehir İletişim ve Randevu'
  const description = truncateText(
    contactData.subtitle ||
      'Kırşehir Su Perisi Güzellik Salonu ile iletişime geçin, randevu oluşturun ve hizmetlerimiz hakkında bilgi alın.',
    158
  )

  return {
    title,
    description,
    alternates: {
      canonical: '/iletisim',
    },
    openGraph: {
      title: 'Kırşehir Su Perisi Güzellik Salonu İletişim',
      description,
      url: toAbsoluteUrl('/iletisim'),
      type: 'website',
    },
  }
}

export default async function ContactPage() {
  const [contactData, contactNumbers] = await Promise.all([getContactData(), getContactNumbers()])
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Su Perisi Güzellik Salonu İletişim',
    url: toAbsoluteUrl('/iletisim'),
    description: truncateText(contactData.subtitle || '', 220),
    telephone: contactNumbers.phone,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactClient settings={contactData} contactNumbers={contactNumbers} />
    </>
  )
}
