'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const prevBodyOverflow = document.body.style.overflow
    const prevBodyOverflowX = document.body.style.overflowX
    const prevHtmlOverflowX = document.documentElement.style.overflowX

    // Lock background scroll and prevent horizontal overflow
    document.body.style.overflow = 'hidden'
    document.body.style.overflowX = 'hidden'
    document.documentElement.style.overflowX = 'hidden'

    // Close modal if user scrolls the page (mobile swipe / scroll gesture)
    const handleScroll = () => {
      onClose()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchmove', handleScroll, { passive: true })

    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.body.style.overflowX = prevBodyOverflowX
      document.documentElement.style.overflowX = prevHtmlOverflowX

      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
    }
  }, [isOpen, onClose])

  const todayStr = new Date().toISOString().split('T')[0]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (formData.date && formData.date < todayStr) {
      alert('Randevu tarihi geçmiş bir gün olamaz. Lütfen bugünden itibaren bir tarih seçin.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'appointment_modal',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: 'randevu',
          preferred_date: formData.date,
          preferred_time: formData.time,
          message: 'Web sitesindeki randevu modalindan iletildi.',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Randevu talebi gönderilemedi.')
      }

      // Close the modal and show a lightweight thank-you overlay.
      setIsSubmitted(true)
      onClose()
      setShowThankYou(true)

      // Reset form and hide thank-you after a short delay.
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', date: '', time: '' })
        setIsSubmitted(false)
        setShowThankYou(false)
      }, 2500)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Randevu talebi gönderilirken bir hata oluştu.'
      setSubmitError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {showThankYou && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            initial={{ scale: 0.96, y: 8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-3xl">
              ✓
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">Teşekkürler!</h3>
            <p className="text-gray-600 leading-relaxed">
              Randevu talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.
            </p>
          </motion.div>
        </motion.div>
      )}
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-center pt-24 sm:pt-0 px-0">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 32, scale: 1 }}
              transition={{ duration: 0.3 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 220 }}
              dragElastic={0.15}
              onDragEnd={(_, info: PanInfo) => { if (info.offset.y > 120) onClose() }}
              whileDrag={{ scale: 0.99 }}
              className="relative mx-auto w-[calc(100dvw-2rem)] sm:w-full max-w-lg bg-white rounded-3xl sm:rounded-2xl shadow-2xl"
              style={{ maxHeight: 'calc(100vh - 7.5rem)', overflowY: 'auto' }}
            >
              {/* Sheet Handle + Close */}
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur cursor-grab active:cursor-grabbing">
                <div className="pt-3 pb-2">
                  <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-200" />
                </div>
                <button
                  onClick={onClose}
                  aria-label="Kapat"
                  className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="px-5 pb-6 pt-8 sm:p-6">
                {!isSubmitted ? (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2">Randevu Al</h2>
                    <p className="text-gray-600 mb-6 text-xs sm:text-sm leading-relaxed">
                      Lütfen bilgilerinizi girin. Hemen size dönüş yapacağız.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-800">Ad Soyad</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Adınız"
                          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-800">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="ornek@email.com"
                          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-800">Telefon</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="05435167011"
                          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-800">Tarih</label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          min={todayStr}
                          required
                          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-800">Saat</label>
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose"
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gray-900 text-white py-3 rounded-md font-semibold text-sm hover:bg-gray-800 transition-colors mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Gonderiliyor...' : 'Randevu Talebini Gonder'}
                      </motion.button>

                      {submitError && (
                        <p className="text-sm text-red-600 text-center">{submitError}</p>
                      )}
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-5xl mb-4">✓</div>
                    <h3 className="text-xl font-serif font-bold mb-2">Başarılı!</h3>
                    <p className="text-gray-600">
                      Randevu talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
