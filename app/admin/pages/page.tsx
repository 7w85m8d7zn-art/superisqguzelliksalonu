"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/src/components/admin/ImageUploader'

export default function PagesAdmin() {
  const router = useRouter()

  const parseJsonLike = <T extends Record<string, any>>(value: unknown): Partial<T> => {
    if (!value) return {}
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as Partial<T>
      } catch (error) {
        console.warn('JSON parse hatası:', error)
        return {}
      }
    }
    if (typeof value === 'object') {
      return value as Partial<T>
    }
    return {}
  }


  // Site Başı (Header)
  const [header, setHeader] = useState({
    header_logo_text: 'Su Perisi Güzellik Salonu',
    header_menu_anasayfa: 'Ana Sayfa',
    header_menu_koleksiyon: 'Koleksiyon',
    header_phone: '0543 516 70 11',
    header_whatsapp: '905435167011',
    header_menu_hakkimizda: 'Hakkımızda',
    header_menu_iletisim: 'Randevu Oluşltur',
  })

  // ... (existing code)


  const [footer, setFooter] = useState({
    footer_brand_name: 'Su Perisi Güzellik Salonu',
    footer_brand_description: 'Profesyonel kadın saç ve kuaför hizmetleri',
    footer_text: '© 2025 Su Perisi Güzellik Salonu. Tüm hakları saklıdır.',
    footer_address: 'Kırşehir Türkiye',
    footer_whatsapp: '05435167011',
    footer_social_instagram: '',
    footer_social_facebook: '',
    footer_menu_hakkimizda: 'Hakkımızda',
    footer_menu_iletisim: 'Randevu Oluşltur',
  })

  // Ana Sayfa
  const [homepage, setHomepage] = useState({
    hero_title: 'Profesyonel Kadın Kuaför & Stil Hizmetleri',
    hero_subtitle: 'Kesim, renklendirme ve özel gün saç tasarımlarında uzman ekibimizle tanışın',
    hero_image: '',
    hero_cta_text: 'Hizmetleri Gör',
    hero_cta_link: '/koleksiyonlar',
    cta_band_title: 'Randevunuzu Kolayca Oluşturun',
    cta_band_description: 'WhatsApp veya telefon üzerinden hızlı randevu talebi bırakın, ekibimiz en kısa sürede size dönüş yapsın.',
    cta_band_button_text: 'Randevu Al',
    cta_band_button_link: '/iletisim',
    cta_band_image: '',
    featured_products: [] as string[],
    why_us_title: 'Neden Salonumuz?',
    why_us_subtitle: 'Binlerce müşteri bize güvendi',
    why_us_item1_title: 'Uzman Ekip',
    why_us_item1_desc: 'Deneyimli kuaför ekibimizle kesim, fön, renklendirme ve bakımda profesyonel sonuçlar',
    why_us_item2_title: 'Renk & Balayage',
    why_us_item2_desc: 'Doğal geçişler, modern tonlar ve saç tipinize uygun tekniklerle kişiye özel renk uygulamaları',
    why_us_item3_title: 'Saç Bakım Protokolleri',
    why_us_item3_desc: 'Keratin, saç botoksu ve onarıcı bakımlarla sağlıklı, parlak ve güçlü saç görünümü',
    showroom_title: 'Salonumuzu Ziyaret Edin',
    showroom_description: 'Profesyonel saç kesimi, renklendirme, fön ve bakım hizmetlerimizi yakından deneyimlemek için salonumuzu ziyaret edin. Uzman ekibimiz saç analizi yaparak size en uygun stil ve bakım önerilerini sunar.',
    showroom_image: '',
  })

  // Hakkımızda
  const [hakkimizda, setHakkimizda] = useState({
    title: 'Hakkımızda',
    subtitle: 'Su Perisi Güzellik Salonu, kadın kuaför ve güzellik hizmetlerinde yüksek kalite ve modern stilin adresidir.',
    content: `2010 yılında kurulan Dijital Showroom, kadın saç kesimi, renklendirme, fön ve bakım hizmetlerinde Kırşehir'in en sevilen salonlarından biridir.

Deneyimli ekibimiz; saç kesimi, boya-balayage, keratin bakımı ve profesyonel saç tasarımıyla her müşteriye yüz hatlarına ve tarzına uygun, kişiye özel bir görünüm sunar. Kaliteli Model ve hijyen odaklı yaklaşımımız, Dijital Showroom'un imza stilini oluşturur.`,
    image: '',
    feature1_title: 'Profesyonel Saç Bakımı',
    feature1_desc: 'Saçınıza uygun bakım protokolleri ve kaliteli Modelle sağlıklı görünüm',
    feature2_title: 'Renk & Balayage',
    feature2_desc: 'Doğal geçişler, modern tonlar ve size özel renk danışmanlığı',
    feature3_title: 'Stil Danışmanlığı',
    feature3_desc: 'Yüz şeklinize ve tarzınıza uygun kesim ve saç tasarımı önerileri',
  })

  // İletişim
  const [iletisim, setIletisim] = useState({
    title: 'Randevu & İletişim',
    subtitle: 'Sorularınız mı var? Hizmetlerimiz hakkında bilgi almak veya randevu oluşturmak için bizimle iletişime geçin. En kısa sürede yanıt vereceğiz.',
    address: 'Kırşehir Türkiye',
    phone: '0543 516 70 11',
    whatsapp: '0543 516 70 11',
    email: 'info@dijitalshowroom.com',
    hours: 'Pazartesi - Pazar\n10:00 - 19:00',
    form_title: 'Bize Ulaşın',
    form_submit_text: 'Mesaj Gönder',
    whatsapp_button_text: "WhatsApp'tan Hızlıca Yazın",
    map_location: 'Kırşehir',
  })

  const [contactNumbers, setContactNumbers] = useState({
    phone: '0543 516 70 11',
    whatsapp_display: '0543 516 70 11',
    whatsapp_number: '905435167011',
    whatsapp_message: 'Merhaba, randevu almak istiyorum.',
  })

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('ana-sayfa')
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' })

  const tabs = [
    { id: 'ana-sayfa', name: 'Ana Sayfa' },
    { id: 'hakkimizda', name: 'Hakkımızda' },
    { id: 'iletisim', name: 'İletişim' },
    { id: 'numaralar', name: 'Numaralar' },
    { id: 'site-basi', name: 'Site Başı (Header)' },
    { id: 'site-sonu', name: 'Site Sonu (Footer)' },
  ]

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted) {
      fetchAll()
      setMounted(true)
    }
  }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      // Settings API'den tüm verileri çek
      const settingsRes = await fetch('/api/settings', { cache: 'no-store' })
      const settings = await settingsRes.json()



      // Header - varsayılan değerlerle birleştir
      if (settings.header) {
        const parsed = parseJsonLike<typeof header>(settings.header)
        setHeader(prev => ({
          ...prev,
          header_logo_text: parsed.header_logo_text || 'Su Perisi Güzellik Salonu',
          header_menu_anasayfa: parsed.header_menu_anasayfa || 'Ana Sayfa',
          header_menu_koleksiyon: parsed.header_menu_koleksiyon || 'Koleksiyon',
          header_menu_hakkimizda: parsed.header_menu_hakkimizda || '',
          header_menu_iletisim: parsed.header_menu_iletisim || '',
        }))
      }

      // Footer - varsayılan değerlerle birleştir
      if (settings.footer) {
        const parsed = parseJsonLike<typeof footer>(settings.footer)
        setFooter(prev => ({
          ...prev,
          footer_brand_name: parsed.footer_brand_name || '',
          footer_brand_description: parsed.footer_brand_description || '',
          footer_text: parsed.footer_text || '',
          footer_address: parsed.footer_address || '',
          footer_whatsapp: parsed.footer_whatsapp || '',
          footer_social_instagram: parsed.footer_social_instagram || '',
          footer_social_facebook: parsed.footer_social_facebook || '',
          footer_menu_hakkimizda: parsed.footer_menu_hakkimizda || '',
          footer_menu_iletisim: parsed.footer_menu_iletisim || '',
        }))
      }

      // Ana Sayfa
      const hpRes = await fetch('/api/homepage', { cache: 'no-store' })
      const hp = await hpRes.json()
      setHomepage(prev => ({
        ...prev,
        hero_title: hp.hero_title || '',
        hero_subtitle: hp.hero_subtitle || '',
        hero_image: hp.hero_image || '',
        hero_cta_text: hp.hero_cta_text || '',
        hero_cta_link: hp.hero_cta_link || '',
        cta_band_title: hp.cta_band_title || '',
        cta_band_description: hp.cta_band_description || '',
        cta_band_button_text: hp.cta_band_button_text || '',
        cta_band_button_link: hp.cta_band_button_link || '',
        cta_band_image: hp.cta_band_image || '',
        featured_products: hp.featured_products || [],
        why_us_title: hp.why_us_title || '',
        why_us_subtitle: hp.why_us_subtitle || '',
        why_us_item1_title: hp.why_us_item1_title || '',
        why_us_item1_desc: hp.why_us_item1_desc || '',
        why_us_item2_title: hp.why_us_item2_title || '',
        why_us_item2_desc: hp.why_us_item2_desc || '',
        why_us_item3_title: hp.why_us_item3_title || '',
        why_us_item3_desc: hp.why_us_item3_desc || '',
        showroom_title: hp.showroom_title || '',
        showroom_description: hp.showroom_description || '',
        showroom_image: hp.showroom_image || ''
      }))

      // Hakkımızda - varsayılan değerlerle birleştir
      if (settings.hakkimizda_data) {
        const parsed = parseJsonLike<typeof hakkimizda>(settings.hakkimizda_data)
        setHakkimizda(prev => ({
          ...prev,
          title: parsed.title || '',
          subtitle: parsed.subtitle || '',
          content: parsed.content || '',
          image: parsed.image || '',
          feature1_title: parsed.feature1_title || '',
          feature1_desc: parsed.feature1_desc || '',
          feature2_title: parsed.feature2_title || '',
          feature2_desc: parsed.feature2_desc || '',
          feature3_title: parsed.feature3_title || '',
          feature3_desc: parsed.feature3_desc || ''
        }))
      }

      // İletişim - varsayılan değerlerle birleştir
      if (settings.iletisim_data) {
        const parsed = parseJsonLike<typeof iletisim>(settings.iletisim_data)
        setIletisim(prev => ({
          ...prev,
          title: parsed.title || '',
          subtitle: parsed.subtitle || '',
          address: parsed.address || '',
          phone: parsed.phone || '',
          whatsapp: parsed.whatsapp || '',
          email: parsed.email || '',
          hours: parsed.hours || '',
          form_title: parsed.form_title || '',
          form_submit_text: parsed.form_submit_text || '',
          whatsapp_button_text: parsed.whatsapp_button_text || '',
          map_location: parsed.map_location || ''
        }))
      }

      if (settings.contact_numbers) {
        const parsed = parseJsonLike<typeof contactNumbers>(settings.contact_numbers)
        setContactNumbers(prev => ({
          ...prev,
          phone: parsed.phone || prev.phone,
          whatsapp_display: parsed.whatsapp_display || parsed.phone || prev.whatsapp_display,
          whatsapp_number: parsed.whatsapp_number || prev.whatsapp_number,
          whatsapp_message: parsed.whatsapp_message || prev.whatsapp_message,
        }))
      }

      // Modeli çek
      const productsRes = await fetch('/api/products', { cache: 'no-store' })
      const productsData = await productsRes.json()
      setProducts(productsData || [])
    } catch (err) {
      console.error('Fetch error:', err)
    }
    setLoading(false)
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000)
  }

  async function saveAll() {
    // Eğer zaten yükleniyorsa kaydetmeyi engelle
    if (loading) {
      console.log('Save already in progress, skipping...')
      return
    }

    setLoading(true)
    const errors: string[] = []

    try {


      // Header kaydet
      try {
        const res2 = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'header', value: JSON.stringify(header) }),
        })
        if (!res2.ok) errors.push('Header')
      } catch (e) {
        console.error('Header save error:', e)
        errors.push('Header')
      }

      // Footer kaydet
      try {
        const res3 = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'footer', value: JSON.stringify(footer) }),
        })
        if (!res3.ok) errors.push('Footer')
      } catch (e) {
        console.error('Footer save error:', e)
        errors.push('Footer')
      }

      // Ana sayfa verilerini kaydet
      try {
        const res4 = await fetch('/api/homepage', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(homepage),
        })
        if (!res4.ok) errors.push('Ana sayfa')
      } catch (e) {
        console.error('Homepage save error:', e)
        errors.push('Ana sayfa')
      }

      // Hakkımızda verilerini kaydet
      try {
        const res5 = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'hakkimizda_data', value: JSON.stringify(hakkimizda) }),
        })
        if (!res5.ok) errors.push('Hakkımızda')
      } catch (e) {
        console.error('Hakkimizda save error:', e)
        errors.push('Hakkımızda')
      }

      // Randevu Oluşltur verilerini kaydet
      try {
        const res6 = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'iletisim_data', value: JSON.stringify(iletisim) }),
        })
        if (!res6.ok) errors.push('Randevu Oluşltur')
      } catch (e) {
        console.error('Iletisim save error:', e)
        errors.push('Randevu Oluşltur')
      }

      // Numaralar kaydet
      try {
        const res7 = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'contact_numbers', value: JSON.stringify(contactNumbers) }),
        })
        if (!res7.ok) errors.push('Numaralar')
      } catch (e) {
        console.error('Contact numbers save error:', e)
        errors.push('Numaralar')
      }

      if (errors.length > 0) {
        showNotification(`Bazı kayıtlar başarısız: ${errors.join(', ')}`, 'error')
      } else {
        showNotification('Tüm değişiklikler başarıyla kaydedildi!', 'success')
        // Cache'i temizle ve sayfaları yenile
        router.refresh()
        // Revalidation: tüm sayfaları yeniden oluştur
        const pathsToRevalidate = ['/', '/hakkimizda', '/iletisim', '/koleksiyonlar']
        await Promise.all(
          pathsToRevalidate.map(path =>
            fetch(`/api/revalidate?path=${encodeURIComponent(path)}`, { method: 'POST' }).catch(() => { })
          )
        )
      }
    } catch (e) {
      console.error('Genel save error:', e)
      showNotification('Kaydetme hatası! Lütfen tekrar deneyin.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white border-l-4 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
          }`}>
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}>
              {notification.type === 'success' ? (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="admin-editor mx-auto max-w-6xl p-1 md:p-2">
        <button
          onClick={saveAll}
          disabled={loading}
          className="admin-btn-primary fixed bottom-4 right-4 z-[85] inline-flex min-w-[132px] items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold shadow-[0_16px_28px_-18px_rgba(17,19,25,0.8)] disabled:cursor-not-allowed disabled:opacity-60 md:bottom-auto md:right-6 md:top-[96px]"
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>

        {/* Header */}
        <div className="sticky top-2 z-30 mb-4 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-nowrap">
          <div>
            <h1 className="admin-page-title mb-1">Sayfa Editörü</h1>
            <p className="admin-page-subtitle">Site sayfalarını ve genel içerikleri tek panelden yönetin.</p>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="sticky top-[96px] z-20 mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`admin-tab-label inline-flex w-full items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-center transition-colors ${activeTab === tab.id ? 'admin-btn-primary' : 'admin-btn-outline'
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* İçerik */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {activeTab === 'site-basi' && (
            <div>
              <h2 className="admin-section-title mb-4">Site Başı (Header)</h2>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-medium mb-1">Logo Metni</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={header.header_logo_text}
                    onChange={(e) => setHeader({ ...header, header_logo_text: e.target.value })} placeholder="Su Perisi Güzellik Salonu" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Menü - Ana Sayfa</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={header.header_menu_anasayfa}
                    onChange={(e) => setHeader({ ...header, header_menu_anasayfa: e.target.value })} placeholder="Ana Sayfa" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Menü - Koleksiyon</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={header.header_menu_koleksiyon}
                    onChange={(e) => setHeader({ ...header, header_menu_koleksiyon: e.target.value })} placeholder="Koleksiyon" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Menü - Hakkımızda</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={header.header_menu_hakkimizda}
                    onChange={(e) => setHeader({ ...header, header_menu_hakkimizda: e.target.value })} placeholder="Hakkımızda" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Menü - Randevu Oluşltur</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={header.header_menu_iletisim}
                    onChange={(e) => setHeader({ ...header, header_menu_iletisim: e.target.value })} placeholder="Randevu Oluşltur" />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'site-sonu' && (
            <div>
              <h2 className="admin-section-title mb-4">Site Sonu (Footer)</h2>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-medium mb-1">Marka Adı</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={footer.footer_brand_name}
                    onChange={(e) => setFooter({ ...footer, footer_brand_name: e.target.value })} placeholder="Su Perisi Güzellik Salonu" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Marka Açıklaması</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={footer.footer_brand_description}
                    onChange={(e) => setFooter({ ...footer, footer_brand_description: e.target.value })} placeholder="Profesyonel kadın saç ve kuaför hizmetleri" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Menü - Hakkımızda</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={footer.footer_menu_hakkimizda}
                    onChange={(e) => setFooter({ ...footer, footer_menu_hakkimizda: e.target.value })} placeholder="Hakkımızda" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Menü - Randevu Oluşltur</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={footer.footer_menu_iletisim}
                    onChange={(e) => setFooter({ ...footer, footer_menu_iletisim: e.target.value })} placeholder="Randevu Oluşltur" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adres</label>
                  <textarea className="w-full border rounded px-3 py-2" rows={2} value={footer.footer_address}
                    onChange={(e) => setFooter({ ...footer, footer_address: e.target.value })} placeholder="Kırşehir Türkiye" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">WhatsApp Numarası (Görünür)</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={footer.footer_whatsapp}
                    onChange={(e) => setFooter({ ...footer, footer_whatsapp: e.target.value })} placeholder="05435167011" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Footer Copyright Metni</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={footer.footer_text}
                    onChange={(e) => setFooter({ ...footer, footer_text: e.target.value })} placeholder="© 2025 Su Perisi Güzellik Salonu. Tüm hakları saklıdır." />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ana-sayfa' && (
            <div>
              <h2 className="admin-section-title mb-4">Ana Sayfa</h2>

              {/* Hero Bölümü */}
              <div className="mb-8 pb-6 border-b">
                <h3 className="admin-section-subtitle mb-4">Hero Bölümü</h3>
                <div className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium mb-1">Başlık</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={homepage.hero_title}
                      onChange={(e) => setHomepage({ ...homepage, hero_title: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Alt Başlık</label>
                    <textarea className="w-full border rounded px-3 py-2" rows={2} value={homepage.hero_subtitle}
                      onChange={(e) => setHomepage({ ...homepage, hero_subtitle: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hero Görseli (URL)</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={homepage.hero_image}
                      onChange={(e) => setHomepage({ ...homepage, hero_image: e.target.value })} placeholder="https://images.unsplash.com/..." />
                    <div className="mt-2">
                      <ImageUploader
                        onPreviews={(previews) => {
                          if (!previews.length) return
                          setHomepage({ ...homepage, hero_image: previews[0] })
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Buton Yazısı</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={homepage.hero_cta_text}
                        onChange={(e) => setHomepage({ ...homepage, hero_cta_text: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Buton Linki</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={homepage.hero_cta_link}
                        onChange={(e) => setHomepage({ ...homepage, hero_cta_link: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Randevu Bilgi Bandı */}
              <div className="mb-8 pb-6 border-b">
                <h3 className="admin-section-subtitle mb-4">Randevu Bilgi Bandı</h3>
                <div className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium mb-1">Başlık</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={homepage.cta_band_title}
                      onChange={(e) => setHomepage({ ...homepage, cta_band_title: e.target.value })}
                      placeholder="Randevunuzu Kolayca Oluşturun"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Açıklama</label>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      rows={3}
                      value={homepage.cta_band_description}
                      onChange={(e) => setHomepage({ ...homepage, cta_band_description: e.target.value })}
                      placeholder="WhatsApp veya telefon üzerinden hızlı randevu talebi bırakın."
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Buton Yazısı</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={homepage.cta_band_button_text}
                        onChange={(e) => setHomepage({ ...homepage, cta_band_button_text: e.target.value })}
                        placeholder="Randevu Al"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Buton Linki</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={homepage.cta_band_button_link}
                        onChange={(e) => setHomepage({ ...homepage, cta_band_button_link: e.target.value })}
                        placeholder="/iletisim"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Arkaplan Görseli (URL)</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={homepage.cta_band_image}
                      onChange={(e) => setHomepage({ ...homepage, cta_band_image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <div className="mt-2">
                      <ImageUploader
                        onPreviews={(previews) => {
                          if (!previews.length) return
                          setHomepage({ ...homepage, cta_band_image: previews[0] })
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Neden Salonumuz */}
              <div className="mb-8 pb-6 border-b">
                <h3 className="admin-section-subtitle mb-4">Neden Salonumuz?</h3>
                <div className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium mb-1">Bölüm Başlığı</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={homepage.why_us_title}
                      onChange={(e) => setHomepage({ ...homepage, why_us_title: e.target.value })} placeholder="Neden Salonumuz?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Alt Başlık</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={homepage.why_us_subtitle}
                      onChange={(e) => setHomepage({ ...homepage, why_us_subtitle: e.target.value })} placeholder="Binlerce müşteri bize güvendi" />
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <label className="block text-sm font-medium mb-1">Özellik 1 - Başlık</label>
                    <input type="text" className="w-full border rounded px-3 py-2 mb-2" value={homepage.why_us_item1_title}
                      onChange={(e) => setHomepage({ ...homepage, why_us_item1_title: e.target.value })} placeholder="Uzman Ekip" />
                    <label className="block text-sm font-medium mb-1">Özellik 1 - Açıklama</label>
                    <textarea className="w-full border rounded px-3 py-2" rows={2} value={homepage.why_us_item1_desc}
                      onChange={(e) => setHomepage({ ...homepage, why_us_item1_desc: e.target.value })} />
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <label className="block text-sm font-medium mb-1">Özellik 2 - Başlık</label>
                    <input type="text" className="w-full border rounded px-3 py-2 mb-2" value={homepage.why_us_item2_title}
                      onChange={(e) => setHomepage({ ...homepage, why_us_item2_title: e.target.value })} placeholder="Renk & Balayage" />
                    <label className="block text-sm font-medium mb-1">Özellik 2 - Açıklama</label>
                    <textarea className="w-full border rounded px-3 py-2" rows={2} value={homepage.why_us_item2_desc}
                      onChange={(e) => setHomepage({ ...homepage, why_us_item2_desc: e.target.value })} />
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <label className="block text-sm font-medium mb-1">Özellik 3 - Başlık</label>
                    <input type="text" className="w-full border rounded px-3 py-2 mb-2" value={homepage.why_us_item3_title}
                      onChange={(e) => setHomepage({ ...homepage, why_us_item3_title: e.target.value })} placeholder="Saç Bakım Protokolleri" />
                    <label className="block text-sm font-medium mb-1">Özellik 3 - Açıklama</label>
                    <textarea className="w-full border rounded px-3 py-2" rows={2} value={homepage.why_us_item3_desc}
                      onChange={(e) => setHomepage({ ...homepage, why_us_item3_desc: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Salonumuzu Ziyaret Edin */}
              <div className="mb-8 pb-6 border-b">
                <h3 className="admin-section-subtitle mb-4">Salonumuzu Ziyaret Edin</h3>
                <div className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium mb-1">Başlık</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={homepage.showroom_title}
                      onChange={(e) => setHomepage({ ...homepage, showroom_title: e.target.value })} placeholder="Salonumuzu Ziyaret Edin" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Açıklama</label>
                    <textarea className="w-full border rounded px-3 py-2" rows={3} value={homepage.showroom_description}
                      onChange={(e) => setHomepage({ ...homepage, showroom_description: e.target.value })} placeholder="Profesyonel saç kesimi, renklendirme, fön ve bakım hizmetlerimizi yakından deneyimlemek için salonumuzu ziyaret edin. Uzman ekibimiz saç analizi yaparak size en uygun stil ve bakım önerilerini sunar." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Görsel (URL)</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={homepage.showroom_image}
                      onChange={(e) => setHomepage({ ...homepage, showroom_image: e.target.value })} placeholder="https://images.unsplash.com/..." />
                    <div className="mt-2">
                      <ImageUploader
                        onPreviews={(previews) => {
                          if (!previews.length) return
                          setHomepage({ ...homepage, showroom_image: previews[0] })
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Öne Çıkan Modeller */}
              <div>
                <h3 className="admin-section-subtitle mb-4">Öne Çıkan Modeller</h3>
                <div className="max-w-xl">
                  <label className="block text-sm font-medium mb-2">Gösterilecek Modeli Seçin</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                    {products.map((product) => (
                      <label key={product.id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                        <input type="checkbox" checked={homepage.featured_products?.includes(product.id) || false}
                          onChange={(e) => {
                            const featured = homepage.featured_products || []
                            if (e.target.checked) {
                              setHomepage({ ...homepage, featured_products: [...featured, product.id] })
                            } else {
                              setHomepage({ ...homepage, featured_products: featured.filter(id => id !== product.id) })
                            }
                          }} className="rounded" />
                        <span className="text-sm font-medium text-slate-800">
                          {product.title || product.name || 'İsimsiz Model'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hakkimizda' && (
            <div>
              <h2 className="admin-section-title mb-4">Hakkımızda</h2>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-medium mb-1">Sayfa Başlığı</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={hakkimizda.title}
                    onChange={(e) => setHakkimizda({ ...hakkimizda, title: e.target.value })} placeholder="Hakkımızda" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Başlık</label>
                  <textarea className="w-full border rounded px-3 py-2" rows={2} value={hakkimizda.subtitle}
                    onChange={(e) => setHakkimizda({ ...hakkimizda, subtitle: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sayfa İçeriği</label>
                  <textarea className="w-full border rounded px-3 py-2" rows={10} value={hakkimizda.content}
                    onChange={(e) => setHakkimizda({ ...hakkimizda, content: e.target.value })} placeholder="Hakkımızda sayfası içeriği..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Görsel (URL)</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={hakkimizda.image}
                    onChange={(e) => setHakkimizda({ ...hakkimizda, image: e.target.value })} placeholder="https://images.unsplash.com/..." />
                  <div className="mt-2">
                    <ImageUploader
                      onPreviews={(previews) => {
                        if (!previews.length) return
                        setHakkimizda({ ...hakkimizda, image: previews[0] })
                      }}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-3">Özellikler</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Özellik 1 - Başlık</label>
                      <input type="text" className="w-full border rounded px-3 py-2 mb-2" value={hakkimizda.feature1_title}
                        onChange={(e) => setHakkimizda({ ...hakkimizda, feature1_title: e.target.value })} placeholder="Profesyonel Saç Bakımı" />
                      <label className="block text-sm font-medium mb-1">Özellik 1 - Açıklama</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={hakkimizda.feature1_desc}
                        onChange={(e) => setHakkimizda({ ...hakkimizda, feature1_desc: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Özellik 2 - Başlık</label>
                      <input type="text" className="w-full border rounded px-3 py-2 mb-2" value={hakkimizda.feature2_title}
                        onChange={(e) => setHakkimizda({ ...hakkimizda, feature2_title: e.target.value })} placeholder="Renk & Balayage" />
                      <label className="block text-sm font-medium mb-1">Özellik 2 - Açıklama</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={hakkimizda.feature2_desc}
                        onChange={(e) => setHakkimizda({ ...hakkimizda, feature2_desc: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Özellik 3 - Başlık</label>
                      <input type="text" className="w-full border rounded px-3 py-2 mb-2" value={hakkimizda.feature3_title}
                        onChange={(e) => setHakkimizda({ ...hakkimizda, feature3_title: e.target.value })} placeholder="Stil Danışmanlığı" />
                      <label className="block text-sm font-medium mb-1">Özellik 3 - Açıklama</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={hakkimizda.feature3_desc}
                        onChange={(e) => setHakkimizda({ ...hakkimizda, feature3_desc: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'numaralar' && (
            <div>
              <h2 className="admin-section-title mb-4">Numaralar</h2>
              <p className="admin-section-subtitle mb-4">
                Site genelindeki telefon ve WhatsApp numaralarını tek yerden yönetin.
              </p>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-medium mb-1">Telefon (Görünür Metin)</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={contactNumbers.phone}
                    onChange={(e) => setContactNumbers({ ...contactNumbers, phone: e.target.value })}
                    placeholder="0543 516 70 11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">WhatsApp (Görünür Metin)</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={contactNumbers.whatsapp_display}
                    onChange={(e) => setContactNumbers({ ...contactNumbers, whatsapp_display: e.target.value })}
                    placeholder="0543 516 70 11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">WhatsApp Link Numarası (Sadece Rakam)</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={contactNumbers.whatsapp_number}
                    onChange={(e) => setContactNumbers({ ...contactNumbers, whatsapp_number: e.target.value })}
                    placeholder="905435167011"
                  />
                  <p className="mt-1 text-xs text-slate-500">wa.me linklerinde bu numara kullanılır.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'iletisim' && (
            <div>
              <h2 className="admin-section-title mb-4">Randevu & İletişim</h2>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-medium mb-1">Sayfa Başlığı</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={iletisim.title}
                    onChange={(e) => setIletisim({ ...iletisim, title: e.target.value })} placeholder="Randevu & İletişim" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Başlık</label>
                  <textarea className="w-full border rounded px-3 py-2" rows={2} value={iletisim.subtitle}
                    onChange={(e) => setIletisim({ ...iletisim, subtitle: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Form Başlığı</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={iletisim.form_title}
                    onChange={(e) => setIletisim({ ...iletisim, form_title: e.target.value })} placeholder="Bize Ulaşın" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Form Gönder Butonu</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={iletisim.form_submit_text}
                    onChange={(e) => setIletisim({ ...iletisim, form_submit_text: e.target.value })} placeholder="Mesaj Gönder" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">WhatsApp Butonu Yazısı</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={iletisim.whatsapp_button_text}
                    onChange={(e) => setIletisim({ ...iletisim, whatsapp_button_text: e.target.value })} placeholder="WhatsApp'tan Hızlıca Yazın" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adres</label>
                  <textarea className="w-full border rounded px-3 py-2" rows={2} value={iletisim.address}
                    onChange={(e) => setIletisim({ ...iletisim, address: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefon</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={iletisim.phone}
                      onChange={(e) => setIletisim({ ...iletisim, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">WhatsApp</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={iletisim.whatsapp}
                      onChange={(e) => setIletisim({ ...iletisim, whatsapp: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={iletisim.email}
                    onChange={(e) => setIletisim({ ...iletisim, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Çalışma Saatleri</label>
                  <textarea className="w-full border rounded px-3 py-2" rows={2} value={iletisim.hours}
                    onChange={(e) => setIletisim({ ...iletisim, hours: e.target.value })} placeholder="Pazartesi - Pazar&#10;10:00 - 19:00" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Harita Konumu</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={iletisim.map_location}
                    onChange={(e) => setIletisim({ ...iletisim, map_location: e.target.value })} placeholder="Kırşehir" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
