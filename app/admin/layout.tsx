import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Montserrat } from 'next/font/google'
import AdminShell from '../../src/components/admin/AdminShell'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-admin-montserrat',
})

export const metadata = {
  title: 'Admin Paneli - Su Perisi Güzellik Salonu',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let cookieHeader = ''
  try {
    const h = await headers()
    cookieHeader = h?.get('cookie') ?? ''
  } catch (err) {
    cookieHeader = ''
  }

  const isAuth = cookieHeader.split(';').map(s => s.trim()).some((c) => c.startsWith('admin-auth='))
  if (!isAuth) redirect('/login')

  return (
    <div className={`admin-shell min-h-screen bg-slate-50 text-slate-900 ${montserrat.className} ${montserrat.variable}`}>
      <AdminShell>{children}</AdminShell>
    </div>
  )
}
