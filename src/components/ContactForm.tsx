'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface ContactFormProps {
  submitLabel?: string
}

export function ContactForm({ submitLabel }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'contact_form',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Mesaj gönderimi başarısız oldu.')
      }

      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Mesaj gönderilirken bir hata oluştu.'
      setSubmitError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#6e7480]">
          Ad Soyad *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Adınız ve soyadınız"
          className="w-full rounded-2xl border border-[#d7d8d6] bg-[#f8f7f5] px-4 py-3 text-sm text-[#13161d] outline-none transition focus:border-[#111319] focus:bg-white"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#6e7480]">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="ornek@email.com"
          className="w-full rounded-2xl border border-[#d7d8d6] bg-[#f8f7f5] px-4 py-3 text-sm text-[#13161d] outline-none transition focus:border-[#111319] focus:bg-white"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <label htmlFor="phone" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#6e7480]">
          Telefon Numarası *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="05435167011"
          className="w-full rounded-2xl border border-[#d7d8d6] bg-[#f8f7f5] px-4 py-3 text-sm text-[#13161d] outline-none transition focus:border-[#111319] focus:bg-white"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <label htmlFor="subject" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#6e7480]">
          Konu *
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full rounded-2xl border border-[#d7d8d6] bg-[#f8f7f5] px-4 py-3 text-sm text-[#13161d] outline-none transition focus:border-[#111319] focus:bg-white"
        >
          <option value="">Konu seçiniz</option>
          <option value="randevu">Randevu Talep</option>
          <option value="sac-kesimi">Saç Kesimi</option>
          <option value="renklendirme">Renklendirme</option>
          <option value="ozel-gun-saci">Özel Gün Saçı</option>
          <option value="diger">Diğer</option>
        </select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#6e7480]">
          Mesaj *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Mesajınızı buraya yazınız..."
          className="w-full resize-none rounded-2xl border border-[#d7d8d6] bg-[#f8f7f5] px-4 py-3 text-sm text-[#13161d] outline-none transition focus:border-[#111319] focus:bg-white"
        />
      </motion.div>

      {/* Success Message */}
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="rounded-2xl border border-green-200 bg-green-50 px-6 py-4 text-center text-green-800"
        >
          <p className="font-semibold">✓ Mesajınız başarıyla gönderildi!</p>
          <p className="text-sm mt-1">En kısa sürede sizinle iletişime geçeceğiz.</p>
        </motion.div>
      )}

      {submitError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-center text-red-700"
        >
          <p className="font-semibold">Gönderim başarısız</p>
          <p className="text-sm mt-1">{submitError}</p>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full rounded-full border border-[#111319] bg-[#111319] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-transparent hover:text-[#111319] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? 'Gönderiliyor...' : (submitLabel || 'Mesaj Gönder')}
      </motion.button>
    </form>
  )
}
