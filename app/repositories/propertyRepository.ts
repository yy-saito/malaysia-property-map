import type {
  Property,
  PropertyListFilter,
  PropertyListPageSize,
  PropertyListResult,
  PropertyUpdatePayload,
} from '~/types/models'
import { useSupabaseBrowserClient } from '~/lib/supabase/client'

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

export const propertyRepository = {
  async fetchList(params: {
    keyword?: string
    completionFilter?: PropertyListFilter
    page: number
    pageSize: PropertyListPageSize
  }): Promise<PropertyListResult> {
    const from = (params.page - 1) * params.pageSize
    const to = from + params.pageSize - 1
    const query = new URLSearchParams({
      select: 'id,scheme_name,postal_code,completed_year,is_data_complete,updated_at',
      order: 'updated_at.desc',
    })

    if (params.keyword) {
      query.set('scheme_name', `ilike.*${params.keyword}*`)
    }

    if (params.completionFilter === 'complete') {
      query.set('is_data_complete', 'eq.true')
    }

    if (params.completionFilter === 'incomplete') {
      query.set('is_data_complete', 'eq.false')
    }

    const { baseUrl, headers } = createPublicHeaders()

    return await withTimeout(async (signal) => {
      const response = await fetch(
        `${baseUrl}/rest/v1/properties?${query.toString()}`,
        {
          method: 'GET',
          headers: {
            ...headers,
            Prefer: 'count=exact',
            Range: `${from}-${to}`,
          },
          signal,
          cache: 'no-store',
        },
      )

      if (!response.ok) {
        throw new Error('物件一覧の取得に失敗しました。')
      }

      const data = await response.json()
      const contentRange = response.headers.get('content-range')
      const totalCount = contentRange ? Number(contentRange.split('/')[1] ?? 0) : data.length

      return {
        items: data,
        totalCount,
      }
    })
  },

  async fetchById(id: string) {
    const query = new URLSearchParams({
      select: 'id,scheme_name,resolved_address,postal_code,tenure,completed_year,note,area_id,is_data_complete',
      id: `eq.${id}`,
    })

    const { baseUrl, headers } = createPublicHeaders()

    const data = await withTimeout(async (signal) => {
      return await $fetch<Property[]>(
        `${baseUrl}/rest/v1/properties?${query.toString()}`,
        {
          headers,
          signal,
          cache: 'no-store',
        },
      )
    })

    if (!data[0]) {
      throw new Error('物件が見つかりません。')
    }

    return data[0]
  },

  async update(id: string, payload: PropertyUpdatePayload) {
    const config = useRuntimeConfig()
    const supabase = useSupabaseBrowserClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error('管理者としてログインしてください。')
    }

    const data = await withTimeout(async (signal) => {
      return await $fetch<Property[]>(
        `${config.public.supabaseUrl}/rest/v1/properties?id=eq.${id}`,
        {
          method: 'PATCH',
          body: payload,
          signal,
          cache: 'no-store',
          headers: {
            apikey: config.public.supabaseAnonKey,
            Authorization: `Bearer ${session.access_token}`,
            Prefer: 'return=representation',
          },
        },
      )
    })

    if (!data[0]) {
      throw new Error('物件更新結果を取得できませんでした。')
    }

    return data[0]
  },
}
