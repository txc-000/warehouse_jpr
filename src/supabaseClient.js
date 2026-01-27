import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Ini adalah "kabel" yang sudah tersambung
export const supabase = createClient(supabaseUrl, supabaseKey)