import type { SoubaStationAreaMappingRow, SoubaTransactionRow } from '~/types/api'

type TransactionBaseRow = {
  transaction_price: number
  transaction_month: string
  land_area: number | null
  land_area_unit: string | null
  floor_area: number | null
  unit_level: number | null
  property_id: string
  area: SoubaTransactionRow['area']
}

type PropertyPostalCodeRow = {
  id: string
  postal_code: string | null
  scheme_name: string | null
}

const chunkArray = <T>(items: T[], size: number) => {
  const chunks: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}

const withTimeout = async <T>(promiseFactory: (signal: AbortSignal) => Promise<T>, timeout = 8000) => {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeout)

  try {
    return await promiseFactory(controller.signal)
  } finally {
    window.clearTimeout(timer)
  }
}

const createPublicHeaders = () => {
  const config = useRuntimeConfig()

  return {
    baseUrl: config.public.supabaseUrl,
    headers: {
      apikey: config.public.supabaseAnonKey,
      Authorization: `Bearer ${config.public.supabaseAnonKey}`,
    },
  }
}

export const mapRepository = {
  async fetchTransactions() {
    const { baseUrl, headers } = createPublicHeaders()
    const query = new URLSearchParams({
      select: 'transaction_price,transaction_month,land_area,land_area_unit,floor_area,unit_level,property_id,area:areas(id,area_level,state_name,postal_code,display_name,latitude,longitude)',
      order: 'transaction_month.desc',
      limit: '5000',
    })

    return await withTimeout(async (signal) => {
      const rows = await $fetch<TransactionBaseRow[]>(
        `${baseUrl}/rest/v1/property_transactions?${query.toString()}`,
        {
          signal,
          cache: 'no-store',
          headers,
        },
      )

      const propertyIds = [...new Set(rows.map((row) => row.property_id).filter(Boolean))]

      if (propertyIds.length === 0) {
        return rows.map<SoubaTransactionRow>((row) => ({
          transaction_price: row.transaction_price,
          transaction_month: row.transaction_month,
          land_area: row.land_area,
          land_area_unit: row.land_area_unit,
          floor_area: row.floor_area,
          unit_level: row.unit_level,
          property: { postal_code: null, scheme_name: null },
          area: row.area,
        }))
      }

      const propertyChunks = chunkArray(propertyIds, 60)
      const properties: PropertyPostalCodeRow[] = []

      for (const chunk of propertyChunks) {
        const propertyQuery = new URLSearchParams({
          select: 'id,postal_code,scheme_name',
          id: `in.(${chunk.join(',')})`,
        })

        const result = await $fetch<PropertyPostalCodeRow[]>(
          `${baseUrl}/rest/v1/properties?${propertyQuery.toString()}`,
          {
            signal,
            cache: 'no-store',
            headers,
          },
        )

        properties.push(...result)
      }

      const propertyMap = new Map(properties.map((property) => [property.id, property] as const))

      return rows.map<SoubaTransactionRow>((row) => ({
        transaction_price: row.transaction_price,
        transaction_month: row.transaction_month,
        land_area: row.land_area,
        land_area_unit: row.land_area_unit,
        floor_area: row.floor_area,
        unit_level: row.unit_level,
        property: propertyMap.has(row.property_id)
          ? {
              postal_code: propertyMap.get(row.property_id)?.postal_code ?? null,
              scheme_name: propertyMap.get(row.property_id)?.scheme_name ?? null,
            }
          : { postal_code: null, scheme_name: null },
        area: row.area,
      }))
    })
  },

  async fetchStationAreaMappings() {
    const { baseUrl, headers } = createPublicHeaders()
    const query = new URLSearchParams({
      select: 'id,postal_code,station_area_name,state_name,station:stations(id,name,latitude,longitude,is_major)',
      order: 'postal_code.asc',
      is_active: 'eq.true',
    })

    return await withTimeout(async (signal) => {
      return await $fetch<SoubaStationAreaMappingRow[]>(
        `${baseUrl}/rest/v1/postal_code_station_area_mappings?${query.toString()}`,
        {
          signal,
          cache: 'no-store',
          headers,
        },
      )
    })
  },
}
