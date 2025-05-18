import { createClient } from "@supabase/supabase-js"

// These environment variables are automatically available from Vercel
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a single supabase client for server-side usage
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Create a singleton for the client-side supabase client
let clientSingleton: ReturnType<typeof createClient> | null = null

export const getSupabaseBrowser = () => {
  if (clientSingleton) return clientSingleton

  clientSingleton = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  return clientSingleton
}
