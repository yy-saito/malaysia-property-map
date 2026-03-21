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
  resolved_address: string | null
  postal_code: string | null
  tenure: string | null
  completed_year: number | null
  note: string | null
  area_id: string | null
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

export type PropertyListPageSize = 20 | 50 | 100

export type PropertyListResult = {
  items: PropertyListItem[]
  totalCount: number
}

export type PropertyUpdatePayload = {
  postal_code: string | null
  completed_year: number | null
  note: string | null
}

export type AdminDashboardStats = {
  propertyCount: number
  incompletePropertyCount: number
  latestImportLabel: string
  adminCount: number
}

export type SoubaAreaLevel = 'state' | 'station_area'

export type SoubaPriceBand = 'all' | 'low' | 'mid' | 'high'

export type SoubaAreaTransaction = {
  transactionMonth: string
  schemeName: string
  landArea: number | null
  landAreaUnit: string | null
  unitLevel: number | null
  transactionPrice: number
}

export type SoubaAreaStat = {
  id: string
  name: string
  areaLevel: SoubaAreaLevel
  stateName: string | null
  postalCode: string | null
  stationAreaName: string | null
  stationName: string | null
  latitude: number | null
  longitude: number | null
  transactionCount: number
  averagePrice: number
  averageFloorArea: number | null
  transactions: SoubaAreaTransaction[]
}

export type SoubaSummary = {
  areaCount: number
  transactionCount: number
  averagePrice: number
}
