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
    <div className={`admin-login relative min-h-screen overflow-hidden bg-[#f4f1eb] ${montserrat.className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(17,19,25,0.07),transparent_36%),radial-gradient(circle_at_82%_85%,rgba(17,19,25,0.05),transparent_40%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4 py-10">
        <div className="w-full rounded-[28px] border border-[#d8d0c3] bg-[#fffdf8] p-6 shadow-[0_20px_42px_-30px_rgba(0,0,0,0.35)] sm:p-7">
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6c7483]">Su Perisi</p>
            <h1 className="mt-2 text-2xl font-bold text-[#111319]">Yönetim Girişi</h1>
            <p className="mt-1 text-sm font-medium text-[#5f6571]">Panel erişimi için giriş bilgilerinizi girin.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
