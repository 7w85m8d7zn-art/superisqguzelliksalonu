'use client'

import { motion } from 'framer-motion'
import { ContactForm } from '@/src/components/ContactForm'
import { StickyButtons } from '@/src/components/StickyButtons'
import { PageHero } from '@/src/components/PageHero'
import { ContactData, ContactNumbers } from '@/src/types'

export function ContactClient({
  settings,
  contactNumbers,
}: {
  settings: ContactData
  contactNumbers: ContactNumbers
}) {
  const googleMapsShareUrl = 'https://share.google/tTiIBRjNNybLXrdrX'
  const googleMapsEmbedUrl =
    'https://www.google.com/maps?q=Su%20Perisi%20G%C3%BCzellik%20Salonu%2C%20K%C4%B1r%C5%9Fehir%20T%C3%BCrkiye&output=embed'

  const whatsappNumber = (contactNumbers.whatsapp_number || '').replace(/\D/g, '') || '905435167011'
  const whatsappMessage = encodeURIComponent(contactNumbers.whatsapp_message || 'Merhaba, randevu almak istiyorum.')

  return (
    <>
      <main className="min-h-screen bg-[#f2f1ef] pb-20">
        <PageHero title={settings.title} subtitle={settings.subtitle} />

        <div className="mx-auto mt-12 grid w-full max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-[#d9d9d7] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.08)] md:p-8">
              <h2 className="mb-6 text-3xl font-serif font-semibold uppercase tracking-[0.04em] text-[#12151b]">{settings.form_title}</h2>
              <ContactForm submitLabel={settings.form_submit_text} />
            </div>
          </div>

          <div className="space-y-5">
            <article className="rounded-3xl border border-[#d9d9d7] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
              <h3 className="mb-5 text-xl font-serif font-semibold uppercase tracking-[0.04em] text-[#12151b]">İletişim Bilgileri</h3>

              <div className="space-y-4 text-sm text-[#5e6570]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#757c86]">Adres</p>
                  <p className="mt-1" dangerouslySetInnerHTML={{ __html: (settings.address || '').replace(/\n/g, '<br/>') }} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#757c86]">Telefon</p>
                  <a href={`tel:${settings.phone}`} className="mt-1 inline-flex font-semibold text-[#111319] transition hover:text-[#3b4452]">
                    {settings.phone}
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#757c86]">WhatsApp</p>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex font-semibold text-[#111319] transition hover:text-[#3b4452]"
                  >
                    {contactNumbers.whatsapp_display || settings.whatsapp}
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#757c86]">Email</p>
                  <a href={`mailto:${settings.email}`} className="mt-1 inline-flex font-semibold text-[#111319] transition hover:text-[#3b4452]">
                    {settings.email}
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#757c86]">Çalışma Saatleri</p>
                  <p className="mt-1" dangerouslySetInnerHTML={{ __html: (settings.hours || '').replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            </article>

            <motion.a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex w-full items-center justify-center rounded-full border border-[#111319] bg-[#111319] px-5 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-white transition hover:bg-transparent hover:text-[#111319]"
            >
              {settings.whatsapp_button_text}
            </motion.a>
          </div>
        </div>

        <section className="mx-auto mt-14 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-[#d8d8d6] bg-white shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between gap-4 border-b border-[#e8e7e4] px-6 py-5 md:px-8">
              <h2 className="text-2xl font-serif font-semibold uppercase tracking-[0.04em] text-[#12151b]">Konumumuz</h2>
              <a
                href={googleMapsShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-[#111319] transition hover:text-[#3b4452]"
              >
                Haritada Aç
              </a>
            </div>
            <div className="relative h-96 bg-[#dbdcda]">
              <iframe
                title="Su Perisi Güzellik Salonu - Kırşehir Konum"
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <StickyButtons contactNumbers={contactNumbers} />
    </>
  )
}
