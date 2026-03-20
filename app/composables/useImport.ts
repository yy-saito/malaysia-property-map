import type { ImportPreviewResponse } from '~/types/api'
import { importRepository } from '~/repositories/importRepository'

type StoredImportPreview = ImportPreviewResponse & {
  id: string
  createdAt: string
}

const STORAGE_KEY = 'admin-import-previews'

export const useImport = () => {
  const { user } = useAuthUser()
  const isUploading = ref(false)
  const previews = useState<Record<string, StoredImportPreview>>('import-previews', () => ({}))
  const isClient = typeof window !== 'undefined'

  const persist = () => {
    if (!isClient) {
      return
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(previews.value))
  }

  const ensureHydrated = () => {
    if (!isClient || Object.keys(previews.value).length > 0) {
      return
    }

    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }

    try {
      previews.value = JSON.parse(raw) as Record<string, StoredImportPreview>
    } catch {
      previews.value = {}
    }
  }

  const startDryRun = async (file: File) => {
    if (!user.value?.id) {
      throw new Error('管理者としてログインしてください。')
    }

    isUploading.value = true

    try {
      const result = await importRepository.startImport(file, user.value.id)
      const id = crypto.randomUUID()

      previews.value[id] = {
        ...result,
        id,
        createdAt: new Date().toISOString(),
      }
      persist()

      return previews.value[id]
    } finally {
      isUploading.value = false
    }
  }

  const getPreview = (id: string) => {
    ensureHydrated()
    return previews.value[id] ?? null
  }

  return {
    isUploading,
    startDryRun,
    getPreview,
  }
}
