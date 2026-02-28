'use server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function signIn(formData: FormData) {
  const email = formData.get('email')?.toString() || ''
  const password = formData.get('password')?.toString() || ''

  // Placeholder authentication - replace with real auth logic
  if (email === 'admin@superisi.com' && password === 'superisi123') {
    // set a simple cookie to mark authentication (for demo only)
    (await cookies()).set({ name: 'admin-auth', value: '1', httpOnly: true, path: '/', maxAge: 60 * 60 * 24 })
    redirect('/admin')
  }

  // On failure, redirect back to login
  redirect('/login')
}
