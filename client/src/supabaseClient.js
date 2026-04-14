import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bzkfhfzvbohmtakehsvt.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6a2ZoZnp2Ym9obXRha2Voc3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDYyNzEsImV4cCI6MjA5MTQyMjI3MX0.O6urJpdfjk7y3phixADxPRiCNAxz_LOd5_ueYzN8TJM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)