'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FAQSection } from '@/src/components/FAQSection'
import { StickyButtons } from '@/src/components/StickyButtons'
import { AboutData, ContactNumbers } from '@/src/types'

export function AboutClient({ about, contactNumbers }: { about: AboutData; contactNumbers: ContactNumbers }) {
    const aboutImage = about.image?.trim() || ''

    return (
        <>
            <main className="min-h-screen bg-cream pt-24 pb-20">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{about.title}</h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">{about.subtitle}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white rounded-lg shadow-lg overflow-hidden"
                        >
                            {aboutImage ? (
                                <div className="relative h-80 w-full">
                                    <Image
                                        src={aboutImage}
                                        alt={about.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        quality={70}
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-400">Salonumuzu Ziyaret Edin</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div
                                className="prose prose-sm max-w-none mb-8 text-gray-600"
                                dangerouslySetInnerHTML={{ __html: about.content.replace(/\n/g, '<br/>') }}
                            />

                            {/* Features */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-lg">✓</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{about.feature1_title}</h4>
                                        <p className="text-sm text-gray-600">{about.feature1_desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-lg">✓</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{about.feature2_title}</h4>
                                        <p className="text-sm text-gray-600">{about.feature2_desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-lg">✓</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{about.feature3_title}</h4>
                                        <p className="text-sm text-gray-600">{about.feature3_desc}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-16">
                    <FAQSection />
                </div>
            </main>
            <StickyButtons contactNumbers={contactNumbers} />
        </>
    )
}
