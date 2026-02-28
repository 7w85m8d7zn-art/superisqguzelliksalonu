'use client'

import { motion } from 'framer-motion'
import { ContactForm } from '@/src/components/ContactForm'
import { StickyButtons } from '@/src/components/StickyButtons'
import { ContactData, ContactNumbers } from '@/src/types'

export function ContactClient({
    settings,
    contactNumbers,
}: {
    settings: ContactData
    contactNumbers: ContactNumbers
}) {
    const whatsappNumber = (contactNumbers.whatsapp_number || '').replace(/\D/g, '') || '905306249382'
    const whatsappMessage = encodeURIComponent(
        contactNumbers.whatsapp_message || 'Merhaba, randevu almak istiyorum.'
    )

    return (
        <>
            <main className="min-h-screen bg-cream pt-32 pb-20">
                {/* Hero Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 mb-12 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                                {settings.title}
                            </h1>
                            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                                {settings.subtitle}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="lg:col-span-2"
                        >
                            <div className="bg-white p-8 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-serif font-bold mb-8">{settings.form_title}</h2>
                                <ContactForm />
                            </div>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Contact Info Card */}
                            <div className="bg-white p-8 rounded-lg shadow-sm">
                                <h3 className="text-xl font-serif font-bold mb-6">İletişim Bilgileri</h3>

                                <div className="space-y-6">
                                    {/* Address */}
                                    <div>
                                        <div className="flex items-start gap-3 mb-4">
                                            <span className="text-2xl">📍</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Adres</h4>
                                                <p className="text-gray-600 text-sm" dangerouslySetInnerHTML={{
                                                    __html: (settings.address || 'İstanbul, Üsküdar').replace(/\n/g, '<br/>')
                                                }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <div className="flex items-start gap-3 mb-4">
                                            <span className="text-2xl">📞</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Telefon</h4>
                                                <a href={`tel:${settings.phone}`} className="text-rose hover:text-rose/80 transition-colors font-medium">
                                                    {settings.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* WhatsApp */}
                                    <div>
                                        <div className="flex items-start gap-3 mb-4">
                                            <span className="text-2xl">💬</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">WhatsApp</h4>
                                                <a
                                                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-rose hover:text-rose/80 transition-colors font-medium"
                                                >
                                                    {contactNumbers.whatsapp_display || settings.whatsapp}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <div className="flex items-start gap-3 mb-4">
                                            <span className="text-2xl">✉️</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                                                <a href={`mailto:${settings.email}`} className="text-rose hover:text-rose/80 transition-colors font-medium">
                                                    {settings.email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hours */}
                                    <div>
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">⏰</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Çalışma Saatleri</h4>
                                                <p className="text-gray-600 text-sm" dangerouslySetInnerHTML={{
                                                    __html: (settings.hours || 'Pazartesi - Pazar<br/>10:00 - 19:00').replace(/\n/g, '<br/>')
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick WhatsApp Button */}
                            <motion.a
                                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-green-500 text-white py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.921 1.226-1.129 1.48-.215.255-.42.27-.715.09-.295-.189-1.243-.459-2.37-1.475-.874-.778-1.464-1.742-1.635-2.038-.16-.296-.017-.458.12-.606.123-.122.294-.314.442-.471.149-.157.198-.256.297-.416.1-.162.049-.305-.024-.429-.073-.123-.67-1.616-.92-2.206-.247-.609-.5-.52-.67-.529-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.634.803 5.11 2.323 7.177l-2.422 8.842 9.072-2.382a9.861 9.861 0 004.773 1.216h.005c5.396 0 9.747-4.363 9.747-9.798 0-2.64-.806-5.117-2.327-7.184-.529-.822-1.223-1.55-2.062-2.152-.838-.602-1.817-.972-2.8-1.069-.973-.093-1.951.023-2.868.326-.917.303-1.755.81-2.363 1.468-.608.658-1.014 1.438-1.178 2.27-.164.832-.057 1.719.311 2.472z" />
                                </svg>
                                {settings.whatsapp_button_text}
                            </motion.a>
                        </motion.div>
                    </div>
                </div>

                {/* Map Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-20 px-4 sm:px-6 lg:px-8"
                >
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Konumumuz</h2>
                        <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                            <iframe
                                title="Su Perisi Güzellik Salonu - Kırşehir / Merkez"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48152.649453436!2d29.006590027035433!3d41.03530585816442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac826d524c9f1%3A0xc14f7612337b7f38!2zw5xza8O8ZGFuLCBFc2thbmRhciwgS8O8c2N1ZGFy!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                        <p className="text-center text-gray-600 mt-4">
                            Harita tam konum göstermeyebilir. Kesin adres için lütfen WhatsApp'tan veya telefon aracılığıyla iletişim kurunuz.
                        </p>
                    </div>
                </motion.section>
            </main>
            <StickyButtons contactNumbers={contactNumbers} />
        </>
    )
}
