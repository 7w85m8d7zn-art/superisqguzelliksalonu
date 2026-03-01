export const revalidate = 300

import type { Metadata } from 'next'
import { Manrope, Oswald } from 'next/font/google'
import './globals.css'
import VisitorTracker from '@/src/components/VisitorTracker'
import { LayoutWrapper } from '@/src/components/LayoutWrapper'
import { getSettings } from '@/src/lib/fetchers'

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
  title: 'Su Perisi Güzellik Salonu | Modern Kuaför Deneyimi',
  description: 'Su Perisi Güzellik Salonu: kesim, renklendirme ve bakım hizmetlerinde modern ve profesyonel yaklaşım.',
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

  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body className={`bg-cream text-gray-900 antialiased ${manrope.className} ${manrope.variable} ${oswald.variable}`}>
        <VisitorTracker />
        <LayoutWrapper settings={settings}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
