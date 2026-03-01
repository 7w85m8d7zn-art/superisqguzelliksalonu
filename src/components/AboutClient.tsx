'use client'

import Image from 'next/image'
import { FAQSection } from '@/src/components/FAQSection'
import { StickyButtons } from '@/src/components/StickyButtons'
import { PageHero } from '@/src/components/PageHero'
import { AboutData, ContactNumbers } from '@/src/types'

export function AboutClient({ about, contactNumbers }: { about: AboutData; contactNumbers: ContactNumbers }) {
  const aboutImage = about.image?.trim() || ''

  return (
    <>
      <main className="min-h-screen bg-[#f2f1ef] pb-20">
        <PageHero title={about.title} subtitle={about.subtitle} />

        <section className="mx-auto mt-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border border-[#d8d8d6] bg-white shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
              {aboutImage ? (
                <div className="relative h-[400px] w-full lg:h-full lg:min-h-[540px]">
                  <Image
                    src={aboutImage}
                    alt={about.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={74}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-[400px] w-full items-center justify-center bg-[#e8e7e4] text-gray-600 lg:h-full lg:min-h-[540px]">
                  Salonumuzdan bir kare
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-[#d8d8d6] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.08)] md:p-8">
              <div
                className="prose prose-sm max-w-none text-[#5f6670]"
                dangerouslySetInnerHTML={{ __html: about.content.replace(/\n/g, '<br/>') }}
              />

              <div className="mt-8 space-y-3">
                <article className="rounded-2xl border border-[#e2e2df] bg-[#f7f6f4] p-4">
                  <h4 className="text-lg font-serif font-semibold uppercase tracking-[0.03em] text-[#111319]">{about.feature1_title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#5f6670]">{about.feature1_desc}</p>
                </article>

                <article className="rounded-2xl border border-[#e2e2df] bg-[#f7f6f4] p-4">
                  <h4 className="text-lg font-serif font-semibold uppercase tracking-[0.03em] text-[#111319]">{about.feature2_title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#5f6670]">{about.feature2_desc}</p>
                </article>

                <article className="rounded-2xl border border-[#e2e2df] bg-[#f7f6f4] p-4">
                  <h4 className="text-lg font-serif font-semibold uppercase tracking-[0.03em] text-[#111319]">{about.feature3_title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#5f6670]">{about.feature3_desc}</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-16">
          <FAQSection />
        </div>
      </main>
      <StickyButtons contactNumbers={contactNumbers} />
    </>
  )
}
