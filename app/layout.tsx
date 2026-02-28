export const revalidate = 300

import type { Metadata } from 'next'
import { Montserrat, Poppins } from 'next/font/google'
import './globals.css'
import VisitorTracker from '@/src/components/VisitorTracker'
import { LayoutWrapper } from '@/src/components/LayoutWrapper'
import { getSettings } from '@/src/lib/fetchers'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Su Perisi Güzellik Salonu - Profesyonel Saç Hizmetleri',
  description: 'Su Perisi Güzellik Salonui - kesim, renklendirme ve özel gün hizmetleri',
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
      <body className={`bg-cream text-gray-900 antialiased ${poppins.className} ${montserrat.variable}`}>
        <VisitorTracker />
        <LayoutWrapper settings={settings}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
