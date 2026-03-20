export type UserRole = 'guest' | 'member' | 'premium' | 'admin'

export type AppUser = {
  id: string
  auth_user_id: string | null
  name: string
  email: string
  role: UserRole
  status: 'active' | 'invited' | 'disabled'
}

export type Property = {
  id: string
  scheme_name: string
  postal_code: string | null
  completed_year: number | null
  is_data_complete: boolean
}

export type PropertyListFilter = 'all' | 'complete' | 'incomplete'

export type PropertyListItem = {
  id: string
  scheme_name: string
  postal_code: string | null
  completed_year: number | null
  is_data_complete: boolean
  updated_at: string
}
