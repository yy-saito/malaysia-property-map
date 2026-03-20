import type { SoubaTransactionRow } from '~/types/api'

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
      select: 'transaction_price,floor_area,area:areas(id,area_level,state_name,postal_code,display_name,latitude,longitude)',
      order: 'transaction_month.desc',
      limit: '5000',
    })

    return await withTimeout(async (signal) => {
      return await $fetch<SoubaTransactionRow[]>(
        `${baseUrl}/rest/v1/property_transactions?${query.toString()}`,
        {
          signal,
          cache: 'no-store',
          headers,
        },
      )
    })
  },
}
