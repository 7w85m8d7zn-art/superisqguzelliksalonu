import { createClient } from '@supabase/supabase-js'

const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const rawServiceRole = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  ''
).trim()
const parsedUrl = (() => {
  if (!rawUrl) return null
  try {
    return new URL(rawUrl)
  } catch {
    return null
  }
})()
const normalizedSupabaseUrl = parsedUrl?.toString().replace(/\/$/, '') || ''
const isPlaceholderUrl = normalizedSupabaseUrl.includes('placeholder.supabase.co')
const isPlaceholderKey = rawServiceRole.toLowerCase().includes('placeholder')
const hasValidUrl = parsedUrl?.protocol === 'https:' && !isPlaceholderUrl
const hasValidKey = rawServiceRole.length > 0 && !isPlaceholderKey

export const isSupabaseConfigured = Boolean(hasValidUrl && hasValidKey)

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase env vars missing/invalid. Falling back to local defaults until valid env vars are configured.'
  )
  if (rawUrl && !parsedUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is not a valid URL')
  } else if (parsedUrl && parsedUrl.protocol !== 'https:') {
    console.warn('NEXT_PUBLIC_SUPABASE_URL should start with https://')
  }
}

const supabaseUrl = normalizedSupabaseUrl || 'https://placeholder.supabase.co'
const supabaseKey = rawServiceRole || 'placeholder-anon-key'

export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

export default supabaseServer
