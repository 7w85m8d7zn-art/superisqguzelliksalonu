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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">E-posta</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="admin@*****.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Şifre</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-24 text-sm text-slate-900 outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              {showPassword ? 'Gizle' : 'Göster'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300 text-slate-900" />
            <span>Beni hatırla</span>
          </label>

          <button
            type="button"
            onClick={() => setShowSupportPopup(true)}
            className="text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
          >
            Şifremi unuttum
          </button>
        </div>

        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: '#0f172a', color: '#ffffff', borderColor: '#0f172a' }}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </div>
      </form>
    </>
  )
}
