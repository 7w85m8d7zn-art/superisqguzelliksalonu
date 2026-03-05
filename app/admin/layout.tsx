import React from 'react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminShell from '../../src/components/admin/AdminShell'

export const metadata: Metadata = {
  title: 'Admin Paneli - Su Perisi Güzellik Salonu',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let cookieHeader = ''
  try {
    const h = await headers()
    cookieHeader = h?.get('cookie') ?? ''
  } catch {
    cookieHeader = ''
  }

  const isAuth = cookieHeader.split(';').map(s => s.trim()).some((c) => c.startsWith('admin-auth='))
  if (!isAuth) redirect('/login')

  return (
    <div className="admin-shell min-h-screen bg-[#f4f1eb] text-[#111319]">
      <AdminShell>{children}</AdminShell>
    </div>
  )
}
