import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL('/login', req.url))
  // delete cookie by setting expires in past
  res.cookies.set({ name: 'admin-auth', value: '', path: '/', expires: new Date(0) })
  return res
}
