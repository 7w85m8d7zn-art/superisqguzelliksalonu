import { isSupabaseConfigured, supabaseServer } from './supabaseServer'
import {
    HeaderSettings,
    FooterSettings,
    HomepageData,
    AboutData,
    ContactData,
    Product,
    ContactNumbers,
} from '../types'
import { products as localProducts } from '@/src/data/products'
import { readFallbackProductsData } from '@/src/lib/fallbackProductsStore'
import {
    getFallbackSettingValueByKey,
    getFallbackSettingsMap,
} from '@/src/lib/fallbackSettingsStore'

const PRODUCT_SERVICE_DETAILS_KEY = 'product_service_details'
const CONTACT_NUMBERS_KEY = 'contact_numbers'

const FALLBACK_CONTACT_NUMBERS: ContactNumbers = {
    phone: '0543 516 70 11',
    whatsapp_display: '0543 516 70 11',
    whatsapp_number: '905435167011',
    whatsapp_message: 'Merhaba, randevu almak istiyorum.',
}

const parseSettingValue = <T extends Record<string, any>>(value: unknown): T => {
    if (!value) return {} as T
    if (typeof value === 'string') {
        try {
            return JSON.parse(value) as T
        } catch (error) {
            console.warn('Failed to parse setting JSON string:', error)
            return {} as T
        }
    }
    if (typeof value === 'object') {
        return value as T
    }
    return {} as T
}

const normalizeImageUrl = (rawUrl: string): string => {
    let normalized = rawUrl.trim()
    if (!normalized) return ''

    normalized = normalized.replace(/^[;,]+/, '')
    if (!normalized) return ''

    const lower = normalized.toLowerCase()
    if (
        lower.startsWith('http://') ||
        lower.startsWith('https://') ||
        lower.startsWith('data:') ||
        lower.startsWith('blob:')
    ) {
        return normalized
    }

    if (normalized.startsWith('/products/')) return `/uploads${normalized}`
    if (normalized.startsWith('products/')) return `/uploads/${normalized}`
    if (normalized.startsWith('uploads/')) return `/${normalized}`
    if (!normalized.startsWith('/')) return `/${normalized}`

    return normalized
}

const sanitizeImageArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) return []
    return Array.from(new Set(
        value
            .map((image: unknown) => (typeof image === 'string' ? normalizeImageUrl(image) : ''))
            .filter((image: string) => image.length > 0)
    ))
}

const sanitizeStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) return []
    return value
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter((item) => item.length > 0)
}

const sanitizeWhatsappNumber = (value: unknown): string => {
    if (typeof value !== 'string') return ''
    return value.replace(/\D/g, '')
}

const formatErrorForLog = (error: unknown) => {
    if (!error) return 'unknown error'
    if (error instanceof Error) return `${error.name}: ${error.message}`
    if (typeof error === 'object') {
        const err = error as Record<string, unknown>
        const compact = {
            name: err.name,
            message: err.message,
            code: err.code,
            details: err.details,
            hint: err.hint,
            status: err.status,
            statusText: err.statusText,
        }

        const hasKnownProps = Object.values(compact).some(v => v !== undefined && v !== null && v !== '')
        if (hasKnownProps) {
            return JSON.stringify(compact)
        }

        try {
            const fallback = JSON.stringify(error)
            return fallback === '{}' ? '[non-enumerable error object]' : fallback
        } catch {
            return '[object error]'
        }
    }
    return String(error)
}

async function getSettingValueByKey(key: string): Promise<unknown | null> {
    if (!isSupabaseConfigured) {
        return await getFallbackSettingValueByKey(key)
    }

    const { data, error } = await supabaseServer
        .from('settings')
        .select('value')
        .eq('key', key)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (error) {
        throw error
    }

    return data?.value ?? null
}

const parseContactNumbers = (value: unknown): ContactNumbers => {
    const parsed = parseSettingValue<Partial<ContactNumbers>>(value)

    const phone = (parsed.phone || FALLBACK_CONTACT_NUMBERS.phone).trim()
    const whatsappDisplay = (parsed.whatsapp_display || parsed.phone || FALLBACK_CONTACT_NUMBERS.whatsapp_display).trim()
    const whatsappNumber =
        sanitizeWhatsappNumber(parsed.whatsapp_number) ||
        sanitizeWhatsappNumber(parsed.whatsapp_display) ||
        sanitizeWhatsappNumber(parsed.phone) ||
        FALLBACK_CONTACT_NUMBERS.whatsapp_number

    const whatsappMessage = (parsed.whatsapp_message || FALLBACK_CONTACT_NUMBERS.whatsapp_message).trim()

    return {
        phone,
        whatsapp_display: whatsappDisplay || phone,
        whatsapp_number: whatsappNumber,
        whatsapp_message: whatsappMessage || FALLBACK_CONTACT_NUMBERS.whatsapp_message,
    }
}

const parseProductServiceDetailsMap = (value: unknown): Record<string, string[]> => {
    const parsed = parseSettingValue<Record<string, unknown>>(value)
    return Object.entries(parsed).reduce<Record<string, string[]>>((acc, [productId, details]) => {
        const normalizedDetails = sanitizeStringArray(details)
        if (productId && normalizedDetails.length > 0) {
            acc[productId] = normalizedDetails
        }
        return acc
    }, {})
}

async function getProductServiceDetailsMap(): Promise<Record<string, string[]>> {
    if (!isSupabaseConfigured) return {}

    try {
        const value = await getSettingValueByKey(PRODUCT_SERVICE_DETAILS_KEY)
        return parseProductServiceDetailsMap(value)
    } catch (error) {
        console.warn('Error fetching product service details map:', formatErrorForLog(error))
        return {}
    }
}

// Helper to normalize product data
const normalizeProduct = (p: any, serviceDetailsMap: Record<string, string[]>): Product => ({
    id: p.id,
    name: p.title || p.name || 'Model',
    description: p.description || '',
    priceFrom: Number(p.price_from || p.priceFrom) || 0,
    images: sanitizeImageArray(Array.isArray(p.images) ? p.images : (p.images ? [p.images] : [])),
    colors: Array.isArray(p.colors) ? p.colors : [],
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    service_details: serviceDetailsMap[p.id] || sanitizeStringArray(p.service_details),
    tags: Array.isArray(p.tags) ? p.tags : [],
    category: p.category || '',
    slug: p.slug || p.id,
    featured: p.featured || false,
})

export async function getSettings(): Promise<{
    header: HeaderSettings
    footer: FooterSettings
    contact_numbers: ContactNumbers
}> {
    const fallbackSettings = {
        header: {
            header_logo_text: 'Su Perisi Güzellik Salonu',
            header_menu_anasayfa: 'Ana Sayfa',
            header_menu_koleksiyon: 'Koleksiyon',
            header_menu_hakkimizda: 'Hakkımızda',
            header_menu_iletisim: 'Randevu Oluşltur',
        },
        footer: {
            footer_brand_name: 'Su Perisi Güzellik Salonu',
            footer_brand_description: 'Profesyonel kadın saç ve kuaför hizmetleri',
            footer_text: '2025 Su Perisi Güzellik Salonu. Tüm hakları saklıdır.',
            footer_address: 'Kırşehir Türkiye',
            footer_whatsapp: '05435167011',
            footer_social_instagram: '',
            footer_social_facebook: '',
            footer_menu_hakkimizda: 'Hakkımızda',
            footer_menu_iletisim: 'Randevu Oluşltur',
        },
        contact_numbers: FALLBACK_CONTACT_NUMBERS,
    }

    try {
        let settingsMap: Record<string, unknown> = {}

        if (isSupabaseConfigured) {
            const { data, error } = await supabaseServer
                .from('settings')
                .select('key, value, updated_at')
                .in('key', ['header', 'footer', CONTACT_NUMBERS_KEY])
                .order('updated_at', { ascending: false })

            if (error) throw error

            // In case duplicate keys exist, keep the newest value for each key.
            settingsMap = (data || []).reduce((acc: Record<string, unknown>, row: any) => {
                if (!(row.key in acc)) {
                    acc[row.key] = row.value
                }
                return acc
            }, {})
        } else {
            settingsMap = await getFallbackSettingsMap()
        }

        // Parse JSON strings or JSON objects
        const header = parseSettingValue<Partial<HeaderSettings>>(settingsMap.header)
        const footer = parseSettingValue<Partial<FooterSettings>>(settingsMap.footer)
        const contactNumbers = settingsMap[CONTACT_NUMBERS_KEY]
            ? parseContactNumbers(settingsMap[CONTACT_NUMBERS_KEY])
            : parseContactNumbers({
                phone: footer.footer_whatsapp || FALLBACK_CONTACT_NUMBERS.phone,
                whatsapp_display: footer.footer_whatsapp || FALLBACK_CONTACT_NUMBERS.whatsapp_display,
                whatsapp_number: footer.footer_whatsapp || FALLBACK_CONTACT_NUMBERS.whatsapp_number,
                whatsapp_message: FALLBACK_CONTACT_NUMBERS.whatsapp_message,
            })

        // Default Fallbacks
        const defaultHeader: HeaderSettings = {
            ...fallbackSettings.header,
            ...header
        }

        const defaultFooter: FooterSettings = {
            ...fallbackSettings.footer,
            ...footer,
            footer_whatsapp: contactNumbers.whatsapp_display || footer.footer_whatsapp || FALLBACK_CONTACT_NUMBERS.whatsapp_display,
        }

        return { header: defaultHeader, footer: defaultFooter, contact_numbers: contactNumbers }
    } catch (error) {
        console.warn('Error fetching settings (using fallback):', formatErrorForLog(error))
        return fallbackSettings
    }
}

export async function getHomepageData(): Promise<HomepageData> {
    const defaultHomepage: HomepageData = {
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
        feature_1_icon: '✨',
        feature_1_title: 'Profesyonel Hizmet',
        feature_1_description: 'Deneyimli stilistler ve profesyonel bakım uygulamaları',
        featured_products: [],
    }

    try {
        const value = await getSettingValueByKey('homepage_data')

        if (!value) {
            console.warn('Homepage data not found in settings, using defaults')
            return defaultHomepage
        }

        const homepageData = parseSettingValue<Partial<HomepageData>>(value)
        return { ...defaultHomepage, ...homepageData }
    } catch (error) {
        console.warn('Error fetching homepage data (using fallback):', formatErrorForLog(error))
        return defaultHomepage
    }
}

export async function getProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured) {
        const fallbackData = await readFallbackProductsData()
        return fallbackData.products.map((product) => normalizeProduct(product, fallbackData.serviceDetailsMap))
    }

    try {
        const serviceDetailsMap = await getProductServiceDetailsMap()
        const { data, error } = await supabaseServer.from('products').select('*')
        if (error || !data || data.length === 0) {
            // Fallback to local products if DB is empty or fails
            console.warn('Using local products fallback due to:', error?.message)
            return localProducts.map(p => ({
                id: p.id,
                slug: p.slug,
                name: p.name,
                description: p.description,
                priceFrom: p.priceFrom,
                images: sanitizeImageArray(p.images),
                colors: p.colors,
                sizes: p.sizes,
                service_details: serviceDetailsMap[p.id] || sanitizeStringArray((p as Product).service_details),
                tags: p.tags,
                category: p.category,
                featured: p.featured
            }))
        }

        return data.map((product) => normalizeProduct(product, serviceDetailsMap))

    } catch (error) {
        console.warn('Error fetching products (using fallback):', formatErrorForLog(error))
        const serviceDetailsMap = await getProductServiceDetailsMap()
        return localProducts.map(p => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            description: p.description,
            priceFrom: p.priceFrom,
            images: sanitizeImageArray(p.images),
            colors: p.colors,
            sizes: p.sizes,
            service_details: serviceDetailsMap[p.id] || sanitizeStringArray((p as Product).service_details),
            tags: p.tags,
            category: p.category,
            featured: p.featured
        }))
    }
}

export async function getAboutData(): Promise<AboutData> {
    const defaultAbout: AboutData = {
        title: 'Hakkımızda',
        subtitle: 'Su Perisi Güzellik Salonu, kadın kuaför ve güzellik hizmetlerinde yüksek kalite ve modern stilin adresidir.',
        content: '',
        image: '',
        feature1_title: 'Profesyonel Saç Bakımı',
        feature1_desc: 'Saçınıza uygun bakım protokolleri ve kaliteli ürünlerle sağlıklı görünüm',
        feature2_title: 'Renk & Balayage',
        feature2_desc: 'Doğal geçişler, modern tonlar ve size özel renk danışmanlığı',
        feature3_title: 'Stil Danışmanlığı',
        feature3_desc: 'Yüz şeklinize ve tarzınıza uygun kesim ve saç tasarımı önerileri',
    }

    try {
        const value = await getSettingValueByKey('hakkimizda_data')
        if (value) {
            return { ...defaultAbout, ...parseSettingValue<Partial<AboutData>>(value) }
        }
        return defaultAbout
    } catch (error) {
        console.warn('Error fetching about data (using fallback):', formatErrorForLog(error))
        return defaultAbout
    }
}

export async function getContactNumbers(): Promise<ContactNumbers> {
    try {
        const value = await getSettingValueByKey(CONTACT_NUMBERS_KEY)
        if (value) {
            return parseContactNumbers(value)
        }

        const contactPageValue = await getSettingValueByKey('iletisim_data')
        const contactPageData = parseSettingValue<Partial<ContactData>>(contactPageValue)

        return parseContactNumbers({
            phone: contactPageData.phone || FALLBACK_CONTACT_NUMBERS.phone,
            whatsapp_display: contactPageData.whatsapp || contactPageData.phone || FALLBACK_CONTACT_NUMBERS.whatsapp_display,
            whatsapp_number: contactPageData.whatsapp || contactPageData.phone || FALLBACK_CONTACT_NUMBERS.whatsapp_number,
            whatsapp_message: FALLBACK_CONTACT_NUMBERS.whatsapp_message,
        })
    } catch (error) {
        console.warn('Error fetching contact numbers (using fallback):', formatErrorForLog(error))
        return FALLBACK_CONTACT_NUMBERS
    }
}

export async function getContactData(): Promise<ContactData> {
    const defaultContact: ContactData = {
        title: 'Randevu & İletişim',
        subtitle: 'Sorularınız mı var? Hizmetlerimiz hakkında bilgi almak veya randevu oluşturmak için bizimle iletişime geçin. En kısa sürede yanıt vereceğiz.',
        form_title: 'Bize Ulaşın',
        form_submit_text: 'Mesaj Gönder',
        whatsapp_button_text: "WhatsApp'tan Hızlıca Yazın",
        address: 'Kırşehir Türkiye',
        phone: '0543 516 70 11',
        whatsapp: '0543 516 70 11',
        email: 'info@dijitalshowroom.com',
        hours: 'Pazartesi - Pazar\n10:00 - 19:00',
        map_location: 'Kırşehir',
    }

    try {
        const contactNumbers = await getContactNumbers()
        const value = await getSettingValueByKey('iletisim_data')
        if (value) {
            const parsedContact = parseSettingValue<Partial<ContactData>>(value)
            return {
                ...defaultContact,
                ...parsedContact,
                phone: contactNumbers.phone,
                whatsapp: contactNumbers.whatsapp_display,
            }
        }
        return {
            ...defaultContact,
            phone: contactNumbers.phone,
            whatsapp: contactNumbers.whatsapp_display,
        }
    } catch (error) {
        console.warn('Error fetching contact data (using fallback):', formatErrorForLog(error))
        return defaultContact
    }
}
