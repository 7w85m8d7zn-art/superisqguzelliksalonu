"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSupportPopup, setShowSupportPopup] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!showSupportPopup) return
    const timer = setTimeout(() => setShowSupportPopup(false), 10000)
    return () => clearTimeout(timer)
  }, [showSupportPopup])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.currentTarget)

    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      body: form,
      credentials: 'same-origin',
    })

    setLoading(false)
    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.')
    }
  }

  return (
    <>
      {showSupportPopup && (
        <div className="fixed right-4 top-4 z-50 w-full max-w-sm rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-900">Destek ekibiyle iletişime geçin</p>
              <p className="mt-1 text-xs text-amber-700">Bu bildirim 10 saniye sonra kapanır.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowSupportPopup(false)}
              className="rounded-lg border border-amber-200 bg-white px-2 py-1 text-xs font-medium text-amber-700"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 text-[#111319]">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#374151]">E-posta</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-[#d8d0c3] bg-white px-4 py-3 text-sm text-[#111319] outline-none transition-all placeholder:text-[#8b94a3] focus:border-[#111319] focus:ring-2 focus:ring-[#111319]/10"
            placeholder="admin@*****.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#374151]">Şifre</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              className="w-full rounded-xl border border-[#d8d0c3] bg-white px-4 py-3 pr-24 text-sm text-[#111319] outline-none transition-all placeholder:text-[#8b94a3] focus:border-[#111319] focus:ring-2 focus:ring-[#111319]/10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-xs font-medium text-[#4b5565] transition hover:bg-[#f1f5f9] hover:text-[#111319]"
            >
              {showPassword ? 'Gizle' : 'Göster'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-[#4b5565]">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-[#9aa3b2] text-[#111319] focus:ring-[#111319]/20"
            />
            <span>Beni hatırla</span>
          </label>

          <button
            type="button"
            onClick={() => setShowSupportPopup(true)}
            className="text-sm font-medium text-[#4b5565] underline decoration-[#c4ccd9] underline-offset-4 transition hover:text-[#111319]"
          >
            Şifremi unuttum
          </button>
        </div>

        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.11em] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </div>
      </form>
    </>
  )
}
