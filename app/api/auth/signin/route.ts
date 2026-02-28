import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const form = await req.formData()
  const email = form.get('email')?.toString() || ''
  const password = form.get('password')?.toString() || ''

  if (email === 'admin@superisi.com' && password === 'superisi123') {
    const res = NextResponse.json({ ok: true })
    res.cookies.set({ name: 'admin-auth', value: '1', httpOnly: true, path: '/', maxAge: 60 * 60 * 24 })
    return res
  }

  return NextResponse.json({ ok: false }, { status: 401 })
}
