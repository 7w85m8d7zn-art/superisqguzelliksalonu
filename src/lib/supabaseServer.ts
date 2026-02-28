import { createClient } from '@supabase/supabase-js'

const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const rawServiceRole = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()
const isPlaceholderUrl = rawUrl.includes('placeholder.supabase.co')
const isPlaceholderKey = rawServiceRole.toLowerCase().includes('placeholder')
const hasValidUrl = rawUrl.startsWith('https://') && !isPlaceholderUrl
const hasValidKey = rawServiceRole.length > 0 && !isPlaceholderKey

export const isSupabaseConfigured = Boolean(hasValidUrl && hasValidKey)

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase env vars missing/invalid. Falling back to local defaults until valid env vars are configured.'
  )
}

if (rawUrl && !rawUrl.startsWith('https://')) {
  console.warn('NEXT_PUBLIC_SUPABASE_URL should start with https://')
}

const supabaseUrl = rawUrl || 'https://placeholder.supabase.co'
const supabaseKey = rawServiceRole || 'placeholder-anon-key'

export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

export default supabaseServer
