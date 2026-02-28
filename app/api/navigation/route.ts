import { NextRequest, NextResponse } from 'next/server'

// Varsayılan navigasyon ayarları
const defaultNavigation = {
  items: [
    { name: 'Ana Sayfa', href: '/', visible: true },
    { name: 'Koleksiyon', href: '/koleksiyonlar', visible: true },
    { name: 'Hakkımızda', href: '/hakkimizda', visible: true },
    { name: 'İletişim', href: '/iletisim', visible: true }
  ]
}

// Basit bir bellek içi depolama (gerçek uygulamada veritabanı kullanılmalı)
let navigationData = { ...defaultNavigation }

export async function GET() {
  return NextResponse.json(navigationData)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    navigationData = { ...navigationData, ...body }
    return NextResponse.json(navigationData)
  } catch {
    return NextResponse.json(
      { error: 'Geçersiz veri formatı' },
      { status: 400 }
    )
  }
}
