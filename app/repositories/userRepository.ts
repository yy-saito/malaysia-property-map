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

export const userRepository = {
  async fetchCurrentUserByAuthId(authUserId: string) {
    const supabase = useSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('users')
      .select('id, auth_user_id, name, email, role, status')
      .eq('auth_user_id', authUserId)
      .maybeSingle()

    if (error) {
      throw error
    }

    return data ? mapUser(data as UserRow) : null
  },
}
