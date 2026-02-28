export interface Settings {
    header?: HeaderSettings
    footer?: FooterSettings
    contact_numbers?: ContactNumbers
    homepage?: HomepageData
    about?: AboutData
    contact?: ContactData
    // Add other global settings as needed
}

export interface ContactNumbers {
    phone: string
    whatsapp_display: string
    whatsapp_number: string
    whatsapp_message: string
}

export interface HeaderSettings {
    header_logo_text: string
    header_menu_anasayfa: string
    header_menu_koleksiyon: string
    header_menu_hakkimizda: string
    header_menu_iletisim: string
}

export interface FooterSettings {
    footer_brand_name: string
    footer_brand_description: string
    footer_text: string
    footer_address: string
    footer_whatsapp: string
    footer_social_instagram: string
    footer_social_facebook: string
    footer_menu_hakkimizda: string
    footer_menu_iletisim: string
}

export interface HomepageData {
    hero_title: string
    hero_subtitle: string
    hero_image: string
    hero_cta_text: string
    hero_cta_link: string
    hero_brightness: number
    why_us_title: string
    why_us_subtitle: string
    why_us_item1_title?: string
    why_us_item1_desc?: string
    why_us_item2_title?: string
    why_us_item2_desc?: string
    why_us_item3_title?: string
    why_us_item3_desc?: string
    showroom_title?: string
    showroom_description?: string
    showroom_image?: string
    feature_1_icon: string
    feature_1_title: string
    feature_1_description: string
    featured_products: string[]
}

export interface AboutData {
    title: string
    subtitle: string
    content: string
    image: string
    feature1_title: string
    feature1_desc: string
    feature2_title: string
    feature2_desc: string
    feature3_title: string
    feature3_desc: string
}

export interface ContactData {
    title: string
    subtitle: string
    form_title: string
    form_submit_text: string
    whatsapp_button_text: string
    address: string
    phone: string
    whatsapp: string
    email: string
    hours: string
    map_location: string
}

export interface Product {
    id: string
    slug: string
    name: string
    title?: string
    description: string
    priceFrom: number
    price_from?: number
    images: string[]
    colors: string[]
    sizes: string[]
    service_details?: string[]
    tags?: string[]
    category: 'kiralama' | 'ozel-dikim' | string
    featured?: boolean
}

export type AppointmentStatus = 'pending' | 'approved' | 'rejected'
export type AppointmentSource = 'contact_form' | 'appointment_modal'

export interface Appointment {
    id: string
    name: string
    email?: string
    phone: string
    subject?: string
    message?: string
    preferred_date?: string
    preferred_time?: string
    source: AppointmentSource
    status: AppointmentStatus
    created_at: string
    updated_at: string
}

export interface DashboardSeriesPoint {
    date: string
    label: string
    appointments: number
    visitors: number
}
