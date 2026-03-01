import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, supabaseServer } from '../../../src/lib/supabaseServer'
import { products as localProducts } from '../../../src/data/products'
import { revalidatePath } from 'next/cache'
import {
  getFallbackSettingValueByKey,
  upsertFallbackSetting,
} from '@/src/lib/fallbackSettingsStore'

const defaultHomepage = {
  hero_title: 'Profesyonel Kadın Kuaför & Stil Hizmetleri',
  hero_subtitle: 'Kesim, renklendirme ve özel gün saç tasarımlarında uzman ekibimizle tanışın',
  hero_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=2000',
  hero_cta_text: 'Hizmetleri Gör',
  hero_cta_link: '/koleksiyonlar',
  hero_brightness: 0.5,
  cta_band_title: 'Randevunuzu Kolayca Oluşturun',
  cta_band_description: 'WhatsApp veya telefon üzerinden hızlı randevu talebi bırakın, ekibimiz en kısa sürede size dönüş yapsın.',
  cta_band_button_text: 'Randevu Al',
  cta_band_button_link: '/iletisim',
  cta_band_image: '',

  why_us_title: 'Neden Su Perisi Güzellik Salonu?',
  why_us_subtitle: 'Binlerce müşteri bize güvendi',
  why_us_item1_title: 'Uzman Ekip',
  why_us_item1_desc: 'Deneyimli kuaför ekibimizle kesim, fön, renklendirme ve bakımda profesyonel sonuçlar',
  why_us_item2_title: 'Renk & Balayage',
  why_us_item2_desc: 'Doğal geçişler, modern tonlar ve saç tipinize uygun tekniklerle kişiye özel renk uygulamaları',
  why_us_item3_title: 'Saç Bakım Protokolleri',
  why_us_item3_desc: 'Keratin, saç botoksu ve onarıcı bakımlarla sağlıklı, parlak ve güçlü saç görünümü',

  showroom_title: 'Salonumuzu Ziyaret Edin',
  showroom_description: 'Profesyonel saç kesimi, renklendirme, fön ve bakım hizmetlerimizi yakından deneyimlemek için salonumuzu ziyaret edin.',
  showroom_image: '',

  featured_products: localProducts.filter(p => p.featured).map(p => p.id),
}

async function getLatestHomepageSetting() {
  if (!isSupabaseConfigured) {
    const value = await getFallbackSettingValueByKey('homepage_data')
    return { value, error: null }
  }

  const { data, error } = await supabaseServer
    .from('settings')
    .select('value')
    .eq('key', 'homepage_data')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    return { value: null, error }
  }

  return { value: data?.value ?? null, error: null }
}

export async function GET() {
  try {
    const { value, error } = await getLatestHomepageSetting()

    if (error || !value) {
      console.warn('Homepage data not found in settings, using defaults')
      return NextResponse.json(defaultHomepage)
    }

    const homepageData = typeof value === 'string' ? JSON.parse(value) : value
    return NextResponse.json({ ...defaultHomepage, ...homepageData })
  } catch (err: any) {
    console.warn('Homepage GET failed:', err?.message || err)
    return NextResponse.json(defaultHomepage)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('PUT request body:', body)

    // Filter out empty values to preserve existing data
    const filteredData: any = {}
    for (const [key, value] of Object.entries(body)) {
      // Only include non-empty values
      if (value !== '' && value !== null && value !== undefined) {
        // For arrays, only include if not empty
        if (Array.isArray(value)) {
          if (value.length > 0) {
            filteredData[key] = value
          }
        } else {
          filteredData[key] = value
        }
      }
    }

    // Fetch existing data to merge with
    const { value: existingValue } = await getLatestHomepageSetting()

    const existingData = existingValue
      ? (typeof existingValue === 'string' ? JSON.parse(existingValue) : existingValue)
      : {}

    // Merge: existing data + new non-empty values
    const mergedData = { ...existingData, ...filteredData }

    if (!isSupabaseConfigured) {
      await upsertFallbackSetting('homepage_data', mergedData)
      revalidatePath('/')
      return NextResponse.json(mergedData)
    }

    // 1) Try update first to avoid relying on a DB unique constraint.
    const { data: updatedRows, error: updateError } = await supabaseServer
      .from('settings')
      .update({
        value: mergedData,
        updated_at: new Date().toISOString(),
      })
      .eq('key', 'homepage_data')
      .select()

    if (updateError) {
      console.warn('Supabase homepage update step failed:', updateError.message)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    if (!updatedRows || updatedRows.length === 0) {
      const { error: insertError } = await supabaseServer
        .from('settings')
        .insert({
          key: 'homepage_data',
          value: mergedData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        console.warn('Supabase homepage insert step failed:', insertError.message)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
    }

    revalidatePath('/')

    console.log('Homepage update successful')
    return NextResponse.json(mergedData)
  } catch (err: any) {
    console.error('PUT error:', err)
    return NextResponse.json({ error: err?.message || 'Invalid JSON' }, { status: 400 })
  }
}
