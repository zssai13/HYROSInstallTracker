import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
export const BUCKET_NAME = 'hyros-docs'

export function getPublicUrl(filename) {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${filename}`
}

// --- Row <-> Install object converters ---

export function rowToInstall(row) {
  return {
    id: row.id,
    name: row.name,
    version: row.version,
    category: row.category,
    status: row.status,
    lastChecked: row.last_checked,
    checkedBy: row.checked_by,
    critical: row.critical,
    file: row.file_name ? {
      name: row.file_name,
      url: row.file_url,
      uploadDate: row.file_upload_date
    } : null,
    isDefault: row.is_default
  }
}

function installToRow(install) {
  return {
    id: install.id,
    name: install.name,
    version: install.version,
    category: install.category,
    status: install.status ?? null,
    last_checked: install.lastChecked || null,
    checked_by: install.checkedBy || '',
    critical: install.critical || false,
    file_name: install.file?.name || null,
    file_url: install.file?.url || null,
    file_upload_date: install.file?.uploadDate || null,
    is_default: install.isDefault || false
  }
}

// --- Database helpers ---

export async function fetchInstalls() {
  const { data, error } = await supabase
    .from('installs')
    .select('*')
    .order('id', { ascending: true })
  if (error) throw error
  return data.map(rowToInstall)
}

export async function updateInstall(id, fields) {
  const { error } = await supabase
    .from('installs')
    .update(fields)
    .eq('id', id)
  if (error) throw error
}

export async function insertInstall(install) {
  const { data, error } = await supabase
    .from('installs')
    .insert(installToRow(install))
    .select()
    .single()
  if (error) throw error
  return rowToInstall(data)
}

export async function deleteInstallById(id) {
  const { error } = await supabase
    .from('installs')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getMaxId() {
  const { data, error } = await supabase
    .from('installs')
    .select('id')
    .order('id', { ascending: false })
    .limit(1)
    .single()
  if (error) throw error
  return data.id
}

export function subscribeToInstalls(callback) {
  const channel = supabase
    .channel('installs-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'installs' },
      (payload) => callback(payload)
    )
    .subscribe()
  return channel
}
