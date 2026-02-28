import LoginForm from '../../src/components/admin/LoginForm'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata = { title: 'Yönetici Girişi' }

export default function LoginPage() {
  return (
    <div className={`admin-login min-h-screen bg-slate-100 ${montserrat.className}`}>
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4 py-10">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] sm:p-7">
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Su Perisi</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Yönetici Girişi</h1>
            <p className="mt-1 text-sm font-medium text-slate-600">Panel erişimi için giriş bilgilerinizi girin.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
