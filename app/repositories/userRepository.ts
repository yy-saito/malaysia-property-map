import type { AppUser } from '~/types/models'
import { useSupabaseBrowserClient } from '~/lib/supabase/client'

type UserRow = {
  id: string
  auth_user_id: string | null
  name: string
  email: string
  role: AppUser['role']
  status: AppUser['status']
}

const mapUser = (row: UserRow): AppUser => {
  return {
    id: row.id,
    auth_user_id: row.auth_user_id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
  }
}

const withTimeout = async <T>(promiseFactory: (signal: AbortSignal) => Promise<T>, timeout = 5000) => {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeout)

  try {
    return await promiseFactory(controller.signal)
  } finally {
    window.clearTimeout(timer)
  }
}

export const userRepository = {
  async fetchCurrentUserByAuthId(authUserId: string) {
    const supabase = useSupabaseBrowserClient()
    const config = useRuntimeConfig()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const query = new URLSearchParams({
      select: 'id,auth_user_id,name,email,role,status',
      auth_user_id: `eq.${authUserId}`,
      limit: '1',
    })

    const data = await withTimeout(async (signal) => {
      return await $fetch<UserRow[]>(
        `${config.public.supabaseUrl}/rest/v1/users?${query.toString()}`,
        {
          signal,
          cache: 'no-store',
          headers: {
            apikey: config.public.supabaseAnonKey,
            Authorization: `Bearer ${session?.access_token ?? config.public.supabaseAnonKey}`,
          },
        },
      )
    })

    return data[0] ? mapUser(data[0]) : null
  },
}
