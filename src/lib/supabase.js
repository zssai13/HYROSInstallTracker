import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
export const BUCKET_NAME = 'hyros-docs'

export function getPublicUrl(filename) {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${filename}`
}
