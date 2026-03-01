import { createClient } from '@supabase/supabase-js'

const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const rawAnon = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  ''
).trim()

const url = rawUrl || 'https://placeholder.supabase.co'
const anon = rawAnon || 'placeholder-anon-key'

export const supabaseBrowser = createClient(url, anon)

export default supabaseBrowser
