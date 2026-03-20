import { createClient } from '@supabase/supabase-js'

let client: ReturnType<typeof createClient> | null = null

export const useSupabaseBrowserClient = () => {
  if (client) {
    return client
  }

  const config = useRuntimeConfig()
  client = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)

  return client
}
