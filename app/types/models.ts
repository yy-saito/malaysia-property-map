export type UserRole = 'guest' | 'member' | 'premium' | 'admin'

export type Property = {
  id: string
  scheme_name: string
  postal_code: string | null
  completed_year: number | null
  is_data_complete: boolean
}
