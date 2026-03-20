import type { AdminDashboardStats } from '~/types/models'

type ImportRow = {
  source_file_name: string
  created_at: string
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

const fetchCount = async (path: string) => {
  const { baseUrl, headers } = createPublicHeaders()

  const response = await withTimeout(async (signal) => {
    return await fetch(`${baseUrl}/rest/v1/${path}`, {
      method: 'GET',
      signal,
      headers: {
        ...headers,
        Prefer: 'count=exact',
        Range: '0-0',
      },
      cache: 'no-store',
    })
  })

  if (!response.ok) {
    throw new Error('ダッシュボード集計の取得に失敗しました。')
  }

  const contentRange = response.headers.get('content-range')
  if (!contentRange) {
    return 0
  }

  const total = contentRange.split('/')[1]
  return Number(total ?? 0)
}

const fetchLatestImport = async () => {
  const { baseUrl, headers } = createPublicHeaders()

  const data = await withTimeout(async (signal) => {
    return await $fetch<ImportRow[]>(
      `${baseUrl}/rest/v1/imports?select=source_file_name,created_at&order=created_at.desc&limit=1`,
      {
        signal,
        cache: 'no-store',
        headers,
      },
    )
  })

  return data[0] ?? null
}

const formatLatestImportLabel = (latestImport: ImportRow | null) => {
  if (!latestImport) {
    return '-'
  }

  const formattedDate = new Intl.DateTimeFormat('ja-JP', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(latestImport.created_at))

  return `${formattedDate} / ${latestImport.source_file_name}`
}

export const dashboardRepository = {
  async fetchStats(): Promise<AdminDashboardStats> {
    const [propertyCount, incompletePropertyCount, adminCount, latestImport] = await Promise.all([
      fetchCount('properties?select=id'),
      fetchCount('properties?select=id&is_data_complete=eq.false'),
      fetchCount('users?select=id&role=eq.admin'),
      fetchLatestImport(),
    ])

    return {
      propertyCount,
      incompletePropertyCount,
      adminCount,
      latestImportLabel: formatLatestImportLabel(latestImport),
    }
  },
}
