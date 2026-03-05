export const revalidate = 300

import type { Metadata } from 'next'
import { Manrope, Oswald } from 'next/font/google'
import './globals.css'
import VisitorTracker from '@/src/components/VisitorTracker'
import { LayoutWrapper } from '@/src/components/LayoutWrapper'
import { getSettings } from '@/src/lib/fetchers'
import { SITE_URL, toAbsoluteUrl } from '@/src/lib/seo'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
})

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-heading',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Kırşehir Su Perisi Güzellik Salonu | Profesyonel Güzellik Hizmetleri',
    template: '%s | Su Perisi Güzellik Salonu',
  },
  description:
    'Kırşehir Su Perisi Güzellik Salonu: cilt bakımı, kalıcı makyaj, kirpik, tırnak ve diğer profesyonel güzellik hizmetleri.',
  keywords: [
    'kırşehir güzellik salonu',
    'kırşehir cilt bakımı',
    'kırşehir kalıcı makyaj',
    'kırşehir protez tırnak',
    'su perisi güzellik salonu',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kırşehir Su Perisi Güzellik Salonu',
    description:
      'Kırşehirde profesyonel güzellik hizmetleri: cilt bakımı, kalıcı makyaj, kirpik, manikür, pedikür ve daha fazlası.',
    url: toAbsoluteUrl('/'),
    siteName: 'Su Perisi Güzellik Salonu',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kırşehir Su Perisi Güzellik Salonu',
    description:
      'Kırşehirde profesyonel güzellik hizmetleri: cilt bakımı, kalıcı makyaj, kirpik, manikür ve pedikür.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico?v=1',
    shortcut: '/favicon.ico?v=1',
    apple: '/favicon.ico?v=1',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  const footerAddress = settings.footer.footer_address || 'Kırşehir Türkiye'
  const businessPhone = settings.contact_numbers.phone || settings.contact_numbers.whatsapp_display || ''
  const whatsappNumber = settings.contact_numbers.whatsapp_number || ''

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: 'Su Perisi Güzellik Salonu',
    url: SITE_URL,
    image: toAbsoluteUrl('/favicon.ico?v=1'),
    telephone: businessPhone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kırşehir',
      addressCountry: 'TR',
      streetAddress: footerAddress,
    },
    areaServed: {
      '@type': 'City',
      name: 'Kırşehir',
    },
    sameAs: [],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: businessPhone,
      },
      ...(whatsappNumber
        ? [
            {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              url: `https://wa.me/${whatsappNumber}`,
            },
          ]
        : []),
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Su Perisi Güzellik Salonu',
    url: SITE_URL,
    inLanguage: 'tr-TR',
  }

  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body className={`bg-cream text-gray-900 antialiased ${manrope.className} ${manrope.variable} ${oswald.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <VisitorTracker />
        <LayoutWrapper settings={settings}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
